import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AuthModal } from "../AuthModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "../icones/Logo/Logo";
import { CartButton } from "../CartButton";
import { SearchButton } from "../SearchButton";
import type { HeaderProps, NavItem } from "../../Types";
import { Logout } from "../icones/Logout/Logout";
import { useCarrinho } from "@/hooks/useCarrinho";

const navItems = [
  { label: "Início", to: "/" },
  { label: "Mercado", to: "/mercado" },
  { label: "Criadores", to: "/criadores" },
  { label: "Aprenda", to: "/aprenda" },
] as const satisfies readonly NavItem[];

const variantStyles = {
  default: {
    header: "border-primary-200/30",
    row: "flex items-center justify-between",
    logo: "py-2",
    nav: "flex gap-10 self-stretch",
    navActive: "data-[status=active]:text-primary after:h-0.5 after:bg-primary",
    navLink: undefined,
    cartButton: undefined,
    actions: "flex shrink-0 items-center gap-7 py-6",
    cartBadge: undefined,
    button: undefined,
  },
  profile: {
    header: "border-muted-200/20",
    row: "grid h-17 grid-cols-[1fr_auto_1fr]",
    logo: "mt-[24.5px] self-start py-2",
    nav: "flex gap-10 self-stretch justify-self-center -translate-x-6",
    navActive:
      "data-[status=active]:text-primary-200 after:h-[3px] after:bg-primary-200",
    navLink: "pt-0.5 font-light data-[status=active]:font-semibold",
    cartButton: "-mt-0.5",
    actions:
      "mt-6 flex shrink-0 items-center gap-7 self-start justify-self-end",
    cartBadge:
      "top-0 right-0 size-4 bg-primary-200 text-[10px] leading-none font-bold",
    button: "bg-primary-200 hover:bg-primary-hover",
  },
} as const;

export function Header({ variant = "default" }: HeaderProps) {
  const { data: carrinho, isLoading } = useCarrinho();
  const [authOpen, setAuthOpen] = useState(false);

  const styles = variantStyles[variant];
  const isProfile = variant === "profile";
  const items = carrinho?.items ?? [];
  return (
    <header className={cn("container border-b", styles.header)}>
      <div className={styles.row}>
        <Link
          to="/"
          aria-label="Kurio - Ir para a página inicial"
          className={cn(
            "inline-flex items-center text-foreground transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D48C46]",
            styles.logo,
          )}
        >
          <Logo aria-hidden="true" />
        </Link>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={
                isProfile ? undefined : { className: "text-primary font-bold" }
              }
              // No design da tela "Meu perfil" o item "Início" aparece destacado.
              data-status={isProfile && item.to === "/" ? "active" : undefined}
              className={cn(
                `
                relative flex items-center text-[16px] font-normal text-foreground transition-colors
                hover:text-primary focus-visible:text-primary active:text-primary
                data-[status=active]:font-bold
                after:absolute after:inset-x-0 after:-bottom-px after:origin-left after:scale-x-0
                after:transition-transform after:duration-200 after:content-['']
                hover:after:scale-x-100 focus-visible:after:scale-x-100 data-[status=active]:after:scale-x-100
              `,
                styles.navActive,
                styles.navLink,
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {/* 20 (lupa) + 28 + 31 (carrinho) + 28 + 100 (botão) = 207px */}
        <div className={styles.actions}>
          <SearchButton />
          <CartButton
            count={items.length}
            className={styles.cartButton}
            badgeClassName={styles.cartBadge}
          />
          <Button
            className={cn("w-25 shrink-0", styles.button)}
            size="sm"
            onClick={() => setAuthOpen(true)}
          >
            <Logout />
            Entrar
          </Button>
        </div>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}
