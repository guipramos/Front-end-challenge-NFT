import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Nft } from "../../Types";
import { NftCard } from "../NftCard";

type CollectionCarouselProps = {
  pages: readonly (readonly Nft[])[];
  initialPage?: number;
  title?: string;
};

export function CollectionCarousel({
  pages,
  initialPage = 0,
  title = "Mais desta coleção",
}: CollectionCarouselProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const items = pages[currentPage] ?? [];

  return (
    <section
      aria-labelledby="collection-title"
      aria-roledescription="carrossel"
      className="-mt-0.75 flex flex-col"
    >
      <h2
        id="collection-title"
        className="border-b border-muted-200/20 pb-2 text-[17px] leading-6 font-bold text-primary"
      >
        {title}
      </h2>

      <ul
        aria-live="polite"
        className="mt-7.5 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5"
      >
        {items.map((nft) => (
          <li key={nft.id}>
            <NftCard
              id={nft.id}
              image={nft.image}
              name={nft.name}
              price={nft.price}
              variant="compact"
            />
          </li>
        ))}
      </ul>

      <div
        role="group"
        aria-label="Páginas do carrossel"
        className="mt-8 flex justify-center gap-2"
      >
        {pages.map((_, index) => {
          const isActive = index === currentPage;

          return (
            <button
              key={index}
              type="button"
              aria-label={`Ir para o grupo ${index + 1} de ${pages.length}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => setCurrentPage(index)}
              className={cn(
                "size-3 rounded-full border border-primary outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/60",
                isActive ? "bg-primary" : "bg-transparent hover:bg-primary/40",
              )}
            />
          );
        })}
      </div>
    </section>
  );
}
