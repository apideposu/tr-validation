import { describe, expect, it } from "vitest";

import { normalizePhone } from "../src/index";

describe("normalizePhone", () => {
  it("normalizes a valid Turkish mobile number", () => {
    const result = normalizePhone("0532 123 45 67");

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("+905321234567");
    expect(result.e164).toBe("+905321234567");
    expect(result.national).toBe("0532 123 45 67");
    expect(result.country).toBe("TR");
    expect(result.type).toBe("mobile");
    expect(result.possibleOriginalOperator).toBe("Turkcell");
    expect(result.operatorConfidence).toBe("prefix_based");
    expect(result.reasons).toEqual([]);
  });

  it("accepts Turkish numbers without the leading zero", () => {
    const result = normalizePhone("5321234567");

    expect(result.ok).toBe(true);
    expect(result.e164).toBe("+905321234567");
  });

  it("recognizes fixed line and toll-free numbers", () => {
    const fixedLine = normalizePhone("+90 212 555 12 12");
    const tollFree = normalizePhone("0800 123 45 67");

    expect(fixedLine.ok).toBe(true);
    expect(fixedLine.type).toBe("fixed_line");
    expect(fixedLine.possibleOriginalOperator).toBeNull();

    expect(tollFree.ok).toBe(true);
    expect(tollFree.type).toBe("toll_free");
  });

  it("keeps extension information when available", () => {
    const result = normalizePhone("+90 532 123 45 67 ext. 9");

    expect(result.ok).toBe(true);
    expect(result.extension).toBe("9");
  });

  it("rejects foreign numbers as non-TR", () => {
    const result = normalizePhone("+49 30 123456");

    expect(result.ok).toBe(false);
    expect(result.e164).toBeNull();
    expect(result.reasons).toEqual(["NON_TR_PHONE"]);
  });

  it("rejects malformed numbers", () => {
    const result = normalizePhone("abc123");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["INVALID_PHONE"]);
  });

  it("marks empty input explicitly", () => {
    const result = normalizePhone("   ");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["EMPTY_INPUT"]);
  });
});
