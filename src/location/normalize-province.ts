import { createValidationResult, type ValidationResult } from "../common/result";
import {
  COMMON_REASON_CODES,
  LOCATION_REASON_CODES,
  type LocationReasonCode,
} from "../common/reasons";
import { findProvince, normalizeProvinceLookup } from "./shared";
import type { ProvinceRecord } from "./types";

export type NormalizeProvinceResult = ValidationResult<
  LocationReasonCode,
  "static_dataset"
> & {
  province: ProvinceRecord | null;
};

export function normalizeProvince(input: string): NormalizeProvinceResult {
  const normalizedLookup = normalizeProvinceLookup(input);
  const reasons: LocationReasonCode[] = [];

  if (normalizedLookup.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return {
      ...createValidationResult(input, normalizedLookup, reasons, "static_dataset"),
      province: null,
    };
  }

  const province = findProvince(input);
  if (!province) {
    reasons.push(LOCATION_REASON_CODES.PROVINCE_NOT_FOUND);
  }

  return {
    ...createValidationResult(
      input,
      province?.normalized ?? normalizedLookup,
      reasons,
      "static_dataset",
    ),
    province,
  };
}
