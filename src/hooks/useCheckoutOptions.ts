import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { CheckoutOptions } from "../Types";

async function fetchCheckoutOptions(): Promise<CheckoutOptions> {
  const { data } = await api.get<CheckoutOptions>("/checkout/options");
  return data;
}

export function useCheckoutOptions() {
  return useQuery({
    queryKey: ["checkout-options"],
    queryFn: fetchCheckoutOptions,
  });
}
