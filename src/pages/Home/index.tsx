import { BlogSection } from "../../components/BlogSection";
import { FeaturedNft } from "../../components/FeaturedNft";
import { FilterSidebar } from "../../components/FilterSidebar";
import { Hero } from "../../components/Hero";
import { Newsletter } from "../../components/Newsletter";
import { NftGrid } from "../../components/NftGrid";
import { PromoBanner } from "../../components/PromoBanner";
import nftArtwork03 from "../../assets/monkey-3.png";
import nftArtwork05 from "../../assets/monkey-5.png";
import { useState } from "react";
import { DEFAULT_FILTERS } from "../../data/filters";
import type { Filters } from "../../Types";

export function Home() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  return (
    <main className="container flex flex-col gap-24">
      <Hero />

      <div className="grid gap-12 lg:grid-cols-[310px_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <FilterSidebar filters={filters} onChange={setFilters} />
          <FeaturedNft />
        </div>
        <NftGrid filters={filters} />
      </div>

      <section aria-label="Destaques" className="grid gap-6 md:grid-cols-2">
        <PromoBanner
          image={nftArtwork03}
          title="Lançamentos gêmeos de edição limitada"
          description="Colecione  edições escassas diretamente dos criadores antes da revelação pública."
          cta="Explorar"
        />
        <PromoBanner
          image={nftArtwork05}
          title="Arte digital selecionada e muito mais"
          description="Explore novos artistas, coleções verificadas e obras digitais que definem a"
          cta="Explorar"
        />
      </section>

      <BlogSection />
      <Newsletter />
    </main>
  );
}
