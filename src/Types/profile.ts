import type { ComponentType } from "react";
import type { IconProps } from "./icon";

export type ProfileMenuItem = {
  label: string;
  Icon: ComponentType<IconProps>;
  active?: boolean;
  indent?: boolean;
  iconClassName?: string;
};
