import type { ComponentType } from "react";
import type { IconProps } from "./icon";

export type ProfileMenuItem = {
  label: string;
  Icon: ComponentType<IconProps>;
  active?: boolean;
  /** O design recua 4px o rótulo de alguns itens ("Dados do perfil" e "Carteiras"). */
  indent?: boolean;
  /** Classes de cor/ajuste fino do ícone. */
  iconClassName?: string;
};
