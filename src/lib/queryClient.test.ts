import { describe, expect, it } from "vitest";
import { queryClient } from "./queryClient";

describe("queryClient", () => {
  it("define as opções padrão das queries", () => {
    const options = queryClient.getDefaultOptions().queries;

    expect(options?.staleTime).toBe(60_000);
    expect(options?.retry).toBe(1);
    expect(options?.refetchOnWindowFocus).toBe(false);
  });
});
