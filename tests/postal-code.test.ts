import { describe, expect, it } from "vitest";

import { validatePostalCode } from "../src/index";

describe("validatePostalCode", () => {
  it("accepts a valid Istanbul postal code", () => {
    const result = validatePostalCode("34710");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("34710");
    expect(result.province?.code).toBe("34");
    expect(result.province?.name).toBe("İstanbul");
    expect(result.reasons).toEqual([]);
  });

  it("accepts a leading-zero postal code (Adana 01000)", () => {
    const result = validatePostalCode("01000");

    expect(result.ok).toBe(true);
    expect(result.province?.code).toBe("01");
  });

  it("accepts a postal code with whitespace", () => {
    const result = validatePostalCode(" 06800 ");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("06800");
    expect(result.province?.code).toBe("06");
  });

  it("rejects a postal code whose first 2 digits are not a province", () => {
    const result = validatePostalCode("99000");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_PROVINCE_CODE");
    expect(result.province).toBeNull();
  });

  it("rejects 4-digit input", () => {
    const result = validatePostalCode("3471");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_LENGTH");
  });

  it("rejects 6-digit input", () => {
    const result = validatePostalCode("347100");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_LENGTH");
  });

  it("rejects empty input", () => {
    const result = validatePostalCode("");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });

  it("rejects unsupported characters", () => {
    const result = validatePostalCode("34A10");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("UNSUPPORTED_CHARACTERS");
  });

  it("preserves localOnly invariant", () => {
    const result = validatePostalCode("34710");

    expect(result.localOnly).toBe(true);
    expect(result.officialVerification).toBe(false);
    expect(result.registryLookup).toBe(false);
  });
});
