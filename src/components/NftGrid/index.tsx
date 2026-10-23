import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NftCard } from "../NftCard";
import { Pagination } from "../Pagination";
import { useMemo, useState } from "react";
import type { Filters, Nft, SortValue, Tab } from "../../Types";
import { priceToNumber } from "@/lib/utils";
import { useNfts } from "@/hooks/useNfts";

const tabs = [
  "Todos os NFTs",
  "Novos lançamentos",
  "Em alta",
] as const satisfies readonly Tab[];

const sortOptions = [
  { value: "recent", label: "Listados recentemente" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
] as const satisfies readonly { value: SortValue; label: string }[];

const NEW_RELEASE_WINDOW = 30 * 24 * 60 * 60 * 1000;
const PAGE_SIZE = 6;

type NftGridProps = {
  filters: Filters;
};

const EMPTY: readonly Nft[] = [];

export function NftGrid({ filters }: NftGridProps) {
  const { data, isLoading, isError } = useNfts();
  const nfts = data ?? EMPTY;

  const [tab, setTab] = useState<Tab>(tabs[0]);
  const [sort, setSort] = useState<SortValue>("recent");
  const [page, setPage] = useState(1);
  const [now] = useState(() => Date.now());

  const [prevFilters, setPrevFilters] = useState(filters);
  if (prevFilters !== filters) {
    setPrevFilters(filters);
    setPage(1);
  }

  const handleTabChange = (value: string) => {
    setTab(value as Tab);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value as SortValue);
    setPage(1);
  };

  const filteredNfts = useMemo(() => {
    const [min, max] = filters.price;

    const list = nfts.filter((nft) => {
      const price = priceToNumber(nft.price);
      const matchesCategory =
        !filters.category || nft.category === filters.category;
      const matchesNetwork =
        !filters.network || nft.network === filters.network;
      const matchesPrice = price >= min && price <= max;
      const matchesTab =
        tab === "Todos os NFTs" ||
        (tab === "Em alta" && nft.trending) ||
        (tab === "Novos lançamentos" &&
          now - new Date(nft.listedAt).getTime() <= NEW_RELEASE_WINDOW);

      return matchesCategory && matchesNetwork && matchesPrice && matchesTab;
    });

    return [...list].sort((a, b) => {
      if (sort === "price-asc")
        return priceToNumber(a.price) - priceToNumber(b.price);
      if (sort === "price-desc")
        return priceToNumber(b.price) - priceToNumber(a.price);
      return b.listedAt.localeCompare(a.listedAt);
    });
  }, [nfts, filters, tab, sort, now]);

  const totalPages = Math.max(1, Math.ceil(filteredNfts.length / PAGE_SIZE));
  const pageNfts = filteredNfts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section aria-label="Lista de NFTs" className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList variant="line" className="h-auto gap-5 p-0">
            {tabs.map((tabName) => (
              <TabsTrigger
                key={tabName}
                value={tabName}
                className="flex-none px-0 pb-3 text-[15px] font-medium text-foreground after:bg-primary hover:text-primary data-active:font-bold data-active:text-primary"
              >
                {tabName}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center pb-3 text-[15px] text-foreground">
          <span id="sort-label">Ordenar por:</span>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger
              aria-labelledby="sort-label"
              className="border-0 bg-transparent px-1 py-1 text-[15px] text-foreground data-[size=default]:h-auto"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p role="status" className="py-12 text-center text-muted-foreground">
          Carregando NFTs...
        </p>
      ) : isError ? (
        <p role="alert" className="py-12 text-center text-muted-foreground">
          Não foi possível carregar os NFTs. Tente novamente.
        </p>
      ) : pageNfts.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Nenhum NFT encontrado com esses filtros.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageNfts.map((nft) => (
            <li key={nft.id}>
              <NftCard
                id={nft.id}
                image={nft.image}
                name={nft.name}
                price={nft.price}
                oldPrice={nft.oldPrice}
              />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}
