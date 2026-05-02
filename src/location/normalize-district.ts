import { createValidationResult, type ValidationResult } from "../common/result";
import {
  COMMON_REASON_CODES,
  LOCATION_REASON_CODES,
  type LocationReasonCode,
} from "../common/reasons";
import { findDistrict, findProvince, normalizeDistrictLookup } from "./shared";
import type { DistrictRecord, ProvinceRecord } from "./types";

export type NormalizeDistrictOptions = {
  province?: string;
};

export type NormalizeDistrictResult = ValidationResult<
  LocationReasonCode,
  "static_dataset"
> & {
  district: DistrictRecord | null;
  province: ProvinceRecord | null;
};

export function normalizeDistrict(
  input: string,
  options: NormalizeDistrictOptions = {},
): NormalizeDistrictResult {
  const normalizedLookup = normalizeDistrictLookup(input);
  const reasons: LocationReasonCode[] = [];

  if (normalizedLookup.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return {
      ...createValidationResult(input, normalizedLookup, reasons, "static_dataset"),
      district: null,
      province: null,
    };
  }

  const province = options.province ? findProvince(options.province) : null;
  if (options.province && !province) {
    reasons.push(LOCATION_REASON_CODES.PROVINCE_NOT_FOUND);
    return {
      ...createValidationResult(input, normalizedLookup, reasons, "static_dataset"),
      district: null,
      province: null,
    };
  }

  const districtMatch = findDistrict(input, province ?? undefined);
  if (!districtMatch.district) {
    reasons.push(districtMatch.reason);
    return {
      ...createValidationResult(input, normalizedLookup, reasons, "static_dataset"),
      district: null,
      province: districtMatch.province,
    };
  }

  return {
    ...createValidationResult(
      input,
      districtMatch.district.normalized,
      reasons,
      "static_dataset",
    ),
    district: districtMatch.district,
    province: districtMatch.province,
  };
}
