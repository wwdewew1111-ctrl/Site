import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { AUTO_SYNC_INTERVAL_MS, fetchEseaState } from '@/services/eseaService';

const SERVER_POLL_MS = 30 * 1000;

interface EseaSyncCountdownProps {
  autoSync: boolean;
  lastSync: number;
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function EseaSyncCountdown({ autoSync, lastSync }: EseaSyncCountdownProps) {
  const [serverLastSync, setServerLastSync] = useState(lastSync);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!autoSync) return;
    let cancelled = false;
    const refresh = () => {
      fetchEseaState()
        .then((next) => {
          if (!cancelled) setServerLastSync((current) => Math.max(current, next.config.lastSync));
        })
        .catch(() => undefined);
    };
    refresh();
    const pollTimer = window.setInterval(refresh, SERVER_POLL_MS);
    const tickTimer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelled = true;
      window.clearInterval(pollTimer);
      window.clearInterval(tickTimer);
    };
  }, [autoSync]);

  const effectiveLastSync = Math.max(lastSync, serverLastSync);

  if (!autoSync) {
    return <p className="text-sm text-muted">Автообновление выключено, следующая синхронизация только вручную.</p>;
  }

  const remaining = effectiveLastSync + AUTO_SYNC_INTERVAL_MS - now;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-elevated/50 px-4 py-3">
      <Timer className="h-4 w-4 shrink-0 text-accent" />
      {remaining > 0 ? (
        <p className="text-sm text-text">
          До следующего обновления: <span className="font-display tabular-nums text-accent">{formatRemaining(remaining)}</span>
        </p>
      ) : (
        <p className="text-sm text-text">Обновление выполняется на ближайшей проверке сервера (до минуты)</p>
      )}
    </div>
  );
}
