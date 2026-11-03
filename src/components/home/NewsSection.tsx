import { useState } from 'react';
import { useSite } from '@/context/siteStore';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NewsCard } from './NewsCard';
import { NewsArticle } from './NewsArticle';
import { Modal } from '@/components/ui/Modal';

export function NewsSection() {
  const { data } = useSite();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = data.news.find((item) => item.id === activeId) ?? null;

  return (
    <section id="news" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Новости команды"
          title="Последние события"
          description="Турниры, победы, составы и закулисье KAB6ANbl ESPORTS."
        />

        {data.news.length === 0 ? (
          <p className="text-muted">Новостей пока нет. Загляните позже.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.news.map((item) => (
              <NewsCard key={item.id} item={item} onOpen={() => setActiveId(item.id)} />
            ))}
          </div>
        )}
      </div>

      <Modal open={active !== null} onClose={() => setActiveId(null)} title={active?.title ?? 'Новость'} widthClass="max-w-3xl">
        {active && <NewsArticle item={active} />}
      </Modal>
    </section>
  );
}
