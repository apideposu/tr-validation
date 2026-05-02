import { describe, expect, it } from "vitest";

import { validateMersis } from "../src/index";

describe("validateMersis", () => {
  it("accepts a valid 16-digit MERSIS with a valid embedded VKN", () => {
    const result = validateMersis("7340334753000001");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("7340334753000001");
    expect(result.embeddedVkn).toBe("7340334753");
    expect(result.serial).toBe("000001");
    expect(result.reasons).toEqual([]);
  });

  it("accepts dotted and dashed input", () => {
    const result = validateMersis("7340-3347-5300-0001");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("7340334753000001");
  });

  it("rejects MERSIS whose embedded VKN fails the checksum", () => {
    const result = validateMersis("7340334754000001");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_EMBEDDED_VKN");
    expect(result.embeddedVkn).toBe("7340334754");
    expect(result.serial).toBe("000001");
  });

  it("rejects invalid length (too short)", () => {
    const result = validateMersis("7340334753");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_LENGTH");
  });

  it("rejects invalid length (too long)", () => {
    const result = validateMersis("73403347530000010");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_LENGTH");
  });

  it("rejects empty input", () => {
    const result = validateMersis("");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });

  it("rejects unsupported characters", () => {
    const result = validateMersis("MERSIS:7340334753000001");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("UNSUPPORTED_CHARACTERS");
  });

  it("preserves localOnly invariant", () => {
    const result = validateMersis("7340334753000001");

    expect(result.localOnly).toBe(true);
    expect(result.officialVerification).toBe(false);
    expect(result.registryLookup).toBe(false);
  });
});
