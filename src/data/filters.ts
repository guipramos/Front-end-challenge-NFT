import type { FilterOptions, Filters } from "../Types";

/** "Banco de dados" do mock: devolvido pelo MSW em GET /api/filter-options. */
export const filterOptions: FilterOptions = {
  collections: [
    { label: "Arte digital", count: 28 },
    { label: "Fotografia", count: 35 },
    { label: "Música", count: 26 },
    { label: "Arte 3D", count: 22 },
    { label: "Colecionamento", count: 25 },
    { label: "Generativo", count: 19 },
    { label: "Jogos", count: 28 },
    { label: "Assinaturas", count: 25 },
    { label: "Utilidade", count: 14 },
  ],
  networks: [
    { label: "Ethereum", count: 178 },
    { label: "Polygon", count: 128 },
    { label: "Solana", count: 86 },
  ],
};

export const MIN_PRICE = 0.02;
export const MAX_PRICE = 13.38;

export const DEFAULT_FILTERS: Filters = {
  category: null,
  network: null,
  price: [MIN_PRICE, MAX_PRICE],
};
