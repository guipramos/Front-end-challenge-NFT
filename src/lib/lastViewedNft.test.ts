import { describe, expect, it, vi } from "vitest";
import { getLastViewedNftId, setLastViewedNftId } from "./lastViewedNft";

describe("lastViewedNft", () => {
  it("retorna null quando nenhum NFT foi visitado", () => {
    expect(getLastViewedNftId()).toBeNull();
  });

  it("guarda e recupera o id do último NFT visitado", () => {
    setLastViewedNftId("emerald-ape-042");
    expect(getLastViewedNftId()).toBe("emerald-ape-042");
    expect(sessionStorage.getItem("kurio:last-viewed-nft")).toBe(
      "emerald-ape-042",
    );
  });

  it("sobrescreve o valor anterior", () => {
    setLastViewedNftId("a");
    setLastViewedNftId("b");
    expect(getLastViewedNftId()).toBe("b");
  });

  it("não lança erro quando o sessionStorage está indisponível", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    expect(() => setLastViewedNftId("x")).not.toThrow();
    expect(getLastViewedNftId()).toBeNull();
  });
});
