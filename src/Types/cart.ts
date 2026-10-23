import type { ComponentProps } from "react";

export type CartButtonProps = ComponentProps<"button"> & {
  count?: number;
  badgeClassName?: string;
};

export type CartItemProps = {
  image: string;
  name: string;
  tokenId: string;
  price: string;
  quantity: number;
  total: string;
};

export type CheckoutItemProps = Omit<CartItemProps, "price">;

export type SelectOption = {
  value: string;
  label: string;
};

export type CarrinhoResponse = {
  items: CartItemProps[];
} & CheckoutItem;

export type CheckoutPayload = {
  walletOption: string;
  network: string | null;
};

export type CheckoutTransaction = {
  id: string;
  date: string;
  wallet: string;
  network: string;
  networkFee: string;
  total: string;
  explorerUrl: string;
  items: CheckoutItemProps[];
};

export type CheckoutOptions = {
  networks: SelectOption[];
  walletTypes: SelectOption[];
  ensSuffixes: SelectOption[];
};

export type CheckoutItem = {
  subtotal: string;
  desconto: string;
  taxa: string;
  total: string;
};
