import { describe, expect, it } from "vitest";

import { listTrBanks, resolveIbanBank } from "../src/index";

describe("resolveIbanBank", () => {
  it("resolves a Ziraat bank from a valid TR IBAN", () => {
    const result = resolveIbanBank("TR620001001234567890123456");

    expect(result.ok).toBe(true);
    expect(result.ibanValid).toBe(true);
    expect(result.bankCode).toBe("00010");
    expect(result.bank?.name).toBe("T.C. Ziraat Bankası A.Ş.");
    expect(result.bank?.type).toBe("bank");
  });

  it("accepts formatted input", () => {
    const result = resolveIbanBank("tr62 0001 0012 3456 7890 1234 56");

    expect(result.ok).toBe(true);
    expect(result.bank?.code).toBe("00010");
  });

  it("returns ibanValid=false for an invalid IBAN", () => {
    const result = resolveIbanBank("TR620001001234567890123457");

    expect(result.ok).toBe(false);
    expect(result.ibanValid).toBe(false);
    expect(result.bankCode).toBeNull();
    expect(result.bank).toBeNull();
  });

});

describe("listTrBanks", () => {
  it("returns the bundled bank list as a defensive copy", () => {
    const first = listTrBanks();
    const second = listTrBanks();

    expect(first.length).toBeGreaterThan(20);
    expect(first).not.toBe(second);
    expect(first[0]).not.toBe(second[0]);
  });

  it("contains the central bank", () => {
    const banks = listTrBanks();
    const central = banks.find((bank) => bank.type === "central_bank");

    expect(central).toBeDefined();
    expect(central?.code).toBe("00001");
  });
});
