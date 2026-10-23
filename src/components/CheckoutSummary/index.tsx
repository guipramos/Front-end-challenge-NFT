import { useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { CheckoutSuccessModal } from "../CheckoutSuccessModal";
import { cn } from "@/lib/utils";
import { useCarrinho } from "@/hooks/useCarrinho";
import { useFinalizarCompra } from "@/hooks/useFinalizarCompra";

const PLACEHOLDER = "—";

const wallets = ["MetaMask", "WalletConnect", "Coinbase"] as const;

const walletOptionClass =
  "flex h-11.25 cursor-pointer items-center gap-2.5 rounded-xs border border-muted-200/20 pt-2 pl-2.5 text-[15px] leading-6 text-foreground transition-colors has-checked:gap-8.5 has-checked:border-muted-200 has-checked:pl-3.75 has-focus-visible:border-ring";

const radioClass =
  "size-4 shrink-0 appearance-none rounded-full border-2 border-muted-200/70 outline-none checked:border-muted-200 checked:bg-primary checked:shadow-[inset_0_0_0_1.5px_var(--color-black)] focus-visible:ring-3 focus-visible:ring-ring/50";

export function CheckoutSummary() {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { data: carrinho, isLoading } = useCarrinho();
  const finalizar = useFinalizarCompra();

  const items = carrinho?.items ?? [];

  const handleConfirmar = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const form = event.currentTarget.form;

    if (form && !form.reportValidity()) return;

    const formData = form ? new FormData(form) : null;
    const network = formData?.get("network");

    finalizar.mutate(
      {
        walletOption: String(formData?.get("walletOption") ?? ""),
        network: network ? String(network) : null,
      },
      { onSuccess: () => setIsSuccessModalOpen(true) },
    );
  };

  return (
    <aside aria-labelledby="checkout-summary-title" className="flex flex-col">
      <h2
        id="checkout-summary-title"
        className="text-[17px] leading-6 font-bold text-foreground"
      >
        Seus NFTs
      </h2>

      <div className="mt-0.5 flex items-center justify-between border-b border-muted-200/20 pb-2 text-base leading-6 text-foreground">
        <span className="font-bold">NFTs</span>
        <span className="font-medium">Subtotal</span>
      </div>

      <ul className="mt-3 flex flex-col gap-3">
        {isLoading && (
          <li className="text-sm text-muted-200">Carregando...</li>
        )}
        {!isLoading && items.length === 0 && (
          <li className="text-sm text-muted-200">Seu carrinho está vazio.</li>
        )}
        {items.map((item) => (
          <li
            key={item.tokenId}
            className="grid h-17.5 grid-cols-[minmax(0,1fr)_40px_98px] items-center gap-x-2 rounded-xs bg-surface pr-4 pl-1"
          >
            <div className="flex min-w-0 items-center gap-2">
              <img
                src={item.image}
                alt={item.name}
                className="h-auto w-17.5 min-w-0 shrink-100 self-start rounded-md bg-nft-bg object-cover"
              />
              <div className="flex min-w-0 flex-col">
                <p className="text-base leading-5.5 font-bold whitespace-nowrap text-foreground">
                  {item.name}
                </p>
                <p className="text-sm leading-5.5 whitespace-nowrap text-primary-200/70">
                  ID do token: {item.tokenId}
                </p>
              </div>
            </div>

            <p className="text-[13px] text-muted-200">
              <span className="sr-only">Quantidade </span>(x {item.quantity})
            </p>

            <p className="text-right text-lg font-bold text-primary">
              {item.total}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-center text-sm leading-6 text-foreground">
        Tem um código promocional?{" "}
        <button type="button" className="cursor-pointer">
          Aplique aqui
        </button>
      </p>

      <dl className="mt-1.5 flex flex-col gap-2 text-[15px] leading-6 text-foreground">
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd className="text-lg leading-6">
            {carrinho?.subtotal ?? PLACEHOLDER}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Desconto do lançamento</dt>
          <dd className="text-[13px]">
            (-) {carrinho?.desconto ?? PLACEHOLDER}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Taxa de rede</dt>
          <dd className="text-lg leading-6">
            {carrinho?.taxa ?? PLACEHOLDER}
          </dd>
        </div>
      </dl>

      <p className="mt-2.75 text-center text-xs leading-4 text-primary-200/80">
        Taxa estimada
      </p>

      <div className="mt-2.5 border-t border-muted-200/20 pt-2">
        <p className="flex items-center justify-between pr-11 pl-10 leading-6">
          <span className="text-base font-bold text-foreground">Total</span>
          <strong className="text-lg leading-6 font-bold text-primary">
            {carrinho?.total ?? PLACEHOLDER}
          </strong>
        </p>
      </div>

      <h3
        id="checkout-wallet-title"
        className="mt-1 text-center text-[17px] leading-6 font-bold text-foreground"
      >
        Carteira e rede
      </h3>

      <div
        role="radiogroup"
        aria-labelledby="checkout-wallet-title"
        className="mt-4 flex flex-col gap-4"
      >
        <label className={cn(walletOptionClass, "pt-1")}>
          <input
            type="radio"
            name="walletOption"
            value="all"
            className={radioClass}
          />
          <ul className="flex w-fit items-center gap-2 rounded-md border border-primary-200/50 bg-surface-alt-200 px-2 py-1.5 text-[9px] leading-normal font-bold tracking-wide text-primary uppercase">
            {wallets.map((wallet) => (
              <li
                key={wallet}
                className="not-last:after:ml-2 not-last:after:content-['·']"
              >
                {wallet}
              </li>
            ))}
          </ul>
        </label>

        <label className={walletOptionClass}>
          <input
            type="radio"
            name="walletOption"
            value="metamask"
            className={radioClass}
          />
          MetaMask
        </label>

        <label className={walletOptionClass}>
          <input
            type="radio"
            name="walletOption"
            value="coinbase"
            defaultChecked
            className={radioClass}
          />
          Coinbase Wallet
        </label>
      </div>

      <Button
        type="submit"
        className="mt-6 h-11.5 w-full text-[15px] font-bold"
        disabled={isLoading || items.length === 0 || finalizar.isPending}
        onClick={handleConfirmar}
      >
        {finalizar.isPending ? "Confirmando..." : "Confirmar compra"}
      </Button>

      <CheckoutSuccessModal
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        transaction={finalizar.data}
      />
    </aside>
  );
}
