import { describe, expect, it } from "vitest";

import { validateBarcode } from "../src/index";

describe("validateBarcode", () => {
  it("accepts a valid EAN-13", () => {
    const result = validateBarcode("5901234123457");

    expect(result.ok).toBe(true);
    expect(result.type).toBe("EAN_13");
    expect(result.normalized).toBe("5901234123457");
    expect(result.gs1Prefix).toBe("590");
    expect(result.isTurkishGs1Prefix).toBe(false);
    expect(result.reasons).toEqual([]);
  });

  it("flags Turkish GS1 prefix 869", () => {
    const result = validateBarcode("8690504000020");

    expect(result.ok).toBe(true);
    expect(result.type).toBe("EAN_13");
    expect(result.gs1Prefix).toBe("869");
    expect(result.isTurkishGs1Prefix).toBe(true);
  });

  it("accepts a valid EAN-8", () => {
    const result = validateBarcode("96385074");

    expect(result.ok).toBe(true);
    expect(result.type).toBe("EAN_8");
    expect(result.gs1Prefix).toBeNull();
    expect(result.isTurkishGs1Prefix).toBe(false);
  });

  it("accepts hyphen and whitespace separators", () => {
    const result = validateBarcode("590-1234-123457");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("5901234123457");
  });

  it("rejects an EAN-13 with invalid checksum", () => {
    const result = validateBarcode("5901234123458");

    expect(result.ok).toBe(false);
    expect(result.type).toBe("EAN_13");
    expect(result.reasons).toContain("INVALID_CHECKSUM");
    expect(result.gs1Prefix).toBeNull();
  });

  it("rejects an EAN-8 with invalid checksum", () => {
    const result = validateBarcode("96385075");

    expect(result.ok).toBe(false);
    expect(result.type).toBe("EAN_8");
    expect(result.reasons).toContain("INVALID_CHECKSUM");
  });

  it("rejects unsupported barcode lengths (e.g. 12 digits)", () => {
    const result = validateBarcode("012345678905");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("UNSUPPORTED_BARCODE_TYPE");
    expect(result.type).toBeNull();
  });

  it("rejects empty input", () => {
    const result = validateBarcode("");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });

  it("rejects unsupported characters", () => {
    const result = validateBarcode("ABC1234123457");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("UNSUPPORTED_CHARACTERS");
  });

  it("preserves localOnly invariant", () => {
    const result = validateBarcode("5901234123457");

    expect(result.localOnly).toBe(true);
    expect(result.officialVerification).toBe(false);
    expect(result.registryLookup).toBe(false);
  });
});
