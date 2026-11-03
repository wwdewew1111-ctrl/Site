import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryPhoto } from '@/types';

interface LightboxProps {
  photos: GalleryPhoto[];
  index: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

export function Lightbox({ photos, index, onNavigate, onClose }: LightboxProps) {
  const total = photos.length;
  const photo = photos[index];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNavigate((index + 1) % total);
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + total) % total);
    };
    window.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, total, onClose, onNavigate]);

  const navButtonClass =
    'absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр фото"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть просмотр"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-accent"
      >
        <X className="h-5 w-5" />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => onNavigate((index - 1 + total) % total)}
            aria-label="Предыдущее фото"
            className={`${navButtonClass} left-2 sm:left-6`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate((index + 1) % total)}
            aria-label="Следующее фото"
            className={`${navButtonClass} right-2 sm:right-6`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <figure key={photo.id} className="flex max-h-full w-full max-w-5xl flex-col items-center animate-fade-in">
        <img
          src={photo.src}
          alt={photo.caption || 'Фото команды'}
          className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
        />
        <figcaption className="mt-4 flex w-full items-center justify-between gap-4 text-sm text-ink-100">
          <span className="truncate">{photo.caption}</span>
          <span className="shrink-0 font-semibold tabular-nums text-ink-300">
            {index + 1} / {total}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
