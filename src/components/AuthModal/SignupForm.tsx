import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { AuthInput, AuthPasswordInput, SocialLogin } from "./AuthFields";

type SignupFormProps = {
  onSubmit?: (data: {
    username: string;
    email: string;
    password: string;
  }) => void;
};

export function SignupForm({ onSubmit }: SignupFormProps) {
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);
    onSubmit?.({
      username: String(data.get("username") ?? ""),
      email: String(data.get("email") ?? ""),
      password,
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="px-20">
        <div className="flex flex-col gap-2">
          <AuthInput
            id="signup-username"
            name="username"
            type="text"
            label="Nome de usuário"
            autoComplete="username"
            required
          />
          <AuthInput
            id="signup-email"
            name="email"
            type="email"
            label="Digite seu e-mail"
            autoComplete="email"
            required
          />
          <AuthPasswordInput
            id="signup-password"
            name="password"
            label="Senha"
            autoComplete="new-password"
            minLength={8}
            required
            aria-invalid={passwordMismatch || undefined}
          />
          <AuthInput
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            label="Confirmar senha"
            autoComplete="new-password"
            required
            aria-invalid={passwordMismatch || undefined}
            aria-describedby={
              passwordMismatch ? "signup-password-error" : undefined
            }
          />
        </div>

        {passwordMismatch && (
          <p
            id="signup-password-error"
            role="alert"
            className="mt-2 text-xs text-required"
          >
            As senhas não coincidem.
          </p>
        )}

        <Button
          type="submit"
          className="mt-5 h-11 w-full rounded-xs bg-primary-200 text-sm font-bold text-black hover:bg-primary-hover"
        >
          Criar conta
        </Button>
      </form>

      <SocialLogin />
    </>
  );
}
