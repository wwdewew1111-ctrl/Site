import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { faceitGet, type Json } from "./faceit.ts";

type Phase = "upcoming" | "live" | "finished";
type MatchFormat = "bo1" | "bo3" | "bo5";
export type SyncMode = "full" | "live";

interface MapResult {
  map: string;
  ours: number;
  theirs: number;
  inProgress: boolean;
}

function phaseFromStatus(status: string): Phase | null {
  const normalized = status.toUpperCase();
  if (normalized === "FINISHED") return "finished";
  if (normalized === "ONGOING" || normalized === "LIVE") return "live";
  if (normalized === "CANCELLED" || normalized === "ABORTED") return null;
  return "upcoming";
}

function formatForMapCount(count: number): MatchFormat {
  if (count <= 1) return "bo1";
  return count <= 3 ? "bo3" : "bo5";
}

async function fetchMaps(matchId: string, teamId: string, apiKey: string, inProgress: boolean): Promise<MapResult[]> {
  const stats = await faceitGet(`/matches/${encodeURIComponent(matchId)}/stats`, apiKey);
  const rounds = (Array.isArray(stats.rounds) ? stats.rounds : []) as Json[];
  const maps: MapResult[] = [];
  for (const round of rounds) {
    const teams = (Array.isArray(round.teams) ? round.teams : []) as Json[];
    const ours = teams.find((team) => team.team_id === teamId);
    const opponent = teams.find((team) => team.team_id !== teamId);
    if (!ours || !opponent) continue;
    maps.push({
      map: String(round.round_stats?.Map ?? "Карта"),
      ours: Number(ours.team_stats?.["Final Score"] ?? 0),
      theirs: Number(opponent.team_stats?.["Final Score"] ?? 0),
      inProgress: false,
    });
  }
  if (inProgress && maps.length > 0) maps[maps.length - 1].inProgress = true;
  return maps;
}

async function refreshMatch(db: SupabaseClient, apiKey: string, teamId: string, matchId: string): Promise<void> {
  const details = await faceitGet(`/matches/${encodeURIComponent(matchId)}`, apiKey);
  const phase = phaseFromStatus(String(details.status ?? ""));
  if (!phase) return;

  const teams = (details.teams ?? {}) as Record<string, Json | undefined>;
  const factions = [teams.faction1, teams.faction2].filter((faction): faction is Json => Boolean(faction));
  const opponent = factions.find((faction) => faction.faction_id !== teamId);
  if (!opponent || !factions.some((faction) => faction.faction_id === teamId)) {
    console.error("FACEIT match does not include our team", { matchId });
    return;
  }

  let maps: MapResult[] = [];
  if (phase !== "upcoming") {
    try {
      maps = await fetchMaps(matchId, teamId, apiKey, phase === "live");
    } catch (error) {
      if (phase === "finished") throw error;
      console.error("FACEIT live stats unavailable", { matchId, error });
    }
  }
  if (phase === "finished" && maps.length === 0) {
    throw new Error(`Итоги матча ${matchId} ещё не опубликованы`);
  }

  const completed = maps.filter((map) => !map.inProgress);
  const row: Record<string, unknown> = {
    id: matchId,
    tournament: String(details.competition_name ?? ""),
    opponent: String(opponent.name ?? ""),
    starts_at: typeof details.scheduled_at === "number" ? new Date(details.scheduled_at * 1000).toISOString() : null,
    phase,
    is_archived: phase === "finished",
    maps: phase === "upcoming" ? [] : maps,
    team_score: phase === "upcoming" ? null : completed.filter((map) => map.ours > map.theirs).length,
    opponent_score: phase === "upcoming" ? null : completed.filter((map) => map.theirs > map.ours).length,
  };
  if (typeof opponent.avatar === "string" && opponent.avatar) row.opponent_logo = opponent.avatar;
  if (phase === "finished") row.match_format = formatForMapCount(maps.length);

  const { error } = await db.from("matches").upsert(row, { onConflict: "id" });
  if (error) throw error;
}

const FACEIT_MATCH_ID_RE = /^1-[0-9a-f-]{36}$/i;
const CHAMPIONSHIP_PAGE_SIZE = 100;
const CHAMPIONSHIP_MAX_PAGES = 5;

async function trackedMatchIds(db: SupabaseClient, phases: Phase[]): Promise<string[]> {
  const { data, error } = await db.from("matches").select("id").in("phase", phases);
  if (error) throw error;
  return (data ?? []).map((row) => String(row.id));
}

async function championshipIdOf(matchId: string, apiKey: string): Promise<string | null> {
  const details = await faceitGet(`/matches/${encodeURIComponent(matchId)}`, apiKey);
  if (details.competition_type !== "championship" || typeof details.competition_id !== "string") return null;
  return details.competition_id;
}

async function championshipTeamMatchIds(
  championshipId: string,
  teamId: string,
  apiKey: string,
  type: "upcoming" | "ongoing",
): Promise<string[]> {
  const ids: string[] = [];
  for (let page = 0; page < CHAMPIONSHIP_MAX_PAGES; page++) {
    const offset = page * CHAMPIONSHIP_PAGE_SIZE;
    const response = await faceitGet(
      `/championships/${encodeURIComponent(championshipId)}/matches?type=${type}&offset=${offset}&limit=${CHAMPIONSHIP_PAGE_SIZE}`,
      apiKey,
    );
    const items = (Array.isArray(response.items) ? response.items : []) as Json[];
    for (const item of items) {
      const teams = (item.teams ?? {}) as Record<string, Json | undefined>;
      const ourTeamPlays = [teams.faction1, teams.faction2].some((faction) => faction?.faction_id === teamId);
      if (ourTeamPlays && typeof item.match_id === "string") ids.push(item.match_id);
    }
    if (items.length < CHAMPIONSHIP_PAGE_SIZE) break;
  }
  return ids;
}

async function scheduledMatchIds(db: SupabaseClient, teamId: string, apiKey: string, anchorMatchIds: string[]): Promise<string[]> {
  const tracked = await trackedMatchIds(db, ["upcoming", "live"]);
  const anchor = anchorMatchIds.find((id) => FACEIT_MATCH_ID_RE.test(id));
  const championshipId = anchor ? await championshipIdOf(anchor, apiKey) : null;
  if (!championshipId) return tracked;
  const upcoming = await championshipTeamMatchIds(championshipId, teamId, apiKey, "upcoming");
  const ongoing = await championshipTeamMatchIds(championshipId, teamId, apiKey, "ongoing");
  return [...new Set([...upcoming, ...ongoing, ...tracked])];
}

export async function syncTeamMatches(
  db: SupabaseClient,
  apiKey: string,
  teamId: string,
  mode: SyncMode,
  anchorMatchIds: string[] = [],
): Promise<void> {
  const ids = mode === "live" ? await trackedMatchIds(db, ["live"]) : await scheduledMatchIds(db, teamId, apiKey, anchorMatchIds);
  for (const id of ids) {
    try {
      await refreshMatch(db, apiKey, teamId, id);
    } catch (error) {
      console.error("FACEIT match sync failed", { matchId: id, error });
    }
  }
}
