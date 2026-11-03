import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useSite } from '@/context/siteStore';
import { createId, formatDate } from '@/lib/format';
import { Modal } from '@/components/ui/Modal';
import { AdminToolbar } from '@/components/admin/AdminToolbar';
import { SortableList } from '@/components/admin/SortableList';
import { NewsForm } from './NewsForm';
import type { NewsItem } from '@/types';

function createBlankNews(): NewsItem {
  return {
    id: createId(),
    title: '',
    date: new Date().toISOString().slice(0, 10),
    tag: '',
    excerpt: '',
    content: '',
    cover: '',
  };
}

export function NewsAdmin() {
  const { data, actions } = useSite();
  const [draft, setDraft] = useState<NewsItem | null>(null);

  const handleDelete = (item: NewsItem) => {
    if (window.confirm(`Удалить новость «${item.title}»? Это действие нельзя отменить.`)) {
      actions.deleteNews(item.id);
    }
  };

  return (
    <div>
      <AdminToolbar
        title="Новости"
        description="Создавайте новости и редактируйте их. Перетащите новость за иконку слева, чтобы изменить порядок на сайте."
        action={
          <button type="button" onClick={() => setDraft(createBlankNews())} className="btn-primary">
            <Plus className="h-4 w-4" />
            Добавить новость
          </button>
        }
      />

      {data.news.length === 0 ? (
        <div className="card p-10 text-center text-muted">Новостей пока нет. Нажмите «Добавить новость», чтобы создать первую.</div>
      ) : (
        <SortableList
          items={data.news}
          label="новость"
          onReorder={actions.reorderNews}
          renderItem={(item) => (
            <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <img src={item.cover} alt="" className="aspect-video w-full rounded-md object-cover sm:w-40 sm:shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {item.tag} • {formatDate(item.date)}
                </p>
                <h3 className="mt-1 truncate text-lg text-text">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{item.excerpt}</p>
              </div>
              <div className="flex gap-2 sm:shrink-0">
                <button type="button" onClick={() => setDraft(item)} className="btn-outline h-10 flex-1 px-4 sm:flex-none">
                  <Pencil className="h-4 w-4" />
                  Редактировать
                </button>
                <button type="button" onClick={() => handleDelete(item)} className="btn-danger h-10 flex-1 px-4 sm:flex-none">
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </button>
              </div>
            </div>
          )}
        />
      )}

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.title ? 'Редактирование новости' : 'Новая новость'}
        widthClass="max-w-2xl"
      >
        {draft && (
          <NewsForm
            key={draft.id}
            initial={draft}
            onCancel={() => setDraft(null)}
            onSave={async (item) => {
              if (await actions.saveNews(item)) setDraft(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
