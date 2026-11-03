import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/format';
import type { NewsItem } from '@/types';

interface NewsCardProps {
  item: NewsItem;
  onOpen: () => void;
}

export function NewsCard({ item, onOpen }: NewsCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_40px_-18px_rgba(255,30,30,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.cover}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded border-l-2 border-accent bg-ink-950/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
          {item.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <time dateTime={item.date} className="text-xs font-medium uppercase tracking-wider text-muted">
          {formatDate(item.date)}
        </time>
        <h3 className="mt-2 text-lg leading-snug text-text transition duration-200 group-hover:text-accent">
          {item.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{item.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent">
          Читать далее
          <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}
