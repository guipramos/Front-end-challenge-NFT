import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { renderApp } from "@/test/utils";
import { getLastViewedNftId, setLastViewedNftId } from "@/lib/lastViewedNft";

const breadcrumb = () => screen.getByRole("navigation", { name: "Navegação estrutural" });

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("página Home", () => {
  it("compõe todas as seções da home", async () => {
    await renderApp("/");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Seja dono do futuro da arte digital" }),
    ).toBeVisible();
    expect(screen.getByRole("complementary", { name: "Filtros" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "NFT em destaque" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Lista de NFTs" })).toBeVisible();
    expect(
      within(screen.getByRole("region", { name: "Destaques" })).getAllByRole("article"),
    ).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Diário da Cunhagem" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Diferenciais e newsletter" })).toBeVisible();
  });

  it("carrega os NFTs do mercado na grade", async () => {
    await renderApp("/");

    expect(
      await screen.findByRole("link", { name: "Ver detalhes de Emerald Ape #042" }),
    ).toBeVisible();
    expect(
      within(screen.getByRole("region", { name: "Lista de NFTs" })).getAllByRole("link", {
        name: /Ver detalhes de/,
      }),
    ).toHaveLength(6);
  });

  it("filtra a grade ao escolher uma coleção na barra lateral", async () => {
    const { user } = await renderApp("/");
    await screen.findByRole("link", { name: "Ver detalhes de Emerald Ape #042" });

    await user.click(await screen.findByRole("button", { name: /Fotografia/ }));

    const grade = screen.getByRole("region", { name: "Lista de NFTs" });
    const links = within(grade).getAllByRole("link", { name: /Ver detalhes de/ });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName("Ver detalhes de Sage Nomad #069");
  });

  it("filtra a grade por rede e permite limpar o filtro", async () => {
    const { user } = await renderApp("/");
    await screen.findByRole("link", { name: "Ver detalhes de Emerald Ape #042" });
    const grade = screen.getByRole("region", { name: "Lista de NFTs" });
    const solana = await screen.findByRole("button", { name: /Solana/ });

    await user.click(solana);
    expect(within(grade).getAllByRole("link", { name: /Ver detalhes de/ })).toHaveLength(2);

    await user.click(solana);
    expect(within(grade).getAllByRole("link", { name: /Ver detalhes de/ })).toHaveLength(6);
  });
});

describe("páginas vazias (Mercado, Criadores, Aprenda)", () => {
  it.each([
    ["/mercado", "Mercado"],
    ["/criadores", "Criadores"],
    ["/aprenda", "Aprenda"],
  ])("%s renderiza o layout e destaca o item do menu", async (route, label) => {
    await renderApp(route);

    const nav = screen.getByRole("navigation", { name: "" });
    await waitFor(() =>
      expect(within(nav).getByRole("link", { name: label })).toHaveAttribute(
        "data-status",
        "active",
      ),
    );
    expect(screen.getByRole("banner")).toBeVisible();
    expect(screen.getByRole("contentinfo")).toBeVisible();
  });
});

