import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { CarrinhoResponse } from "../Types";

async function fetchCarrinho(): Promise<CarrinhoResponse> {
  const { data } = await api.get<CarrinhoResponse>("/mercado/carrinho");
  return data;
}

export function useCarrinho() {
  return useQuery({
    queryKey: ["carrinho"],
    queryFn: fetchCarrinho,
  });
}
