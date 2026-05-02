import { describe, expect, it } from "vitest";

import { titleCaseTurkish } from "../src/index";

describe("titleCaseTurkish", () => {
  it("title-cases a simple Turkish phrase", () => {
    expect(titleCaseTurkish("istanbul büyükşehir belediyesi")).toBe(
      "İstanbul Büyükşehir Belediyesi",
    );
  });

  it("uppercases lowercase i to dotted İ", () => {
    expect(titleCaseTurkish("ipek yolu")).toBe("İpek Yolu");
  });

  it("lowercases dotless I to dotless ı when not at word start", () => {
    expect(titleCaseTurkish("KIRMIZI BALIK")).toBe("Kırmızı Balık");
  });

  it("preserves apostrophe-suffixed words as a single word", () => {
    expect(titleCaseTurkish("mehmet'in evi")).toBe("Mehmet'in Evi");
  });

  it("treats hyphen as a word separator", () => {
    expect(titleCaseTurkish("kuzey-güney aksı")).toBe("Kuzey-Güney Aksı");
  });

  it("treats slash as a word separator", () => {
    expect(titleCaseTurkish("istanbul/kadıköy")).toBe("İstanbul/Kadıköy");
  });

  it("collapses multiple spaces but preserves them", () => {
    expect(titleCaseTurkish("ankara   çankaya")).toBe("Ankara   Çankaya");
  });

  it("handles empty input", () => {
    expect(titleCaseTurkish("")).toBe("");
  });

  it("handles already-uppercase input", () => {
    expect(titleCaseTurkish("İSTANBUL")).toBe("İstanbul");
  });

  it("handles mixed input with diacritics", () => {
    expect(titleCaseTurkish("ÇANAKKALE şehitleri")).toBe("Çanakkale Şehitleri");
  });
});
