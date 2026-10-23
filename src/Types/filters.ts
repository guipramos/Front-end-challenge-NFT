export type FilterOption = {
  label: string;
  count: number;
};

export type FilterOptions = {
  collections: FilterOption[];
  networks: FilterOption[];
};

export type Filters = {
  category: string | null;
  network: string | null;
  price: [number, number];
};

export type FilterSidebarProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export type Tab = "Todos os NFTs" | "Novos lançamentos" | "Em alta";

export type SortValue = "recent" | "price-asc" | "price-desc";
