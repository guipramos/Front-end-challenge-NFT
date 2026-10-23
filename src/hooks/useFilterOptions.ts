import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { FilterOptions } from "../Types";

async function fetchFilterOptions(): Promise<FilterOptions> {
  const { data } = await api.get<FilterOptions>("/filter-options");
  return data;
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ["filter-options"],
    queryFn: fetchFilterOptions,
  });
}
