import { describe, expect, it } from "vitest";
import { isAxiosError } from "axios";
import { api } from "@/lib/api";
import { cartItems } from "@/data/cart";
import { checkoutOptions } from "@/data/checkout";
import { filterOptions } from "@/data/filters";
import { marketNfts } from "@/data/nfts";
import type {
  CarrinhoResponse,
  CheckoutTransaction,
  Nft,
} from "@/Types";

async function expectStatus(promise: Promise<unknown>, status: number) {
  const error = await promise.then(
    () => null,
    (e: unknown) => e,
  );
  expect(isAxiosError(error)).toBe(true);
  expect(isAxiosError(error) && error.response?.status).toBe(status);
  return isAxiosError(error) ? error : null;
}

describe("handlers de catálogo", () => {
  it("GET /nfts devolve todos os NFTs do mercado", async () => {
    const { data } = await api.get<Nft[]>("/nfts");

    expect(data).toHaveLength(marketNfts.length);
    expect(data.map((nft) => nft.id)).toEqual(marketNfts.map((nft) => nft.id));
  });

  it("GET /nfts/:id devolve o NFT correspondente", async () => {
    const { data } = await api.get<Nft>("/nfts/emerald-ape-042");

    expect(data.name).toBe("Emerald Ape #042");
    expect(data.price).toBe("1.19 ETH");
  });

  it("GET /nfts/:id responde 404 para id inexistente", async () => {
    const error = await expectStatus(api.get("/nfts/nao-existe"), 404);

    expect(error?.response?.data).toEqual({ message: "NFT não encontrado" });
  });

  it("GET /filter-options devolve coleções e redes", async () => {
    const { data } = await api.get("/filter-options");

    expect(data).toEqual(filterOptions);
  });

  it("GET /checkout/options devolve redes, carteiras e sufixos ENS", async () => {
    const { data } = await api.get("/checkout/options");

    expect(data).toEqual(checkoutOptions);
  });
});

describe("handlers de carrinho", () => {
  it("GET /mercado/carrinho devolve itens e totais iniciais", async () => {
    const { data } = await api.get<CarrinhoResponse>("/mercado/carrinho");

    expect(data.items).toHaveLength(cartItems.length);
    expect(data.subtotal).toBe("26.83 ETH");
    expect(data.desconto).toBe("00.00");
    expect(data.taxa).toBe("0.016 ETH");
    expect(data.total).toBe("26.846 ETH");
  });

  it("POST /carrinho soma a quantidade de um item que já está no carrinho", async () => {
    const { data, status } = await api.post<CarrinhoResponse>("/carrinho", {
      tokenId: "#0042",
      quantity: 1,
      edition: "1/50",
    });

    const item = data.items.find((i) => i.tokenId === "#0042");
    expect(status).toBe(201);
    expect(data.items).toHaveLength(3);
    expect(item?.quantity).toBe(3);
    expect(item?.total).toBe("3.57 ETH");
  });

  it("POST /carrinho adiciona um item novo", async () => {
    const { data } = await api.post<CarrinhoResponse>("/carrinho", {
      tokenId: "#0069",
      quantity: 2,
      edition: "1/50",
    });

    const item = data.items.find((i) => i.tokenId === "#0069");
    expect(data.items).toHaveLength(4);
    expect(item).toMatchObject({
      name: "Sage Nomad #069",
      price: "1.69 ETH",
      quantity: 2,
      total: "3.38 ETH",
    });
  });

  it("POST /carrinho responde 404 para tokenId desconhecido", async () => {
    const error = await expectStatus(
      api.post("/carrinho", { tokenId: "#9999", quantity: 1 }),
      404,
    );

    expect(error?.response?.data).toEqual({ message: "NFT não encontrado" });
  });

  it("PATCH /carrinho/:tokenId atualiza quantidade e total do item", async () => {
    const { data } = await api.patch<CarrinhoResponse>(
      `/carrinho/${encodeURIComponent("#0042")}`,
      { quantity: 5 },
    );

    const item = data.items.find((i) => i.tokenId === "#0042");
    expect(item?.quantity).toBe(5);
    expect(item?.total).toBe("5.95 ETH");
  });

  it("PATCH /carrinho/:tokenId responde 404 se o item não está no carrinho", async () => {
    await expectStatus(
      api.patch(`/carrinho/${encodeURIComponent("#9999")}`, { quantity: 2 }),
      404,
    );
  });

  it("DELETE /carrinho/:tokenId remove o item", async () => {
    const { data } = await api.delete<CarrinhoResponse>(
      `/carrinho/${encodeURIComponent("#0042")}`,
    );

    expect(data.items.map((i) => i.tokenId)).toEqual(["#0009", "#0552"]);
  });

  it("DELETE em um item inexistente mantém o carrinho intacto", async () => {
    const { data } = await api.delete<CarrinhoResponse>(
      `/carrinho/${encodeURIComponent("#9999")}`,
    );

    expect(data.items).toHaveLength(3);
  });

  it("as alterações persistem entre requisições (estado do mock)", async () => {
    await api.delete(`/carrinho/${encodeURIComponent("#0042")}`);

    const { data } = await api.get<CarrinhoResponse>("/mercado/carrinho");

    expect(data.items).toHaveLength(2);
    expect(data.subtotal).toBe("24.45 ETH");
  });
});

describe("handler de checkout", () => {
  it("POST /checkout cria a transação a partir do carrinho", async () => {
    const { data, status } = await api.post<CheckoutTransaction>("/checkout", {
      walletOption: "metamask",
      network: "polygon",
    });

    expect(status).toBe(201);
    expect(data.id).toMatch(/^0x[0-9A-F]{4}…[0-9A-F]{4}$/);
    expect(data.wallet).toBe("MetaMask");
    expect(data.network).toBe("Polygon");
    expect(data.networkFee).toBe("0.016 ETH");
    expect(data.total).toBe("26.846 ETH");
    expect(data.explorerUrl).toBe("https://etherscan.io");
    expect(data.items).toHaveLength(3);
    expect(data.date).toEqual(expect.any(String));
  });

  it("mapeia as carteiras conhecidas para seus rótulos", async () => {
    const { data } = await api.post<CheckoutTransaction>("/checkout", {
      walletOption: "coinbase",
      network: "solana",
    });

    expect(data.wallet).toBe("Coinbase Wallet");
    expect(data.network).toBe("Solana");
  });

  it("usa MetaMask e Ethereum como padrão para valores desconhecidos", async () => {
    const { data } = await api.post<CheckoutTransaction>("/checkout", {
      walletOption: "outra",
      network: null,
    });

    expect(data.wallet).toBe("MetaMask");
    expect(data.network).toBe("Ethereum");
  });

  it("esvazia o carrinho depois da compra", async () => {
    await api.post("/checkout", { walletOption: "all", network: "ethereum" });

    const { data } = await api.get<CarrinhoResponse>("/mercado/carrinho");

    expect(data.items).toEqual([]);
    expect(data.subtotal).toBe("0.00 ETH");
  });

  it("responde 400 quando o carrinho está vazio", async () => {
    await api.post("/checkout", { walletOption: "all", network: "ethereum" });

    const error = await expectStatus(
      api.post("/checkout", { walletOption: "all", network: "ethereum" }),
      400,
    );

    expect(error?.response?.data).toEqual({ message: "O carrinho está vazio" });
  });
});
