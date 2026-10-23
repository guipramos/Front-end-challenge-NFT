import { Link } from "@tanstack/react-router";
import { CheckoutForm } from "../../components/CheckoutForm";
import { CheckoutSummary } from "../../components/CheckoutSummary";
import { MercadoBreadcrumbLink } from "../../components/MercadoBreadcrumbLink";
import { Newsletter } from "../../components/Newsletter";

export function Pagamento() {
  return (
    <main className="container flex flex-col gap-24 pt-3.5">
      <section aria-label="Pagamento" className="flex flex-col">
        <nav
          aria-label="Navegação estrutural"
          className="mb-6 text-[15px] leading-6 font-bold"
        >
          <ol className="flex whitespace-pre">
            <li>
              <Link to="/" className="transition-colors hover:text-primary">
                Início
              </Link>
            </li>
            <li aria-hidden="true">{" / "}</li>
            <li>
              <MercadoBreadcrumbLink />
            </li>
            <li aria-hidden="true">{" / "}</li>
            <li aria-current="page">Pagamento</li>
          </ol>
        </nav>

        <form className="grid items-start gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,1fr)_405px]">
          <CheckoutForm />
          <CheckoutSummary />
        </form>
      </section>

      <Newsletter />
    </main>
  );
}
