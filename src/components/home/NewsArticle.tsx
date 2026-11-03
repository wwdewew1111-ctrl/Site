import { formatDate } from '@/lib/format';
import type { NewsItem } from '@/types';

export function NewsArticle({ item }: { item: NewsItem }) {
  const paragraphs = item.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article>
      <img src={item.cover} alt={item.title} className="aspect-video w-full object-cover" />
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded border-l-2 border-accent bg-ink-950 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            {item.tag}
          </span>
          <time dateTime={item.date} className="text-xs font-medium uppercase tracking-wider text-muted">
            {formatDate(item.date)}
          </time>
        </div>
        <h2 className="mt-4 text-2xl text-text sm:text-3xl">{item.title}</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
