import { useState } from "react";
import { cn } from "@/lib/utils";
import { Lupa } from "../icones/Lupa/Lupa";

type NftGalleryProps = {
  name: string;
  images: readonly string[];
};

export function NftGallery({ name, images }: NftGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-7">
      <ul
        aria-label={`Miniaturas de ${name}`}
        className="flex shrink-0 gap-4 sm:flex-col"
      >
        {images.map((image, index) => (
          <li key={index}>
            <button
              type="button"
              aria-label={`Ver imagem ${index + 1} de ${images.length}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
              className="block size-16 overflow-hidden rounded-md bg-nft-bg outline-none focus-visible:ring-2 focus-visible:ring-primary sm:size-25"
            >
              <img src={image} alt="" className="size-full object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative aspect-square min-w-0 flex-1 self-start bg-card p-5">
        <div className="size-full overflow-hidden rounded-[20px] bg-nft-bg">
          <img
            src={images[activeIndex]}
            alt={name}
            className={cn(
              "size-full object-cover transition-transform duration-300",
              isZoomed && "scale-150",
            )}
          />
        </div>

        <button
          type="button"
          aria-label={isZoomed ? "Reduzir imagem" : "Ampliar imagem"}
          aria-pressed={isZoomed}
          onClick={() => setIsZoomed((value) => !value)}
          className="absolute top-5 right-4 flex size-7 items-center justify-center rounded-full bg-card outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Lupa aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
