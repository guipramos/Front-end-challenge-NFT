import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CartButtonProps } from "../../Types";
import { Cart } from "../icones/Cart/Cart";

const MAX_COUNT = 99;

export function CartButton({
  count = 0,
  className,
  badgeClassName,
  ...props
}: CartButtonProps) {
  const displayCount = count > MAX_COUNT ? `${MAX_COUNT}+` : count;

  return (
    <Button
      variant="ghost"
      aria-label={`Carrinho, ${count} ${count === 1 ? "item" : "itens"}`}
      className={cn(
        "relative h-6 w-7.75 justify-start p-0 hover:bg-transparent hover:opacity-80",
        className,
      )}
      {...props}
    >
      <Cart aria-hidden="true" />

      {count > 0 && (
        <Badge
          aria-hidden="true"
          className={cn(
            "absolute -top-2 -right-2 size-6 rounded-full p-0 font-bold",
            badgeClassName,
          )}
        >
          {displayCount}
        </Badge>
      )}
    </Button>
  );
}
