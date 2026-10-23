import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { renderWithRouter } from "@/test/utils";
import { AuthModal } from "./AuthModal";
import {
  AuthInput,
  AuthPasswordInput,
  SocialLogin,
} from "./AuthModal/AuthFields";
import { LoginForm } from "./AuthModal/LoginForm";
import { SignupForm } from "./AuthModal/SignupForm";
import { Header } from "./Header";

describe("AuthInput / AuthPasswordInput / SocialLogin", () => {
  it("AuthInput usa o rótulo como label acessível e placeholder", () => {
    render(<AuthInput id="x" label="Nome de usuário" />);

    const input = screen.getByLabelText("Nome de usuário");
    expect(input).toHaveAttribute("placeholder", "Nome de usuário");
    expect(input).toHaveAttribute("id", "x");
  });

  it("AuthPasswordInput alterna a visibilidade da senha", async () => {
    const user = userEvent.setup();
    render(<AuthPasswordInput id="p" label="Senha" />);

    const input = screen.getByLabelText("Senha");
    expect(input).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Ocultar senha" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Ocultar senha" }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("SocialLogin oferece Google e Facebook", () => {
    render(<SocialLogin />);

    expect(screen.getByText("Ou continue com")).toBeVisible();
    expect(screen.getByRole("button", { name: "Continuar com Google" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Continuar com Facebook" })).toBeVisible();
  });
});

describe("LoginForm", () => {
  it("renderiza e-mail, senha, 'Esqueceu a senha?' e botão Entrar", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("contato@email.com")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Esqueceu a senha?" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeVisible();
  });

  it("envia e-mail e senha digitados", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("contato@email.com"), "ana@email.com");
    await user.type(screen.getByLabelText("Senha"), "segredo123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "ana@email.com",
      password: "segredo123",
    });
  });

  it("não envia com campos obrigatórios vazios", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("não envia com e-mail inválido", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("contato@email.com"), "invalido");
    await user.type(screen.getByLabelText("Senha"), "segredo123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("funciona sem onSubmit", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("contato@email.com"), "ana@email.com");
    await user.type(screen.getByLabelText("Senha"), "segredo123");

    await expect(
      user.click(screen.getByRole("button", { name: "Entrar" })),
    ).resolves.toBeUndefined();
  });
});

