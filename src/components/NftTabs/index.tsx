import { StarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Nft } from "../../Types";

type NftTabsProps = {
  nft: Nft;
};

const triggerClass =
  "h-auto flex-none px-0 pt-0 pb-0.5 text-[17px] leading-6 font-normal text-foreground/90 after:-bottom-px after:bg-primary hover:text-primary data-active:font-bold data-active:text-primary group-data-[variant=line]/tabs-list:data-active:after:opacity-100";

export function NftTabs({ nft }: NftTabsProps) {
  const { details } = nft;

  return (
    <Tabs defaultValue="details" className="gap-0">
      <TabsList
        variant="line"
        className="h-auto w-full flex-wrap justify-start gap-x-10 border-b border-muted-200/20 p-0"
      >
        <TabsTrigger value="details" className={triggerClass}>
          Detalhes do NFT
        </TabsTrigger>
        <TabsTrigger value="reviews" className={triggerClass}>
          Avaliações de colecionadores ({nft.ratingCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="details"
        className="mt-3.5 text-sm leading-6 text-muted-200/80"
      >
        <div className="flex flex-col gap-6">
          {details.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="mt-3 flex flex-col gap-3">
          <div>
            <dt className="font-bold text-foreground">Rede:</dt>
            <dd>{details.network}</dd>
          </div>
          <div>
            <dt className="font-bold text-foreground">Contrato:</dt>
            <dd>{details.contract}</dd>
          </div>
          <div>
            <dt className="font-bold text-foreground">Direitos autorais:</dt>
            <dd>{details.royalties}</dd>
          </div>
        </dl>
      </TabsContent>

      <TabsContent value="reviews" className="mt-2.5 text-sm leading-6">
        <ul className="flex flex-col gap-4">
          {nft.reviews.map((review) => (
            <li key={review.author} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">
                  {review.author}
                </span>
                <span
                  role="img"
                  aria-label={`${review.rating} de 5 estrelas`}
                  className="flex gap-0.5 text-primary"
                >
                  {Array.from({ length: review.rating }, (_, index) => (
                    <StarIcon
                      key={index}
                      aria-hidden="true"
                      className="size-3.5 fill-current"
                    />
                  ))}
                </span>
              </div>
              <p className="text-muted-200/80">{review.comment}</p>
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  );
}
