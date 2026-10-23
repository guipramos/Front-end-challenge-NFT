import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Badge, badgeVariants } from "./badge";
import { Button, buttonVariants } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Slider } from "./slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Button", () => {
  it("renderiza um <button> com variante e tamanho padrão", () => {
    render(<Button>Salvar</Button>);

    const button = screen.getByRole("button", { name: "Salvar" });
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "default");
  });

  it("expõe variante e tamanho via data-attributes", () => {
    render(
      <Button variant="outline" size="sm">
        Outline
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Outline" });
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-size", "sm");
  });

  it("dispara onClick e respeita disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Ok</Button>);

    await user.click(screen.getByRole("button", { name: "Ok" }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        Ok
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Ok" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Ok" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("com asChild renderiza o filho em vez de <button>", () => {
    render(
      <Button asChild>
        <a href="/destino">Link</a>
      </Button>,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute(
      "data-slot",
      "button",
    );
  });

  it("mescla className personalizada", () => {
    render(<Button className="minha-classe">X</Button>);

    expect(screen.getByRole("button")).toHaveClass("minha-classe");
  });

  it("buttonVariants gera classes diferentes por variante", () => {
    expect(buttonVariants({ variant: "link" })).toContain("underline-offset-4");
    expect(buttonVariants({ size: "icon" })).toContain("size-8");
    expect(buttonVariants({ variant: "ghost" })).not.toBe(
      buttonVariants({ variant: "default" }),
    );
  });
});

describe("Badge", () => {
  it("renderiza um <span> com variante padrão", () => {
    render(<Badge>3</Badge>);

    const badge = screen.getByText("3");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveAttribute("data-variant", "default");
  });

  it("aceita variante e asChild", () => {
    render(
      <Badge asChild variant="secondary">
        <a href="/x">Novo</a>
      </Badge>,
    );

    const link = screen.getByRole("link", { name: "Novo" });
    expect(link).toHaveAttribute("data-variant", "secondary");
  });

  it("badgeVariants muda conforme a variante", () => {
    expect(badgeVariants({ variant: "outline" })).toContain("border-border");
  });
});

describe("Card", () => {
  it("compõe as partes do card com seus data-slots", () => {
    render(
      <Card size="sm">
        <CardHeader>
          <CardTitle>Título</CardTitle>
          <CardDescription>Descrição</CardDescription>
          <CardAction>Ação</CardAction>
        </CardHeader>
        <CardContent>Conteúdo</CardContent>
        <CardFooter>Rodapé</CardFooter>
      </Card>,
    );

    const slots = [
      ["Título", "card-title"],
      ["Descrição", "card-description"],
      ["Ação", "card-action"],
      ["Conteúdo", "card-content"],
      ["Rodapé", "card-footer"],
    ] as const;

    for (const [text, slot] of slots) {
      expect(screen.getByText(text)).toHaveAttribute("data-slot", slot);
    }
    expect(screen.getByText("Título").closest("[data-slot=card]")).toHaveAttribute(
      "data-size",
      "sm",
    );
  });

  it("CardTitle usa h3 por padrão e aceita h2/h4", () => {
    render(
      <>
        <CardTitle>Padrão</CardTitle>
        <CardTitle as="h2">Dois</CardTitle>
        <CardTitle as="h4">Quatro</CardTitle>
      </>,
    );

    expect(screen.getByRole("heading", { name: "Padrão", level: 3 })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Dois", level: 2 })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Quatro", level: 4 })).toBeVisible();
  });

  it("usa o tamanho 'default' quando não informado", () => {
    render(<Card data-testid="card" />);

    expect(screen.getByTestId("card")).toHaveAttribute("data-size", "default");
  });
});

describe("Input e Label", () => {
  it("associa o Label ao Input e aceita digitação", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" type="text" />
      </>,
    );

    const input = screen.getByLabelText("Nome");
    await user.type(input, "Ana");

    expect(input).toHaveValue("Ana");
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("repassa type, placeholder e disabled", () => {
    render(<Input type="email" placeholder="e-mail" disabled />);

    const input = screen.getByPlaceholderText("e-mail");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toBeDisabled();
  });

  it("Label tem data-slot", () => {
    render(<Label>Rótulo</Label>);

    expect(screen.getByText("Rótulo")).toHaveAttribute("data-slot", "label");
  });
});

describe("Pagination (ui)", () => {
  it("renderiza a navegação com links e marca o ativo", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#2">2</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    expect(screen.getByRole("navigation", { name: "pagination" })).toBeVisible();
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "2" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("renderiza anterior, próximo e reticências", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" text="Seguinte" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    expect(screen.getByRole("link", { name: "Go to previous page" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Go to next page" })).toBeVisible();
    expect(screen.getByText("Seguinte")).toBeInTheDocument();
    expect(screen.getByText("More pages")).toBeInTheDocument();
  });
});

