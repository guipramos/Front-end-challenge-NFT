import nftArtwork03 from "../assets/monkey-3.png";
import nftArtwork04 from "../assets/monkey-4.png";
import nftArtwork05 from "../assets/monkey-5.png";
import type { CartItemProps } from "../Types";

export const cartItems: readonly CartItemProps[] = [
  {
    image: nftArtwork03,
    name: "Emerald Ape #042",
    tokenId: "#0042",
    price: "1.19 ETH",
    quantity: 2,
    total: "2.38 ETH",
  },
  {
    image: nftArtwork04,
    name: "Violet Nomad #314",
    tokenId: "#0009",
    price: "1.39 ETH",
    quantity: 6,
    total: "8.34 ETH",
  },
  {
    image: nftArtwork05,
    name: "Ivory Baron #088",
    tokenId: "#0552",
    price: "1.79 ETH",
    quantity: 9,
    total: "16.11 ETH",
  },
];
