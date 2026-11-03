import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useSite } from '@/context/siteStore';
import { createId } from '@/lib/format';
import { Modal } from '@/components/ui/Modal';
import { AdminToolbar } from '@/components/admin/AdminToolbar';
import { SortableList } from '@/components/admin/SortableList';
import { ProductForm } from './ProductForm';
import type { MerchProduct } from '@/types';

function createBlankProduct(): MerchProduct {
  return { id: createId(), title: '', price: '', image: '', url: '' };
}

export function MerchAdmin() {
  const { data, actions } = useSite();
  const { mode, products } = data.merch;
  const [draft, setDraft] = useState<MerchProduct | null>(null);
  const isShop = mode === 'shop';

  const handleDelete = (product: MerchProduct) => {
    if (window.confirm(`Удалить товар «${product.title}»?`)) {
      actions.deleteProduct(product.id);
    }
  };

  return (
    <div className="space-y-10">
      <AdminToolbar
        title="Мерч"
        description="Выберите, что видят посетители в разделе мерча: сам магазин или заставку «Скоро в продаже»."
      />

      <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Режим раздела</p>
          <p className="mt-2 text-lg font-semibold text-text">
            {isShop ? 'Показать магазин товаров' : 'Режим «Скоро в продаже»'}
          </p>
          <p className="mt-1 text-sm text-muted">
            {isShop
              ? 'Посетители видят товары и кнопки покупки.'
              : 'Посетители видят заставку «Мерч скоро выйдет».'}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isShop}
          aria-label="Показать магазин товаров"
          onClick={() => actions.setMerchMode(isShop ? 'comingSoon' : 'shop')}
          className={`relative h-9 w-16 shrink-0 self-start rounded-full border transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:self-auto ${
            isShop ? 'border-accent bg-accent' : 'border-border bg-elevated'
          }`}
        >
          <span
            className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-300 ${
              isShop ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
      </section>

      <section>
        <AdminToolbar
          title="Товары"
          description="Фото, название, цена и ссылка на покупку. Без ссылки товар показывается с пометкой «Ссылка на покупку скоро»."
          action={
            <button type="button" onClick={() => setDraft(createBlankProduct())} className="btn-primary">
              <Plus className="h-4 w-4" />
              Добавить товар
            </button>
          }
        />

        {products.length === 0 ? (
          <div className="card p-10 text-center text-muted">Товаров пока нет.</div>
        ) : (
          <SortableList
            items={products}
            label="товар"
            onReorder={actions.reorderProducts}
            renderItem={(product) => (
              <div className="card flex items-center gap-4 p-4">
                <img src={product.image} alt="" className="h-20 w-20 shrink-0 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-text">{product.title}</p>
                  <p className="mt-1 font-display text-accent">{product.price}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={() => setDraft(product)} className="btn-icon" aria-label={`Редактировать ${product.title}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="btn-icon hover:border-error-500 hover:text-error-500"
                    aria-label={`Удалить ${product.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          />
        )}
      </section>

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.title ? 'Редактирование товара' : 'Новый товар'}
        widthClass="max-w-2xl"
      >
        {draft && (
          <ProductForm
            key={draft.id}
            initial={draft}
            onCancel={() => setDraft(null)}
            onSave={async (product) => {
              if (await actions.saveProduct(product)) setDraft(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
