import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { AuthInput, AuthPasswordInput, SocialLogin } from "./AuthFields";

type LoginFormProps = {
  onSubmit?: (credentials: { email: string; password: string }) => void;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmit?.({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="px-20">
        <div className="flex flex-col gap-2">
          <AuthInput
            id="login-email"
            name="email"
            type="email"
            label="contato@email.com"
            autoComplete="email"
            required
          />
          <AuthPasswordInput
            id="login-password"
            name="password"
            label="Senha"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            className="rounded-xs text-xs text-primary-200 transition-opacity outline-none hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Esqueceu a senha?
          </button>
        </div>

        <Button
          type="submit"
          className="mt-4.5 h-11 w-full rounded-xs bg-primary-200 text-sm font-bold text-black hover:bg-primary-hover"
        >
          Entrar
        </Button>
      </form>

      <SocialLogin />
    </>
  );
}
