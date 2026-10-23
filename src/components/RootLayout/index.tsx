import { Outlet, useRouterState } from "@tanstack/react-router";
import { Header } from "../Header";
import { Footer } from "../Footer";

export function RootLayout() {
  // A tela "Meu perfil" usa as medidas do cabeçalho do design dela.
  const isProfile = useRouterState({
    select: (state) => state.location.pathname === "/perfil",
  });

  return (
    <>
      <Header variant={isProfile ? "profile" : "default"} />
      <Outlet />
      <Footer />
    </>
  );
}
