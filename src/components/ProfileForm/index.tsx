import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
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
import type { SelectOption } from "../../Types";
import {
  EyeIcon,
  EyeOffIcon,
  GalleryIcon,
} from "../icones/ProfileMenu/ProfileMenu";

const ensSuffixes = [
  { value: ".eth", label: ".eth" },
] as const satisfies readonly SelectOption[];

const inputClass =
  "h-10 rounded-xs border-muted-200/20 px-3 text-sm md:text-sm placeholder:text-muted-200/50";

const labelClass = "gap-0 text-[15px] leading-5 font-light text-foreground";

const sectionTitleClass = "text-base leading-4 font-medium text-foreground";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  spacedMark?: boolean;
  gapClassName?: string;
  className?: string;
  children: ReactNode;
};

function Field({
  id,
  label,
  required = false,
  spacedMark = false,
  gapClassName = "gap-3.75",
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col", gapClassName, className)}>
      <Label htmlFor={id} className={labelClass}>
        {label}
        {required && (
          <span
            aria-hidden="true"
            className={cn(
              "text-xl leading-none text-required",
              spacedMark ? "ml-[5.5px]" : "ml-[1.5px]",
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

type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
};

function PasswordField({ id, name, label, autoComplete }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const ToggleIcon = visible ? EyeIcon : EyeOffIcon;

  return (
    <Field id={id} label={label} gapClassName="gap-2.5">
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          className={cn(inputClass, "pr-12")}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
          className="absolute top-1/2 right-4.5 -translate-y-1/2 rounded-xs text-muted-200 transition-opacity outline-none hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ToggleIcon aria-hidden="true" className="size-[17px]" />
        </button>
      </div>
    </Field>
  );
}

export function ProfileForm() {
  return (
    <section
      aria-labelledby="profile-form-title"
      className="min-w-0 flex-1"
    >
      <h1 id="profile-form-title" className={sectionTitleClass}>
        Perfil do colecionador
      </h1>

      <form className="mt-9 grid grid-cols-2 items-start gap-x-7">
        <div className="flex flex-col gap-7">
          <Field id="display-name" label="Nome de exibição" required>
            <Input
              id="display-name"
              name="displayName"
              type="text"
              autoComplete="name"
              required
              className={inputClass}
            />
          </Field>

          <Field id="email" label="E-mail" required>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
            />
          </Field>

          <Field id="wallet-nickname" label="Apelido da carteira" required>
            <Input
              id="wallet-nickname"
              name="walletNickname"
              type="text"
              required
              className={inputClass}
            />
          </Field>

          <section
            aria-labelledby="change-password-title"
            className="mt-[4.5px] flex flex-col"
          >
            <h2
              id="change-password-title"
              className={cn(sectionTitleClass, "font-light")}
            >
              Alterar senha
            </h2>

            <div className="mt-5 flex flex-col gap-5.25">
              <PasswordField
                id="current-password"
                name="currentPassword"
                label="Senha atual"
                autoComplete="current-password"
              />
              <PasswordField
                id="new-password"
                name="newPassword"
                label="Nova senha"
                autoComplete="new-password"
              />
              <PasswordField
                id="confirm-password"
                name="confirmPassword"
                label="Confirmar nova senha"
                autoComplete="new-password"
              />
            </div>
          </section>

          <Button
            type="submit"
            className="mt-1 h-10 w-33 rounded-xs bg-primary-200 text-sm font-bold hover:bg-primary-hover"
          >
            Salvar
          </Button>
        </div>

        <div className="flex flex-col gap-7">
          <Field id="username" label="Nome de usuário" required>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className={inputClass}
            />
          </Field>

          <Field id="ens-suffix" label="Nome ENS" required spacedMark>
            <div className="flex gap-3">
              <Select name="ensSuffix" defaultValue={ensSuffixes[0].value}>
                <SelectTrigger
                  id="ens-suffix"
                  aria-label="Sufixo ENS"
                  className="h-10 w-19 shrink-0 rounded-xs border-muted-200/20 pr-1 pl-3 text-sm font-light data-[size=default]:h-10 [&>svg]:size-4.5 [&>svg]:translate-y-px [&>svg]:text-foreground/80"
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
              <Input
                id="ens-name"
                name="ensName"
                type="text"
                aria-label="Nome ENS"
                required
                className={cn(inputClass, "flex-1")}
              />
            </div>
          </Field>

          <div
            role="group"
            aria-labelledby="avatar-label"
            className="-mt-[7px] flex flex-col gap-2"
          >
            <span id="avatar-label" className={cn(labelClass, "flex items-center")}>
              Avatar
            </span>
            <div className="flex items-center gap-6">
              <div
                aria-hidden="true"
                className="flex size-12.5 shrink-0 items-center justify-center rounded-full border border-muted-200/20 bg-[#2e1c16] text-primary-200"
              >
                <GalleryIcon className="-translate-x-px -translate-y-[1.5px]" />
              </div>
              <div className="flex items-center gap-[18.5px]">
                <Button
                  type="button"
                  className="h-10 w-[99px] justify-start rounded-xs bg-primary-200 pr-3 pl-6 text-sm font-bold hover:bg-primary-hover"
                >
                  Alterar
                </Button>
                <button
                  type="button"
                  className="rounded-xs text-sm font-light text-foreground transition-opacity outline-none hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
