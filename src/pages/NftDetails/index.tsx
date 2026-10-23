import { useEffect } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { setLastViewedNftId } from "@/lib/lastViewedNft";
import { CollectionCarousel } from "../../components/CollectionCarousel";
import { Newsletter } from "../../components/Newsletter";
import { NftGallery } from "../../components/NftGallery";
import { NftInfo } from "../../components/NftInfo";
import { NftTabs } from "../../components/NftTabs";
import {
  collectionNftPages,
  DEFAULT_COLLECTION_PAGE,
  findNftById,
} from "../../data/nfts";

export function NftDetails() {
  const { nftId } = useParams({ from: "/mercado/$nftId" });
  const nft = findNftById(nftId);

  useEffect(() => {
    if (nft) setLastViewedNftId(nft.id);
  }, [nft]);

  if (!nft) {
    return (
      <main className="container flex flex-col items-center gap-6 py-24 text-center">
        <h1 className="text-[28px] leading-9 font-bold">NFT não encontrado</h1>
        <p className="text-sm text-muted-200">
          O item que você procura não existe ou foi removido do mercado.
        </p>
        <Link
          to="/"
          className="text-primary underline-offset-4 hover:underline"
        >
          Voltar para o início
        </Link>
      </main>
    );
  }

  return (
    <main className="container flex flex-col gap-24 pt-3">
      <section
        aria-label={`Detalhes de ${nft.name}`}
        className="-mb-1.5 flex flex-col"
      >
        <nav
          aria-label="Navegação estrutural"
          className="mb-[9px] text-[15px] leading-6 font-bold"
        >
          <ol className="flex whitespace-pre">
            <li>
              <Link to="/" className="transition-colors hover:text-primary">
                Início
              </Link>
            </li>
            <li aria-hidden="true">{" / "}</li>
            <li>
              <Link
                to="/mercado/$nftId"
                params={{ nftId: nft.id }}
                aria-current="page"
                className="transition-colors hover:text-primary"
              >
                Mercado
              </Link>
            </li>
          </ol>
        </nav>

        <div
          key={nft.id}
          className="grid gap-8 lg:grid-cols-[574px_minmax(0,1fr)]"
        >
          <NftGallery name={nft.name} images={Array(4).fill(nft.image)} />
          <NftInfo nft={nft} />
        </div>
      </section>

      <NftTabs key={`tabs-${nft.id}`} nft={nft} />

      <CollectionCarousel
        key={`collection-${nft.id}`}
        pages={collectionNftPages}
        initialPage={DEFAULT_COLLECTION_PAGE}
      />

      <Newsletter />
    </main>
  );
}
