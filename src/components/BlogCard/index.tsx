import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { BlogCardProps } from "../../Types";

export function BlogCard({
  image,
  date,
  readTime,
  title,
  excerpt,
}: BlogCardProps) {
  return (
    <Card role="article" className="w-full gap-0 rounded-lg py-0 ring-0">
      <div className="aspect-square bg-nft-bg">
        <img src={image} alt="" className="size-full object-cover" />
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 px-4 pt-3 pb-4">
        <p className="text-[12px] font-medium leading-4 text-muted-foreground">
          {date} | {readTime}
        </p>
        <CardTitle className="font-bold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{excerpt}</p>
        <Button
          asChild
          variant="link"
          className="mt-auto h-auto w-fit p-0 text-sm font-bold hover:text-primary-hover hover:no-underline"
        >
          <a href="#">Ler mais →</a>
        </Button>
      </CardContent>
    </Card>
  );
}
