import { useState, type FormEvent } from 'react';
import type { MerchProduct } from '@/types';
import { ImageInput } from '@/components/admin/ImageInput';
import { Field } from '@/components/admin/FormField';

type ProductErrors = Partial<Record<'title' | 'price' | 'image' | 'url', string>>;

interface ProductFormProps {
  initial: MerchProduct;
  onSave: (product: MerchProduct) => void;
  onCancel: () => void;
}

export function ProductForm({ initial, onSave, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<MerchProduct>(initial);
  const [errors, setErrors] = useState<ProductErrors>({});
  const isNew = initial.title === '';

  const update = <K extends keyof MerchProduct>(key: K, value: MerchProduct[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = form.url.trim();
    const nextErrors: ProductErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Введите название товара';
    if (!form.price.trim()) nextErrors.price = 'Укажите цену, например 3 990 ₽';
    if (!form.image) nextErrors.image = 'Добавьте фото товара';
    if (url && !/^https?:\/\//i.test(url)) nextErrors.url = 'Ссылка должна начинаться с https://';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({ ...form, title: form.title.trim(), price: form.price.trim(), url });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 p-6 sm:p-8">
      <h2 className="pr-10 text-2xl text-text">{isNew ? 'Новый товар' : 'Редактирование товара'}</h2>

      <ImageInput label="Фото товара" value={form.image} onChange={(value) => update('image', value)} error={errors.image} />

      <Field label="Название" error={errors.title}>
        <input
          type="text"
          value={form.title}
          onChange={(event) => update('title', event.target.value)}
          placeholder="Например: Худи Black Edition"
          className="input"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Цена" error={errors.price}>
          <input
            type="text"
            value={form.price}
            onChange={(event) => update('price', event.target.value)}
            placeholder="6 490 ₽"
            className="input"
          />
        </Field>
        <Field label="Ссылка на покупку" error={errors.url} hint="Необязательно. Например, ссылка на магазин.">
          <input
            type="url"
            value={form.url}
            onChange={(event) => update('url', event.target.value)}
            placeholder="https://..."
            className="input"
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-outline">
          Отмена
        </button>
        <button type="submit" className="btn-primary">
          Сохранить товар
        </button>
      </div>
    </form>
  );
}
