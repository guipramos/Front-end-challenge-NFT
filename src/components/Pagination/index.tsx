import type { MouseEvent } from "react";
import { ChevronRightIcon } from "lucide-react";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const itemBase = "text-sm font-normal";
const itemActive =
  "border-transparent bg-primary font-bold text-primary-foreground";
const itemIdle = "bg-surface-200 hover:bg-surface-alt-200";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const goTo = (page: number) => (event: MouseEvent) => {
    event.preventDefault();
    onPageChange(page);
  };

  return (
    <PaginationRoot aria-label="Paginação" className="mx-0 justify-end">
      <PaginationContent className="gap-2">
        {pages.map((page) => {
          const isActive = page === currentPage;

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={isActive}
                onClick={goTo(page)}
                className={cn(itemBase, isActive ? itemActive : itemIdle)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label="Próxima página"
            onClick={goTo(Math.min(currentPage + 1, totalPages))}
            className={cn(itemBase, "bg-surface hover:bg-surface-alt")}
          >
            <ChevronRightIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
