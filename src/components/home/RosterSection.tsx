import { useSite } from '@/context/siteStore';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PlayerCard } from './PlayerCard';

export function RosterSection() {
  const { data } = useSite();

  return (
    <section id="roster" className="scroll-mt-20 border-y border-border bg-elevated/50 py-20 sm:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Состав по CS2"
          title="Наша команда"
        />

        {data.players.length === 0 ? (
          <p className="text-muted">Состав пока не добавлен.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
