import { useSite } from '@/context/siteStore';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from './ProductCard';

export function MerchSection() {
  const { data } = useSite();
  const { mode, products } = data.merch;

  return (
    <section id="merch" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Мерч KAB6ANbl"
          title={mode === 'shop' ? 'Фирменная линейка' : 'Скоро в продаже'}
          description="Джерси, худи и коврики в фирменных черно-красных цветах команды."
        />

        {mode === 'shop' ? <ShopGrid /> : <ComingSoonBlock />}
        {mode === 'shop' && products.length === 0 && (
          <p className="text-muted">Товары скоро появятся в магазине.</p>
        )}
      </div>
    </section>
  );
}

function ShopGrid() {
  const { products } = useSite().data.merch;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ComingSoonBlock() {
  return (
    <div className="grid place-items-center rounded-2xl border border-ink-800 bg-ink-950 px-6 py-16 text-center text-white sm:py-24">
      <span className="inline-flex items-center gap-2 rounded border border-accent/60 bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        Coming Soon
      </span>
      <h3 className="mt-6 text-3xl uppercase sm:text-4xl">Мерч скоро выйдет</h3>
    </div>
  );
}
