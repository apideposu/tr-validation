import { describe, expect, it } from "vitest";

import { parseTurkishCurrency } from "../src/index";

describe("parseTurkishCurrency", () => {
  it("parses ₺ prefix with Turkish formatting", () => {
    const result = parseTurkishCurrency("₺1.234,56");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(1234.56);
    expect(result.currency).toBe("TRY");
  });

  it("parses TL suffix with Turkish formatting", () => {
    const result = parseTurkishCurrency("1.234,56 TL");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(1234.56);
    expect(result.currency).toBe("TRY");
    expect(result.currencyToken).toBe("TL");
  });

  it("parses TRY ISO code", () => {
    const result = parseTurkishCurrency("TRY 99,90");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(99.9);
    expect(result.currency).toBe("TRY");
  });

  it("parses USD with English formatting", () => {
    const result = parseTurkishCurrency("$1,234.56");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(1234.56);
    expect(result.currency).toBe("USD");
    expect(result.detectedLocale).toBe("en");
  });

  it("parses EUR suffix", () => {
    const result = parseTurkishCurrency("250,00 EUR");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(250);
    expect(result.currency).toBe("EUR");
  });

  it("parses without any currency token (number-only)", () => {
    const result = parseTurkishCurrency("1.234,56");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(1234.56);
    expect(result.currency).toBeNull();
  });

  it("flags unknown ISO code but keeps ok=false", () => {
    const result = parseTurkishCurrency("100,00 XYZ");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("UNKNOWN_CURRENCY");
    expect(result.currency).toBeNull();
    expect(result.currencyToken).toBe("XYZ");
  });

  it("rejects multiple currency tokens", () => {
    const result = parseTurkishCurrency("$100 USD");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_CURRENCY_FORMAT");
  });

  it("rejects invalid number portion", () => {
    const result = parseTurkishCurrency("₺abc");

    expect(result.ok).toBe(false);
  });

  it("rejects empty input", () => {
    const result = parseTurkishCurrency("");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });

  it("preserves localOnly invariant", () => {
    const result = parseTurkishCurrency("₺99,90");

    expect(result.localOnly).toBe(true);
    expect(result.officialVerification).toBe(false);
    expect(result.registryLookup).toBe(false);
  });

  it("uses format_parse mode", () => {
    const result = parseTurkishCurrency("₺99,90");

    expect(result.mode).toBe("format_parse");
  });
});
