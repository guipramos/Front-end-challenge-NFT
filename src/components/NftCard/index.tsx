import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NftCardProps } from "../../Types";

export function NftCard({
  id,
  image,
  name,
  price,
  oldPrice,
  variant = "default",
}: NftCardProps) {
  const isCompact = variant === "compact";

  return (
    <Link
      to="/mercado/$nftId"
      params={{ nftId: id }}
      aria-label={`Ver detalhes de ${name}`}
      className="group/nft block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <article className={cn("flex flex-col gap-3", isCompact && "gap-3.5")}>
        <Card
          className={cn(
            "gap-0 rounded-none px-1 pt-7.75 pb-4.75 ring-0",
            isCompact && "pt-5 pb-6",
          )}
        >
          <div
            className={cn(
              "aspect-square overflow-hidden bg-nft-bg",
              isCompact ? "rounded-xl" : "rounded-[15px]",
            )}
          >
            <img
              src={image}
              alt={name}
              className="size-full object-cover transition-transform duration-300 group-hover/nft:scale-105"
            />
          </div>
        </Card>
        <div className={cn("flex flex-col gap-1", isCompact && "gap-0.5")}>
          <h3
            className={cn(
              "text-[16px] font-normal",
              isCompact ? "text-[15px] text-foreground/80" : "mb-3",
              "leading-4",
            )}
          >
            {name}
          </h3>
          <p
            className={cn(
              "flex items-center gap-2 font-bold text-primary",
              isCompact ? "text-[16px]" : "text-[18px]",
              "leading-4",
            )}
          >
            {price}
            {oldPrice && (
              <s className="font-normal text-primary-300 no-underline">
                {oldPrice}
              </s>
            )}
          </p>
        </div>
      </article>
    </Link>
  );
}
