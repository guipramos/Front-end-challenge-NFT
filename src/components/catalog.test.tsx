import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { renderWithRouter } from "@/test/utils";
import { collectionNftPages, findNftById, marketNfts } from "@/data/nfts";
import { DEFAULT_FILTERS } from "@/data/filters";
import type { Filters } from "@/Types";
import { CollectionCarousel } from "./CollectionCarousel";
import { FilterSidebar } from "./FilterSidebar";
import { NftCard } from "./NftCard";
import { NftGallery } from "./NftGallery";
import { NftGrid } from "./NftGrid";
import { NftInfo } from "./NftInfo";
import { NftTabs } from "./NftTabs";
import { Pagination } from "./Pagination";

const emerald = findNftById("emerald-ape-042")!;
const neon = findNftById("neon-vessel-332")!;

describe("NftCard", () => {
  it("exibe nome, preço e imagem", async () => {
    await renderWithRouter(
      <NftCard id="a" image="/a.png" name="Emerald Ape #042" price="1.19 ETH" />,
    );

    expect(screen.getByRole("heading", { name: "Emerald Ape #042" })).toBeVisible();
    expect(screen.getByText("1.19 ETH")).toBeVisible();
    expect(screen.getByRole("img", { name: "Emerald Ape #042" })).toHaveAttribute(
      "src",
      "/a.png",
    );
  });

  it("é um link para a página de detalhes do NFT", async () => {
    await renderWithRouter(
      <NftCard id="emerald-ape-042" image="/a.png" name="Emerald Ape #042" price="1.19 ETH" />,
    );

    expect(
      screen.getByRole("link", { name: "Ver detalhes de Emerald Ape #042" }),
    ).toHaveAttribute("href", "/mercado/emerald-ape-042");
  });

  it("navega para os detalhes ao clicar", async () => {
    const { user, router } = await renderWithRouter(
      <NftCard id="emerald-ape-042" image="/a.png" name="Emerald Ape #042" price="1.19 ETH" />,
    );

    await user.click(screen.getByRole("link", { name: /Ver detalhes/ }));

    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/mercado/emerald-ape-042"),
    );
  });

  it("mostra o preço antigo riscado quando existe", async () => {
    await renderWithRouter(
      <NftCard id="n" image="/n.png" name="Neon" price="1.89 ETH" oldPrice="2.29 ETH" />,
    );

    expect(screen.getByText("2.29 ETH").tagName).toBe("S");
  });

  it("não mostra preço antigo quando não existe", async () => {
    const { container } = await renderWithRouter(
      <NftCard id="n" image="/n.png" name="Neon" price="1.89 ETH" />,
    );

    expect(container.querySelector("s")).toBeNull();
  });

  it("aplica estilos diferentes na variante compacta", async () => {
    await renderWithRouter(
      <>
        <NftCard id="a" image="/a.png" name="Padrão" price="1 ETH" />
        <NftCard id="b" image="/b.png" name="Compacto" price="2 ETH" variant="compact" />
      </>,
    );

    expect(screen.getByRole("heading", { name: "Padrão" })).toHaveClass("mb-3");
    expect(screen.getByRole("heading", { name: "Compacto" })).not.toHaveClass(
      "mb-3",
    );
  });
});

