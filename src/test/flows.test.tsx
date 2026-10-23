import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { renderApp } from "@/test/utils";
import { getLastViewedNftId } from "@/lib/lastViewedNft";

type User = Awaited<ReturnType<typeof renderApp>>["user"];

const cartTable = () => screen.getByRole("table", { name: "NFTs no carrinho" });
const headerCart = (count: number) =>
  screen.findByRole("button", {
    name: `Carrinho, ${count} ${count === 1 ? "item" : "itens"}`,
  });

async function preencherPagamento(user: User) {
  const form = within(screen.getByRole("region", { name: "Perfil do colecionador" }));
  await user.type(form.getByLabelText(/Nome de exibição/), "Ana Souza");
  await user.type(form.getByLabelText(/Nome de usuário/), "ana");
  await user.type(form.getByLabelText(/Nome do perfil/), "Ana");
  await user.type(form.getByLabelText(/Endereço da carteira/), "0xABCDEF");
  await user.type(form.getByLabelText(/Código de indicação/), "KURIO");
  await user.type(form.getByLabelText(/E-mail/), "ana@email.com");
  await user.click(form.getByRole("combobox", { name: /^Rede/ }));
  await user.click(await screen.findByRole("option", { name: "Polygon" }));
  await user.click(form.getByRole("combobox", { name: /Tipo de carteira/ }));
  await user.click(await screen.findByRole("option", { name: "MetaMask" }));
}

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("fluxo: descobrir, comprar e finalizar", () => {
  it("filtra na home, abre o NFT, compra, revisa o carrinho e paga", async () => {
    const { user, router } = await renderApp("/");

    await user.click(await screen.findByRole("button", { name: /Fotografia/ }));
    const grade = screen.getByRole("region", { name: "Lista de NFTs" });
    await user.click(
      await within(grade).findByRole("link", { name: "Ver detalhes de Sage Nomad #069" }),
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Sage Nomad #069" }),
    ).toBeVisible();
    expect(router.state.location.pathname).toBe("/mercado/sage-nomad-069");
    await user.click(screen.getByRole("radio", { name: "1/10" }));
    await user.click(screen.getByRole("button", { name: "Aumentar quantidade" }));
    await user.click(screen.getByRole("button", { name: "Comprar" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/mercado/carrinho"));
    const tabela = within(await screen.findByRole("table", { name: "NFTs no carrinho" }));
    expect(await tabela.findByText("Sage Nomad #069")).toBeVisible();
    expect(tabela.getByRole("status", { name: "Quantidade de Sage Nomad #069" })).toHaveTextContent(
      "2",
    );
    expect(tabela.getByText("3.38 ETH")).toBeVisible();
    expect(await headerCart(4)).toBeVisible();
    expect(await screen.findByText("30.21 ETH")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Conectar e finalizar" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/mercado/pagamento"));
    expect(await screen.findByText("Sage Nomad #069")).toBeVisible();
    await preencherPagamento(user);
    await user.click(screen.getByRole("button", { name: "Confirmar compra" }));

    const dialog = await screen.findByRole("dialog", {
      name: "Seus NFTs agora estão na sua carteira",
    });
    expect(within(dialog).getByText(/Transação confirmada na Polygon/)).toBeVisible();
    expect(within(dialog).getByText("Sage Nomad #069")).toBeVisible();
    expect(within(dialog).getByRole("link", { name: "Ver no Etherscan" })).toHaveAttribute(
      "href",
      "https://etherscan.io",
    );

    await user.click(within(dialog).getByRole("button", { name: "Fechar" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(await screen.findByText("Seu carrinho está vazio.")).toBeVisible();
    expect(await headerCart(0)).toBeVisible();
    expect(screen.getByRole("button", { name: "Confirmar compra" })).toBeDisabled();
  });

  it("comprar um NFT que já está no carrinho soma as quantidades", async () => {
    const { user, router } = await renderApp("/mercado/emerald-ape-042");
    await screen.findByRole("heading", { level: 1, name: "Emerald Ape #042" });

    await user.click(screen.getByRole("button", { name: "Comprar" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/mercado/carrinho"));
    const tabela = within(await screen.findByRole("table", { name: "NFTs no carrinho" }));
    expect(
      await tabela.findByRole("status", { name: "Quantidade de Emerald Ape #042" }),
    ).toHaveTextContent("3");
    expect(tabela.getAllByRole("row").filter((r) => r.querySelector("img"))).toHaveLength(3);
    expect(await headerCart(3)).toBeVisible();
  });

  it("o breadcrumb do carrinho volta ao último NFT visitado", async () => {
    const { user, router } = await renderApp("/mercado/neon-vessel-332");
    await screen.findByRole("heading", { level: 1, name: "Neon Vessel #332" });
    await user.click(screen.getByRole("button", { name: "Comprar" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/mercado/carrinho"));
    expect(getLastViewedNftId()).toBe("neon-vessel-332");

    await user.click(
      within(screen.getByRole("navigation", { name: "Navegação estrutural" })).getByRole("link", {
        name: "Mercado",
      }),
    );

    await waitFor(() => expect(router.state.location.pathname).toBe("/mercado/neon-vessel-332"));
    expect(
      await screen.findByRole("heading", { level: 1, name: "Neon Vessel #332" }),
    ).toBeVisible();
  });
});

describe("fluxo: gerenciar o carrinho", () => {
  it("ajusta quantidades, remove itens e acompanha o resumo até a página de pagamento", async () => {
    const { user, router } = await renderApp("/mercado/carrinho");
    await within(cartTable()).findByText("Emerald Ape #042");

    await user.click(screen.getByRole("button", { name: "Aumentar quantidade de Emerald Ape #042" }));
    expect(await screen.findByText("3.57 ETH")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Diminuir quantidade de Emerald Ape #042" }));
    await waitFor(() => expect(screen.queryByText("3.57 ETH")).not.toBeInTheDocument());
    expect(screen.getByText("2.38 ETH")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Remover Ivory Baron #088 do carrinho" }));
    await waitFor(() =>
      expect(within(cartTable()).queryByText("Ivory Baron #088")).not.toBeInTheDocument(),
    );
    expect(await headerCart(2)).toBeVisible();
    expect(await screen.findByText("10.72 ETH")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Conectar e finalizar" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/mercado/pagamento"));
    expect(await screen.findByText("Emerald Ape #042")).toBeVisible();
    expect(screen.getByText("Violet Nomad #314")).toBeVisible();
    expect(screen.queryByText("Ivory Baron #088")).not.toBeInTheDocument();
  });

  it("não deixa finalizar a compra com o carrinho vazio", async () => {
    const { user, router } = await renderApp("/mercado/carrinho");
    await within(cartTable()).findByText("Emerald Ape #042");

    for (const nome of ["Emerald Ape #042", "Violet Nomad #314", "Ivory Baron #088"]) {
      await user.click(screen.getByRole("button", { name: `Remover ${nome} do carrinho` }));
      await waitFor(() => expect(within(cartTable()).queryByText(nome)).not.toBeInTheDocument());
    }
    await user.click(screen.getByRole("button", { name: "Conectar e finalizar" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/mercado/pagamento"));

    expect(await screen.findByText("Seu carrinho está vazio.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Confirmar compra" })).toBeDisabled();
  });
});

describe("fluxo: autenticação", () => {
  it("abre o modal pelo cabeçalho, cria a conta e fecha", async () => {
    const { user } = await renderApp("/");
    await user.click(screen.getByRole("button", { name: "Entrar" }));
    const dialog = await screen.findByRole("dialog", { name: "Entrar" });

    await user.click(within(dialog).getByRole("tab", { name: "Criar conta" }));
    await user.type(within(dialog).getByLabelText("Nome de usuário"), "ana");
    await user.type(within(dialog).getByLabelText("Digite seu e-mail"), "ana@email.com");
    await user.type(within(dialog).getByLabelText("Senha"), "segredo123");
    await user.type(within(dialog).getByLabelText("Confirmar senha"), "diferente1");
    await user.click(within(dialog).getByRole("button", { name: "Criar conta" }));
    expect(within(dialog).getByRole("alert")).toHaveTextContent("As senhas não coincidem.");

    const confirmar = within(dialog).getByLabelText("Confirmar senha");
    await user.clear(confirmar);
    await user.type(confirmar, "segredo123");
    await user.click(within(dialog).getByRole("button", { name: "Criar conta" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("o modal também funciona nas demais páginas", async () => {
    const { user } = await renderApp("/perfil");

    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("dialog", { name: "Entrar" })).toBeVisible();
  });
});

describe("fluxo: navegação", () => {
  it("percorre o menu principal e o logo", async () => {
    const { user, router } = await renderApp("/");
    const nav = () => within(screen.getByRole("navigation", { name: "" }));

    for (const [label, path] of [
      ["Mercado", "/mercado"],
      ["Criadores", "/criadores"],
      ["Aprenda", "/aprenda"],
      ["Início", "/"],
    ] as const) {
      await user.click(nav().getByRole("link", { name: label }));
      await waitFor(() => expect(router.state.location.pathname).toBe(path));
    }

    await user.click(nav().getByRole("link", { name: "Aprenda" }));
    await user.click(
      within(screen.getByRole("banner")).getByRole("link", {
        name: "Kurio - Ir para a página inicial",
      }),
    );
    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
    expect(
      await screen.findByRole("heading", { level: 1, name: /Seja dono do futuro/ }),
    ).toBeVisible();
  });
});
