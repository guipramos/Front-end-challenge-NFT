import { Button } from "@/components/ui/button";
import { Lupa } from "../icones/Lupa/Lupa";

export function SearchButton() {
  return (
    <Button
      variant="ghost"
      aria-label="Buscar"
      className="size-auto p-0 hover:bg-transparent hover:opacity-80"
    >
      <Lupa aria-hidden="true" />
    </Button>
  );
}
