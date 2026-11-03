import { ShoppingBag } from 'lucide-react';
import type { MerchProduct } from '@/types';

export function ProductCard({ product }: { product: MerchProduct }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_40px_-18px_rgba(255,30,30,0.55)]">
      <div className="aspect-square overflow-hidden bg-elevated">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex-1">
          <h3 className="text-base leading-snug text-text">{product.title}</h3>
          <p className="mt-2 font-display text-xl text-accent">{product.price}</p>
        </div>
        {product.url ? (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full"
          >
            <ShoppingBag className="h-4 w-4" />
            Купить
          </a>
        ) : (
          <p className="text-center text-xs font-medium uppercase tracking-wider text-muted">Ссылка на покупку скоро</p>
        )}
      </div>
    </article>
  );
}
