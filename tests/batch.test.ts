import { describe, expect, it } from "vitest";

import { validateBatch, type ValidateBatchItem } from "../src/index";

describe("validateBatch", () => {
  it("dispatches mixed items, preserves order, and mirrors ok at the top level", () => {
    const items = [
      { id: "tckn-1", type: "tckn", value: "10000000146" },
      { id: "iban-1", type: "iban", value: "TR62 0001 0012 3456 7890 1234 56" },
      { id: "card-1", type: "creditCard", value: "4111 1111 1111 1111" },
      { id: "number-1", type: "turkishNumber", value: "1.234,56" },
    ] as const satisfies readonly ValidateBatchItem[];

    const results = validateBatch(items);

    expect(results).toHaveLength(4);
    expect(results.map((entry) => entry.index)).toEqual([0, 1, 2, 3]);
    expect(results.map((entry) => entry.id)).toEqual([
      "tckn-1",
      "iban-1",
      "card-1",
      "number-1",
    ]);
    expect(results.map((entry) => entry.type)).toEqual([
      "tckn",
      "iban",
      "creditCard",
      "turkishNumber",
    ]);
    expect(results.every((entry) => entry.ok === entry.result.ok)).toBe(true);

    expect(results[0].result.ok).toBe(true);
    expect(results[0].result.normalized).toBe("10000000146");

    expect(results[1].result.ok).toBe(true);
    expect(results[1].result.normalized).toBe("TR620001001234567890123456");

    expect(results[2].result.ok).toBe(true);
    expect(results[2].result.scheme).toBe("visa");

    expect(results[3].result.ok).toBe(true);
    expect(results[3].result.value).toBe(1234.56);
    expect(results[3].result.detectedLocale).toBe("tr");
  });

  it("passes item-specific options through to district normalization", () => {
    const results = validateBatch([
      {
        id: "district-ankara",
        type: "district",
        value: "Golbasi",
        options: { province: "06" },
      },
      {
        id: "district-adiyaman",
        type: "district",
        value: "Golbasi",
        options: { province: "02" },
      },
    ] as const satisfies readonly ValidateBatchItem[]);

    expect(results[0].ok).toBe(true);
    expect(results[0].result.province?.code).toBe("06");
    expect(results[0].result.district?.normalized).toBe("golbasi");

    expect(results[1].ok).toBe(true);
    expect(results[1].result.province?.code).toBe("02");
    expect(results[1].result.district?.normalized).toBe("golbasi");
  });

  it("keeps invalid results intact for bulk import-style flows", () => {
    const results = validateBatch([
      { type: "vkn", value: "VKN" },
      { type: "barcode", value: "123" },
      { type: "turkishCurrency", value: "ABC 12" },
      { type: "phone", value: "+49 30 123456" },
    ] as const satisfies readonly ValidateBatchItem[]);

    expect(results.map((entry) => entry.ok)).toEqual([false, false, false, false]);

    expect(results[0].result.reasons).toEqual(["UNSUPPORTED_CHARACTERS", "EMPTY_INPUT"]);
    expect(results[1].result.reasons).toContain("UNSUPPORTED_BARCODE_TYPE");
    expect(results[2].result.reasons).toContain("UNKNOWN_CURRENCY");
    expect(results[3].result.reasons).toEqual(["NON_TR_PHONE"]);
  });
});
