import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileForm } from "./ProfileForm";
import { ProfileSidebar } from "./ProfileSidebar";

describe("ProfileSidebar", () => {
  it("exibe o título e os itens do menu", () => {
    render(<ProfileSidebar />);

    expect(screen.getByRole("heading", { name: "Meu perfil" })).toBeVisible();
    const menu = screen.getByRole("navigation", { name: "Menu do perfil" });
    const itens = within(menu).getAllByRole("button");
    expect(itens.map((b) => b.textContent)).toEqual([
      "Dados do perfil",
      "Carteiras",
      "Atividade",
      "Lista de interesse",
      "Ofertas",
      "Arquivos baixados",
      "Suporte",
      "Sair",
    ]);
  });

  it("marca somente 'Dados do perfil' como página atual", () => {
    render(<ProfileSidebar />);

    expect(screen.getByRole("button", { name: "Dados do perfil" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getAllByRole("button", { current: "page" })).toHaveLength(1);
  });

  it("tem o botão 'Sair'", () => {
    render(<ProfileSidebar />);

    expect(screen.getByRole("button", { name: "Sair" })).toBeEnabled();
  });
});

describe("ProfileForm", () => {
  it("renderiza o título e os campos obrigatórios", () => {
    render(<ProfileForm />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Perfil do colecionador" }),
    ).toBeVisible();
    for (const label of [
      /Nome de exibição/,
      /E-mail/,
      /Apelido da carteira/,
      /Nome de usuário/,
    ]) {
      expect(screen.getByLabelText(label)).toBeRequired();
    }
    expect(screen.getByRole("textbox", { name: "Nome ENS" })).toBeRequired();
  });

  it("agrupa os campos de alteração de senha", () => {
    render(<ProfileForm />);

    const secao = screen.getByRole("region", { name: "Alterar senha" });
    for (const label of ["Senha atual", "Nova senha", "Confirmar nova senha"]) {
      expect(within(secao).getByLabelText(label)).toHaveAttribute("type", "password");
    }
    expect(within(secao).getAllByRole("button", { name: "Mostrar senha" })).toHaveLength(3);
  });

  it("alterna a visibilidade de cada campo de senha de forma independente", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const [primeiro] = screen.getAllByRole("button", { name: "Mostrar senha" });
    await user.click(primeiro);

    expect(screen.getByLabelText("Senha atual")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Nova senha")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Confirmar nova senha")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Ocultar senha" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Ocultar senha" }));
    expect(screen.getByLabelText("Senha atual")).toHaveAttribute("type", "password");
  });

  it("aceita digitação nos campos", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(screen.getByLabelText(/Nome de exibição/), "Ana Souza");
    await user.type(screen.getByLabelText(/E-mail/), "ana@email.com");
    await user.type(screen.getByRole("textbox", { name: "Nome ENS" }), "ana");

    expect(screen.getByLabelText(/Nome de exibição/)).toHaveValue("Ana Souza");
    expect(screen.getByLabelText(/E-mail/)).toHaveValue("ana@email.com");
    expect(screen.getByRole("textbox", { name: "Nome ENS" })).toHaveValue("ana");
  });

  it("valida o formato do e-mail", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(screen.getByLabelText(/E-mail/), "invalido");

    expect(screen.getByLabelText(/E-mail/)).toBeInvalid();
  });

  it("usa .eth como sufixo ENS padrão e só oferece essa opção", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const sufixo = screen.getByRole("combobox", { name: "Sufixo ENS" });
    expect(sufixo).toHaveTextContent(".eth");

    await user.click(sufixo);
    expect(await screen.findAllByRole("option")).toHaveLength(1);
  });

  it("tem os botões de avatar e de salvar", () => {
    render(<ProfileForm />);

    const avatar = screen.getByRole("group", { name: "Avatar" });
    expect(within(avatar).getByRole("button", { name: "Alterar" })).toBeVisible();
    expect(within(avatar).getByRole("button", { name: "Remover" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Salvar" })).toHaveAttribute("type", "submit");
  });
});
