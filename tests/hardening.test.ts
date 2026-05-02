import { describe, expect, it } from "vitest";

import {
  getDistrictsByProvince,
  getProvinces,
  normalizeDistrict,
  normalizePhone,
  normalizeProvince,
  validateIban,
  validateTckn,
  validateVkn,
} from "../src/index";

type BaseValidationResult = {
  ok: boolean;
  input: string;
  normalized: string;
  reasons: string[];
  mode: "structural_validation" | "number_plan_parse" | "static_dataset";
  localOnly: true;
  officialVerification: false;
  registryLookup: false;
};

function expectValidationContract(
  result: BaseValidationResult,
  expected: { input: string; mode: BaseValidationResult["mode"] },
): void {
  expect(result.input).toBe(expected.input);
  expect(result.mode).toBe(expected.mode);
  expect(result.localOnly).toBe(true);
  expect(result.officialVerification).toBe(false);
  expect(result.registryLookup).toBe(false);
}

function expectUniqueReasons(reasons: string[]): void {
  expect(new Set(reasons).size).toBe(reasons.length);
}

describe("0.2.x hardening", () => {
  it("keeps the shared contract stable for structural validators", () => {
    const tckn = validateTckn("10000000146");
    const vkn = validateVkn("7340334753");
    const iban = validateIban("TR62 0001 0012 3456 7890 1234 56");

    expectValidationContract(tckn, {
      input: "10000000146",
      mode: "structural_validation",
    });
    expectValidationContract(vkn, {
      input: "7340334753",
      mode: "structural_validation",
    });
    expectValidationContract(iban, {
      input: "TR62 0001 0012 3456 7890 1234 56",
      mode: "structural_validation",
    });

    expect(iban.country).toBe("TR");
    expect(iban.formatted).toBe("TR62 0001 0012 3456 7890 1234 56");
  });

  it("keeps the shared contract stable for phone and location helpers", () => {
    const phone = normalizePhone("0532 123 45 67");
    const province = normalizeProvince("34");
    const district = normalizeDistrict("Kad\u0131k\u00f6y", { province: "34" });

    expectValidationContract(phone, {
      input: "0532 123 45 67",
      mode: "number_plan_parse",
    });
    expectValidationContract(province, {
      input: "34",
      mode: "static_dataset",
    });
    expectValidationContract(district, {
      input: "Kad\u0131k\u00f6y",
      mode: "static_dataset",
    });

    expect(phone.country).toBe("TR");
    expect(province.province?.code).toBe("34");
    expect(district.province?.code).toBe("34");
  });

  it("dedupes reason codes for multi-failure inputs", () => {
    const iban = validateIban("TR!!");
    const tckn = validateTckn("TCKN");
    const vkn = validateVkn("VKN");

    expectUniqueReasons(iban.reasons);
    expectUniqueReasons(tckn.reasons);
    expectUniqueReasons(vkn.reasons);

    expect(iban.reasons).toEqual(["UNSUPPORTED_CHARACTERS", "INVALID_LENGTH"]);
    expect(tckn.reasons).toEqual(["UNSUPPORTED_CHARACTERS", "EMPTY_INPUT"]);
    expect(vkn.reasons).toEqual(["UNSUPPORTED_CHARACTERS", "EMPTY_INPUT"]);
  });

  it("preserves normalized candidate data for invalid phones", () => {
    const malformed = normalizePhone("abc123");
    const foreign = normalizePhone("+49 30 123456");
    const empty = normalizePhone("   ");

    expectValidationContract(malformed, {
      input: "abc123",
      mode: "number_plan_parse",
    });
    expectValidationContract(foreign, {
      input: "+49 30 123456",
      mode: "number_plan_parse",
    });
    expectValidationContract(empty, {
      input: "   ",
      mode: "number_plan_parse",
    });

    expect(malformed.normalized).toBe("123");
    expect(malformed.e164).toBeNull();
    expect(malformed.country).toBeNull();
    expect(malformed.type).toBe("unknown");
    expect(malformed.reasons).toEqual(["INVALID_PHONE"]);

    expect(foreign.normalized).toBe("+4930123456");
    expect(foreign.e164).toBeNull();
    expect(foreign.country).toBeNull();
    expect(foreign.possibleOriginalOperator).toBeNull();
    expect(foreign.reasons).toEqual(["NON_TR_PHONE"]);

    expect(empty.normalized).toBe("");
    expect(empty.reasons).toEqual(["EMPTY_INPUT"]);
  });

  it("supports single-digit province codes and normalized province context", () => {
    const province = normalizeProvince("6");
    const districtByName = normalizeDistrict("Kad\u0131k\u00f6y", {
      province: "Istanbul",
    });
    const districtBySlug = normalizeDistrict("Kad\u0131k\u00f6y", {
      province: "istanbul",
    });

    expect(province.ok).toBe(true);
    expect(province.normalized).toBe("ankara");
    expect(province.province?.code).toBe("06");

    expect(districtByName.ok).toBe(true);
    expect(districtByName.normalized).toBe("kadikoy");
    expect(districtByName.province?.code).toBe("34");

    expect(districtBySlug.ok).toBe(true);
    expect(districtBySlug.normalized).toBe("kadikoy");
    expect(districtBySlug.province?.code).toBe("34");
  });

  it("returns fresh province and district records on each call", () => {
    const provinces = getProvinces();
    const districts = getDistrictsByProvince("34");

    expect(provinces).toHaveLength(81);
    expect(districts.length).toBeGreaterThan(0);

    provinces[0]!.name = "mutated";
    provinces[0]!.phoneAreaCodes.push("999");
    districts[0]!.name = "mutated";

    const nextProvinces = getProvinces();
    const nextDistricts = getDistrictsByProvince("34");

    expect(nextProvinces[0]!.name).not.toBe("mutated");
    expect(nextProvinces[0]!.phoneAreaCodes).not.toContain("999");
    expect(nextDistricts[0]!.name).not.toBe("mutated");
  });

  it("marks empty location input explicitly", () => {
    const province = normalizeProvince("   ");
    const district = normalizeDistrict("   ");

    expectValidationContract(province, {
      input: "   ",
      mode: "static_dataset",
    });
    expectValidationContract(district, {
      input: "   ",
      mode: "static_dataset",
    });

    expect(province.reasons).toEqual(["EMPTY_INPUT"]);
    expect(province.province).toBeNull();

    expect(district.reasons).toEqual(["EMPTY_INPUT"]);
    expect(district.province).toBeNull();
    expect(district.district).toBeNull();
  });
});
