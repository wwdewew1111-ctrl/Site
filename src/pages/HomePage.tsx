import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { MatchesSection } from '@/components/home/MatchesSection';
import { EseaPublicSection } from '@/components/EseaStats';
import { NewsSection } from '@/components/home/NewsSection';
import { RosterSection } from '@/components/home/RosterSection';
import { GallerySection } from '@/components/home/GallerySection';
import { MerchSection } from '@/components/home/MerchSection';

export function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      <main>
        <Hero />
        <MatchesSection />
        <EseaPublicSection />
        <NewsSection />
        <RosterSection />
        <GallerySection />
        <MerchSection />
      </main>
      <Footer />
    </div>
  );
}
