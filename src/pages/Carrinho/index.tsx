import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { CartItem, cartGridClass } from "../../components/CartItem";
import { CartSummary } from "../../components/CartSummary";
import { MercadoBreadcrumbLink } from "../../components/MercadoBreadcrumbLink";
import { CollectionCarousel } from "../../components/CollectionCarousel";
import { Newsletter } from "../../components/Newsletter";
import { collectionNftPages, DEFAULT_COLLECTION_PAGE } from "../../data/nfts";
import { useCarrinho } from "@/hooks/useCarrinho";

const columns = ["NFTs", "Preço", "Edições", "Total"] as const;

export function Carrinho() {
  const { data: carrinho, isLoading } = useCarrinho();
  const items = carrinho?.items ?? [];

  return (
    <main className="container flex flex-col gap-24 pt-3">
      <section aria-label="Carrinho de NFTs" className="-mb-1.5 flex flex-col">
        <nav
          aria-label="Navegação estrutural"
          className="mb-1.5 text-[15px] leading-6 font-bold"
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
            <li>
              <Link
                to="/mercado/carrinho"
                aria-current="page"
                className="transition-colors hover:text-primary"
              >
                Carrinho
              </Link>
            </li>
          </ol>
        </nav>

        <div className="grid items-start gap-x-21.5 gap-y-10 lg:grid-cols-[minmax(0,1fr)_332px]">
          <div role="table" aria-label="NFTs no carrinho">
            <div
              role="row"
              className={cn(
                "hidden border-b border-muted-200/20 pb-1.5 text-base leading-6 font-bold text-foreground",
                cartGridClass,
              )}
            >
              {columns.map((column, index) => (
                <span
                  key={column}
                  role="columnheader"
                  className={cn(index > 0 && "font-medium text-foreground/80")}
                >
                  {column}
                </span>
              ))}
              <span role="columnheader" className="sr-only">
                Remover
              </span>
            </div>

            <div role="rowgroup" className="flex flex-col gap-3 lg:mt-3">
              {isLoading && <p className="text-muted-200">Carregando...</p>}
              {items.map((item) => (
                <CartItem key={item.tokenId} {...item} />
              ))}
            </div>
          </div>

          {carrinho && (
            <CartSummary
              subtotal={carrinho.subtotal}
              desconto={carrinho.desconto}
              taxa={carrinho.taxa}
              total={carrinho.total}
            />
          )}
        </div>
      </section>

      <CollectionCarousel
        title="Colecionadores também viram"
        pages={collectionNftPages}
        initialPage={DEFAULT_COLLECTION_PAGE}
      />

      <Newsletter />
    </main>
  );
}
