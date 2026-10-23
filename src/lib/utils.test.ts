import { describe, expect, it } from "vitest";
import { cn, priceToNumber } from "./utils";

describe("cn", () => {
  it("junta classes", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignora valores falsy e aceita condicionais", () => {
    const inactive = false as boolean;
    expect(cn("a", inactive && "b", undefined, null, "c")).toBe("a c");
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });

  it("resolve conflitos do Tailwind mantendo a última classe", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm text-red-500", "text-lg")).toBe("text-red-500 text-lg");
  });
});

describe("priceToNumber", () => {
  it("converte preços em ETH para número", () => {
    expect(priceToNumber("1.19 ETH")).toBe(1.19);
    expect(priceToNumber("0.99 ETH")).toBe(0.99);
  });

  it("retorna NaN quando não há número", () => {
    expect(priceToNumber("grátis")).toBeNaN();
  });
});
