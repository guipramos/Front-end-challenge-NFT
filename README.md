# NFT Marketplace — Desafio Técnico Frontend

Projeto desenvolvido como resposta a um **desafio técnico de frontend**: implementar um marketplace de NFTs em React e TypeScript, seguindo o layout do Figma, com APIs simuladas.

O desafio avalia fidelidade visual, qualidade das interações, integração com APIs, gerenciamento de estado assíncrono, acessibilidade e performance.

## Stack

| Responsabilidade | Tecnologia |
| --- | --- |
| Interface | React 19 |
| Linguagem | TypeScript |
| Build | Vite |
| Roteamento | TanStack Router |
| Estado remoto | TanStack Query |
| Cliente HTTP | Axios |
| Estilização | Tailwind CSS 4 |
| Componentes | shadcn/ui (Radix UI) |
| Mocking | MSW (Mock Service Worker) |
| Testes | Vitest + Testing Library + MSW |

## Telas

- **Home** (`/`): destaques, coleções e conteúdo editorial.
- **Mercado** (`/mercado`): catálogo com busca, filtros, ordenação e paginação.
- **Detalhes do NFT** (`/mercado/$nftId`): galeria, informações, edição, quantidade e compra.
- **Carrinho** (`/mercado/carrinho`): edição de quantidades, remoção e resumo de valores.
- **Pagamento** (`/mercado/pagamento`): dados do colecionador, carteira, rede e envio do pedido, com modal de confirmação.
- **Perfil** (`/perfil`): edição dos dados do colecionador.
- **Login e cadastro**: modal de autenticação.

## Como rodar

### Pré-requisitos

- **Node.js ≥ 22.12** (há um `.nvmrc` com a versão recomendada)
- **pnpm**

```bash
nvm use          # opcional, lê o .nvmrc
pnpm install
```

### Comandos

| Comando | Descrição |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento, com os mocks do MSW ativos |
| `pnpm build` | Verificação de tipos (`tsc -b`) e build de produção |
| `pnpm preview` | Serve localmente o build de produção |
| `pnpm lint` | Executa o ESLint |
| `pnpm test` | Executa a suíte de testes (Vitest) |
| `pnpm test:watch` | Executa os testes em modo watch |
| `pnpm test:coverage` | Executa os testes com relatório de cobertura |

## Mocks (MSW)

Toda a camada de dados é simulada na rede com o **MSW**, sem backend real. Os componentes, hooks e o cliente Axios consomem a API normalmente, e quem responde é o Service Worker.

- Os handlers ficam em `src/mocks/handlers.ts` e o worker do navegador em `src/mocks/browser.ts`.
- Os mocks mantêm estado em memória (por exemplo, o carrinho), então as alterações feitas pela interface aparecem nas respostas seguintes.
- Os mesmos handlers são reutilizados nos testes, por meio de `setupServer` do `msw/node`.

Endpoints simulados:

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/nfts` | Lista de NFTs do catálogo |
| `GET` | `/api/nfts/:id` | Detalhe de um NFT |
| `GET` | `/api/filter-options` | Opções dos filtros |
| `GET` | `/api/mercado/carrinho` | Carrinho e resumo de valores |
| `POST` | `/api/carrinho` | Adiciona item ao carrinho |
| `PATCH` | `/api/carrinho/:tokenId` | Altera a quantidade de um item |
| `DELETE` | `/api/carrinho/:tokenId` | Remove um item |
| `GET` | `/api/checkout/options` | Carteiras e redes disponíveis |
| `POST` | `/api/checkout` | Finaliza o pedido |

## Testes

Os testes foram escritos com **Vitest** (o runner nativo do Vite), **React Testing Library** e **user-event**, usando o **MSW** para simular a API. Eles cobrem desde as funções utilitárias até os fluxos completos da aplicação. São 357 testes em 19 arquivos.

```bash
pnpm test
pnpm test:coverage
```

| Camada | Arquivos | O que cobre |
| --- | --- | --- |
| Utilitários e dados | `src/lib/*.test.ts`, `src/data/data.test.ts` | Funções auxiliares, cliente Axios, `QueryClient`, dados estáticos |
| Mocks | `src/mocks/handlers.test.ts` | Contrato e comportamento dos handlers do MSW |
| Hooks | `src/hooks/queries.test.tsx`, `src/hooks/mutations.test.tsx` | Consultas e mutations do TanStack Query |
| Componentes | `src/components/*.test.tsx`, `src/components/ui/ui.test.tsx`, `src/components/icones/icones.test.tsx` | Catálogo, carrinho, checkout, autenticação, perfil, componentes de UI e ícones |
| Páginas e rotas | `src/pages/pages.test.tsx`, `src/app.test.tsx` | Cada página e o roteamento com a árvore de rotas real |
| Fluxos | `src/test/flows.test.tsx` | Jornadas completas, como do catálogo ao carrinho e ao pagamento |

Infraestrutura de testes em `src/test/`:

- `setup.ts`: `jest-dom`, polyfills do jsdom (`ResizeObserver`, `matchMedia` etc.), servidor MSW e limpeza entre testes.
- `server.ts`: servidor MSW com os handlers reais do app.
- `utils.tsx`: helpers de renderização com `QueryClient` isolado e `Router` em memória.

Cada teste começa de um estado isolado: o cache do Query, o `sessionStorage` e o carrinho simulado são resetados a cada execução, e requisições sem handler fazem o teste falhar.

## Estrutura do projeto

```
src/
├── components/   # Componentes de interface (e ui/ com shadcn/ui)
├── data/         # Dados estáticos e fixtures
├── hooks/        # Hooks de consulta e mutation (TanStack Query)
├── lib/          # Cliente Axios, QueryClient e utilitários
├── mocks/        # Handlers e worker do MSW
├── pages/        # Páginas, uma por rota
├── test/         # Setup e helpers de teste
├── Types/        # Tipos compartilhados
└── router.tsx    # Rotas (TanStack Router)
```
