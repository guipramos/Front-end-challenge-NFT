import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CheckoutItem } from "@/Types";

export function CartSummary({ subtotal, desconto, taxa, total }: CheckoutItem) {
  const navigate = useNavigate();

  return (
    <aside aria-labelledby="cart-summary-title" className="flex flex-col">
      <h2
        id="cart-summary-title"
        className="border-b border-muted-200/20 pb-1.5 text-lg leading-6 font-bold text-foreground"
      >
        Resumo da carteira
      </h2>

      <form className="mt-5.5 flex flex-col gap-1.5">
        <Label
          htmlFor="promo-code"
          className="text-sm leading-5 font-bold text-foreground"
        >
          Código promocional
        </Label>
        <div className="flex">
          <Input
            id="promo-code"
            type="text"
            placeholder="Digite o código promocional..."
            className="h-10 rounded-md rounded-r-none border-primary-200/60 bg-black px-2.5 text-xs md:text-xs placeholder:text-muted-200/50"
          />
          <Button
            type="submit"
            className="h-10 w-25.5 shrink-0 rounded-l-none bg-primary-200 px-0 text-[15px] font-bold hover:bg-primary-hover"
          >
            Aplicar
          </Button>
        </div>
      </form>

      <dl className="mt-5.5 flex flex-col gap-2 text-[15px] leading-6">
        <div className="flex items-center justify-between">
          <dt className="text-foreground/80">Subtotal</dt>
          <dd className="text-lg leading-6 text-foreground">{subtotal}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-foreground/80">Desconto do lançamento</dt>
          <dd className="text-foreground">(-) {desconto}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-foreground/80">Taxa de rede</dt>
          <dd className="text-lg leading-6 text-foreground">{taxa}</dd>
        </div>
      </dl>

      <p className="mt-2.75 text-right text-xs leading-4 text-primary-200/80">
        Taxa estimada
      </p>

      <p className="mt-5 flex items-center justify-between leading-6">
        <span className="text-base font-bold text-foreground">Total</span>
        <strong className="text-lg leading-6 font-bold text-primary-200">
          {total}
        </strong>
      </p>

      <Button
        type="button"
        className="mt-5 h-10 w-full bg-primary-200 text-[15px] font-bold hover:bg-primary-hover"
        onClick={() => navigate({ to: "/mercado/pagamento" })}
      >
        Conectar e finalizar
      </Button>

      <Link
        to="/"
        className="mt-3 text-center text-[15px] leading-6 text-muted-200 transition-colors hover:text-primary focus-visible:text-primary"
      >
        Continuar explorando
      </Link>
    </aside>
  );
}
