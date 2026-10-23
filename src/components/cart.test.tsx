import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { renderWithRouter } from "@/test/utils";
import { setLastViewedNftId } from "@/lib/lastViewedNft";
import type { CartItemProps } from "@/Types";
import { CartButton } from "./CartButton";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { MercadoBreadcrumbLink } from "./MercadoBreadcrumbLink";

describe("CartButton", () => {
  it("usa o plural no rótulo e não mostra o selo com zero itens", () => {
    render(<CartButton />);

    const button = screen.getByRole("button", { name: "Carrinho, 0 itens" });
    expect(button).toBeVisible();
    expect(button.querySelector("[data-slot=badge]")).toBeNull();
  });

  it("usa o singular com 1 item", () => {
    render(<CartButton count={1} />);

    expect(
      screen.getByRole("button", { name: "Carrinho, 1 item" }),
    ).toBeVisible();
  });

  it("mostra o selo com a quantidade de itens", () => {
    render(<CartButton count={3} />);

    const button = screen.getByRole("button", { name: "Carrinho, 3 itens" });
    expect(button.querySelector("[data-slot=badge]")).toHaveTextContent("3");
  });

  it("limita o selo a 99+", () => {
    render(<CartButton count={150} />);

    const button = screen.getByRole("button", { name: "Carrinho, 150 itens" });
    expect(button.querySelector("[data-slot=badge]")).toHaveTextContent("99+");
  });

  it("mostra 99 sem o sinal de + no limite", () => {
    render(<CartButton count={99} />);

    expect(
      screen
        .getByRole("button", { name: "Carrinho, 99 itens" })
        .querySelector("[data-slot=badge]"),
    ).toHaveTextContent(/^99$/);
  });

  it("repassa props, className e badgeClassName", () => {
    const onClick = vi.fn();
    render(
      <CartButton
        count={2}
        className="classe-botao"
        badgeClassName="classe-selo"
        onClick={onClick}
      />,
    );

    const button = screen.getByRole("button", { name: /Carrinho/ });
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveClass("classe-botao");
    expect(button.querySelector("[data-slot=badge]")).toHaveClass("classe-selo");
  });
});

const item: CartItemProps = {
  image: "/a.png",
  name: "Emerald Ape #042",
  tokenId: "#0042",
  price: "1.19 ETH",
  quantity: 2,
  total: "2.38 ETH",
};

describe("CartItem", () => {
  it("exibe imagem, nome, token, preço, quantidade e total", async () => {
    await renderWithRouter(<CartItem {...item} />);

    expect(screen.getByRole("img", { name: item.name })).toHaveAttribute("src", "/a.png");
    expect(screen.getByText(item.name)).toBeVisible();
    expect(screen.getByText("ID do token: #0042")).toBeVisible();
    expect(screen.getByText("1.19 ETH")).toBeVisible();
    expect(screen.getByRole("status", { name: `Quantidade de ${item.name}` })).toHaveTextContent("2");
    expect(screen.getByText("2.38 ETH")).toBeVisible();
  });

  it("aumenta a quantidade enviando PATCH com quantity + 1", async () => {
    let received: { path: string; body: unknown } | undefined;
    server.use(
      http.patch("/api/carrinho/:tokenId", async ({ request }) => {
        received = { path: new URL(request.url).pathname, body: await request.json() };
        return HttpResponse.json({});
      }),
    );
    const { user } = await renderWithRouter(<CartItem {...item} />);

    await user.click(screen.getByRole("button", { name: `Aumentar quantidade de ${item.name}` }));

    await waitFor(() =>
      expect(received).toEqual({ path: "/api/carrinho/%230042", body: { quantity: 3 } }),
    );
  });

  it("diminui a quantidade enviando PATCH com quantity - 1", async () => {
    let body: unknown;
    server.use(
      http.patch("/api/carrinho/:tokenId", async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({});
      }),
    );
    const { user } = await renderWithRouter(<CartItem {...item} />);

    await user.click(screen.getByRole("button", { name: `Diminuir quantidade de ${item.name}` }));

    await waitFor(() => expect(body).toEqual({ quantity: 1 }));
  });

  it("desabilita 'Diminuir' na quantidade mínima (1)", async () => {
    await renderWithRouter(<CartItem {...item} quantity={1} />);

    expect(
      screen.getByRole("button", { name: `Diminuir quantidade de ${item.name}` }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: `Aumentar quantidade de ${item.name}` }),
    ).toBeEnabled();
  });

  it("desabilita 'Aumentar' na quantidade máxima (99)", async () => {
    await renderWithRouter(<CartItem {...item} quantity={99} />);

    expect(
      screen.getByRole("button", { name: `Aumentar quantidade de ${item.name}` }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: `Diminuir quantidade de ${item.name}` }),
    ).toBeEnabled();
  });

  it("desabilita os botões de quantidade enquanto a atualização está em andamento", async () => {
    server.use(
      http.patch("/api/carrinho/:tokenId", async () => {
        await delay(150);
        return HttpResponse.json({});
      }),
    );
    const { user } = await renderWithRouter(<CartItem {...item} />);
    const mais = screen.getByRole("button", { name: `Aumentar quantidade de ${item.name}` });
    const menos = screen.getByRole("button", { name: `Diminuir quantidade de ${item.name}` });

    await user.click(mais);

    expect(mais).toBeDisabled();
    expect(menos).toBeDisabled();
    await waitFor(() => expect(mais).toBeEnabled());
  });

  it("remove o item enviando DELETE", async () => {
    let path: string | undefined;
    server.use(
      http.delete("/api/carrinho/:tokenId", ({ request }) => {
        path = new URL(request.url).pathname;
        return HttpResponse.json({});
      }),
    );
    const { user } = await renderWithRouter(<CartItem {...item} />);

    await user.click(screen.getByRole("button", { name: `Remover ${item.name} do carrinho` }));

    await waitFor(() => expect(path).toBe("/api/carrinho/%230042"));
  });

  it("desabilita 'Remover' enquanto a remoção está em andamento", async () => {
    server.use(
      http.delete("/api/carrinho/:tokenId", async () => {
        await delay(150);
        return HttpResponse.json({});
      }),
    );
    const { user } = await renderWithRouter(<CartItem {...item} />);
    const remover = screen.getByRole("button", { name: `Remover ${item.name} do carrinho` });

    await user.click(remover);

    expect(remover).toBeDisabled();
    await waitFor(() => expect(remover).toBeEnabled());
  });
});

