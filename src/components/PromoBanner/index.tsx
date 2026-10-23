import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import type { PromoBannerProps } from "../../Types";

export function PromoBanner({
  image,
  title,
  description,
  cta,
}: PromoBannerProps) {
  return (
    <Card
      role="article"
      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-6 rounded-lg py-0 ring-0"
    >
      <div className="aspect-square">
        <img src={image} alt="" className="size-full object-cover" />
      </div>
      <div className="flex flex-col items-start text-end gap-3 py-6 pr-6">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="items-end w-full flex justify-end">
          <Button size="sm" className="font-normal text-sm">
            {cta} →
          </Button>
        </div>
      </div>
    </Card>
  );
}
