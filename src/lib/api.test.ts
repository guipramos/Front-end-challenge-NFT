import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { api } from "./api";

describe("api", () => {
  it("usa /api como baseURL", () => {
    expect(api.defaults.baseURL).toBe("/api");
  });

  it("resolve as requisições a partir do baseURL", async () => {
    server.use(http.get("/api/ping", () => HttpResponse.json({ ok: true })));

    const { data } = await api.get("/ping");

    expect(data).toEqual({ ok: true });
  });

  it("rejeita quando o servidor responde com erro", async () => {
    server.use(
      http.get("/api/falha", () =>
        HttpResponse.json({ message: "erro" }, { status: 500 }),
      ),
    );

    await expect(api.get("/falha")).rejects.toMatchObject({
      response: { status: 500 },
    });
  });
});
