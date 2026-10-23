import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CheckoutPayload, CheckoutTransaction } from "../Types";

export function useFinalizarCompra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const { data } = await api.post<CheckoutTransaction>("/checkout", payload);
      return data;
    },
    onSuccess: () => {
      // A compra esvazia o carrinho no servidor.
      queryClient.invalidateQueries({ queryKey: ["carrinho"] });
    },
  });
}
