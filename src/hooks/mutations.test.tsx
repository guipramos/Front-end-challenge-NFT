import { describe, expect, it, vi } from "vitest";
import { act, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { createTestQueryClient, renderHookWithQuery } from "@/test/utils";
import { useAtualizarQuantidadeCarrinho } from "./useAtualizarQuantidadeCarrinho";
import { useCarrinho } from "./useCarrinho";
import { useFinalizarCompra } from "./useFinalizarCompra";
import { useRemoverItemCarrinho } from "./useRemoverItemCarrinho";

const tokenIds = (items?: { tokenId: string }[]) =>
  items?.map((item) => item.tokenId);

describe("useAtualizarQuantidadeCarrinho", () => {
  it("envia PATCH com o tokenId codificado e a nova quantidade", async () => {
    let received: { path: string; body: unknown } | undefined;
    server.use(
      http.patch("/api/carrinho/:tokenId", async ({ request }) => {
        received = {
          path: new URL(request.url).pathname,
          body: await request.json(),
        };
        return HttpResponse.json({});
      }),
    );

    const { result } = renderHookWithQuery(() =>
      useAtualizarQuantidadeCarrinho(),
    );

    act(() => result.current.mutate({ tokenId: "#0042", quantity: 4 }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(received).toEqual({
      path: "/api/carrinho/%230042",
      body: { quantity: 4 },
    });
  });

  it("invalida a query do carrinho ao concluir", async () => {
    const client = createTestQueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    const { result } = renderHookWithQuery(
      () => useAtualizarQuantidadeCarrinho(),
      client,
    );

    act(() => result.current.mutate({ tokenId: "#0042", quantity: 3 }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["carrinho"] });
  });

  it("atualiza os dados do carrinho em cache", async () => {
    const { result } = renderHookWithQuery(() => ({
      carrinho: useCarrinho(),
      atualizar: useAtualizarQuantidadeCarrinho(),
    }));
    await waitFor(() => expect(result.current.carrinho.isSuccess).toBe(true));

    act(() =>
      result.current.atualizar.mutate({ tokenId: "#0042", quantity: 5 }),
    );

    await waitFor(() =>
      expect(
        result.current.carrinho.data?.items.find((i) => i.tokenId === "#0042")
          ?.quantity,
      ).toBe(5),
    );
  });

  it("marca erro quando o item não existe", async () => {
    const { result } = renderHookWithQuery(() =>
      useAtualizarQuantidadeCarrinho(),
    );

    act(() => result.current.mutate({ tokenId: "#9999", quantity: 2 }));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useRemoverItemCarrinho", () => {
  it("remove o item e atualiza o carrinho", async () => {
    const { result } = renderHookWithQuery(() => ({
      carrinho: useCarrinho(),
      remover: useRemoverItemCarrinho(),
    }));
    await waitFor(() => expect(result.current.carrinho.isSuccess).toBe(true));

    act(() => result.current.remover.mutate("#0042"));

    await waitFor(() =>
      expect(tokenIds(result.current.carrinho.data?.items)).toEqual([
        "#0009",
        "#0552",
      ]),
    );
  });

  it("invalida a query do carrinho ao concluir", async () => {
    const client = createTestQueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    const { result } = renderHookWithQuery(
      () => useRemoverItemCarrinho(),
      client,
    );

    act(() => result.current.mutate("#0009"));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["carrinho"] });
  });
});

describe("useFinalizarCompra", () => {
  it("retorna a transação criada", async () => {
    const { result } = renderHookWithQuery(() => useFinalizarCompra());

    act(() =>
      result.current.mutate({ walletOption: "metamask", network: "polygon" }),
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.wallet).toBe("MetaMask");
    expect(result.current.data?.network).toBe("Polygon");
    expect(result.current.data?.items).toHaveLength(3);
  });

  it("esvazia o carrinho em cache depois da compra", async () => {
    const { result } = renderHookWithQuery(() => ({
      carrinho: useCarrinho(),
      finalizar: useFinalizarCompra(),
    }));
    await waitFor(() => expect(result.current.carrinho.isSuccess).toBe(true));

    act(() =>
      result.current.finalizar.mutate({ walletOption: "all", network: null }),
    );

    await waitFor(() =>
      expect(result.current.carrinho.data?.items).toHaveLength(0),
    );
  });

  it("expõe erro quando o carrinho está vazio", async () => {
    const { result } = renderHookWithQuery(() => useFinalizarCompra());
    const payload = { walletOption: "all", network: null };

    act(() => result.current.mutate(payload));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => result.current.mutate(payload));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
