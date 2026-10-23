import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import type { IconProps } from "@/Types";
import { Cart } from "./Cart/Cart";
import { Facebook } from "./Facebook/Facebook";
import { FacebookBrand } from "./FacebookBrand/FacebookBrand";
import { Google } from "./Google/Google";
import { Instagram } from "./Instagram/Instagram";
import { Linkedin } from "./Linkedin/Linkedin";
import { Logo } from "./Logo/Logo";
import { Logout } from "./Logout/Logout";
import { Lupa } from "./Lupa/Lupa";
import {
  ActivityIcon,
  DownloadsIcon,
  EyeIcon,
  EyeOffIcon,
  GalleryIcon,
  HeartIcon,
  LocationIcon,
  OffersIcon,
  SignOutIcon,
  SupportIcon,
  UserIcon,
} from "./ProfileMenu/ProfileMenu";
import { ThankYou } from "./ThankYou/ThankYou";
import { Twitter } from "./Twitter/Twitter";
import { Youtube } from "./Youtube/Youtube";

const icons: [string, ComponentType<IconProps>][] = [
  ["Cart", Cart],
  ["Facebook", Facebook],
  ["FacebookBrand", FacebookBrand],
  ["Google", Google],
  ["Instagram", Instagram],
  ["Linkedin", Linkedin],
  ["Logo", Logo],
  ["Logout", Logout],
  ["Lupa", Lupa],
  ["ThankYou", ThankYou],
  ["Twitter", Twitter],
  ["Youtube", Youtube],
  ["UserIcon", UserIcon],
  ["LocationIcon", LocationIcon],
  ["ActivityIcon", ActivityIcon],
  ["HeartIcon", HeartIcon],
  ["OffersIcon", OffersIcon],
  ["DownloadsIcon", DownloadsIcon],
  ["SupportIcon", SupportIcon],
  ["SignOutIcon", SignOutIcon],
  ["EyeIcon", EyeIcon],
  ["EyeOffIcon", EyeOffIcon],
  ["GalleryIcon", GalleryIcon],
];

describe.each(icons)("ícone %s", (_name, Icon) => {
  it("renderiza um <svg>", () => {
    const { container } = render(<Icon />);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("repassa props (aria-hidden, data-testid e className)", () => {
    const { container } = render(
      <Icon aria-hidden="true" data-testid="icone" className="minha-classe" />,
    );

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("data-testid", "icone");
    expect(svg).toHaveClass("minha-classe");
  });
});

describe("Logo", () => {
  it("expõe o nome acessível 'Kurio'", () => {
    const { getByRole } = render(<Logo />);

    expect(getByRole("img", { name: "Kurio" })).toBeInTheDocument();
  });

  it("usa a cor padrão quando nenhuma className é passada", () => {
    const { getByRole } = render(<Logo />);

    expect(getByRole("img", { name: "Kurio" })).toHaveClass("text-[#F5F1EB]");
  });
});

describe("ícones sociais", () => {
  it.each([
    ["Facebook", Facebook],
    ["Instagram", Instagram],
    ["Linkedin", Linkedin],
    ["Twitter", Twitter],
    ["Youtube", Youtube],
  ] as const)("%s usa text-primary por padrão", (_name, Icon) => {
    const { container } = render(<Icon />);

    expect(container.querySelector("svg")).toHaveClass("text-primary");
  });
});
