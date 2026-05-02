import { describe, expect, it } from "vitest";

import { parseTurkishNumber } from "../src/index";

describe("parseTurkishNumber", () => {
  it("parses Turkish-formatted decimal (1.234,56)", () => {
    const result = parseTurkishNumber("1.234,56");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(1234.56);
    expect(result.detectedLocale).toBe("tr");
  });

  it("parses English-formatted decimal (1,234.56)", () => {
    const result = parseTurkishNumber("1,234.56");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(1234.56);
    expect(result.detectedLocale).toBe("en");
  });

  it("parses plain integer", () => {
    const result = parseTurkishNumber("1234");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(1234);
  });

  it("parses Turkish multi-group thousands (1.234.567)", () => {
    const result = parseTurkishNumber("1.234.567");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(1234567);
    expect(result.detectedLocale).toBe("tr");
  });

  it("parses English multi-group thousands (1,234,567)", () => {
    const result = parseTurkishNumber("1,234,567");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(1234567);
    expect(result.detectedLocale).toBe("en");
  });

  it("parses Turkish decimal-only (1,5)", () => {
    const result = parseTurkishNumber("1,5");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(1.5);
    expect(result.detectedLocale).toBe("tr");
  });

  it("flags 1.234 as ambiguous (could be 1234 or 1.234)", () => {
    const result = parseTurkishNumber("1.234");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("AMBIGUOUS_GROUPING");
    expect(result.value).toBeNull();
  });

  it("treats 12.34 as English decimal", () => {
    const result = parseTurkishNumber("12.34");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(12.34);
    expect(result.detectedLocale).toBe("en");
  });

  it("parses negative numbers", () => {
    const result = parseTurkishNumber("-1.234,56");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(-1234.56);
  });

  it("parses positive sign", () => {
    const result = parseTurkishNumber("+42,5");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(42.5);
  });

  it("tolerates whitespace as thousand separator", () => {
    const result = parseTurkishNumber("1 234,56");

    expect(result.ok).toBe(true);
    expect(result.value).toBe(1234.56);
  });

  it("rejects invalid grouping in Turkish format (1.23,45)", () => {
    const result = parseTurkishNumber("1.23,45");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_NUMBER_FORMAT");
  });

  it("rejects empty input", () => {
    const result = parseTurkishNumber("");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });

  it("rejects unsupported characters", () => {
    const result = parseTurkishNumber("1.234abc");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("UNSUPPORTED_CHARACTERS");
  });

  it("rejects multiple decimal markers in one locale", () => {
    const result = parseTurkishNumber("1,234,56,78");

    expect(result.ok).toBe(false);
  });

  it("uses format_parse mode", () => {
    const result = parseTurkishNumber("1,5");

    expect(result.mode).toBe("format_parse");
    expect(result.localOnly).toBe(true);
  });
});
