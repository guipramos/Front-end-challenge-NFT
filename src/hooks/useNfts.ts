import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Nft } from "../Types";

async function fetchNfts(): Promise<Nft[]> {
  const { data } = await api.get<Nft[]>("/nfts");
  return data;
}

export function useNfts() {
  return useQuery({
    queryKey: ["nfts"],
    queryFn: fetchNfts,
  });
}
