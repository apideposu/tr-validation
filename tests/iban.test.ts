import { describe, expect, it } from "vitest";

import { formatIban, validateIban } from "../src/index";

describe("validateIban", () => {
  it("accepts a valid Turkish IBAN with lowercase and separators", () => {
    const result = validateIban("tr62-0001-0012-3456-7890-1234-56");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("TR620001001234567890123456");
    expect(result.country).toBe("TR");
    expect(result.formatted).toBe("TR62 0001 0012 3456 7890 1234 56");
    expect(result.reasons).toEqual([]);
  });

  it("rejects invalid checksum", () => {
    const result = validateIban("TR620001001234567890123457");

    expect(result.ok).toBe(false);
    expect(result.country).toBe("TR");
    expect(result.formatted).toBeNull();
    expect(result.reasons).toEqual(["INVALID_CHECKSUM"]);
  });

  it("rejects non-TR IBAN values", () => {
    const result = validateIban("GB82WEST12345698765432");

    expect(result.ok).toBe(false);
    expect(result.country).toBeNull();
    expect(result.formatted).toBeNull();
    expect(result.reasons).toContain("NON_TR_IBAN");
  });

  it("rejects unsupported characters", () => {
    const result = validateIban("TR62 0001 0012 3456 7890 1234 5!");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("UNSUPPORTED_CHARACTERS");
  });

  it("marks empty input explicitly", () => {
    const result = validateIban("   ");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });
});

describe("formatIban", () => {
  it("formats normalized IBAN values in 4-character groups", () => {
    expect(formatIban("tr620001001234567890123456")).toBe("TR62 0001 0012 3456 7890 1234 56");
  });
});
