import { useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { useSite } from '@/context/siteStore';
import { readImageFile } from '@/lib/readImageFile';
import { createId } from '@/lib/format';
import { AdminToolbar } from '@/components/admin/AdminToolbar';
import { SortableList } from '@/components/admin/SortableList';

export function GalleryAdmin() {
  const { data, actions } = useSite();
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const src = await readImageFile(file);
        const saved = await actions.addPhoto({ id: createId(), src, caption: caption.trim() });
        if (!saved) break;
      }
    } catch {
      setError('Не удалось загрузить одно из фото. Попробуйте файлы в формате JPG или PNG.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string, label: string) => {
    if (window.confirm(`Удалить фото${label ? ` «${label}»` : ''} из галереи?`)) {
      actions.deletePhoto(id);
    }
  };

  return (
    <div>
      <AdminToolbar
        title="Галерея"
        description="Загружайте фото с турниров и буткемпов или удаляйте старые. Нажмите на фото в галерее сайта, чтобы открыть его на весь экран."
      />

      <div className="card space-y-5 p-6">
        <label className="block">
          <span className="label">Подпись для новых фото (необязательно)</span>
          <input
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Например: Финал турнира в Казани"
            className="input"
          />
        </label>

        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-elevated/40 p-10 text-center transition hover:border-accent ${
            uploading ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white">
            <Upload className="h-5 w-5" />
          </span>
          <span className="font-semibold text-text">{uploading ? 'Загружаем фото...' : 'Нажмите, чтобы выбрать фото'}</span>
          <span className="text-sm text-muted">Можно выбрать сразу несколько файлов (JPG, PNG, WebP)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              void handleFiles(event.target.files);
              event.target.value = '';
            }}
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-error-700 dark:text-error-500">
            {error}
          </p>
        )}
      </div>

      <div className="mt-10">
        <p className="mb-4 text-sm font-medium text-muted">В галерее: {data.gallery.length} фото</p>
        {data.gallery.length === 0 ? (
          <div className="card p-10 text-center text-muted">Фотографий пока нет.</div>
        ) : (
          <SortableList
            items={data.gallery}
            label="фото"
            onReorder={actions.reorderPhotos}
            renderItem={(photo) => (
              <div className="card flex items-center gap-4 p-3">
                <img src={photo.src} alt={photo.caption} className="aspect-[4/3] w-24 shrink-0 rounded-md object-cover" />
                <p className="min-w-0 flex-1 truncate text-sm text-text">{photo.caption || 'Без подписи'}</p>
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id, photo.caption)}
                  aria-label="Удалить фото"
                  className="btn-icon hover:border-error-500 hover:text-error-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
