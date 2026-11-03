import { useState, type FormEvent } from 'react';
import type { NewsItem } from '@/types';
import { ImageInput } from '@/components/admin/ImageInput';
import { Field } from '@/components/admin/FormField';

type NewsErrors = Partial<Record<'title' | 'date' | 'content' | 'cover', string>>;

interface NewsFormProps {
  initial: NewsItem;
  onSave: (item: NewsItem) => void;
  onCancel: () => void;
}

const EXCERPT_LENGTH = 160;

function makeExcerpt(content: string): string {
  if (content.length <= EXCERPT_LENGTH) return content;
  return `${content.slice(0, EXCERPT_LENGTH).trimEnd()}...`;
}

export function NewsForm({ initial, onSave, onCancel }: NewsFormProps) {
  const [form, setForm] = useState<NewsItem>(initial);
  const [errors, setErrors] = useState<NewsErrors>({});
  const isNew = initial.title === '';

  const update = <K extends keyof NewsItem>(key: K, value: NewsItem[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: NewsErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Введите заголовок новости';
    if (!form.date) nextErrors.date = 'Выберите дату';
    if (!form.content.trim()) nextErrors.content = 'Напишите текст новости';
    if (!form.cover) nextErrors.cover = 'Добавьте картинку';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const content = form.content.trim();
    onSave({
      ...form,
      title: form.title.trim(),
      tag: form.tag.trim() || 'Новость',
      excerpt: form.excerpt.trim() || makeExcerpt(content),
      content,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 p-6 sm:p-8">
      <h2 className="pr-10 text-2xl text-text">{isNew ? 'Новая новость' : 'Редактирование новости'}</h2>

      <Field label="Заголовок" error={errors.title}>
        <input
          type="text"
          value={form.title}
          onChange={(event) => update('title', event.target.value)}
          placeholder="Например: Победа на отборочном турнире"
          className="input"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Дата" error={errors.date}>
          <input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} className="input" />
        </Field>
        <Field label="Тег" hint="Например: Турнир, Состав, Буткемп">
          <input
            type="text"
            value={form.tag}
            onChange={(event) => update('tag', event.target.value)}
            placeholder="Турнир"
            className="input"
          />
        </Field>
      </div>

      <Field label="Краткое описание" hint="Показывается в карточке новости. Если оставить пустым, возьмется начало текста.">
        <textarea
          value={form.excerpt}
          onChange={(event) => update('excerpt', event.target.value)}
          rows={2}
          className="textarea"
        />
      </Field>

      <Field label="Полный текст новости" error={errors.content} hint="Пустая строка делит текст на абзацы.">
        <textarea
          value={form.content}
          onChange={(event) => update('content', event.target.value)}
          rows={9}
          className="textarea"
        />
      </Field>

      <div>
        <ImageInput label="Обложка новости" value={form.cover} onChange={(value) => update('cover', value)} />
        {errors.cover && (
          <p role="alert" className="mt-2 text-sm text-error-700 dark:text-error-500">
            {errors.cover}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-outline">
          Отмена
        </button>
        <button type="submit" className="btn-primary">
          Сохранить новость
        </button>
      </div>
    </form>
  );
}
