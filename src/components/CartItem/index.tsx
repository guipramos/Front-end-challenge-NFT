import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CartItemProps } from "../../Types";
import { useRemoverItemCarrinho } from "@/hooks/useRemoverItemCarrinho";
import { useAtualizarQuantidadeCarrinho } from "@/hooks/useAtualizarQuantidadeCarrinho";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

export const cartGridClass =
  "lg:grid lg:grid-cols-[310px_139px_137px_minmax(0,1fr)_20px] lg:items-center lg:pr-6.5";

const quantityButtonClass =
  "h-6.25 w-4.25 rounded-full bg-primary-200 p-0 text-primary-foreground hover:bg-primary-hover";

export function CartItem({
  image,
  name,
  tokenId,
  price,
  quantity,
  total,
}: CartItemProps) {
  const remover = useRemoverItemCarrinho();
  const atualizar = useAtualizarQuantidadeCarrinho();

  const alterarQuantidade = (novaQuantidade: number) =>
    atualizar.mutate({ tokenId, quantity: novaQuantidade });

  return (
    <div
      role="row"
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xs bg-surface lg:h-17.5 lg:gap-0",
        cartGridClass,
      )}
    >
      <div role="cell" className="flex min-w-0 items-center gap-4">
        <img
          src={image}
          alt={name}
          className="size-17.5 shrink-0 rounded-xs bg-nft-bg object-cover"
        />
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-base leading-5.5 font-bold text-foreground">
            {name}
          </p>
          <p className="truncate text-sm leading-5.5 text-primary-200/70">
            ID do token: {tokenId}
          </p>
        </div>
      </div>

      <p role="cell" className="text-base font-medium text-muted-200">
        {price}
      </p>

      <div
        role="cell"
        className="flex items-center gap-3.5 text-base text-foreground"
      >
        <Button
          type="button"
          aria-label={`Diminuir quantidade de ${name}`}
          className={quantityButtonClass}
          disabled={quantity <= MIN_QUANTITY || atualizar.isPending}
          onClick={() => alterarQuantidade(quantity - 1)}
        >
          <MinusIcon aria-hidden="true" className="size-3" strokeWidth={3} />
        </Button>
        <output aria-label={`Quantidade de ${name}`}>{quantity}</output>
        <Button
          type="button"
          aria-label={`Aumentar quantidade de ${name}`}
          className={quantityButtonClass}
          disabled={quantity >= MAX_QUANTITY || atualizar.isPending}
          onClick={() => alterarQuantidade(quantity + 1)}
        >
          <PlusIcon aria-hidden="true" className="size-3" strokeWidth={3} />
        </Button>
      </div>

      <p role="cell" className="text-base font-bold text-primary-200">
        {total}
      </p>

      <div role="cell" className="flex items-center justify-center">
        <Button
          type="button"
          variant="ghost"
          aria-label={`Remover ${name} do carrinho`}
          className="size-5 p-0 text-muted-200/80 hover:bg-transparent hover:text-primary"
          disabled={remover.isPending}
          onClick={() => remover.mutate(tokenId)}
        >
          <TrashIcon aria-hidden="true" className="size-4.5" />
        </Button>
      </div>
    </div>
  );
}
