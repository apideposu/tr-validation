import { describe, expect, it } from "vitest";

import { validateVkn } from "../src/index";

describe("validateVkn", () => {
  it("accepts a valid VKN", () => {
    const result = validateVkn("7340334753");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("7340334753");
    expect(result.reasons).toEqual([]);
  });

  it("accepts dotted input", () => {
    const result = validateVkn("734.033.4753");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("7340334753");
  });

  it("rejects repeated digits", () => {
    const result = validateVkn("1111111111");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("REPEATED_DIGITS");
  });

  it("rejects invalid checksum", () => {
    const result = validateVkn("7340334754");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["INVALID_CHECKSUM"]);
  });

  it("rejects invalid length", () => {
    const result = validateVkn("12345");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["INVALID_LENGTH"]);
  });

  it("rejects unsupported characters", () => {
    const result = validateVkn("VKN#7340334753");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("UNSUPPORTED_CHARACTERS");
  });

  it("marks empty input explicitly", () => {
    const result = validateVkn("");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });
});