describe("página NftDetails", () => {
  it("mostra os detalhes do NFT pelo id da URL", async () => {
    await renderApp("/mercado/emerald-ape-042");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Emerald Ape #042" }),
    ).toBeVisible();
    expect(screen.getByRole("region", { name: "Detalhes de Emerald Ape #042" })).toBeVisible();
    expect(screen.getByText("1.19 ETH")).toBeVisible();
    expect(screen.getByRole("list", { name: "Miniaturas de Emerald Ape #042" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Detalhes do NFT" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Mais desta coleção" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Diferenciais e newsletter" })).toBeVisible();
  });

  it("mostra o breadcrumb com a página atual", async () => {
    await renderApp("/mercado/emerald-ape-042");

    await screen.findByRole("heading", { level: 1 });
    expect(within(breadcrumb()).getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
    expect(within(breadcrumb()).getByRole("link", { name: "Mercado" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("registra o NFT como último visitado", async () => {
    await renderApp("/mercado/neon-vessel-332");

    await screen.findByRole("heading", { level: 1, name: "Neon Vessel #332" });
    expect(getLastViewedNftId()).toBe("neon-vessel-332");
  });

  it("também abre NFTs do carrossel de coleção", async () => {
    await renderApp("/mercado/kurio-apes-3");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Golden Wave #197" }),
    ).toBeVisible();
  });

  it("mostra a mensagem de não encontrado para ids inexistentes", async () => {
    await renderApp("/mercado/nao-existe");

    expect(await screen.findByRole("heading", { name: "NFT não encontrado" })).toBeVisible();
    expect(
      screen.getByText("O item que você procura não existe ou foi removido do mercado."),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Voltar para o início" })).toHaveAttribute("href", "/");
    expect(getLastViewedNftId()).toBeNull();
  });

  it("'Voltar para o início' leva à home", async () => {
    const { user, router } = await renderApp("/mercado/nao-existe");

    await user.click(await screen.findByRole("link", { name: "Voltar para o início" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
    expect(
      await screen.findByRole("heading", { level: 1, name: /Seja dono do futuro/ }),
    ).toBeVisible();
  });

  it("navega para outro NFT a partir do carrossel e reinicia o estado", async () => {
    const { user, router } = await renderApp("/mercado/emerald-ape-042");
    await screen.findByRole("heading", { level: 1, name: "Emerald Ape #042" });
    await user.click(screen.getByRole("radio", { name: "ABERTA" }));
    await user.click(screen.getByRole("button", { name: "Aumentar quantidade" }));

    await user.click(screen.getByRole("link", { name: "Ver detalhes de Violet Nomad #314" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Violet Nomad #314" }),
    ).toBeVisible();
    expect(router.state.location.pathname).toBe("/mercado/kurio-apes-7");
    expect(getLastViewedNftId()).toBe("kurio-apes-7");
    expect(screen.getByRole("radio", { name: "1/50" })).toBeChecked();
    expect(screen.getByRole("group", { name: "Quantidade" })).toHaveTextContent("1");
  });
});

describe("página Carrinho", () => {
  const tabela = () => screen.getByRole("table", { name: "NFTs no carrinho" });
  const aguardarItens = () => within(tabela()).findByText("Emerald Ape #042");

  it("lista os itens do carrinho e o resumo", async () => {
    await renderApp("/mercado/carrinho");

    expect(screen.getByText("Carregando...")).toBeVisible();
    const tabela = screen.getByRole("table", { name: "NFTs no carrinho" });
    expect(await within(tabela).findByText("Emerald Ape #042")).toBeVisible();
    expect(within(tabela).getByText("Violet Nomad #314")).toBeVisible();
    expect(within(tabela).getByText("Ivory Baron #088")).toBeVisible();
    expect(within(tabela).getAllByRole("columnheader").map((c) => c.textContent)).toEqual([
      "NFTs",
      "Preço",
      "Edições",
      "Total",
      "Remover",
    ]);
    expect(await screen.findByText("26.83 ETH")).toBeVisible();
    expect(screen.getByText("26.846 ETH")).toBeVisible();
  });

  it("mostra o breadcrumb Início / Mercado / Carrinho", async () => {
    await renderApp("/mercado/carrinho");

    const nav = breadcrumb();
    expect(within(nav).getByRole("link", { name: "Início" })).toBeVisible();
    expect(within(nav).getByRole("link", { name: "Mercado" })).toHaveAttribute("href", "/mercado");
    expect(within(nav).getByRole("link", { name: "Carrinho" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("o link 'Mercado' volta ao último NFT visitado", async () => {
    setLastViewedNftId("sage-nomad-069");
    await renderApp("/mercado/carrinho");

    expect(within(breadcrumb()).getByRole("link", { name: "Mercado" })).toHaveAttribute(
      "href",
      "/mercado/sage-nomad-069",
    );
  });

  it("atualiza total do item e resumo ao aumentar a quantidade", async () => {
    const { user } = await renderApp("/mercado/carrinho");
    await aguardarItens();

    await user.click(
      screen.getByRole("button", { name: "Aumentar quantidade de Emerald Ape #042" }),
    );

    expect(await screen.findByText("3.57 ETH")).toBeVisible();
    expect(screen.getByRole("status", { name: "Quantidade de Emerald Ape #042" })).toHaveTextContent(
      "3",
    );
    expect(await screen.findByText("28.02 ETH")).toBeVisible();
  });

  it("atualiza o total ao diminuir a quantidade", async () => {
    const { user } = await renderApp("/mercado/carrinho");
    await aguardarItens();

    await user.click(
      screen.getByRole("button", { name: "Diminuir quantidade de Violet Nomad #314" }),
    );

    expect(await screen.findByText("6.95 ETH")).toBeVisible();
  });

  it("remove um item e atualiza o contador do cabeçalho", async () => {
    const { user } = await renderApp("/mercado/carrinho");
    await aguardarItens();
    expect(await screen.findByRole("button", { name: "Carrinho, 3 itens" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Remover Emerald Ape #042 do carrinho" }));

    await waitFor(() =>
      expect(within(tabela()).queryByText("Emerald Ape #042")).not.toBeInTheDocument(),
    );
    expect(await screen.findByRole("button", { name: "Carrinho, 2 itens" })).toBeVisible();
    expect(await screen.findByText("24.45 ETH")).toBeVisible();
  });

  it("zera o resumo quando todos os itens são removidos", async () => {
    const { user } = await renderApp("/mercado/carrinho");
    await aguardarItens();

    for (const nome of ["Emerald Ape #042", "Violet Nomad #314", "Ivory Baron #088"]) {
      await user.click(screen.getByRole("button", { name: `Remover ${nome} do carrinho` }));
      await waitFor(() =>
        expect(within(tabela()).queryByText(nome)).not.toBeInTheDocument(),
      );
    }

    expect(await screen.findByText("0.00 ETH")).toBeVisible();
    expect(await screen.findByRole("button", { name: "Carrinho, 0 itens" })).toBeVisible();
  });

  it("'Conectar e finalizar' abre a página de pagamento", async () => {
    const { user, router } = await renderApp("/mercado/carrinho");
    await aguardarItens();

    await user.click(screen.getByRole("button", { name: "Conectar e finalizar" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/mercado/pagamento"));
    expect(await screen.findByRole("region", { name: "Pagamento" })).toBeVisible();
  });

  it("mostra o carrossel 'Colecionadores também viram'", async () => {
    await renderApp("/mercado/carrinho");

    expect(
      await screen.findByRole("heading", { name: "Colecionadores também viram" }),
    ).toBeVisible();
  });
});

describe("página Pagamento", () => {
  async function preencherFormulario(user: Awaited<ReturnType<typeof renderApp>>["user"]) {
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

  it("mostra o breadcrumb, o formulário e o resumo", async () => {
    await renderApp("/mercado/pagamento");

    expect(within(breadcrumb()).getByRole("link", { name: "Mercado" })).toBeVisible();
    expect(breadcrumb()).toHaveTextContent("Pagamento");
    expect(screen.getByRole("heading", { name: "Perfil do colecionador" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Seus NFTs" })).toBeVisible();
    expect(await screen.findByText("Emerald Ape #042")).toBeVisible();
    expect(screen.getByRole("button", { name: "Confirmar compra" })).toBeVisible();
  });

  it("não finaliza a compra com campos obrigatórios vazios", async () => {
    let chamou = false;
    server.use(
      http.post("/api/checkout", () => {
        chamou = true;
        return HttpResponse.json({}, { status: 201 });
      }),
    );
    const { user } = await renderApp("/mercado/pagamento");
    await screen.findByText("Emerald Ape #042");

    await user.click(screen.getByRole("button", { name: "Confirmar compra" }));

    expect(chamou).toBe(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("finaliza a compra com o formulário preenchido", async () => {
    let body: unknown;
    server.use(
      http.post("/api/checkout", async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(
          {
            id: "0xABCD…1234",
            date: "23 de out. de 2026",
            wallet: "MetaMask",
            network: "Polygon",
            networkFee: "0.016 ETH",
            total: "26.846 ETH",
            explorerUrl: "https://etherscan.io",
            items: [],
          },
          { status: 201 },
        );
      }),
    );
    const { user } = await renderApp("/mercado/pagamento");
    await screen.findByText("Emerald Ape #042");
    await preencherFormulario(user);

    await user.click(screen.getByRole("button", { name: "Confirmar compra" }));

    const dialog = await screen.findByRole("dialog", {
      name: "Seus NFTs agora estão na sua carteira",
    });
    expect(within(dialog).getByText(/Transação confirmada na Polygon/)).toBeVisible();
    expect(body).toEqual({ walletOption: "coinbase", network: "polygon" });
  });
});

describe("página Perfil", () => {
  it("mostra o menu lateral e o formulário do perfil", async () => {
    await renderApp("/perfil");

    expect(screen.getByRole("complementary", { name: "Meu perfil" })).toBeVisible();
    expect(screen.getByRole("heading", { level: 1, name: "Perfil do colecionador" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Menu do perfil" })).toBeVisible();
  });

  it("usa o cabeçalho da variante 'profile'", async () => {
    await renderApp("/perfil");

    expect(screen.getByRole("banner")).toHaveClass("border-muted-200/20");
    expect(
      within(screen.getByRole("banner")).getByRole("link", { name: "Início" }),
    ).toHaveAttribute("data-status", "active");
  });
});
