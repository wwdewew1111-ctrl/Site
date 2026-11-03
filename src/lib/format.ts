import type { MatchFormat } from '@/types';

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatMatchDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isMatchFinished(match: { teamScore: number | null; opponentScore: number | null }): boolean {
  return match.teamScore !== null && match.opponentScore !== null;
}

export function matchUnitLabel(format: MatchFormat): string {
  return format === 'bo1' ? 'Раунды' : 'Карты';
}

export function scoreToneClass(own: number, other: number): string {
  if (own > other) return 'text-green-500';
  if (own < other) return 'text-red-500';
  return 'text-text';
}

export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
