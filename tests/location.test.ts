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
    expect(istanbul?.name).toBe("\u0130stanbul");
    expect(istanbul?.districtCount).toBeGreaterThan(0);
  });
});

describe("getDistrictsByProvince", () => {
  it("returns districts by plate code, slug, or province name", () => {
    const byCode = getDistrictsByProvince("34");
    const bySlug = getDistrictsByProvince("istanbul");
    const byNameWithWhitespace = getDistrictsByProvince("  \u0130stanbul  ");

    expect(byCode.some((district) => district.normalized === "kadikoy")).toBe(true);
    expect(bySlug.some((district) => district.normalized === "kadikoy")).toBe(true);
    expect(byNameWithWhitespace.some((district) => district.normalized === "kadikoy")).toBe(
      true,
    );
  });

  it("returns an empty array for unknown provinces", () => {
    expect(getDistrictsByProvince("99")).toEqual([]);
  });
});

describe("normalizeProvince", () => {
  it("normalizes provinces by name, code, and ASCII alias", () => {
    const byName = normalizeProvince("\u0130stanbul");
    const byCode = normalizeProvince("34");
    const byAsciiAlias = normalizeProvince("Sanliurfa");

    expect(byName.ok).toBe(true);
    expect(byName.normalized).toBe("istanbul");
    expect(byName.province?.code).toBe("34");

    expect(byCode.ok).toBe(true);
    expect(byCode.normalized).toBe("istanbul");
    expect(byCode.province?.name).toBe("\u0130stanbul");

    expect(byAsciiAlias.ok).toBe(true);
    expect(byAsciiAlias.normalized).toBe("sanliurfa");
    expect(byAsciiAlias.province?.code).toBe("63");
  });

  it("returns a clear reason for unknown provinces", () => {
    const result = normalizeProvince("Bilinmeyen");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["PROVINCE_NOT_FOUND"]);
  });
});

describe("normalizeDistrict", () => {
  it("normalizes a district with explicit province context", () => {
    const result = normalizeDistrict("Kad\u0131k\u00f6y", { province: "34" });

    expect(result.ok).toBe(true);
    expect(result.normalized).toBe("kadikoy");
    expect(result.province?.code).toBe("34");
    expect(result.district?.name).toBe("Kad\u0131k\u00f6y");
  });

  it("accepts province context as a name or slug with whitespace", () => {
    const byName = normalizeDistrict("Kadikoy", { province: "  Istanbul  " });
    const bySlug = normalizeDistrict("Kadikoy", { province: "istanbul" });

    expect(byName.ok).toBe(true);
    expect(byName.province?.code).toBe("34");
    expect(byName.district?.normalized).toBe("kadikoy");

    expect(bySlug.ok).toBe(true);
    expect(bySlug.province?.code).toBe("34");
    expect(bySlug.district?.normalized).toBe("kadikoy");
  });

  it("normalizes a unique district without province context", () => {
    const result = normalizeDistrict("\u00c7ankaya");

    expect(result.ok).toBe(true);
    expect(result.province?.code).toBe("06");
    expect(result.district?.normalized).toBe("cankaya");
  });

  it("detects ambiguous district names", () => {
    const result = normalizeDistrict("Merkez");

    expect(result.ok).toBe(false);
    expect(result.reasons).toEqual(["AMBIGUOUS_DISTRICT"]);
  });

  it("can disambiguate an otherwise ambiguous district with province context", () => {
    const ankara = normalizeDistrict("Golbasi", { province: "06" });
    const adiyaman = normalizeDistrict("Golbasi", { province: "02" });

    expect(ankara.ok).toBe(true);
    expect(ankara.province?.code).toBe("06");
    expect(ankara.district?.name).toBe("G\u00f6lba\u015f\u0131");

    expect(adiyaman.ok).toBe(true);
    expect(adiyaman.province?.code).toBe("02");
    expect(adiyaman.district?.name).toBe("G\u00f6lba\u015f\u0131");
  });

  it("reports province and district lookup errors clearly", () => {
    const invalidProvince = normalizeDistrict("Kad\u0131k\u00f6y", { province: "99" });
    const invalidDistrict = normalizeDistrict("Bilinmeyen", { province: "34" });

    expect(invalidProvince.ok).toBe(false);
    expect(invalidProvince.reasons).toEqual(["PROVINCE_NOT_FOUND"]);

    expect(invalidDistrict.ok).toBe(false);
    expect(invalidDistrict.reasons).toEqual(["DISTRICT_NOT_FOUND"]);
    expect(invalidDistrict.province?.code).toBe("34");
    expect(invalidDistrict.district).toBeNull();
  });
});
