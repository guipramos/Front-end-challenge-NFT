import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export type AuthMode = "login" | "signup";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Aba exibida ao abrir o modal. */
  defaultMode?: AuthMode;
};

const tabs = [
  { mode: "login", label: "Entrar" },
  { mode: "signup", label: "Criar conta" },
] as const satisfies readonly { mode: AuthMode; label: string }[];

const descriptions: Record<AuthMode, string> = {
  login: "Entre para gerenciar sua carteira, coleção e perfil de criador.",
  signup: "Crie seu perfil de colecionador e conecte uma carteira quando quiser.",
};

export function AuthModal({
  open,
  onOpenChange,
  defaultMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  function handleOpenChange(nextOpen: boolean) {
    // Sempre volta para a aba inicial na próxima abertura.
    if (!nextOpen) setMode(defaultMode);
    onOpenChange(nextOpen);
  }

  function handleSuccess() {
    // Ainda não há API de autenticação: apenas fecha o modal.
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-125 rounded-none border-0 p-0 sm:max-w-125">
        <div className="relative pt-12 pb-14 after:absolute after:inset-x-0 after:bottom-0 after:h-2.5 after:bg-primary-200 after:content-['']">
          <DialogClose
            aria-label="Fechar"
            className="absolute top-3 right-3 flex size-6 items-center justify-center text-primary-200 transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <X className="size-4" aria-hidden="true" />
          </DialogClose>

          <header className="px-20 text-center">
            <DialogTitle className="sr-only">
              {mode === "login" ? "Entrar" : "Criar conta"}
            </DialogTitle>

            <div
              role="tablist"
              aria-label="Acesso à conta"
              className="flex items-center justify-center text-lg leading-6 font-medium"
            >
              {tabs.map((tab, index) => {
                const active = mode === tab.mode;
                return (
                  <button
                    key={tab.mode}
                    type="button"
                    role="tab"
                    id={`auth-tab-${tab.mode}`}
                    aria-selected={active}
                    aria-controls="auth-panel"
                    onClick={() => setMode(tab.mode)}
                    className={cn(
                      "rounded-xs px-2 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      index === 0 && "border-r border-muted-200/60 pr-3",
                      index === 1 && "pl-3",
                      active
                        ? "text-primary-200"
                        : "text-foreground hover:text-primary-200",
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <DialogDescription className="mx-auto mt-7 max-w-76 text-xs leading-5 text-foreground">
              {descriptions[mode]}
            </DialogDescription>
          </header>

          <div
            id="auth-panel"
            role="tabpanel"
            aria-labelledby={`auth-tab-${mode}`}
            className="mt-6"
          >
            {mode === "login" ? (
              <LoginForm onSubmit={handleSuccess} />
            ) : (
              <SignupForm onSubmit={handleSuccess} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