describe("Tabs", () => {
  function Example() {
    return (
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Aba A</TabsTrigger>
          <TabsTrigger value="b">Aba B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Conteúdo A</TabsContent>
        <TabsContent value="b">Conteúdo B</TabsContent>
      </Tabs>
    );
  }

  it("mostra o conteúdo da aba padrão", () => {
    render(<Example />);

    expect(screen.getByRole("tab", { name: "Aba A" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Conteúdo A")).toBeVisible();
    expect(screen.queryByText("Conteúdo B")).not.toBeInTheDocument();
  });

  it("troca de aba ao clicar", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole("tab", { name: "Aba B" }));

    expect(screen.getByRole("tab", { name: "Aba B" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Conteúdo B")).toBeVisible();
    expect(screen.queryByText("Conteúdo A")).not.toBeInTheDocument();
  });

  it("navega entre abas com o teclado", async () => {
    const user = userEvent.setup();
    render(<Example />);

    screen.getByRole("tab", { name: "Aba A" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Aba B" })).toHaveFocus();
  });
});

describe("Dialog", () => {
  it("abre pelo gatilho e exibe título e descrição", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Abrir</DialogTrigger>
        <DialogContent>
          <DialogTitle>Meu diálogo</DialogTitle>
          <DialogDescription>Detalhes</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Abrir" }));

    expect(screen.getByRole("dialog", { name: "Meu diálogo" })).toBeVisible();
    expect(screen.getByText("Detalhes")).toBeVisible();
  });

  it("fecha ao pressionar Escape", async () => {
    const user = userEvent.setup();
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Meu diálogo</DialogTitle>
          <DialogDescription>Detalhes</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Select", () => {
  function Example({ onChange = () => {} }: { onChange?: (v: string) => void }) {
    return (
      <Select onValueChange={onChange}>
        <SelectTrigger aria-label="Fruta">
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="maca">Maçã</SelectItem>
          <SelectItem value="pera">Pera</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  it("mostra o placeholder inicialmente", () => {
    render(<Example />);

    expect(screen.getByRole("combobox", { name: "Fruta" })).toHaveTextContent(
      "Escolha",
    );
  });

  it("abre a lista e seleciona uma opção", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Example onChange={onChange} />);

    await user.click(screen.getByRole("combobox", { name: "Fruta" }));
    await user.click(await screen.findByRole("option", { name: "Pera" }));

    expect(onChange).toHaveBeenCalledWith("pera");
    expect(screen.getByRole("combobox", { name: "Fruta" })).toHaveTextContent(
      "Pera",
    );
  });
});

describe("Slider", () => {
  it("renderiza um thumb por valor", () => {
    render(<Slider aria-label="Preço" min={0} max={10} defaultValue={[2, 8]} />);

    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "2");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "8");
  });

  it("sem valor inicial começa no mínimo", () => {
    render(<Slider min={1} max={5} />);

    expect(screen.getAllByRole("slider")[0]).toHaveAttribute(
      "aria-valuenow",
      "1",
    );
  });

  it("emite onValueChange ao mover com o teclado", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState([2, 8]);
      return (
        <Slider
          min={0}
          max={10}
          step={1}
          value={value}
          onValueChange={(v) => {
            onValueChange(v);
            setValue(v);
          }}
        />
      );
    }
    render(<Controlled />);

    const [min] = screen.getAllByRole("slider");
    min.focus();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenLastCalledWith([3, 8]);
    expect(screen.getAllByRole("slider")[0]).toHaveAttribute(
      "aria-valuenow",
      "3",
    );
  });
});
