import { describe, expect, it } from "vitest";

import { validateTckn } from "../src/index";

describe("validateTckn", () => {
  it("accepts a valid TCKN", () => {
    const result = validateTckn("10000000146");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("10000000146");
    expect(result.reasons).toEqual([]);
    expect(result.localOnly).toBe(true);
    expect(result.officialVerification).toBe(false);
    expect(result.registryLookup).toBe(false);
  });

  it("accepts common separators and whitespace", () => {
    const result = validateTckn("100 000 001-46");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("10000000146");
  });

  it("rejects values with leading zero", () => {
    const result = validateTckn("01234567890");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("LEADING_ZERO");
  });

  it("rejects repeated digits", () => {
    const result = validateTckn("11111111111");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("REPEATED_DIGITS");
  });

  it("rejects invalid checksum", () => {
    const result = validateTckn("10000000145");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["INVALID_CHECKSUM"]);
  });

  it("rejects invalid length", () => {
    const result = validateTckn("12345");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["INVALID_LENGTH"]);
  });

  it("rejects unsupported characters", () => {
    const result = validateTckn("TCKN:10000000146");

    expect(result.ok).toBe(false);
    expect(result.normalized).toBe("10000000146");
    expect(result.reasons).toContain("UNSUPPORTED_CHARACTERS");
  });

  it("marks empty input explicitly", () => {
    const result = validateTckn("   ");

    expect(result.ok).toBe(false);
    expect(result.normalized).toBe("");
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });
});
