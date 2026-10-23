import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { FooterLinkGroup } from "../../Types";
import { Logo } from "../icones/Logo/Logo";
import { Facebook } from "../icones/Facebook/Facebook";
import { Instagram } from "../icones/Instagram/Instagram";
import { Twitter } from "../icones/Twitter/Twitter";
import { Linkedin } from "../icones/Linkedin/Linkedin";
import { Youtube } from "../icones/Youtube/Youtube";

const linkGroups = [
  {
    title: "Meu perfil",
    links: [
      "Meu perfil",
      "Minha coleção",
      "Atividade",
      "Estúdio do criador",
      "Lista de interesse",
    ],
  },
  {
    title: "Central de ajuda",
    links: [
      "Central de ajuda",
      "Como comprar NFTs",
      "Carteira e segurança",
      "Política do mercado",
      "Denunciar item",
    ],
  },
  {
    title: "Coleções",
    links: ["Arte digital", "Fotografia", "Música", "Arte 3D", "Utilidade"],
  },
] as const satisfies readonly FooterLinkGroup[];

const socials = [
  {
    label: "Facebook",
    Icon: Facebook,
    url: "https://www.facebook.com/?locale=pt_BR",
  },
  { label: "Instagram", Icon: Instagram, url: "https://www.instagram.com/" },
  { label: "Twitter", Icon: Twitter, url: "https://x.com/?lang=en" },
  {
    label: "LinkedIn",
    Icon: Linkedin,
    url: "https://www.linkedin.com/company/junglegaming/?originalSubdomain=ae",
  },
  { label: "YouTube", Icon: Youtube, url: "https://www.youtube.com/" },
] as const;

const wallets = ["MetaMask", "WalletConnect", "Coinbase"] as const;

const logoLinkClass =
  "inline-flex items-center text-foreground transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

const linkClass =
  "text-sm text-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export function Footer() {
  return (
    <div>
      <div className="bg-surface-alt-200 container p-8">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            aria-label="Kurio - Ir para a página inicial"
            className={logoLinkClass}
          >
            <Logo aria-hidden="true" />
          </Link>
          <p className="text-sm font-normal leading-5.5">
            Feito para colecionadores, <br /> criadores e cultura
          </p>
          <address className="contents not-italic">
            <a href="mailto:contato@email.com">contato@email.com</a>
            <a href="tel:+551140028922">+55 11 4002 8922</a>
          </address>
        </div>
      </div>

      <footer className="container bg-surface-200">
        <div className="container grid gap-10 py-10 md:grid-cols-2 lg:grid-cols-4">
          {linkGroups.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className="flex flex-col gap-3"
            >
              <h2 className="text-lg font-bold text-foreground">
                {group.title}
              </h2>
              <ul className="flex flex-col gap-1.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className={linkClass}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">
                Redes sociais
              </h2>
              <ul className="flex gap-2">
                {socials.map(({ label, Icon, url }) => (
                  <li key={label}>
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="size-7 border-primary-200"
                    >
                      <a target="_blank" href={url} aria-label={label}>
                        <Icon aria-hidden="true" className="text-current" />
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">
                Carteiras compatíveis
              </h2>
              <ul className="flex w-fit items-center gap-2 rounded-md border border-primary-200/50 bg-surface-alt-200 px-2 py-1 text-[9px] font-bold tracking-wide text-primary uppercase">
                {wallets.map((wallet) => (
                  <li
                    key={wallet}
                    className="not-last:after:ml-2 not-last:after:content-['·']"
                  >
                    {wallet}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </footer>
      <div className="py-4 text-center text-sm text-foreground font-normal pb-6 pt-1.5">
        © {new Date().getFullYear()} Kurio. Propriedade digital para todos.
      </div>
    </div>
  );
}
