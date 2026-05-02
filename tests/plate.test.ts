import { describe, expect, it } from "vitest";

import { validatePlate } from "../src/index";

describe("validatePlate", () => {
  it("accepts a 1-letter / 4-digit plate (34 A 1234)", () => {
    const result = validatePlate("34 A 1234");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("34A1234");
    expect(result.formatted).toBe("34 A 1234");
    expect(result.letters).toBe("A");
    expect(result.digits).toBe("1234");
    expect(result.province?.code).toBe("34");
    expect(result.province?.name).toBe("İstanbul");
    expect(result.reasons).toEqual([]);
  });

  it("accepts a 2-letter / 3-digit plate (06 AB 123)", () => {
    const result = validatePlate("06 AB 123");

    expect(result.ok).toBe(true);
    expect(result.formatted).toBe("06 AB 123");
    expect(result.province?.code).toBe("06");
  });

  it("accepts a 2-letter / 4-digit plate (35 BC 1234)", () => {
    const result = validatePlate("35 BC 1234");

    expect(result.ok).toBe(true);
    expect(result.letters).toBe("BC");
    expect(result.digits).toBe("1234");
  });

  it("accepts a 3-letter / 2-digit plate (01 ABC 12)", () => {
    const result = validatePlate("01 ABC 12");

    expect(result.ok).toBe(true);
    expect(result.formatted).toBe("01 ABC 12");
  });

  it("accepts a 3-letter / 3-digit plate (81 XYZ 999) but rejects forbidden letter", () => {
    const result = validatePlate("81 XYZ 999");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_LETTER_BLOCK");
  });

  it("accepts lowercase input and normalizes to uppercase", () => {
    const result = validatePlate("34abc123");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("34ABC123");
  });

  it("accepts hyphen and dot separators", () => {
    const result = validatePlate("34-A-1234");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("34A1234");
  });

  it("rejects an out-of-range province code", () => {
    const result = validatePlate("99 A 1234");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_PROVINCE_CODE");
    expect(result.province).toBeNull();
  });

  it("rejects province code 00", () => {
    const result = validatePlate("00 A 1234");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_PROVINCE_CODE");
  });

  it("rejects forbidden letters Q/W/X", () => {
    const q = validatePlate("34 Q 1234");
    const w = validatePlate("34 W 1234");
    const x = validatePlate("34 X 1234");

    expect(q.ok).toBe(false);
    expect(w.ok).toBe(false);
    expect(x.ok).toBe(false);
    expect(q.reasons).toContain("INVALID_LETTER_BLOCK");
  });

  it("rejects 1-letter plates with fewer than 4 digits", () => {
    const result = validatePlate("34 A 123");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_DIGIT_BLOCK");
  });

  it("rejects 3-letter plates with 4 digits", () => {
    const result = validatePlate("34 ABC 1234");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_LENGTH");
  });

  it("rejects empty input", () => {
    const result = validatePlate("");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });

  it("rejects unsupported characters", () => {
    const result = validatePlate("34*A*1234");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("UNSUPPORTED_CHARACTERS");
  });

  it("rejects plates that are too short", () => {
    const result = validatePlate("3A1");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_LENGTH");
  });

  it("rejects plates that are too long", () => {
    const result = validatePlate("345 ABCD 1234");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_LENGTH");
  });

  it("rejects plates with reversed structure (letters first)", () => {
    const result = validatePlate("AB 34 123");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_FORMAT");
  });

  it("preserves localOnly invariant", () => {
    const result = validatePlate("34 A 1234");

    expect(result.localOnly).toBe(true);
    expect(result.officialVerification).toBe(false);
    expect(result.registryLookup).toBe(false);
  });
});
