import { useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FacebookBrand } from "../icones/FacebookBrand/FacebookBrand";
import { Google } from "../icones/Google/Google";
import { EyeIcon, EyeOffIcon } from "../icones/ProfileMenu/ProfileMenu";

const inputClass =
  "h-11 rounded-xs border-muted-200/20 bg-black/50 px-3 text-xs md:text-xs text-foreground placeholder:text-muted-200/50 focus-visible:ring-0 focus-visible:border-primary-200 aria-invalid:ring-0";

type AuthInputProps = ComponentProps<typeof Input> & {
  id: string;
  label: string;
};

export function AuthInput({ id, label, className, ...props }: AuthInputProps) {
  return (
    <div>
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={label}
        className={cn(inputClass, className)}
        {...props}
      />
    </div>
  );
}

export function AuthPasswordInput({
  id,
  label,
  className,
  ...props
}: Omit<AuthInputProps, "type">) {
  const [visible, setVisible] = useState(false);
  const ToggleIcon = visible ? EyeIcon : EyeOffIcon;

  return (
    <div className="relative">
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <Input
        id={id}
        type={visible ? "text" : "password"}
        placeholder={label}
        className={cn(inputClass, "pr-11", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visible}
        className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-xs text-primary-200 transition-opacity outline-none hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ToggleIcon aria-hidden="true" className="size-4.5" />
      </button>
    </div>
  );
}

const socialButtonClass =
  "flex h-10.5 w-full items-center justify-center gap-2.5 rounded-xs border border-muted-200/20 bg-black/30 text-xs text-foreground transition-colors outline-none hover:border-primary-200/60 focus-visible:ring-3 focus-visible:ring-ring/50";

export function SocialLogin() {
  return (
    <div className="mt-6 border-t border-muted-200/20 px-20 pt-3.5">
      <p className="text-center text-xs text-foreground">Ou continue com</p>
      <div className="mt-3 flex flex-col gap-2.5">
        <button type="button" className={socialButtonClass}>
          <Google aria-hidden="true" />
          Continuar com Google
        </button>
        <button type="button" className={socialButtonClass}>
          <FacebookBrand aria-hidden="true" />
          Continuar com Facebook
        </button>
      </div>
    </div>
  );
}
