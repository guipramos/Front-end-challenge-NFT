import type { CheckoutOptions } from "../Types";

export const checkoutOptions: CheckoutOptions = {
  networks: [
    { value: "ethereum", label: "Ethereum" },
    { value: "polygon", label: "Polygon" },
    { value: "solana", label: "Solana" },
  ],
  walletTypes: [
    { value: "metamask", label: "MetaMask" },
    { value: "walletconnect", label: "WalletConnect" },
    { value: "coinbase", label: "Coinbase Wallet" },
  ],
  ensSuffixes: [{ value: ".eth", label: ".eth" }],
};
