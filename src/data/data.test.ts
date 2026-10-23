import { describe, expect, it } from "vitest";
import { cartItems } from "./cart";
import { checkoutOptions } from "./checkout";
import {
  DEFAULT_FILTERS,
  filterOptions,
  MAX_PRICE,
  MIN_PRICE,
} from "./filters";
import {
  collectionNftPages,
  DEFAULT_COLLECTION_PAGE,
  findNftById,
  marketNfts,
} from "./nfts";
import { accentIcon, profileMenuItems } from "./profile";
import { priceToNumber } from "@/lib/utils";

describe("data/nfts", () => {
  it("lista 9 NFTs no mercado com ids únicos", () => {
    const ids = marketNfts.map((nft) => nft.id);

    expect(marketNfts).toHaveLength(9);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("preenche todos os campos obrigatórios de cada NFT", () => {
    for (const nft of marketNfts) {
      expect(nft.name).toMatch(/#\d+$/);
      expect(nft.image).toBeTruthy();
      expect(priceToNumber(nft.price)).toBeGreaterThan(0);
      expect(nft.tokenId).toMatch(/^#0\d+$/);
      expect(nft.editions).toContain(nft.edition);
      expect(nft.attributes.length).toBeGreaterThan(0);
      expect(nft.details.paragraphs).toHaveLength(2);
      expect(nft.reviews).toHaveLength(3);
    }
  });

  it("gera o tokenId a partir do número do nome", () => {
    expect(findNftById("emerald-ape-042")?.tokenId).toBe("#0042");
    expect(findNftById("neon-vessel-332")?.tokenId).toBe("#0332");
  });

  it("mantém o preço antigo apenas nos NFTs em promoção", () => {
    const comPrecoAntigo = marketNfts.filter((nft) => nft.oldPrice);

    expect(comPrecoAntigo.map((nft) => nft.id)).toEqual(["neon-vessel-332"]);
  });

  it("todas as categorias e redes dos NFTs existem nas opções de filtro", () => {
    const categorias = filterOptions.collections.map((c) => c.label);
    const redes = filterOptions.networks.map((n) => n.label);

    for (const nft of marketNfts) {
      expect(categorias).toContain(nft.category);
      expect(redes).toContain(nft.network);
    }
  });

  it("o carrossel tem 3 páginas de 5 itens com ids sequenciais", () => {
    expect(collectionNftPages).toHaveLength(3);
    collectionNftPages.forEach((page) => expect(page).toHaveLength(5));
    expect(collectionNftPages.flat().map((nft) => nft.id)).toEqual(
      Array.from({ length: 15 }, (_, i) => `kurio-apes-${i + 1}`),
    );
  });

  it("a página padrão do carrossel é a central", () => {
    expect(DEFAULT_COLLECTION_PAGE).toBe(1);
  });

  describe("findNftById", () => {
    it("encontra NFTs do mercado", () => {
      expect(findNftById("golden-wave-197")?.name).toBe("Golden Wave #197");
    });

    it("encontra NFTs do carrossel de coleção", () => {
      expect(findNftById("kurio-apes-7")?.name).toBe("Violet Nomad #314");
    });

    it("retorna undefined para ids desconhecidos", () => {
      expect(findNftById("nao-existe")).toBeUndefined();
    });
  });
});

describe("data/filters", () => {
  it("define a faixa de preço padrão", () => {
    expect(MIN_PRICE).toBe(0.02);
    expect(MAX_PRICE).toBe(13.38);
    expect(DEFAULT_FILTERS).toEqual({
      category: null,
      network: null,
      price: [MIN_PRICE, MAX_PRICE],
    });
  });

  it("expõe coleções e redes com contagens positivas", () => {
    expect(filterOptions.collections).toHaveLength(9);
    expect(filterOptions.networks.map((n) => n.label)).toEqual([
      "Ethereum",
      "Polygon",
      "Solana",
    ]);
    [...filterOptions.collections, ...filterOptions.networks].forEach((o) =>
      expect(o.count).toBeGreaterThan(0),
    );
  });
});

describe("data/cart", () => {
  it("o total de cada item é preço × quantidade", () => {
    for (const item of cartItems) {
      const esperado = (priceToNumber(item.price) * item.quantity).toFixed(2);

      expect(priceToNumber(item.total).toFixed(2)).toBe(esperado);
    }
  });

  it("possui 3 itens com tokenIds distintos", () => {
    expect(cartItems.map((i) => i.tokenId)).toEqual(["#0042", "#0009", "#0552"]);
  });
});

describe("data/checkout", () => {
  it("oferece as redes, carteiras e sufixos ENS esperados", () => {
    expect(checkoutOptions.networks.map((n) => n.value)).toEqual([
      "ethereum",
      "polygon",
      "solana",
    ]);
    expect(checkoutOptions.walletTypes.map((w) => w.value)).toEqual([
      "metamask",
      "walletconnect",
      "coinbase",
    ]);
    expect(checkoutOptions.ensSuffixes).toEqual([
      { value: ".eth", label: ".eth" },
    ]);
  });
});

describe("data/profile", () => {
  it("monta o menu do perfil com 7 itens e apenas um ativo", () => {
    const ativos = profileMenuItems.filter((item) => "active" in item);

    expect(profileMenuItems.map((i) => i.label)).toEqual([
      "Dados do perfil",
      "Carteiras",
      "Atividade",
      "Lista de interesse",
      "Ofertas",
      "Arquivos baixados",
      "Suporte",
    ]);
    expect(ativos).toHaveLength(1);
    expect(ativos[0].label).toBe("Dados do perfil");
  });

  it("exporta a classe de destaque dos ícones", () => {
    expect(accentIcon).toBe("text-[#d2936c]");
  });
});