describe("SignupForm", () => {
  async function preencher(
    user: ReturnType<typeof userEvent.setup>,
    { senha = "segredo123", confirmar = "segredo123" } = {},
  ) {
    await user.type(screen.getByLabelText("Nome de usuário"), "ana");
    await user.type(screen.getByLabelText("Digite seu e-mail"), "ana@email.com");
    await user.type(screen.getByLabelText("Senha"), senha);
    await user.type(screen.getByLabelText("Confirmar senha"), confirmar);
  }

  it("renderiza os quatro campos e o botão Criar conta", () => {
    render(<SignupForm />);

    for (const label of [
      "Nome de usuário",
      "Digite seu e-mail",
      "Senha",
      "Confirmar senha",
    ]) {
      expect(screen.getByLabelText(label)).toBeRequired();
    }
    expect(screen.getByRole("button", { name: "Criar conta" })).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("envia usuário, e-mail e senha quando tudo é válido", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);

    await preencher(user);
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(onSubmit).toHaveBeenCalledWith({
      username: "ana",
      email: "ana@email.com",
      password: "segredo123",
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("avisa quando as senhas não coincidem e não envia", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);

    await preencher(user, { confirmar: "outra-senha1" });
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(screen.getByRole("alert")).toHaveTextContent("As senhas não coincidem.");
    expect(screen.getByLabelText("Confirmar senha")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Senha")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Confirmar senha")).toHaveAccessibleDescription(
      "As senhas não coincidem.",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("remove o aviso depois de corrigir a confirmação", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);

    await preencher(user, { confirmar: "outra-senha1" });
    await user.click(screen.getByRole("button", { name: "Criar conta" }));
    expect(screen.getByRole("alert")).toBeVisible();

    const confirmar = screen.getByLabelText("Confirmar senha");
    await user.clear(confirmar);
    await user.type(confirmar, "segredo123");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("exige senha com pelo menos 8 caracteres (minlength do navegador)", () => {
    render(<SignupForm />);

    expect(screen.getByLabelText("Senha")).toHaveAttribute("minlength", "8");
  });
});

describe("AuthModal", () => {
  function Harness({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)}>Reabrir</button>
        <AuthModal
          open={open}
          onOpenChange={(next) => {
            onOpenChange?.(next);
            setOpen(next);
          }}
        />
      </>
    );
  }

  it("não aparece quando fechado", () => {
    render(<AuthModal open={false} onOpenChange={() => {}} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("abre na aba 'Entrar' por padrão", () => {
    render(<AuthModal open onOpenChange={() => {}} />);

    expect(screen.getByRole("dialog", { name: "Entrar" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Entrar" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Criar conta" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(
      screen.getByText("Entre para gerenciar sua carteira, coleção e perfil de criador."),
    ).toBeVisible();
    expect(screen.getByLabelText("contato@email.com")).toBeVisible();
  });

  it("respeita defaultMode='signup'", () => {
    render(<AuthModal open onOpenChange={() => {}} defaultMode="signup" />);

    expect(screen.getByRole("dialog", { name: "Criar conta" })).toBeVisible();
    expect(screen.getByLabelText("Confirmar senha")).toBeVisible();
  });

  it("alterna entre as abas Entrar e Criar conta", async () => {
    const user = userEvent.setup();
    render(<AuthModal open onOpenChange={() => {}} />);

    await user.click(screen.getByRole("tab", { name: "Criar conta" }));

    expect(screen.getByRole("dialog", { name: "Criar conta" })).toBeVisible();
    expect(
      screen.getByText("Crie seu perfil de colecionador e conecte uma carteira quando quiser."),
    ).toBeVisible();
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", "auth-tab-signup");
    expect(screen.queryByLabelText("contato@email.com")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Entrar" }));
    expect(screen.getByLabelText("contato@email.com")).toBeVisible();
  });

  it("fecha pelo botão 'Fechar'", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<AuthModal open onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "Fechar" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("fecha com Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<AuthModal open onOpenChange={onOpenChange} />);

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("fecha o modal ao entrar com sucesso", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Harness onOpenChange={onOpenChange} />);
    const dialog = screen.getByRole("dialog");

    await user.type(within(dialog).getByLabelText("contato@email.com"), "ana@email.com");
    await user.type(within(dialog).getByLabelText("Senha"), "segredo123");
    await user.click(within(dialog).getByRole("button", { name: "Entrar" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("fecha o modal ao criar a conta com sucesso", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Harness onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("tab", { name: "Criar conta" }));
    await user.type(screen.getByLabelText("Nome de usuário"), "ana");
    await user.type(screen.getByLabelText("Digite seu e-mail"), "ana@email.com");
    await user.type(screen.getByLabelText("Senha"), "segredo123");
    await user.type(screen.getByLabelText("Confirmar senha"), "segredo123");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("não fecha quando o formulário é inválido", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Harness onOpenChange={onOpenChange} />);

    await user.click(
      within(screen.getByRole("tabpanel")).getByRole("button", { name: "Entrar" }),
    );

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("volta para a aba inicial ao reabrir", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("tab", { name: "Criar conta" }));
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Reabrir" }));

    expect(await screen.findByRole("dialog", { name: "Entrar" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Entrar" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});

describe("Header", () => {
  const nav = () => screen.getByRole("navigation");

  it("exibe logo e links de navegação", async () => {
    await renderWithRouter(<Header />);

    expect(
      screen.getByRole("link", { name: "Kurio - Ir para a página inicial" }),
    ).toHaveAttribute("href", "/");
    expect(within(nav()).getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
    expect(within(nav()).getByRole("link", { name: "Mercado" })).toHaveAttribute("href", "/mercado");
    expect(within(nav()).getByRole("link", { name: "Criadores" })).toHaveAttribute("href", "/criadores");
    expect(within(nav()).getByRole("link", { name: "Aprenda" })).toHaveAttribute("href", "/aprenda");
  });

  it("destaca somente o link da rota atual", async () => {
    await renderWithRouter(<Header />, { route: "/mercado" });

    await waitFor(() =>
      expect(within(nav()).getByRole("link", { name: "Mercado" })).toHaveAttribute(
        "data-status",
        "active",
      ),
    );
    expect(within(nav()).getByRole("link", { name: "Início" })).not.toHaveAttribute(
      "data-status",
      "active",
    );
  });

  it("destaca 'Início' na home", async () => {
    await renderWithRouter(<Header />, { route: "/" });

    expect(within(nav()).getByRole("link", { name: "Início" })).toHaveAttribute(
      "data-status",
      "active",
    );
  });

  it("mostra o botão de busca", async () => {
    await renderWithRouter(<Header />);

    expect(screen.getByRole("button", { name: "Buscar" })).toBeVisible();
  });

  it("mostra a quantidade de itens do carrinho vinda da API", async () => {
    await renderWithRouter(<Header />);

    expect(screen.getByRole("button", { name: "Carrinho, 0 itens" })).toBeVisible();
    expect(await screen.findByRole("button", { name: "Carrinho, 3 itens" })).toBeVisible();
  });

  it("mostra zero itens quando a API do carrinho falha", async () => {
    server.use(http.get("/api/mercado/carrinho", () => HttpResponse.error()));
    const { client } = await renderWithRouter(<Header />);
    await waitFor(() => expect(client.getQueryState(["carrinho"])?.status).toBe("error"));

    expect(screen.getByRole("button", { name: "Carrinho, 0 itens" })).toBeVisible();
  });

  it("abre o modal de autenticação ao clicar em 'Entrar'", async () => {
    const { user } = await renderWithRouter(<Header />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("dialog", { name: "Entrar" })).toBeVisible();
  });

  it("fecha o modal ao pressionar Escape", async () => {
    const { user } = await renderWithRouter(<Header />);
    await user.click(screen.getByRole("button", { name: "Entrar" }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("variante 'profile' usa o estilo do perfil e destaca 'Início'", async () => {
    await renderWithRouter(<Header variant="profile" />, { route: "/mercado" });

    expect(screen.getByRole("banner")).toHaveClass("border-muted-200/20");
    expect(within(nav()).getByRole("link", { name: "Início" })).toHaveAttribute(
      "data-status",
      "active",
    );
  });

  it("variante padrão usa a borda primária", async () => {
    await renderWithRouter(<Header />);

    expect(screen.getByRole("banner")).toHaveClass("border-primary-200/30");
  });
});
