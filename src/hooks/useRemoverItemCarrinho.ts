import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRemoverItemCarrinho() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tokenId: string) =>
      api.delete(`/carrinho/${encodeURIComponent(tokenId)}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrinho"] });
    },
  });
}
