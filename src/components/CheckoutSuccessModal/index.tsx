import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CheckoutTransaction } from "../../Types";
import { ThankYou } from "../icones/ThankYou/ThankYou";

type CheckoutSuccessModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: CheckoutTransaction;
};

const rowGridClass =
  "grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-4 sm:grid-cols-[minmax(0,1fr)_67px_100px] sm:gap-x-8";

export function CheckoutSuccessModal({
  open,
  onOpenChange,
  transaction,
}: CheckoutSuccessModalProps) {
  if (!transaction) return null;

  const { items, total, networkFee, network, explorerUrl } = transaction;

  const summaryItems = [
    { label: "ID da transação", value: transaction.id, bold: true },
    { label: "Data", value: transaction.date, bold: false },
    { label: "Total", value: total, bold: false },
    { label: "Carteira", value: transaction.wallet, bold: true },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-143 rounded-none border-0 p-0 sm:max-w-143">
        <div className="relative flex flex-col pb-14.5 after:absolute after:inset-x-0 after:bottom-0 after:h-2.5 after:bg-primary-200 after:content-['']">
          <DialogClose
            aria-label="Fechar"
            className="absolute top-3 right-3 flex size-6 items-center justify-center text-primary-200 transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <X className="size-4" aria-hidden="true" />
          </DialogClose>

          <header className="flex flex-col items-center pt-5.5">
            <ThankYou className="h-20 w-16.5 text-primary-200" aria-hidden="true" />
            <DialogTitle className="mt-3 px-6 text-center text-base leading-6 font-bold text-muted-200">
              Seus NFTs agora estão na sua carteira
            </DialogTitle>
          </header>

          <dl className="mt-4.5 flex flex-wrap justify-center gap-y-3 border-y border-primary-200 px-6 py-3 text-sm leading-5 text-muted-200 sm:h-16.25 sm:flex-nowrap sm:items-center sm:px-9 sm:py-0">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="flex basis-1/2 flex-col sm:basis-auto sm:border-l sm:border-primary-200/50 sm:px-4 sm:first:border-l-0 sm:first:pl-0 sm:last:pr-0"
              >
                <dt className={item.bold ? "font-bold" : undefined}>
                  {item.label}
                </dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>

          <section
            aria-labelledby="checkout-details-title"
            className="px-6 pt-4 sm:px-11"
          >
            <h3
              id="checkout-details-title"
              className="text-[15px] leading-6 font-bold text-foreground"
            >
              Detalhes da transação
            </h3>

            <div
              className={`${rowGridClass} mt-1 border-b border-muted-200/20 pb-1.5 text-base leading-6 font-bold text-foreground`}
            >
              <span>NFTs</span>
              <span className="text-center">Edições</span>
              <span className="text-right">Subtotal</span>
            </div>

            <ul className="mt-3.25 flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.tokenId} className={rowGridClass}>
                  <div className="flex min-w-0 items-center gap-4">
                    <img
                      src={item.image}
                      alt=""
                      className="size-16.25 shrink-0 rounded-md bg-nft-bg object-cover"
                    />
                    <div className="flex min-w-0 flex-col">
                      <p className="truncate text-base leading-5.5 font-bold text-foreground">
                        {item.name}
                      </p>
                      <p className="truncate text-sm leading-5.5 text-primary-200/70">
                        ID do token: {item.tokenId}
                      </p>
                    </div>
                  </div>

                  <p className="text-center text-[13px] text-muted-200">
                    <span className="sr-only">Quantidade </span>(x{" "}
                    {item.quantity})
                  </p>

                  <p className="text-right text-lg font-bold text-primary">
                    {item.total}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-3 ml-auto flex w-full flex-col gap-1.5 border-b border-muted-200/20 pb-1.75 sm:w-79.25">
              <div className="flex items-center justify-between leading-6">
                <dt className="text-[15px] text-foreground">Taxa de rede</dt>
                <dd className="text-lg text-foreground">
                  {networkFee}
                </dd>
              </div>
              <div className="flex items-center justify-between leading-6">
                <dt className="text-base font-bold text-foreground">Total</dt>
                <dd className="text-lg font-bold text-primary">
                  {total}
                </dd>
              </div>
            </dl>

            <DialogDescription className="mt-3 text-center text-sm leading-5.5 text-muted-200">
              Transação confirmada na {network}. A propriedade foi transferida
              para sua carteira conectada e registrada na rede.
            </DialogDescription>

            <div className="mt-5 flex justify-center">
              <Button
                asChild
                className="h-11.75 rounded-xs px-4 text-base font-bold"
              >
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver no Etherscan
                </a>
              </Button>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
