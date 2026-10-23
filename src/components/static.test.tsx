import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "@/test/utils";
import { BlogCard } from "./BlogCard";
import { BlogSection } from "./BlogSection";
import { FeaturedNft } from "./FeaturedNft";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Newsletter } from "./Newsletter";
import { PromoBanner } from "./PromoBanner";
import { SearchButton } from "./SearchButton";

describe("Hero", () => {
  it("exibe título, texto de apoio, imagem e botão", () => {
    render(<Hero />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Seja dono do futuro da arte digital",
      }),
    ).toBeVisible();
    expect(screen.getByText("Bem-vindo à Kurio")).toBeVisible();
    expect(screen.getByText(/Descubra NFTs selecionados/)).toBeVisible();
    expect(
      screen.getByRole("img", { name: /Macaco de óculos escuros/ }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Explorar" })).toBeVisible();
  });

  it("é identificada pelo título (aria-labelledby)", () => {
    render(<Hero />);

    expect(
      screen.getByRole("region", { name: "Seja dono do futuro da arte digital" }),
    ).toBeInTheDocument();
  });
});

describe("FeaturedNft", () => {
  it("mostra o NFT em destaque com oferta limitada", () => {
    render(<FeaturedNft />);

    const card = screen.getByRole("article");
    expect(
      within(card).getByRole("heading", { level: 2, name: "NFT em destaque" }),
    ).toBeVisible();
    expect(within(card).getByText("Oferta limitada")).toBeVisible();
    expect(
      within(card).getByRole("img", { name: /Macaco de chapéu verde/ }),
    ).toBeVisible();
  });
});

describe("PromoBanner", () => {
  it("exibe título, descrição e CTA", () => {
    render(
      <PromoBanner
        image="/img.png"
        title="Edição limitada"
        description="Colecione agora"
        cta="Explorar"
      />,
    );

    const banner = screen.getByRole("article");
    expect(within(banner).getByText("Edição limitada")).toBeVisible();
    expect(within(banner).getByText("Colecione agora")).toBeVisible();
    expect(
      within(banner).getByRole("button", { name: "Explorar →" }),
    ).toBeVisible();
  });

  it("usa imagem decorativa (alt vazio)", () => {
    const { container } = render(
      <PromoBanner image="/img.png" title="T" description="D" cta="C" />,
    );

    expect(container.querySelector("img")).toHaveAttribute("alt", "");
    expect(container.querySelector("img")).toHaveAttribute("src", "/img.png");
  });
});

describe("BlogCard", () => {
  const props = {
    image: "/blog.png",
    date: "12 de setembro",
    readTime: "Leitura de 6 min",
    title: "Como funciona",
    excerpt: "Aprenda a colecionar.",
  };

  it("exibe data, tempo de leitura, título e resumo", () => {
    render(<BlogCard {...props} />);

    expect(
      screen.getByText("12 de setembro | Leitura de 6 min"),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Como funciona" })).toBeVisible();
    expect(screen.getByText("Aprenda a colecionar.")).toBeVisible();
  });

  it("tem o link 'Ler mais →'", () => {
    render(<BlogCard {...props} />);

    expect(screen.getByRole("link", { name: "Ler mais →" })).toHaveAttribute(
      "href",
      "#",
    );
  });
});

describe("BlogSection", () => {
  it("lista 4 posts sob o título 'Diário da Cunhagem'", () => {
    render(<BlogSection />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Diário da Cunhagem" }),
    ).toBeVisible();
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(
      screen.getByRole("heading", { name: "Como funciona a propriedade de NFTs" }),
    ).toBeVisible();
    expect(screen.getAllByRole("link", { name: "Ler mais →" })).toHaveLength(4);
  });
});

describe("Newsletter", () => {
  it("exibe os três diferenciais", () => {
    render(<Newsletter />);

    for (const title of [
      "Segurança da carteira",
      "Criadores em destaque",
      "Alertas de lançamentos",
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeVisible();
    }
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("permite digitar o e-mail e tem botão de envio", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);

    const input = screen.getByLabelText("E-mail");
    await user.type(input, "ana@email.com");

    expect(input).toHaveValue("ana@email.com");
    expect(input).toHaveAttribute("type", "email");
    expect(screen.getByRole("button", { name: "Enviar" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("valida o formato do e-mail", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);

    const input = screen.getByLabelText("E-mail");
    await user.type(input, "invalido");

    expect(input).toBeInvalid();
  });
});

describe("SearchButton", () => {
  it("renderiza o botão 'Buscar'", () => {
    render(<SearchButton />);

    expect(screen.getByRole("button", { name: "Buscar" })).toBeVisible();
  });
});

describe("Footer", () => {
  it("renderiza os grupos de links de navegação", async () => {
    await renderWithRouter(<Footer />);

    for (const name of ["Meu perfil", "Central de ajuda", "Coleções"]) {
      expect(screen.getByRole("navigation", { name })).toBeVisible();
    }
    const ajuda = screen.getByRole("navigation", { name: "Central de ajuda" });
    expect(within(ajuda).getAllByRole("link")).toHaveLength(5);
    expect(
      within(ajuda).getByRole("link", { name: "Como comprar NFTs" }),
    ).toBeVisible();
  });

  it("tem o link do logo para a página inicial", async () => {
    await renderWithRouter(<Footer />);

    expect(
      screen.getByRole("link", { name: "Kurio - Ir para a página inicial" }),
    ).toHaveAttribute("href", "/");
  });

  it("lista as redes sociais abrindo em nova aba", async () => {
    await renderWithRouter(<Footer />);

    for (const label of [
      "Facebook",
      "Instagram",
      "Twitter",
      "LinkedIn",
      "YouTube",
    ]) {
      const link = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\//));
    }
  });

  it("exibe contatos, carteiras compatíveis e o ano atual", async () => {
    await renderWithRouter(<Footer />);

    expect(
      screen.getByRole("link", { name: "contato@email.com" }),
    ).toHaveAttribute("href", "mailto:contato@email.com");
    expect(
      screen.getByRole("link", { name: "+55 11 4002 8922" }),
    ).toHaveAttribute("href", "tel:+551140028922");
    expect(screen.getByText("WalletConnect")).toBeVisible();
    expect(
      screen.getByText(
        `© ${new Date().getFullYear()} Kurio. Propriedade digital para todos.`,
      ),
    ).toBeVisible();
  });
});
