import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import monkey2 from "../../assets/monkey-2.png";

export function FeaturedNft() {
  return (
    <Card role="article" className="gap-3 rounded-lg py-0 ring-0">
      <CardHeader className="px-5 pt-5">
        <CardTitle
          as="h2"
          className="mb-4 text-2xl leading-8 font-bold text-primary uppercase"
        >
          NFT em destaque
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 text-center">
        <p className="text-[22px] font-bold tracking-4 text-foreground uppercase">
          Oferta limitada
        </p>
        <div className="aspect-square overflow-hidden rounded-md bg-nft-bg mt-4">
          <img
            src={monkey2}
            alt="Macaco de chapéu verde e moletom roxo"
            className="size-full object-cover w-[310px] h-268px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
