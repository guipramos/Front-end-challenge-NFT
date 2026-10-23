import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Home } from "./pages/Home";
import { RootLayout } from "./components/RootLayout";
import { Mercado } from "./pages/Mercado";
import { Criadores } from "./pages/Criadores";
import { Aprenda } from "./pages/Aprenda";
import { NftDetails } from "./pages/NftDetails";
import { Carrinho } from "./pages/Carrinho";
import { Pagamento } from "./pages/Pagamento";
import { Perfil } from "./pages/Perfil";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const mercadoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mercado",
  component: Mercado,
});

const nftDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mercado/$nftId",
  component: NftDetails,
});

const carrinhoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mercado/carrinho",
  component: Carrinho,
});

const pagamentoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mercado/pagamento",
  component: Pagamento,
});

const criadoresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/criadores",
  component: Criadores,
});

const aprendaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/aprenda",
  component: Aprenda,
});

const perfilRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/perfil",
  component: Perfil,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  mercadoRoute,
  nftDetailsRoute,
  carrinhoRoute,
  pagamentoRoute,
  criadoresRoute,
  aprendaRoute,
  perfilRoute,
]);

export const router = createRouter({ routeTree, scrollRestoration: true });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
