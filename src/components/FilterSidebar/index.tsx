import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { MAX_PRICE, MIN_PRICE } from "../../data/filters";
import { useFilterOptions } from "../../hooks/useFilterOptions";
import type { FilterSidebarProps } from "../../Types";

const formatPrice = (value: number) => value.toFixed(2).replace(".", ",");

const linkItem =
  "h-auto w-full justify-between px-3 py-1.5 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-primary";

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const { data: options, isLoading, isError } = useFilterOptions();
  const collections = options?.collections ?? [];
  const networks = options?.networks ?? [];

  const [draftRange, setDraftRange] = useState<number[]>(filters.price);

  const toggleCategory = (label: string) => {
    onChange({
      ...filters,
      category: filters.category === label ? null : label,
    });
  };

  const toggleNetwork = (label: string) => {
    onChange({
      ...filters,
      network: filters.network === label ? null : label,
    });
  };

  const applyPrice = () =>
    onChange({ ...filters, price: [draftRange[0], draftRange[1]] });

  return (
    <aside
      aria-label="Filtros"
      className="flex flex-col gap-6 bg-surface-200 p-5"
    >
      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] leading-4 font-bold text-foreground mb-3">
          Coleções
        </h2>
        {isLoading && <p className="px-3 text-sm">Carregando...</p>}
        {isError && (
          <p className="px-3 text-sm">Não foi possível carregar as coleções.</p>
        )}
        <ul className="flex flex-col gap-1">
          {collections.map((item) => (
            <li key={item.label}>
              <Button
                variant="ghost"
                aria-pressed={filters.category === item.label}
                className={cn(
                  linkItem,
                  filters.category === item.label && "font-bold text-primary",
                )}
                onClick={() => toggleCategory(item.label)}
              >
                <span>{item.label}</span>
                <span className="rounded px-1.5 text-xs text-mutated-200">
                  ({item.count})
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] leading-4 font-bold text-foreground mb-3">
          Faixa de preço
        </h2>
        <Slider
          aria-label="Faixa de preço"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={0.01}
          value={draftRange}
          onValueChange={setDraftRange}
        />
        <div className="pl-3">
          <p className="text-[15px] text-foreground mb-3">
            Preço: {formatPrice(draftRange[0])} – {formatPrice(draftRange[1])}{" "}
            ETH
          </p>
          <Button size="sm" className="w-fit" onClick={applyPrice}>
            Aplicar
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3 mt-10">
        <h2 className="text-[18px] mb-3 font-bold">Rede</h2>
        {isLoading && <p className="px-3 text-sm">Carregando...</p>}
        {isError && (
          <p className="px-3 text-sm">Não foi possível carregar as redes.</p>
        )}
        <ul className="flex flex-col gap-1">
          {networks.map((item) => (
            <li key={item.label}>
              <Button
                variant="ghost"
                aria-pressed={filters.network === item.label}
                className={cn(
                  linkItem,
                  filters.network === item.label && "font-bold text-primary",
                )}
                onClick={() => toggleNetwork(item.label)}
              >
                <span>{item.label}</span>
                <span className="rounded px-1.5 text-xs">({item.count})</span>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
