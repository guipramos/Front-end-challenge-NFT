import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { renderWithRouter } from "@/test/utils";
import type { CheckoutTransaction } from "@/Types";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutSuccessModal } from "./CheckoutSuccessModal";
import { CheckoutSummary } from "./CheckoutSummary";

const transaction: CheckoutTransaction = {
  id: "0xABCD…1234",
  date: "23 de out. de 2026",
  wallet: "MetaMask",
  network: "Polygon",
  networkFee: "0.016 ETH",
  total: "26.846 ETH",
  explorerUrl: "https://etherscan.io",
  items: [
    {
      image: "/a.png",
      name: "Emerald Ape #042",
      tokenId: "#0042",
      quantity: 2,
      total: "2.38 ETH",
    },
    {
      image: "/b.png",
      name: "Violet Nomad #314",
      tokenId: "#0009",
      quantity: 6,
      total: "8.34 ETH",
    },
  ],
};

describe("CheckoutSuccessModal", () => {
  it("não renderiza nada sem transação", () => {
    render(<CheckoutSuccessModal open onOpenChange={() => {}} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("não aparece quando está fechado", () => {
    render(
      <CheckoutSuccessModal
        open={false}
        onOpenChange={() => {}}
        transaction={transaction}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("exibe o resumo da transação", () => {
    render(
      <CheckoutSuccessModal open onOpenChange={() => {}} transaction={transaction} />,
    );

    const dialog = screen.getByRole("dialog", {
      name: "Seus NFTs agora estão na sua carteira",
    });
    for (const [label, value] of [
      ["ID da transação", "0xABCD…1234"],
      ["Data", "23 de out. de 2026"],
      ["Carteira", "MetaMask"],
    ]) {
      expect(within(dialog).getByText(label)).toBeVisible();
      expect(within(dialog).getByText(value)).toBeVisible();
    }
    expect(within(dialog).getByText("Taxa de rede")).toBeVisible();
    expect(within(dialog).getByText("0.016 ETH")).toBeVisible();
    expect(within(dialog).getAllByText("26.846 ETH")).toHaveLength(2);
  });

  it("lista os itens com quantidade e subtotal", () => {
    render(
      <CheckoutSuccessModal open onOpenChange={() => {}} transaction={transaction} />,
    );

    const dialog = screen.getByRole("dialog");
    const itens = within(dialog).getAllByRole("listitem");
    expect(itens).toHaveLength(2);
    expect(within(itens[0]).getByText("Emerald Ape #042")).toBeVisible();
    expect(within(itens[0]).getByText("ID do token: #0042")).toBeVisible();
    expect(within(itens[0]).getByText("2.38 ETH")).toBeVisible();
    expect(itens[1]).toHaveTextContent("(x 6)");
  });

  it("descreve a confirmação na rede usada", () => {
    render(
      <CheckoutSuccessModal open onOpenChange={() => {}} transaction={transaction} />,
    );

    expect(screen.getByText(/Transação confirmada na Polygon\./)).toBeVisible();
  });

  it("tem link para o explorador abrindo em nova aba", () => {
    render(
      <CheckoutSuccessModal open onOpenChange={() => {}} transaction={transaction} />,
    );

    const link = screen.getByRole("link", { name: "Ver no Etherscan" });
    expect(link).toHaveAttribute("href", "https://etherscan.io");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("chama onOpenChange(false) ao fechar pelo botão e pela tecla Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CheckoutSuccessModal open onOpenChange={onOpenChange} transaction={transaction} />,
    );

    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });
});

describe("CheckoutForm", () => {
  it("renderiza os campos do perfil do colecionador", async () => {
    await renderWithRouter(<CheckoutForm />);

    expect(screen.getByRole("heading", { name: "Perfil do colecionador" })).toBeVisible();
    for (const label of [
      /Nome de exibição/,
      /Nome de usuário/,
      /Nome do perfil/,
      /Endereço da carteira/,
      /Código de indicação/,
      /E-mail/,
    ]) {
      expect(screen.getByLabelText(label)).toBeVisible();
    }
    expect(screen.getByLabelText("ENS ou carteira secundária (opcional)")).toBeVisible();
    expect(screen.getByLabelText("Observação do colecionador (opcional)")).toBeVisible();
    expect(screen.getByLabelText("Usar outra carteira?")).not.toBeChecked();
  });

  it("marca os campos obrigatórios e deixa os opcionais livres", async () => {
    await renderWithRouter(<CheckoutForm />);

    for (const label of [
      /Nome de exibição/,
      /Nome de usuário/,
      /Nome do perfil/,
      /Endereço da carteira/,
      /Código de indicação/,
      /E-mail/,
    ]) {
      expect(screen.getByLabelText(label)).toBeRequired();
    }
    expect(screen.getByLabelText("ENS ou carteira secundária (opcional)")).not.toBeRequired();
    expect(screen.getByLabelText("Observação do colecionador (opcional)")).not.toBeRequired();
  });

  it("valida o formato do e-mail", async () => {
    const user = userEvent.setup();
    await renderWithRouter(<CheckoutForm />);

    const email = screen.getByLabelText(/E-mail/);
    await user.type(email, "sem-arroba");

    expect(email).toHaveAttribute("type", "email");
    expect(email).toBeInvalid();
  });

  it("aceita digitação nos campos de texto", async () => {
    const { user } = await renderWithRouter(<CheckoutForm />);

    await user.type(screen.getByLabelText(/Nome de exibição/), "Ana");
    await user.type(screen.getByLabelText(/Endereço da carteira/), "0x123");
    await user.type(screen.getByLabelText("Observação do colecionador (opcional)"), "Olá");

    expect(screen.getByLabelText(/Nome de exibição/)).toHaveValue("Ana");
    expect(screen.getByLabelText(/Endereço da carteira/)).toHaveValue("0x123");
    expect(screen.getByLabelText("Observação do colecionador (opcional)")).toHaveValue("Olá");
  });

  it("alterna 'Usar outra carteira?'", async () => {
    const { user } = await renderWithRouter(<CheckoutForm />);
    const checkbox = screen.getByLabelText("Usar outra carteira?");

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("carrega as redes da API no seletor", async () => {
    const { user } = await renderWithRouter(<CheckoutForm />);
    const rede = screen.getByRole("combobox", { name: /^Rede/ });

    expect(rede).toHaveTextContent("Selecione uma rede");

    await waitFor(async () => {
      await user.click(rede);
      expect(await screen.findAllByRole("option")).toHaveLength(3);
    });
    expect(screen.getByRole("option", { name: "Ethereum" })).toBeVisible();
    expect(screen.getByRole("option", { name: "Polygon" })).toBeVisible();
    expect(screen.getByRole("option", { name: "Solana" })).toBeVisible();
  });

  it("seleciona uma rede", async () => {
    const { user, client } = await renderWithRouter(<CheckoutForm />);
    await waitFor(() =>
      expect(client.getQueryState(["checkout-options"])?.status).toBe("success"),
    );

    await user.click(screen.getByRole("combobox", { name: /^Rede/ }));
    await user.click(await screen.findByRole("option", { name: "Polygon" }));

    expect(screen.getByRole("combobox", { name: /^Rede/ })).toHaveTextContent("Polygon");
  });

  it("seleciona o tipo de carteira", async () => {
    const { user, client } = await renderWithRouter(<CheckoutForm />);
    await waitFor(() =>
      expect(client.getQueryState(["checkout-options"])?.status).toBe("success"),
    );

    const carteira = screen.getByRole("combobox", { name: /Tipo de carteira/ });
    expect(carteira).toHaveTextContent("Selecione uma carteira");

    await user.click(carteira);
    expect(await screen.findAllByRole("option")).toHaveLength(3);
    await user.click(screen.getByRole("option", { name: "WalletConnect" }));

    expect(carteira).toHaveTextContent("WalletConnect");
  });

  it("usa .eth como sufixo ENS padrão", async () => {
    const { client } = await renderWithRouter(<CheckoutForm />);
    await waitFor(() =>
      expect(client.getQueryState(["checkout-options"])?.status).toBe("success"),
    );

    expect(screen.getByRole("combobox", { name: /Nome ENS/ })).toHaveTextContent(".eth");
  });

  it("não quebra quando a API de opções falha", async () => {
    server.use(
      http.get("/api/checkout/options", () => HttpResponse.json({}, { status: 500 })),
    );
    const { user, client } = await renderWithRouter(<CheckoutForm />);
    await waitFor(() =>
      expect(client.getQueryState(["checkout-options"])?.status).toBe("error"),
    );

    await user.click(screen.getByRole("combobox", { name: /^Rede/ }));

    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });
});

describe("CheckoutSummary", () => {
  /** Na página real o resumo vive dentro do <form> de pagamento. */
  const renderSummary = () =>
    renderWithRouter(
      <form>
        <CheckoutSummary />
      </form>,
    );

  const confirmar = () => screen.getByRole("button", { name: /Confirmar compra|Confirmando/ });

  it("mostra 'Carregando...' e traços enquanto o carrinho carrega", async () => {
    await renderSummary();

    expect(screen.getByText("Carregando...")).toBeVisible();
    expect(screen.getAllByText("—")).toHaveLength(3);
    expect(confirmar()).toBeDisabled();
  });

  it("lista os itens e os totais do carrinho", async () => {
    await renderSummary();

    expect(await screen.findByText("Emerald Ape #042")).toBeVisible();
    expect(screen.getByText("Violet Nomad #314")).toBeVisible();
    expect(screen.getByText("Ivory Baron #088")).toBeVisible();
    expect(screen.getByText("(x 9)", { exact: false })).toBeVisible();
    expect(screen.getByText("26.83 ETH")).toBeVisible();
    expect(screen.getByText("(-) 00.00")).toBeVisible();
    expect(screen.getByText("0.016 ETH")).toBeVisible();
    expect(screen.getByText("26.846 ETH")).toBeVisible();
    expect(confirmar()).toBeEnabled();
  });

  it("mostra o carrinho vazio e bloqueia a compra", async () => {
    server.use(
      http.get("/api/mercado/carrinho", () =>
        HttpResponse.json({
          items: [],
          subtotal: "0.00 ETH",
          desconto: "00.00",
          taxa: "0.016 ETH",
          total: "0.016 ETH",
        }),
      ),
    );
    await renderSummary();

    expect(await screen.findByText("Seu carrinho está vazio.")).toBeVisible();
    expect(confirmar()).toBeDisabled();
  });

  it("oferece as opções de carteira com Coinbase marcada por padrão", async () => {
    await renderSummary();

    const grupo = screen.getByRole("radiogroup", { name: "Carteira e rede" });
    expect(within(grupo).getAllByRole("radio")).toHaveLength(3);
    expect(within(grupo).getByRole("radio", { name: "MetaMask" })).not.toBeChecked();
    expect(within(grupo).getByRole("radio", { name: "Coinbase Wallet" })).toBeChecked();
  });

  it("troca a carteira escolhida", async () => {
    const { user } = await renderSummary();

    await user.click(screen.getByRole("radio", { name: "MetaMask" }));

    expect(screen.getByRole("radio", { name: "MetaMask" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Coinbase Wallet" })).not.toBeChecked();
  });

  it("confirma a compra e abre o modal de sucesso", async () => {
    let body: unknown;
    server.use(
      http.post("/api/checkout", async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(transaction, { status: 201 });
      }),
    );
    const { user } = await renderSummary();
    await screen.findByText("Emerald Ape #042");

    await user.click(screen.getByRole("radio", { name: "MetaMask" }));
    await user.click(confirmar());

    const dialog = await screen.findByRole("dialog", {
      name: "Seus NFTs agora estão na sua carteira",
    });
    expect(body).toEqual({ walletOption: "metamask", network: null });
    expect(within(dialog).getByText("0xABCD…1234")).toBeVisible();
  });

  it("usa Coinbase na compra quando nada é alterado", async () => {
    let body: unknown;
    server.use(
      http.post("/api/checkout", async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(transaction, { status: 201 });
      }),
    );
    const { user } = await renderSummary();
    await screen.findByText("Emerald Ape #042");

    await user.click(confirmar());

    await screen.findByRole("dialog");
    expect(body).toEqual({ walletOption: "coinbase", network: null });
  });

  it("esvazia a lista de itens depois da compra", async () => {
    const { user } = await renderSummary();
    await screen.findByText("Emerald Ape #042");

    await user.click(confirmar());
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    expect(await screen.findByText("Seu carrinho está vazio.")).toBeVisible();
    expect(confirmar()).toBeDisabled();
  });

  it("mostra 'Confirmando...' e desabilita o botão durante a compra", async () => {
    server.use(
      http.post("/api/checkout", async () => {
        await delay(150);
        return HttpResponse.json(transaction, { status: 201 });
      }),
    );
    const { user } = await renderSummary();
    await screen.findByText("Emerald Ape #042");

    await user.click(confirmar());

    expect(screen.getByRole("button", { name: "Confirmando..." })).toBeDisabled();
    await screen.findByRole("dialog");
  });

  it("não abre o modal quando a compra falha", async () => {
    server.use(
      http.post("/api/checkout", () =>
        HttpResponse.json({ message: "erro" }, { status: 500 }),
      ),
    );
    const { user } = await renderSummary();
    await screen.findByText("Emerald Ape #042");

    await user.click(confirmar());

    await waitFor(() => expect(confirmar()).toBeEnabled());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
