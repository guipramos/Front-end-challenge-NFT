import type { LinkProps } from "@tanstack/react-router";

export type HeaderProps = {
  variant?: "default" | "profile";
};

export type NavItem = {
  label: string;
  to: LinkProps["to"];
};
