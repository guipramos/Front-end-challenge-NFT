import { http, HttpResponse } from "msw";
import { marketNfts } from "@/data/nfts";
import { filterOptions } from "@/data/filters";
import { cartItems } from "@/data/cart";
import { checkoutOptions } from "@/data/checkout";
import type {
  CarrinhoResponse,
  CartItemProps,
  CheckoutPayload,
  CheckoutTransaction,
  ComprarPayload,
} from "@/Types";

const CURRENCY = "ETH";

const parsePrice = (price: string) => Number.parseFloat(price);
const formatPrice = (value: number) => `${value.toFixed(2)} ${CURRENCY}`;

let carrinho: CartItemProps[] = cartItems.map((item) => ({ ...item }));
const TAXA_REDE = 0.016;

export function resetCarrinho() {
  carrinho = cartItems.map((item) => ({ ...item }));
}

function buildCarrinhoResponse(): CarrinhoResponse {
  const subtotal = carrinho.reduce(
    (sum, item) => sum + parsePrice(item.total),
    0,
  );
  const desconto = 0;

  return {
    items: carrinho,
    subtotal: formatPrice(subtotal),
    desconto: "00.00",
    taxa: `${TAXA_REDE} ${CURRENCY}`,
    total: `${(subtotal - desconto + TAXA_REDE).toFixed(3)} ${CURRENCY}`,
  };
}

const WALLET_LABELS: Record<string, string> = {
  all: "Todas as carteiras",
  metamask: "MetaMask",
  coinbase: "Coinbase Wallet",
};

function generateTransactionId() {
  const hash = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  )
    .join("")
    .toUpperCase();

  return `0x${hash.slice(0, 4)}…${hash.slice(-4)}`;
}

export const handlers = [
  http.get("/api/mercado/carrinho", () =>
    HttpResponse.json(buildCarrinhoResponse()),
  ),
  http.post("/api/carrinho", async ({ request }) => {
    const { tokenId, quantity } = (await request.json()) as ComprarPayload;
    const nft = marketNfts.find((item) => item.tokenId === tokenId);

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrado" },
        { status: 404 },
      );
    }

    const existing = carrinho.find((item) => item.tokenId === tokenId);
    const newQuantity = (existing?.quantity ?? 0) + quantity;
    const updated: CartItemProps = {
      image: nft.image,
      name: nft.name,
      tokenId: nft.tokenId,
      price: nft.price,
      quantity: newQuantity,
      total: formatPrice(parsePrice(nft.price) * newQuantity),
    };

    carrinho = existing
      ? carrinho.map((item) => (item.tokenId === tokenId ? updated : item))
      : [...carrinho, updated];

    return HttpResponse.json(buildCarrinhoResponse(), { status: 201 });
  }),
  http.get("/api/checkout/options", () => HttpResponse.json(checkoutOptions)),
  http.post("/api/checkout", async ({ request }) => {
    const { walletOption, network } = (await request.json()) as CheckoutPayload;

    if (carrinho.length === 0) {
      return HttpResponse.json(
        { message: "O carrinho está vazio" },
        { status: 400 },
      );
    }

    const resumo = buildCarrinhoResponse();
    const networkLabel =
      checkoutOptions.networks.find((option) => option.value === network)
        ?.label ?? "Ethereum";

    const transaction: CheckoutTransaction = {
      id: generateTransactionId(),
      date: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      wallet: WALLET_LABELS[walletOption] ?? "MetaMask",
      network: networkLabel,
      networkFee: resumo.taxa,
      total: resumo.total,
      explorerUrl: "https://etherscan.io",
      items: resumo.items,
    };

    carrinho = [];

    return HttpResponse.json(transaction, { status: 201 });
  }),
  http.get("/api/filter-options", () => HttpResponse.json(filterOptions)),
  http.get("/api/nfts", () => HttpResponse.json(marketNfts)),
  http.get("/api/nfts/:id", ({ params }) => {
    const nft = marketNfts.find((item) => item.id === params.id);

    return nft
      ? HttpResponse.json(nft)
      : HttpResponse.json({ message: "NFT não encontrado" }, { status: 404 });
  }),
  http.patch("/api/carrinho/:tokenId", async ({ params, request }) => {
    const tokenId = decodeURIComponent(String(params.tokenId));
    const { quantity } = (await request.json()) as { quantity: number };
    const existing = carrinho.find((item) => item.tokenId === tokenId);

    if (!existing) {
      return HttpResponse.json(
        { message: "Item não encontrado no carrinho" },
        { status: 404 },
      );
    }

    carrinho = carrinho.map((item) =>
      item.tokenId === tokenId
        ? {
            ...item,
            quantity,
            total: formatPrice(parsePrice(item.price) * quantity),
          }
        : item,
    );

    return HttpResponse.json(buildCarrinhoResponse());
  }),
  http.delete("/api/carrinho/:tokenId", ({ params }) => {
    const tokenId = decodeURIComponent(String(params.tokenId));
    carrinho = carrinho.filter((item) => item.tokenId !== tokenId);
    return HttpResponse.json(buildCarrinhoResponse());
  }),
];
