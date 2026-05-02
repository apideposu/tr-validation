import { describe, expect, it } from "vitest";

import { normalizeTurkishText, slugifyTurkish } from "../src/index";

describe("normalizeTurkishText", () => {
  it("normalizes whitespace, Turkish casing, ascii fold, slug, and search key", () => {
    const result = normalizeTurkishText("  İSTANBUL / Kadıköy  ");

    expect(result.trimmed).toBe("İSTANBUL / Kadıköy");
    expect(result.normalized).toBe("istanbul / kadıköy");
    expect(result.ascii).toBe("istanbul / kadikoy");
    expect(result.slug).toBe("istanbul-kadikoy");
    expect(result.searchKey).toBe("istanbul kadikoy");
  });

  it("handles Turkish lowercasing for dotted and dotless I", () => {
    const result = normalizeTurkishText("IĞDIR İZMİR");

    expect(result.normalized).toBe("ığdır izmir");
    expect(result.ascii).toBe("igdir izmir");
    expect(result.slug).toBe("igdir-izmir");
  });

  it("returns empty slug and search key for whitespace-only input", () => {
    const result = normalizeTurkishText("   ");

    expect(result.trimmed).toBe("");
    expect(result.normalized).toBe("");
    expect(result.slug).toBe("");
    expect(result.searchKey).toBe("");
  });
});

describe("slugifyTurkish", () => {
  it("stays consistent with normalizeTurkishText", () => {
    const input = "Çekmeköy Belediyesi";

    expect(slugifyTurkish(input)).toBe(normalizeTurkishText(input).slug);
    expect(slugifyTurkish(input)).toBe("cekmekoy-belediyesi");
  });
});
