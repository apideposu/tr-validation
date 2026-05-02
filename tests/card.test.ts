import { describe, expect, it } from "vitest";

import { validateCreditCard } from "../src/index";

describe("validateCreditCard", () => {
  it("accepts a valid Visa test PAN", () => {
    const result = validateCreditCard("4111 1111 1111 1111");

    expect(result.ok).toBe(true);
    expect(result.scheme).toBe("visa");
    expect(result.normalized).toBe("4111111111111111");
    expect(result.bin).toBe("411111");
    expect(result.last4).toBe("1111");
    expect(result.reasons).toEqual([]);
  });

  it("accepts a valid Mastercard test PAN", () => {
    const result = validateCreditCard("5555 5555 5555 4444");

    expect(result.ok).toBe(true);
    expect(result.scheme).toBe("mastercard");
  });

  it("accepts a Mastercard 2-series test PAN", () => {
    const result = validateCreditCard("2223 0031 2200 3222");

    expect(result.ok).toBe(true);
    expect(result.scheme).toBe("mastercard");
  });

  it("accepts a valid Amex test PAN", () => {
    const result = validateCreditCard("3782 822463 10005");

    expect(result.ok).toBe(true);
    expect(result.scheme).toBe("amex");
    expect(result.normalized.length).toBe(15);
  });

  it("accepts a valid Troy test PAN (9792 prefix)", () => {
    const result = validateCreditCard("9792 0000 0000 0001");

    expect(result.scheme).toBe("troy");
  });

  it("accepts a valid JCB test PAN", () => {
    const result = validateCreditCard("3530 1113 3330 0000");

    expect(result.ok).toBe(true);
    expect(result.scheme).toBe("jcb");
  });

  it("accepts a valid Diners test PAN", () => {
    const result = validateCreditCard("3056 9300 0902 0004");

    expect(result.ok).toBe(true);
    expect(result.scheme).toBe("diners");
  });

  it("accepts hyphenated input", () => {
    const result = validateCreditCard("4111-1111-1111-1111");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("4111111111111111");
  });

  it("rejects an invalid Luhn checksum", () => {
    const result = validateCreditCard("4111 1111 1111 1112");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_CHECKSUM");
  });

  it("rejects too-short input", () => {
    const result = validateCreditCard("411111");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_LENGTH");
  });

  it("rejects too-long input", () => {
    const result = validateCreditCard("4111111111111111111111");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_LENGTH");
  });

  it("rejects empty input", () => {
    const result = validateCreditCard("");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });

  it("rejects unsupported characters", () => {
    const result = validateCreditCard("4111-ABCD-1111-1111");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("UNSUPPORTED_CHARACTERS");
  });

  it("flags unknown scheme but still computes Luhn", () => {
    const result = validateCreditCard("1234567890123452");

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("UNKNOWN_SCHEME");
  });

  it("rejects Visa with invalid length for the scheme", () => {
    const result = validateCreditCard("4111111111111");

    expect(result.scheme).toBe("visa");
    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("INVALID_CHECKSUM");
  });

  it("does not return bin or last4 when validation fails", () => {
    const result = validateCreditCard("4111 1111 1111 1112");

    expect(result.bin).toBeNull();
    expect(result.last4).toBeNull();
  });

  it("preserves localOnly invariant", () => {
    const result = validateCreditCard("4111 1111 1111 1111");

    expect(result.localOnly).toBe(true);
    expect(result.officialVerification).toBe(false);
    expect(result.registryLookup).toBe(false);
  });
});
