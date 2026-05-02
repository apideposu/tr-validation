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

  it("accepts the full supported separator set", () => {
    const result = validateVkn("734/033_4753");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("7340334753");
    expect(result.reasons).toEqual([]);
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

  it("keeps unsupported-character and repeated-digit reasons together when both apply", () => {
    const result = validateVkn("VKN1111111111");

    expect(result.ok).toBe(false);
    expect(result.normalized).toBe("1111111111");
    expect(result.reasons).toEqual(["UNSUPPORTED_CHARACTERS", "REPEATED_DIGITS"]);
  });

  it("marks empty input explicitly", () => {
    const result = validateVkn("");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });

  it("keeps unsupported-character reason when normalization removes everything", () => {
    const result = validateVkn("VKN");

    expect(result.ok).toBe(false);
    expect(result.normalized).toBe("");
    expect(result.reasons).toEqual(["UNSUPPORTED_CHARACTERS", "EMPTY_INPUT"]);
  });
});
