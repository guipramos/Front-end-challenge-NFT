import { useState } from "react";
import {
  HeartIcon,
  MailIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComprarPayload, Nft } from "../../Types";
import { Linkedin } from "../icones/Linkedin/Linkedin";
import { Twitter } from "../icones/Twitter/Twitter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;
const MAX_STARS = 5;

const shareLinks = [
  {
    label: "Compartilhar no LinkedIn",
    href: "https://www.linkedin.com/",
    Icon: Linkedin,
    className: "size-4 fill-current text-foreground",
  },
  {
    label: "Compartilhar por e-mail",
    href: "mailto:?subject=Kurio",
    Icon: MailIcon,
    className: "size-4 text-foreground/70",
  },
  {
    label: "Compartilhar no Twitter",
    href: "https://twitter.com/",
    Icon: Twitter,
    className: "size-4 fill-current text-foreground",
  },
] as const;

type NftInfoProps = {
  nft: Nft;
};

export function NftInfo({ nft }: NftInfoProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [edition, setEdition] = useState(nft.edition);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [isFavorite, setIsFavorite] = useState(false);

  const metaItems = [
    `ID do token: ${nft.tokenId}`,
    `Coleção: ${nft.collection}`,
    `Atributos: ${nft.attributes.join(", ")}`,
  ];

  const comprarMutation = useMutation({
    mutationFn: (dados: ComprarPayload) => axios.post("/api/carrinho", dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrinho"] });
      navigate({ to: "/mercado/carrinho" });
    },
    onError: (error) => {
      console.error({ message: error });
    },
  });

  const handleComprar = () => {
    const payload = {
      tokenId: nft.tokenId,
      quantity,
      edition,
    };

    comprarMutation.mutate(payload);
  };

  return (
    <div className="flex flex-col text-[15px]">
      <h1 className="text-[28px] leading-9 font-bold text-foreground">
        {nft.name}
      </h1>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pb-2">
        <p className="flex items-baseline gap-2 whitespace-nowrap text-[22px] leading-7 font-bold text-primary">
          {nft.price}
          {nft.oldPrice && (
            <s className="text-base font-normal text-primary-300 no-underline">
              {nft.oldPrice}
            </s>
          )}
        </p>
        <p className="flex items-center gap-1.5 leading-6 text-foreground/80 sm:whitespace-nowrap">
          <span
            role="img"
            aria-label={`Avaliação ${nft.rating} de ${MAX_STARS}`}
            className="flex gap-1.25"
          >
            {Array.from({ length: MAX_STARS }, (_, index) => (
              <StarIcon
                key={index}
                aria-hidden="true"
                className={cn(
                  "size-3.5 fill-current",
                  index < nft.rating ? "text-primary" : "text-muted-200",
                )}
              />
            ))}
          </span>
          {nft.ratingCount} avaliações de colecionadores
        </p>
      </div>
      <hr className="mr-5.5 border-muted-200/20" />

      <h2 className="mt-2.5 leading-6 font-bold text-foreground">
        Sobre este NFT:
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-200/80">
        {nft.description}
      </p>

      <div role="radiogroup" aria-labelledby="edition-label" className="mt-0.5">
        <p id="edition-label" className="leading-6 font-bold text-foreground">
          Edição:
        </p>
        <div className="mt-2 flex flex-wrap gap-1.75">
          {nft.editions.map((option) => {
            const isSelected = option === edition;

            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setEdition(option)}
                className={cn(
                  "h-7.5 rounded-full border px-1 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "border-primary text-primary"
                    : "border-muted-200/20 text-muted-200/75 hover:border-primary/60",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div
          role="group"
          aria-label="Quantidade"
          className="flex items-start gap-3.5 text-base text-foreground"
        >
          <Button
            type="button"
            aria-label="Diminuir quantidade"
            disabled={quantity <= MIN_QUANTITY}
            onClick={() =>
              setQuantity((value) => Math.max(MIN_QUANTITY, value - 1))
            }
            className="h-12 w-8 rounded-full bg-primary-200 p-0 text-primary-foreground hover:bg-primary-hover disabled:opacity-100"
          >
            <MinusIcon aria-hidden="true" className="size-6" />
          </Button>
          <output aria-live="polite" className="self-center">
            {quantity}
          </output>
          <Button
            type="button"
            aria-label="Aumentar quantidade"
            disabled={quantity >= MAX_QUANTITY}
            onClick={() =>
              setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))
            }
            className="h-12 w-8 rounded-full bg-primary-200 p-0 text-primary-foreground hover:bg-primary-hover disabled:opacity-100"
          >
            <PlusIcon aria-hidden="true" className="size-6" />
          </Button>
        </div>

        <div className="flex items-start gap-2">
          <Button
            type="button"
            className="h-10 w-32.5 rounded-md bg-primary-200 text-sm font-bold uppercase hover:bg-primary-hover"
            onClick={handleComprar}
          >
            Comprar
          </Button>
          <Button
            type="button"
            variant="outline"
            aria-pressed={isFavorite}
            onClick={() => setIsFavorite((value) => !value)}
            className="h-10 w-32.5 gap-2 rounded-md border-primary-200/70 text-sm font-medium text-muted-200 hover:bg-transparent hover:text-primary"
          >
            <HeartIcon
              aria-hidden="true"
              className={cn(
                "size-5",
                isFavorite && "fill-current text-primary",
              )}
            />
            Favoritar
          </Button>
        </div>
      </div>

      <ul className="mt-3.5 -mb-1.75 flex flex-col gap-2 text-muted-200/70">
        {metaItems.map((item) => (
          <li key={item} className="leading-6">
            {item}
          </li>
        ))}
        <li className="flex items-center gap-2 leading-6 font-bold text-foreground">
          Compartilhar este NFT:
          <span className="flex items-center gap-2">
            {shareLinks.map(({ label, href, Icon, className }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="transition-opacity hover:opacity-80"
              >
                <Icon aria-hidden="true" className={className} />
              </a>
            ))}
          </span>
        </li>
      </ul>
    </div>
  );
}
