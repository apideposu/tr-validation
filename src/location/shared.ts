import { LOCATION_REASON_CODES } from "../common/reasons";
import { slugifyTurkish } from "../text/slugify-turkish";
import { DISTRICTS, PROVINCES } from "./data";
import type { DistrictRecord, ProvinceRecord } from "./types";

const PROVINCE_BY_CODE = new Map(PROVINCES.map((province) => [province.code, province] as const));
const PROVINCE_BY_NORMALIZED = new Map(
  PROVINCES.map((province) => [province.normalized, province] as const),
);
const DISTRICTS_BY_PROVINCE_CODE = new Map<string, DistrictRecord[]>();
const DISTRICTS_BY_NORMALIZED = new Map<string, DistrictRecord[]>();

for (const district of DISTRICTS) {
  const inProvince = DISTRICTS_BY_PROVINCE_CODE.get(district.provinceCode) ?? [];
  inProvince.push(district);
  DISTRICTS_BY_PROVINCE_CODE.set(district.provinceCode, inProvince);

  const globalMatches = DISTRICTS_BY_NORMALIZED.get(district.normalized) ?? [];
  globalMatches.push(district);
  DISTRICTS_BY_NORMALIZED.set(district.normalized, globalMatches);
}

export function listProvinceRecords(): ProvinceRecord[] {
  return PROVINCES.map(cloneProvince);
}

export function listDistrictRecordsByProvince(provinceCodeOrSlug: string): DistrictRecord[] {
  const province = findProvince(provinceCodeOrSlug);
  if (!province) {
    return [];
  }
  return (DISTRICTS_BY_PROVINCE_CODE.get(province.code) ?? []).map(cloneDistrict);
}

export function findProvince(input: string): ProvinceRecord | null {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return null;
  }

  if (/^\d{1,2}$/.test(trimmed)) {
    return cloneProvince(PROVINCE_BY_CODE.get(trimmed.padStart(2, "0")) ?? null);
  }

  const normalized = slugifyTurkish(trimmed);
  const bySlug = PROVINCE_BY_NORMALIZED.get(normalized);
  if (bySlug) {
    return cloneProvince(bySlug);
  }

  const lower = trimmed.toLocaleLowerCase("tr-TR");
  const byName = PROVINCES.find((province) => province.name.toLocaleLowerCase("tr-TR") === lower);
  return cloneProvince(byName ?? null);
}

export function findDistrict(
  input: string,
  province?: ProvinceRecord,
):
  | { district: DistrictRecord; province: ProvinceRecord }
  | { district: null; province: ProvinceRecord | null; reason: "DISTRICT_NOT_FOUND" | "AMBIGUOUS_DISTRICT" } {
  const normalized = slugifyTurkish(input);
  if (normalized.length === 0) {
    return {
      district: null,
      province: province ?? null,
      reason: LOCATION_REASON_CODES.DISTRICT_NOT_FOUND,
    };
  }

  if (province) {
    const inProvince = DISTRICTS_BY_PROVINCE_CODE.get(province.code) ?? [];
    const district = inProvince.find((entry) => entry.normalized === normalized) ?? null;
    if (!district) {
      return {
        district: null,
        province,
        reason: LOCATION_REASON_CODES.DISTRICT_NOT_FOUND,
      };
    }
    return { district: cloneDistrict(district), province };
  }

  const matches = DISTRICTS_BY_NORMALIZED.get(normalized) ?? [];
  if (matches.length === 0) {
    return {
      district: null,
      province: null,
      reason: LOCATION_REASON_CODES.DISTRICT_NOT_FOUND,
    };
  }

  if (matches.length > 1) {
    return {
      district: null,
      province: null,
      reason: LOCATION_REASON_CODES.AMBIGUOUS_DISTRICT,
    };
  }

  const onlyMatch = matches[0];
  const matchedProvince = PROVINCE_BY_CODE.get(onlyMatch.provinceCode);
  if (!matchedProvince) {
    return {
      district: null,
      province: null,
      reason: LOCATION_REASON_CODES.DISTRICT_NOT_FOUND,
    };
  }

  return {
    district: cloneDistrict(onlyMatch),
    province: cloneProvince(matchedProvince),
  };
}

export function normalizeProvinceLookup(input: string): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return "";
  }
  if (/^\d{1,2}$/.test(trimmed)) {
    return trimmed.padStart(2, "0");
  }
  return slugifyTurkish(trimmed);
}

export function normalizeDistrictLookup(input: string): string {
  return slugifyTurkish(input);
}

function cloneProvince(province: ProvinceRecord | null): ProvinceRecord | null {
  if (!province) {
    return null;
  }

  return {
    code: province.code,
    name: province.name,
    normalized: province.normalized,
    phoneAreaCodes: [...province.phoneAreaCodes],
    districtCount: province.districtCount,
  };
}

function cloneDistrict(district: DistrictRecord): DistrictRecord {
  return {
    provinceCode: district.provinceCode,
    provinceName: district.provinceName,
    provinceNormalized: district.provinceNormalized,
    name: district.name,
    normalized: district.normalized,
  };
}
