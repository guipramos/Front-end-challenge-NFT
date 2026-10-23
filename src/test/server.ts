import { setupServer } from "msw/node";
import { handlers } from "@/mocks/handlers";

/** Servidor MSW (Node) com os mesmos handlers usados pelo app em desenvolvimento. */
export const server = setupServer(...handlers);
