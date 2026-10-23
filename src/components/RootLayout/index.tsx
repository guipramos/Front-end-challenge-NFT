import { Outlet, useRouterState } from "@tanstack/react-router";
import { Header } from "../Header";
import { Footer } from "../Footer";

export function RootLayout() {
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
