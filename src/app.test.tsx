import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import { RootLayout } from "./components/RootLayout";
import { router } from "./router";
import { renderApp } from "@/test/utils";

const siteHeader = () => screen.getAllByRole("banner")[0];

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("router", () => {
  it("registra todas as rotas da aplicação", () => {
    expect(Object.keys(router.routesByPath).sort()).toEqual(
      [
        "/",
        "/aprenda",
        "/criadores",
        "/mercado",
        "/mercado/$nftId",
        "/mercado/carrinho",
        "/mercado/pagamento",
        "/perfil",
      ].sort(),
    );
  });

  it("restaura o scroll entre navegações", () => {
    expect(router.options.scrollRestoration).toBe(true);
  });

  it("usa o RootLayout como layout raiz", () => {
    expect(router.routeTree.options.component).toBe(RootLayout);
  });
});

describe("App", () => {
  afterEach(async () => {
    await router.navigate({ to: "/" });
  });

  it("renderiza a home com cabeçalho e rodapé", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", { level: 1, name: /Seja dono do futuro/ }),
    ).toBeVisible();
    expect(siteHeader()).toBeVisible();
    expect(screen.getByRole("contentinfo")).toBeVisible();
  });

  it("navega pelo menu sem recarregar a página", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: /Seja dono do futuro/ });

    await user.click(
      within(screen.getByRole("navigation", { name: "" })).getByRole("link", { name: "Aprenda" }),
    );

    await waitFor(() => expect(router.state.location.pathname).toBe("/aprenda"));
    expect(
      screen.queryByRole("heading", { level: 1, name: /Seja dono do futuro/ }),
    ).not.toBeInTheDocument();
  });

  it("fornece o React Query para a árvore (carrinho no cabeçalho)", async () => {
    render(<App />);

    expect(await screen.findByRole("button", { name: "Carrinho, 3 itens" })).toBeVisible();
  });
});

describe("RootLayout", () => {
  it("renderiza cabeçalho, conteúdo da rota e rodapé", async () => {
    await renderApp("/aprenda");

    expect(siteHeader()).toBeVisible();
    expect(screen.getByRole("contentinfo")).toBeVisible();
  });

  it("usa o cabeçalho padrão fora do perfil", async () => {
    await renderApp("/");

    expect(siteHeader()).toHaveClass("border-primary-200/30");
  });

  it("troca para o cabeçalho do perfil em /perfil", async () => {
    await renderApp("/perfil");

    expect(siteHeader()).toHaveClass("border-muted-200/20");
  });

  it("volta ao cabeçalho padrão ao sair do perfil", async () => {
    const { router: testRouter } = await renderApp("/perfil");

    await testRouter.navigate({ to: "/aprenda" });

    await waitFor(() =>
      expect(siteHeader()).toHaveClass("border-primary-200/30"),
    );
  });
});
