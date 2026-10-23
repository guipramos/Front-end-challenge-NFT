import { Link } from "@tanstack/react-router";
import { getLastViewedNftId } from "@/lib/lastViewedNft";

const linkClass = "transition-colors hover:text-primary";

/**
 * Link "Mercado" do breadcrumb: volta para o último NFT visitado
 * (/mercado/:id) e, se não houver nenhum, para a lista (/mercado).
 */
export function MercadoBreadcrumbLink() {
  const nftId = getLastViewedNftId();

  if (nftId) {
    return (
      <Link to="/mercado/$nftId" params={{ nftId }} className={linkClass}>
        Mercado
      </Link>
    );
  }

  return (
    <Link to="/mercado" className={linkClass}>
      Mercado
    </Link>
  );
}
