export type NftCardProps = {
  id: string;
  image: string;
  name: string;
  price: string;
  oldPrice?: string;
  variant?: "default" | "compact";
};

export type NftReview = {
  author: string;
  rating: number;
  comment: string;
};

export type Nft = NftCardProps & {
  description: string;
  edition: string;
  editions: readonly string[];
  tokenId: string;
  collection: string;
  category: string;
  network: string;
  listedAt: string;
  trending: boolean;
  attributes: readonly string[];
  ratingCount: number;
  rating: number;
  details: {
    paragraphs: readonly string[];
    network: string;
    contract: string;
    royalties: string;
  };
  reviews: readonly NftReview[];
};

export type ComprarPayload = Pick<Nft, "tokenId" | "edition"> & {
  quantity: number;
};
