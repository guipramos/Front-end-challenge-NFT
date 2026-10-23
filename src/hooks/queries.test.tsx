import { describe, expect, it } from "vitest";
import { waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { renderHookWithQuery } from "@/test/utils";
import { checkoutOptions } from "@/data/checkout";
import { filterOptions } from "@/data/filters";
import { marketNfts } from "@/data/nfts";
import { useCarrinho } from "./useCarrinho";
import { useCheckoutOptions } from "./useCheckoutOptions";
import { useFilterOptions } from "./useFilterOptions";
import { useNfts } from "./useNfts";

describe("useNfts", () => {
  it("busca a lista de NFTs", async () => {
    const { result } = renderHookWithQuery(() => useNfts());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(marketNfts.length);
  });

  it("expõe o erro quando a API falha", async () => {
    server.use(http.get("/api/nfts", () => HttpResponse.error()));

    const { result } = renderHookWithQuery(() => useNfts());

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});

describe("useFilterOptions", () => {
  it("busca as opções de filtro", async () => {
    const { result } = renderHookWithQuery(() => useFilterOptions());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(filterOptions);
  });

  it("expõe o erro quando a API falha", async () => {
    server.use(
      http.get("/api/filter-options", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    const { result } = renderHookWithQuery(() => useFilterOptions());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCheckoutOptions", () => {
  it("busca as opções de checkout", async () => {
    const { result } = renderHookWithQuery(() => useCheckoutOptions());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(checkoutOptions);
  });
});

describe("useCarrinho", () => {
  it("busca o carrinho com itens e totais", async () => {
    const { result } = renderHookWithQuery(() => useCarrinho());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(3);
    expect(result.current.data?.total).toBe("26.846 ETH");
  });

  it("usa a chave de cache ['carrinho']", async () => {
    const { result, client } = renderHookWithQuery(() => useCarrinho());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(client.getQueryData(["carrinho"])).toBe(result.current.data);
  });
});
