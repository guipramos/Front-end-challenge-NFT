import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCheckoutOptions } from "@/hooks/useCheckoutOptions";

const DEFAULT_ENS_SUFFIX = ".eth";

const inputClass =
  "h-10 rounded-xs border-muted-200/20 px-3 text-sm md:text-sm placeholder:text-muted-200/50";

const selectTriggerClass =
  "h-10 w-full rounded-xs border-muted-200/20 pr-7 pl-3 text-sm data-[size=default]:h-10 data-placeholder:text-muted-200/70";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  spacedMark?: boolean;
  className?: string;
  children: ReactNode;
};

function Field({
  id,
  label,
  required = false,
  spacedMark = false,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label
        htmlFor={id}
        className="gap-0 text-[15px] leading-5 font-normal text-foreground"
      >
        {label}
        {required && (
          <span
            aria-hidden="true"
            className={cn(
              "text-[17px] leading-none text-required",
              spacedMark && "ml-2.25",
            )}
          >
            *
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}

export function CheckoutForm() {
  const { data: options } = useCheckoutOptions();

  const networks = options?.networks ?? [];
  const walletTypes = options?.walletTypes ?? [];
  const ensSuffixes = options?.ensSuffixes ?? [];

  return (
    <section aria-labelledby="checkout-form-title" className="flex flex-col">
      <h2
        id="checkout-form-title"
        className="text-[17px] leading-6 font-bold text-foreground"
      >
        Perfil do colecionador
      </h2>

      <div className="mt-3 grid gap-x-6 gap-y-4.25 sm:grid-cols-2">
        <Field id="display-name" label="Nome de exibição" required>
          <Input
            id="display-name"
            name="displayName"
            type="text"
            required
            className={inputClass}
          />
        </Field>

        <Field id="username" label="Nome de usuário" required>
          <Input
            id="username"
            name="username"
            type="text"
            required
            className={inputClass}
          />
        </Field>

        <Field id="network" label="Rede" required spacedMark>
          <Select name="network" required>
            <SelectTrigger id="network" className={selectTriggerClass}>
              <SelectValue placeholder="Selecione uma rede" />
            </SelectTrigger>
            <SelectContent>
              {networks.map((network) => (
                <SelectItem key={network.value} value={network.value}>
                  {network.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field id="profile-name" label="Nome do perfil" required>
          <Input
            id="profile-name"
            name="profileName"
            type="text"
            required
            className={inputClass}
          />
        </Field>

        <Field id="wallet-address" label="Endereço da carteira" required>
          <Input
            id="wallet-address"
            name="walletAddress"
            type="text"
            placeholder="Endereço 0x da carteira"
            required
            className={cn(inputClass, "pl-5")}
          />
        </Field>

        <div className="self-end">
          <Input
            id="secondary-wallet"
            name="secondaryWallet"
            type="text"
            aria-label="ENS ou carteira secundária (opcional)"
            placeholder="ENS ou carteira secundária (opcional)"
            className={cn(inputClass, "pl-5")}
          />
        </div>

        <Field id="wallet-type" label="Tipo de carteira" required>
          <Select name="walletType" required>
            <SelectTrigger id="wallet-type" className={selectTriggerClass}>
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              {walletTypes.map((wallet) => (
                <SelectItem key={wallet.value} value={wallet.value}>
                  {wallet.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field id="referral-code" label="Código de indicação" required>
          <Input
            id="referral-code"
            name="referralCode"
            type="text"
            required
            className={inputClass}
          />
        </Field>

        <Field id="email" label="E-mail" required>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
          />
        </Field>

        <Field id="ens-suffix" label="Nome ENS" required spacedMark>
          <Select name="ensSuffix" defaultValue={DEFAULT_ENS_SUFFIX}>
            <SelectTrigger
              id="ens-suffix"
              className="h-10 w-19.5 rounded-xs border-muted-200/20 pr-2 pl-3 text-sm data-[size=default]:h-10"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ensSuffixes.map((suffix) => (
                <SelectItem key={suffix.value} value={suffix.value}>
                  {suffix.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <label className="mt-5.5 flex w-fit items-center gap-2 text-[15px] leading-5 text-foreground">
        <input
          type="checkbox"
          name="useOtherWallet"
          className="size-4 shrink-0 appearance-none rounded-full border-2 border-primary-300 outline-none checked:bg-primary-300 checked:shadow-[inset_0_0_0_2px_var(--color-black)] focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        Usar outra carteira?
      </label>

      <div className="mt-6 flex flex-col gap-2.5">
        <Label
          htmlFor="collector-note"
          className="text-[15px] leading-5 font-normal text-foreground"
        >
          Observação do colecionador (opcional)
        </Label>
        <textarea
          id="collector-note"
          name="collectorNote"
          className="h-37.5 w-full max-w-87.5 resize-none rounded-xs border border-muted-200/20 bg-transparent p-3 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
    </section>
  );
}