describe("Pagination", () => {
  it("renderiza um link por página e o botão de próxima", () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />);

    const nav = screen.getByRole("navigation", { name: "Paginação" });
    expect(within(nav).getByRole("link", { name: "1" })).toBeVisible();
    expect(within(nav).getByRole("link", { name: "2" })).toBeVisible();
    expect(within(nav).getByRole("link", { name: "3" })).toBeVisible();
    expect(
      within(nav).getByRole("link", { name: "Próxima página" }),
    ).toBeVisible();
  });

  it("marca somente a página atual", () => {
    render(<Pagination currentPage={2} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "1" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("chama onPageChange com a página clicada (sem navegar)", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("link", { name: "3" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("'Próxima página' avança uma página", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("link", { name: "Próxima página" }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("'Próxima página' não passa da última página", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("link", { name: "Próxima página" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});

describe("NftGallery", () => {
  const images = ["/a.png", "/b.png", "/c.png"];

  it("mostra miniaturas e a primeira imagem como principal", () => {
    render(<NftGallery name="Emerald Ape" images={images} />);

    const thumbs = screen.getByRole("list", { name: "Miniaturas de Emerald Ape" });
    expect(within(thumbs).getAllByRole("button")).toHaveLength(3);
    expect(screen.getByRole("img", { name: "Emerald Ape" })).toHaveAttribute(
      "src",
      "/a.png",
    );
    expect(
      screen.getByRole("button", { name: "Ver imagem 1 de 3" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("troca a imagem principal ao clicar numa miniatura", async () => {
    const user = userEvent.setup();
    render(<NftGallery name="Emerald Ape" images={images} />);

    await user.click(screen.getByRole("button", { name: "Ver imagem 3 de 3" }));

    expect(screen.getByRole("img", { name: "Emerald Ape" })).toHaveAttribute(
      "src",
      "/c.png",
    );
    expect(
      screen.getByRole("button", { name: "Ver imagem 3 de 3" }),
    ).toHaveAttribute("aria-current", "true");
    expect(
      screen.getByRole("button", { name: "Ver imagem 1 de 3" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("alterna o zoom da imagem", async () => {
    const user = userEvent.setup();
    render(<NftGallery name="Emerald Ape" images={images} />);

    const main = screen.getByRole("img", { name: "Emerald Ape" });
    expect(main).not.toHaveClass("scale-150");

    await user.click(screen.getByRole("button", { name: "Ampliar imagem" }));
    expect(main).toHaveClass("scale-150");
    expect(screen.getByRole("button", { name: "Reduzir imagem" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Reduzir imagem" }));
    expect(main).not.toHaveClass("scale-150");
  });
});

describe("CollectionCarousel", () => {
  it("usa o título padrão e a página inicial informada", async () => {
    await renderWithRouter(
      <CollectionCarousel pages={collectionNftPages} initialPage={1} />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Mais desta coleção" }),
    ).toBeVisible();
    const items = screen.getAllByRole("link", { name: /Ver detalhes de/ });
    expect(items.map((i) => i.getAttribute("aria-label"))).toEqual(
      collectionNftPages[1].map((nft) => `Ver detalhes de ${nft.name}`),
    );
  });

  it("aceita um título personalizado", async () => {
    await renderWithRouter(
      <CollectionCarousel title="Colecionadores também viram" pages={collectionNftPages} />,
    );

    expect(
      screen.getByRole("heading", { name: "Colecionadores também viram" }),
    ).toBeVisible();
  });

  it("começa na primeira página quando initialPage não é informado", async () => {
    await renderWithRouter(<CollectionCarousel pages={collectionNftPages} />);

    expect(
      screen.getByRole("link", { name: `Ver detalhes de ${collectionNftPages[0][0].name}` }),
    ).toBeVisible();
  });

  it("tem um indicador por página e marca o ativo", async () => {
    await renderWithRouter(
      <CollectionCarousel pages={collectionNftPages} initialPage={1} />,
    );

    const group = screen.getByRole("group", { name: "Páginas do carrossel" });
    expect(within(group).getAllByRole("button")).toHaveLength(3);
    expect(
      within(group).getByRole("button", { name: "Ir para o grupo 2 de 3" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("troca os itens ao clicar em outro indicador", async () => {
    const { user } = await renderWithRouter(
      <CollectionCarousel pages={collectionNftPages} initialPage={1} />,
    );

    await user.click(screen.getByRole("button", { name: "Ir para o grupo 3 de 3" }));

    expect(
      screen.getByRole("link", { name: `Ver detalhes de ${collectionNftPages[2][0].name}` }),
    ).toBeVisible();
    expect(
      screen.queryByRole("link", { name: `Ver detalhes de ${collectionNftPages[1][0].name}` }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Ver detalhes de/ })).toHaveLength(5);
  });

  it("não quebra com uma página inexistente", async () => {
    await renderWithRouter(
      <CollectionCarousel pages={collectionNftPages} initialPage={9} />,
    );

    expect(screen.queryAllByRole("link", { name: /Ver detalhes de/ })).toHaveLength(0);
  });
});

describe("NftTabs", () => {
  it("mostra os detalhes por padrão", () => {
    render(<NftTabs nft={emerald} />);

    expect(screen.getByRole("tab", { name: "Detalhes do NFT" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Rede:")).toBeVisible();
    expect(screen.getByText("Contrato:")).toBeVisible();
    expect(screen.getByText("Direitos autorais:")).toBeVisible();
    expect(screen.getByText(emerald.details.network)).toBeVisible();
    emerald.details.paragraphs.forEach((p) =>
      expect(screen.getByText(p)).toBeVisible(),
    );
  });

  it("mostra a quantidade de avaliações no rótulo da aba", () => {
    render(<NftTabs nft={emerald} />);

    expect(
      screen.getByRole("tab", { name: "Avaliações de colecionadores (19)" }),
    ).toBeVisible();
  });

  it("exibe as avaliações ao trocar de aba", async () => {
    const user = userEvent.setup();
    render(<NftTabs nft={emerald} />);

    await user.click(
      screen.getByRole("tab", { name: /Avaliações de colecionadores/ }),
    );

    for (const review of emerald.reviews) {
      expect(screen.getByText(review.author)).toBeVisible();
      expect(screen.getByText(review.comment)).toBeVisible();
    }
    expect(screen.getAllByRole("img", { name: "5 de 5 estrelas" })).toHaveLength(2);
    expect(screen.getByRole("img", { name: "4 de 5 estrelas" })).toBeVisible();
    expect(screen.queryByText("Contrato:")).not.toBeInTheDocument();
  });
});

describe("NftInfo", () => {
  it("exibe nome, preço, descrição e avaliação", async () => {
    await renderWithRouter(<NftInfo nft={emerald} />);

    expect(screen.getByRole("heading", { level: 1, name: "Emerald Ape #042" })).toBeVisible();
    expect(screen.getByText("1.19 ETH")).toBeVisible();
    expect(screen.getByText(emerald.description)).toBeVisible();
    expect(screen.getByRole("img", { name: "Avaliação 4 de 5" })).toBeVisible();
    expect(screen.getByText(/19 avaliações de colecionadores/)).toBeVisible();
  });

  it("mostra o preço antigo apenas quando existe", async () => {
    const { unmount } = await renderWithRouter(<NftInfo nft={neon} />);
    expect(screen.getByText("2.29 ETH").tagName).toBe("S");
    unmount();

    await renderWithRouter(<NftInfo nft={emerald} />);
    expect(screen.queryByText("2.29 ETH")).not.toBeInTheDocument();
  });

  it("exibe token, coleção e atributos", async () => {
    await renderWithRouter(<NftInfo nft={emerald} />);

    expect(screen.getByText("ID do token: #0042")).toBeVisible();
    expect(screen.getByText("Coleção: Kurio Apes")).toBeVisible();
    expect(screen.getByText("Atributos: Óculos, Esmeralda, Raro")).toBeVisible();
  });

  it("lista as edições e deixa a padrão selecionada", async () => {
    await renderWithRouter(<NftInfo nft={emerald} />);

    const group = screen.getByRole("radiogroup", { name: "Edição:" });
    expect(within(group).getAllByRole("radio")).toHaveLength(4);
    expect(within(group).getByRole("radio", { name: "1/50" })).toBeChecked();
  });

  it("troca a edição selecionada", async () => {
    const { user } = await renderWithRouter(<NftInfo nft={emerald} />);

    await user.click(screen.getByRole("radio", { name: "ABERTA" }));

    expect(screen.getByRole("radio", { name: "ABERTA" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "1/50" })).not.toBeChecked();
  });

  it("controla a quantidade respeitando o mínimo de 1", async () => {
    const { user } = await renderWithRouter(<NftInfo nft={emerald} />);
    const group = screen.getByRole("group", { name: "Quantidade" });
    const menos = within(group).getByRole("button", { name: "Diminuir quantidade" });
    const mais = within(group).getByRole("button", { name: "Aumentar quantidade" });

    expect(within(group).getByRole("status")).toHaveTextContent("1");
    expect(menos).toBeDisabled();

    await user.click(mais);
    await user.click(mais);
    expect(within(group).getByRole("status")).toHaveTextContent("3");
    expect(menos).toBeEnabled();

    await user.click(menos);
    expect(within(group).getByRole("status")).toHaveTextContent("2");
  });

  it("desabilita o botão de aumentar no máximo de 99", async () => {
    const { user } = await renderWithRouter(<NftInfo nft={emerald} />);
    const mais = screen.getByRole("button", { name: "Aumentar quantidade" });

    for (let i = 0; i < 98; i++) await user.click(mais);

    expect(screen.getByRole("group", { name: "Quantidade" })).toHaveTextContent("99");
    expect(mais).toBeDisabled();
  });

  it("alterna o favorito", async () => {
    const { user } = await renderWithRouter(<NftInfo nft={emerald} />);
    const favoritar = screen.getByRole("button", { name: "Favoritar" });

    expect(favoritar).toHaveAttribute("aria-pressed", "false");
    await user.click(favoritar);
    expect(favoritar).toHaveAttribute("aria-pressed", "true");
    await user.click(favoritar);
    expect(favoritar).toHaveAttribute("aria-pressed", "false");
  });

  it("tem links de compartilhamento", async () => {
    await renderWithRouter(<NftInfo nft={emerald} />);

    expect(
      screen.getByRole("link", { name: "Compartilhar no LinkedIn" }),
    ).toHaveAttribute("href", "https://www.linkedin.com/");
    expect(
      screen.getByRole("link", { name: "Compartilhar por e-mail" }),
    ).toHaveAttribute("href", "mailto:?subject=Kurio");
    expect(
      screen.getByRole("link", { name: "Compartilhar no Twitter" }),
    ).toHaveAttribute("target", "_blank");
  });

  it("Comprar envia o NFT ao carrinho e navega para /mercado/carrinho", async () => {
    let body: unknown;
    server.use(
      http.post("/api/carrinho", async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({}, { status: 201 });
      }),
    );
    const { user, router } = await renderWithRouter(<NftInfo nft={emerald} />);

    await user.click(screen.getByRole("button", { name: "Aumentar quantidade" }));
    await user.click(screen.getByRole("radio", { name: "1/10" }));
    await user.click(screen.getByRole("button", { name: "Comprar" }));

    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/mercado/carrinho"),
    );
    expect(body).toEqual({ tokenId: "#0042", quantity: 2, edition: "1/10" });
  });

  it("invalida o carrinho depois de comprar", async () => {
    const { user, client } = await renderWithRouter(<NftInfo nft={emerald} />);
    const invalidate = vi.spyOn(client, "invalidateQueries");

    await user.click(screen.getByRole("button", { name: "Comprar" }));

    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({ queryKey: ["carrinho"] }),
    );
  });

  it("registra o erro e permanece na página se a compra falhar", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    server.use(
      http.post("/api/carrinho", () =>
        HttpResponse.json({ message: "falhou" }, { status: 500 }),
      ),
    );
    const { user, router } = await renderWithRouter(<NftInfo nft={emerald} />);

    await user.click(screen.getByRole("button", { name: "Comprar" }));

    await waitFor(() => expect(error).toHaveBeenCalled());
    expect(router.state.location.pathname).toBe("/");
  });
});

describe("FilterSidebar", () => {
  function Harness({ onChange }: { onChange?: (f: Filters) => void }) {
    const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
    return (
      <FilterSidebar
        filters={filters}
        onChange={(next) => {
          onChange?.(next);
          setFilters(next);
        }}
      />
    );
  }

  it("mostra 'Carregando...' enquanto as opções chegam", async () => {
    await renderWithRouter(<Harness />);

    expect(screen.getAllByText("Carregando...")).toHaveLength(2);
    await screen.findByRole("button", { name: /Arte digital/ });
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
  });

  it("lista coleções e redes com suas contagens", async () => {
    await renderWithRouter(<Harness />);

    expect(await screen.findByRole("button", { name: "Arte digital(28)" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Utilidade(14)" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Ethereum(178)" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Solana(86)" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Coleções" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Rede" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Faixa de preço" })).toBeVisible();
  });

  it("mostra mensagens de erro quando a API falha", async () => {
    server.use(
      http.get("/api/filter-options", () => HttpResponse.json({}, { status: 500 })),
    );
    await renderWithRouter(<Harness />);

    expect(
      await screen.findByText("Não foi possível carregar as coleções."),
    ).toBeVisible();
    expect(screen.getByText("Não foi possível carregar as redes.")).toBeVisible();
  });

  it("seleciona e desmarca uma coleção", async () => {
    const onChange = vi.fn();
    const { user } = await renderWithRouter(<Harness onChange={onChange} />);
    const botao = await screen.findByRole("button", { name: /Fotografia/ });

    expect(botao).toHaveAttribute("aria-pressed", "false");

    await user.click(botao);
    expect(onChange).toHaveBeenLastCalledWith({ ...DEFAULT_FILTERS, category: "Fotografia" });
    expect(botao).toHaveAttribute("aria-pressed", "true");

    await user.click(botao);
    expect(onChange).toHaveBeenLastCalledWith(DEFAULT_FILTERS);
    expect(botao).toHaveAttribute("aria-pressed", "false");
  });

  it("seleciona e desmarca uma rede", async () => {
    const onChange = vi.fn();
    const { user } = await renderWithRouter(<Harness onChange={onChange} />);
    const botao = await screen.findByRole("button", { name: /Polygon/ });

    await user.click(botao);
    expect(onChange).toHaveBeenLastCalledWith({ ...DEFAULT_FILTERS, network: "Polygon" });

    await user.click(botao);
    expect(onChange).toHaveBeenLastCalledWith(DEFAULT_FILTERS);
  });

  it("combina categoria e rede", async () => {
    const onChange = vi.fn();
    const { user } = await renderWithRouter(<Harness onChange={onChange} />);

    await user.click(await screen.findByRole("button", { name: /Jogos/ }));
    await user.click(screen.getByRole("button", { name: /Solana/ }));

    expect(onChange).toHaveBeenLastCalledWith({
      ...DEFAULT_FILTERS,
      category: "Jogos",
      network: "Solana",
    });
  });

  it("mostra a faixa de preço completa por padrão", async () => {
    await renderWithRouter(<Harness />);

    expect(screen.getByText(/Preço: 0,02 – 13,38\s+ETH/)).toBeVisible();
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("só aplica o preço ao clicar em 'Aplicar'", async () => {
    const onChange = vi.fn();
    const { user } = await renderWithRouter(<Harness onChange={onChange} />);
    const [min] = screen.getAllByRole("slider");

    min.focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");

    expect(screen.getByText(/Preço: 0,04 – 13,38\s+ETH/)).toBeVisible();
    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const { price } = onChange.mock.calls[0][0] as Filters;
    expect(price[0]).toBeCloseTo(0.04);
    expect(price[1]).toBeCloseTo(13.38);
  });
});

describe("NftGrid", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-23T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const cardNames = () =>
    screen
      .getAllByRole("link", { name: /Ver detalhes de/ })
      .map((link) => link.getAttribute("aria-label")!.replace("Ver detalhes de ", ""));

  async function renderGrid(filters: Filters = DEFAULT_FILTERS) {
    const utils = await renderWithRouter(<NftGrid filters={filters} />);
    await waitFor(() =>
      expect(utils.client.getQueryState(["nfts"])?.status).toBe("success"),
    );
    await act(async () => {});
    return utils;
  }

  it("mostra 6 NFTs por página, do mais recente para o mais antigo", async () => {
    await renderGrid();

    expect(cardNames()).toEqual([
      "Emerald Ape #042",
      "Sage Nomad #069",
      "Neon Vessel #332",
      "Cosmic Bloom #118",
      "Violet Nomad #311",
      "Ivory Baron #008",
    ]);
  });

  it("pagina a lista e mostra os demais na página 2", async () => {
    const { user } = await renderGrid();

    const nav = screen.getByRole("navigation", { name: "Paginação" });
    expect(within(nav).getAllByRole("link")).toHaveLength(3);

    await user.click(within(nav).getByRole("link", { name: "2" }));

    expect(cardNames()).toEqual([
      "Golden Wave #197",
      "Golden Pulse #204",
      "Golden Signal #146",
    ]);
    expect(within(nav).getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("filtra por aba: 'Em alta' mostra só os NFTs em tendência", async () => {
    const { user } = await renderGrid();

    await user.click(screen.getByRole("tab", { name: "Em alta" }));

    expect(cardNames()).toEqual([
      "Emerald Ape #042",
      "Neon Vessel #332",
      "Violet Nomad #311",
      "Golden Pulse #204",
    ]);
    expect(screen.queryByRole("navigation", { name: "Paginação" })).not.toBeInTheDocument();
  });

  it("filtra por aba: 'Novos lançamentos' considera os últimos 30 dias", async () => {
    const { user } = await renderGrid();

    await user.click(screen.getByRole("tab", { name: "Novos lançamentos" }));

    expect(cardNames()).toEqual([
      "Emerald Ape #042",
      "Sage Nomad #069",
      "Neon Vessel #332",
      "Cosmic Bloom #118",
    ]);
  });

  it("volta a mostrar tudo na aba 'Todos os NFTs'", async () => {
    const { user } = await renderGrid();

    await user.click(screen.getByRole("tab", { name: "Em alta" }));
    await user.click(screen.getByRole("tab", { name: "Todos os NFTs" }));

    expect(cardNames()).toHaveLength(6);
  });

  it("ordena por menor preço", async () => {
    const { user } = await renderGrid();

    await user.click(screen.getByRole("combobox", { name: /Ordenar por/ }));
    await user.click(await screen.findByRole("option", { name: "Menor preço" }));

    expect(cardNames()).toEqual([
      "Golden Wave #197",
      "Golden Pulse #204",
      "Emerald Ape #042",
      "Cosmic Bloom #118",
      "Golden Signal #146",
      "Sage Nomad #069",
    ]);
  });

  it("ordena por maior preço", async () => {
    const { user } = await renderGrid();

    await user.click(screen.getByRole("combobox", { name: /Ordenar por/ }));
    await user.click(await screen.findByRole("option", { name: "Maior preço" }));

    expect(cardNames()[0]).toBe("Neon Vessel #332");
    expect(cardNames()[1]).toBe("Violet Nomad #311");
  });

  it("volta para a página 1 ao mudar a ordenação", async () => {
    const { user } = await renderGrid();

    await user.click(screen.getByRole("link", { name: "2" }));
    await user.click(screen.getByRole("combobox", { name: /Ordenar por/ }));
    await user.click(await screen.findByRole("option", { name: "Menor preço" }));

    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("filtra por categoria", async () => {
    await renderGrid({ ...DEFAULT_FILTERS, category: "Arte digital" });

    expect(cardNames()).toEqual([
      "Emerald Ape #042",
      "Cosmic Bloom #118",
      "Golden Pulse #204",
    ]);
  });

  it("filtra por rede", async () => {
    await renderGrid({ ...DEFAULT_FILTERS, network: "Solana" });

    expect(cardNames()).toEqual(["Neon Vessel #332", "Golden Wave #197"]);
  });

  it("filtra por faixa de preço", async () => {
    await renderGrid({ ...DEFAULT_FILTERS, price: [1.5, 1.8] });

    expect(cardNames()).toEqual(["Sage Nomad #069", "Ivory Baron #008"]);
  });

  it("mostra mensagem quando nenhum NFT corresponde", async () => {
    await renderGrid({ ...DEFAULT_FILTERS, category: "Música", network: "Solana" });

    expect(
      await screen.findByText("Nenhum NFT encontrado com esses filtros."),
    ).toBeVisible();
    expect(screen.queryByRole("navigation", { name: "Paginação" })).not.toBeInTheDocument();
  });

  it("volta para a página 1 quando os filtros mudam", async () => {
    function Harness() {
      const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
      return (
        <>
          <button onClick={() => setFilters({ ...DEFAULT_FILTERS })}>
            Refazer filtro
          </button>
          <NftGrid filters={filters} />
        </>
      );
    }
    const { user, client } = await renderWithRouter(<Harness />);
    await waitFor(() =>
      expect(client.getQueryState(["nfts"])?.status).toBe("success"),
    );
    await act(async () => {});

    await user.click(screen.getByRole("link", { name: "2" }));
    expect(cardNames()).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: "Refazer filtro" }));

    expect(cardNames()).toHaveLength(6);
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("exibe o preço antigo no card em promoção", async () => {
    await renderGrid();

    expect(screen.getByText("2.29 ETH")).toBeVisible();
  });
});

describe("NftGrid (dados)", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("mostra o estado de carregamento enquanto busca os NFTs", async () => {
    await renderWithRouter(<NftGrid filters={DEFAULT_FILTERS} />);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando NFTs...");
    expect(
      await screen.findByRole("link", { name: `Ver detalhes de ${marketNfts[0].name}` }),
    ).toBeVisible();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("trata falha da API mostrando a mensagem de erro", async () => {
    server.use(http.get("/api/nfts", () => HttpResponse.error()));
    const { client } = await renderWithRouter(<NftGrid filters={DEFAULT_FILTERS} />);
    await waitFor(() =>
      expect(client.getQueryState(["nfts"])?.status).toBe("error"),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar os NFTs.",
    );
    expect(
      screen.queryByText("Nenhum NFT encontrado com esses filtros."),
    ).not.toBeInTheDocument();
  });

  it("usa os dados do mock como fonte", async () => {
    await renderWithRouter(<NftGrid filters={DEFAULT_FILTERS} />);

    expect(
      await screen.findByRole("link", { name: `Ver detalhes de ${marketNfts[0].name}` }),
    ).toBeVisible();
  });
});
