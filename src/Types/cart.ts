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

/** Corpo de POST /api/checkout. */
export type CheckoutPayload = {
  walletOption: string;
  network: string | null;
};

/** Resposta de POST /api/checkout (exibida no modal de sucesso). */
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

/** Resposta de GET /api/checkout/options. */
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
