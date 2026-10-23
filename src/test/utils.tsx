import type { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { render, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { router as appRouter } from "@/router";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
}

/** Wrapper só com React Query (para hooks e componentes sem rotas). */
export function createQueryWrapper(client = createTestQueryClient()) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

export function renderHookWithQuery<Result, Props>(
  hook: (props: Props) => Result,
  client = createTestQueryClient(),
) {
  return {
    client,
    ...renderHook(hook, { wrapper: createQueryWrapper(client) }),
  };
}

/** Rotas "fantasma" para as quais os componentes isolados podem navegar. */
const stubPaths = [
  "/mercado",
  "/mercado/carrinho",
  "/mercado/pagamento",
  "/mercado/$nftId",
  "/criadores",
  "/aprenda",
  "/perfil",
] as const;

/**
 * Renderiza um componente isolado dentro de um router em memória.
 * O componente aparece em todas as rotas; cada rota exibe um marcador
 * `data-testid="route:<caminho>"` para verificar a navegação.
 */
export async function renderWithRouter(
  ui: ReactElement,
  { route = "/", client = createTestQueryClient() } = {},
) {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        {ui}
        <Outlet />
      </>
    ),
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <div data-testid="route:/" />,
  });

  const stubs = stubPaths.map((path) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => <div data-testid={`route:${path}`} />,
    }),
  );

  const testRouter = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, ...stubs]),
    history: createMemoryHistory({ initialEntries: [route] }),
  });

  const user = userEvent.setup();
  const utils = render(
    <QueryClientProvider client={client}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>,
  );

  await testRouter.load();

  return { user, client, router: testRouter, ...utils };
}

/**
 * Renderiza o app inteiro (rotas reais + layout) numa URL específica,
 * usando um histórico em memória.
 */
export async function renderApp(route = "/") {
  const client = createTestQueryClient();
  const testRouter = createRouter({
    routeTree: appRouter.routeTree,
    history: createMemoryHistory({ initialEntries: [route] }),
  });

  const user = userEvent.setup();
  const utils = render(
    <QueryClientProvider client={client}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>,
  );

  await testRouter.load();

  return { user, client, router: testRouter, ...utils };
}
