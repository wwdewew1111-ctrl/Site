import { AlertTriangle, Loader2, RotateCw } from 'lucide-react';

interface SiteStatusProps {
  failed: boolean;
  onRetry: () => void;
}

export function SiteStatus({ failed, onRetry }: SiteStatusProps) {
  if (failed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
        <AlertTriangle className="h-12 w-12 text-accent" />
        <div>
          <p className="font-display text-2xl text-text">Не удалось загрузить сайт</p>
          <p className="mt-2 text-sm text-muted">Проверьте интернет-соединение и попробуйте снова.</p>
        </div>
        <button type="button" onClick={onRetry} className="btn-primary">
          <RotateCw className="h-4 w-4" />
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg" role="status" aria-live="polite">
      <Loader2 className="h-10 w-10 animate-spin text-accent" aria-label="Загрузка" />
    </div>
  );
}
