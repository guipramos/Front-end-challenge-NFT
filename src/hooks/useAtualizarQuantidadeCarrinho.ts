import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AtualizarQuantidadePayload = {
  tokenId: string;
  quantity: number;
};

export function useAtualizarQuantidadeCarrinho() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tokenId, quantity }: AtualizarQuantidadePayload) =>
      api.patch(`/carrinho/${encodeURIComponent(tokenId)}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrinho"] });
    },
  });
}