describe("CartSummary", () => {
  const totals = {
    subtotal: "26.83 ETH",
    desconto: "00.00",
    taxa: "0.016 ETH",
    total: "26.846 ETH",
  };

  it("exibe subtotal, desconto, taxa e total", async () => {
    await renderWithRouter(<CartSummary {...totals} />);

    expect(screen.getByRole("heading", { name: "Resumo da carteira" })).toBeVisible();
    expect(screen.getByText("26.83 ETH")).toBeVisible();
    expect(screen.getByText("(-) 00.00")).toBeVisible();
    expect(screen.getByText("0.016 ETH")).toBeVisible();
    expect(screen.getByText("26.846 ETH")).toBeVisible();
    expect(screen.getByText("Taxa estimada")).toBeVisible();
  });

  it("permite digitar o código promocional", async () => {
    const { user } = await renderWithRouter(<CartSummary {...totals} />);

    const input = screen.getByLabelText("Código promocional");
    await user.type(input, "KURIO10");

    expect(input).toHaveValue("KURIO10");
    expect(screen.getByRole("button", { name: "Aplicar" })).toHaveAttribute("type", "submit");
  });

  it("'Conectar e finalizar' leva para /mercado/pagamento", async () => {
    const { user, router } = await renderWithRouter(<CartSummary {...totals} />);

    await user.click(screen.getByRole("button", { name: "Conectar e finalizar" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/mercado/pagamento"));
  });

  it("'Continuar explorando' é um link para a home", async () => {
    await renderWithRouter(<CartSummary {...totals} />, { route: "/mercado" });

    expect(screen.getByRole("link", { name: "Continuar explorando" })).toHaveAttribute("href", "/");
  });
});

describe("MercadoBreadcrumbLink", () => {
  it("aponta para /mercado quando nenhum NFT foi visitado", async () => {
    await renderWithRouter(<MercadoBreadcrumbLink />);

    expect(screen.getByRole("link", { name: "Mercado" })).toHaveAttribute("href", "/mercado");
  });

  it("aponta para o último NFT visitado", async () => {
    setLastViewedNftId("emerald-ape-042");
    await renderWithRouter(<MercadoBreadcrumbLink />);

    expect(screen.getByRole("link", { name: "Mercado" })).toHaveAttribute(
      "href",
      "/mercado/emerald-ape-042",
    );
  });

  it("navega para o destino ao clicar", async () => {
    setLastViewedNftId("neon-vessel-332");
    const { user, router } = await renderWithRouter(<MercadoBreadcrumbLink />);

    await user.click(screen.getByRole("link", { name: "Mercado" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/mercado/neon-vessel-332"));
  });
});
