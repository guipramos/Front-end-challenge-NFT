import nftArtwork03 from "../assets/monkey-3.png";
import nftArtwork04 from "../assets/monkey-4.png";
import nftArtwork05 from "../assets/monkey-5.png";
import nftArtwork09 from "../assets/monkey-9.png";
import type { Nft, NftCardProps, NftReview } from "../Types";

type NftSeed = NftCardProps & {
  attributes?: readonly string[];
  category?: string;
  network?: string;
  listedAt?: string;
  trending?: boolean;
};

const editions = ["1/1", "1/10", "1/50", "ABERTA"] as const;

const defaultReviews: readonly NftReview[] = [
  {
    author: "Marina S.",
    rating: 5,
    comment:
      "Arte impecável e entrega imediata. A procedência na rede deu toda a confiança na compra.",
  },
  {
    author: "Rafael T.",
    rating: 5,
    comment:
      "Os metadados estão completos e o acesso exclusivo para colecionadores é um ótimo diferencial.",
  },
  {
    author: "Camila O.",
    rating: 4,
    comment:
      "Coleção consistente e com identidade forte. Espero novos lançamentos em breve.",
  },
];

function buildNft({
  attributes,
  category,
  network,
  listedAt,
  trending,
  ...seed
}: NftSeed): Nft {
  const tokenNumber = seed.name.split("#")[1] ?? "000";

  return {
    ...seed,
    category: category ?? "Arte digital",
    network: network ?? "Ethereum",
    listedAt: listedAt ?? "2026-01-01",
    trending: trending ?? false,
    description:
      "Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.",
    edition: "1/50",
    editions,
    tokenId: `#0${tokenNumber}`,
    collection: "Kurio Apes",
    attributes: attributes ?? ["Óculos", "Esmeralda", "Raro"],
    rating: 4,
    ratingCount: 19,
    details: {
      paragraphs: [
        `${seed.name} é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.`,
        "A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.",
      ],
      network:
        "Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.",
      contract:
        "Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.",
      royalties: "0x7A42...19E8 • Contrato inteligente ERC-721 verificado.",
    },
    reviews: defaultReviews,
  };
}

/** NFTs listados no Mercado (grade da Home). */
export const marketNfts: readonly Nft[] = (
  [
    {
      id: "emerald-ape-042",
      image: nftArtwork03,
      name: "Emerald Ape #042",
      price: "1.19 ETH",
      category: "Arte digital",
      network: "Ethereum",
      listedAt: "2026-10-20",
      trending: true,
    },
    {
      id: "sage-nomad-069",
      image: nftArtwork04,
      name: "Sage Nomad #069",
      price: "1.69 ETH",
      attributes: ["Chapéu", "Moletom", "Comum"],
      category: "Fotografia",
      network: "Polygon",
      listedAt: "2026-10-14",
      trending: false,
    },
    {
      id: "neon-vessel-332",
      image: nftArtwork05,
      name: "Neon Vessel #332",
      price: "1.89 ETH",
      oldPrice: "2.29 ETH",
      attributes: ["Blazer", "Neon", "Épico"],
      category: "Arte 3D",
      network: "Solana",
      listedAt: "2026-10-08",
      trending: true,
    },
    {
      id: "cosmic-bloom-118",
      image: nftArtwork04,
      name: "Cosmic Bloom #118",
      price: "1.25 ETH",
      attributes: ["Chapéu", "Moletom", "Raro"],
      category: "Arte digital",
      network: "Ethereum",
      listedAt: "2026-09-28",
      trending: false,
    },
    {
      id: "violet-nomad-311",
      image: nftArtwork04,
      name: "Violet Nomad #311",
      price: "1.89 ETH",
      attributes: ["Chapéu", "Violeta", "Raro"],
      category: "Generativo",
      network: "Polygon",
      listedAt: "2026-09-15",
      trending: true,
    },
    {
      id: "ivory-baron-008",
      image: nftArtwork05,
      name: "Ivory Baron #008",
      price: "1.75 ETH",
      attributes: ["Blazer", "Marfim", "Épico"],
      category: "Música",
      network: "Ethereum",
      listedAt: "2026-08-30",
      trending: false,
    },
    {
      id: "golden-wave-197",
      image: nftArtwork09,
      name: "Golden Wave #197",
      price: "0.99 ETH",
      attributes: ["Fones", "Dourado", "Comum"],
      category: "Jogos",
      network: "Solana",
      listedAt: "2026-08-10",
      trending: false,
    },
    {
      id: "golden-pulse-204",
      image: nftArtwork09,
      name: "Golden Pulse #204",
      price: "1.09 ETH",
      attributes: ["Fones", "Dourado", "Raro"],
      category: "Arte digital",
      network: "Polygon",
      listedAt: "2026-07-22",
      trending: true,
    },
    {
      id: "golden-signal-146",
      image: nftArtwork09,
      name: "Golden Signal #146",
      price: "1.49 ETH",
      attributes: ["Fones", "Dourado", "Épico"],
      category: "Colecionamento",
      network: "Ethereum",
      listedAt: "2026-07-01",
      trending: false,
    },
  ] satisfies readonly NftSeed[]
).map(buildNft);

/**
 * Carrossel "Mais desta coleção": três páginas de cinco itens.
 * A página central é a exibida por padrão.
 */
export const collectionNftPages: readonly (readonly Nft[])[] = (
  [
    [
      { name: "Sage Nomad #069", price: "1.69 ETH", image: nftArtwork04 },
      { name: "Neon Vessel #332", price: "1.89 ETH", image: nftArtwork05 },
      { name: "Golden Wave #197", price: "0.99 ETH", image: nftArtwork09 },
      { name: "Violet Nomad #311", price: "1.89 ETH", image: nftArtwork04 },
      { name: "Ivory Baron #008", price: "1.75 ETH", image: nftArtwork05 },
    ],
    [
      { name: "Cosmic Bloom #118", price: "1.29 ETH", image: nftArtwork04 },
      { name: "Violet Nomad #314", price: "1.39 ETH", image: nftArtwork04 },
      { name: "Ivory Baron #088", price: "1.79 ETH", image: nftArtwork05 },
      { name: "Golden Beat #207", price: "0.99 ETH", image: nftArtwork09 },
      { name: "Golden Signal #160", price: "0.39 ETH", image: nftArtwork09 },
    ],
    [
      { name: "Golden Pulse #204", price: "1.09 ETH", image: nftArtwork09 },
      { name: "Cosmic Bloom #121", price: "1.35 ETH", image: nftArtwork04 },
      { name: "Ivory Baron #091", price: "1.65 ETH", image: nftArtwork05 },
      { name: "Sage Nomad #072", price: "1.59 ETH", image: nftArtwork04 },
      { name: "Golden Wave #199", price: "1.05 ETH", image: nftArtwork09 },
    ],
  ] satisfies readonly (readonly Omit<NftCardProps, "id">[])[]
).map((page, pageIndex) =>
  page.map((item, itemIndex) =>
    buildNft({ ...item, id: `kurio-apes-${pageIndex * 5 + itemIndex + 1}` }),
  ),
);

export const DEFAULT_COLLECTION_PAGE = 1;

const allNfts: readonly Nft[] = [...marketNfts, ...collectionNftPages.flat()];

export function findNftById(id: string): Nft | undefined {
  return allNfts.find((nft) => nft.id === id);
}
