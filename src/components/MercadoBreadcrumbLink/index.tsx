import { Link } from "@tanstack/react-router";
import { getLastViewedNftId } from "@/lib/lastViewedNft";

const linkClass = "transition-colors hover:text-primary";

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
