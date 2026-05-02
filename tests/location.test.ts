import { describe, expect, it } from "vitest";

import {
  getDistrictsByProvince,
  getProvinces,
  normalizeDistrict,
  normalizeProvince,
} from "../src/index";

describe("getProvinces", () => {
  it("returns the bundled province list", () => {
    const provinces = getProvinces();
    const istanbul = provinces.find((province) => province.code === "34");

    expect(provinces).toHaveLength(81);
    expect(istanbul?.name).toBe("İstanbul");
    expect(istanbul?.districtCount).toBeGreaterThan(0);
  });
});

describe("getDistrictsByProvince", () => {
  it("returns districts by plate code or normalized province slug", () => {
    const byCode = getDistrictsByProvince("34");
    const bySlug = getDistrictsByProvince("istanbul");

    expect(byCode.some((district) => district.normalized === "kadikoy")).toBe(true);
    expect(bySlug.some((district) => district.normalized === "kadikoy")).toBe(true);
  });

  it("returns an empty array for unknown provinces", () => {
    expect(getDistrictsByProvince("99")).toEqual([]);
  });
});

describe("normalizeProvince", () => {
  it("normalizes provinces by name and code", () => {
    const byName = normalizeProvince("İstanbul");
    const byCode = normalizeProvince("34");

    expect(byName.ok).toBe(true);
    expect(byName.normalized).toBe("istanbul");
    expect(byName.province?.code).toBe("34");

    expect(byCode.ok).toBe(true);
    expect(byCode.normalized).toBe("istanbul");
    expect(byCode.province?.name).toBe("İstanbul");
  });

  it("returns a clear reason for unknown provinces", () => {
    const result = normalizeProvince("Bilinmeyen");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["PROVINCE_NOT_FOUND"]);
  });
});

describe("normalizeDistrict", () => {
  it("normalizes a district with explicit province context", () => {
    const result = normalizeDistrict("Kadıköy", { province: "34" });

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("kadikoy");
    expect(result.province?.code).toBe("34");
    expect(result.district?.name).toBe("Kadıköy");
  });

  it("normalizes a unique district without province context", () => {
    const result = normalizeDistrict("Çankaya");

    expect(result.ok).toBe(true);
    expect(result.province?.code).toBe("06");
    expect(result.district?.normalized).toBe("cankaya");
  });

  it("detects ambiguous district names", () => {
    const result = normalizeDistrict("Merkez");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["AMBIGUOUS_DISTRICT"]);
  });

  it("reports province and district lookup errors clearly", () => {
    const invalidProvince = normalizeDistrict("Kadıköy", { province: "99" });
    const invalidDistrict = normalizeDistrict("Bilinmeyen", { province: "34" });

    expect(invalidProvince.ok).toBe(false);
    expect(invalidProvince.reasons).toEqual(["PROVINCE_NOT_FOUND"]);

    expect(invalidDistrict.ok).toBe(false);
    expect(invalidDistrict.reasons).toEqual(["DISTRICT_NOT_FOUND"]);
  });
});
