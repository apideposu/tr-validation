import {
  COMMON_REASON_CODES,
  POSTAL_CODE_REASON_CODES,
  type PostalCodeReasonCode,
} from "../common/reasons";
import { createValidationResult, type ValidationResult } from "../common/result";
import { PROVINCES } from "../location/data";

export type PostalCodeProvinceInfo = {
  code: string;
  name: string;
};

export type PostalCodeValidationResult = ValidationResult<PostalCodeReasonCode> & {
  province: PostalCodeProvinceInfo | null;
};

const UNSUPPORTED_POSTAL_CHARACTERS = /[^0-9\s-]/;

const PROVINCE_BY_CODE = new Map(
  PROVINCES.map((province) => [province.code, { code: province.code, name: province.name }] as const),
);

export function validatePostalCode(input: string): PostalCodeValidationResult {
  const reasons: PostalCodeReasonCode[] = [];
  const hasUnsupportedCharacters = UNSUPPORTED_POSTAL_CHARACTERS.test(input);

  if (hasUnsupportedCharacters) {
    reasons.push(COMMON_REASON_CODES.UNSUPPORTED_CHARACTERS);
  }

  const normalized = normalizePostalCodeInput(input);

  if (normalized.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return buildResult(input, normalized, reasons, null);
  }

  if (normalized.length !== 5) {
    reasons.push(COMMON_REASON_CODES.INVALID_LENGTH);
    return buildResult(input, normalized, reasons, null);
  }

  const provinceCode = normalized.slice(0, 2);
  const province = PROVINCE_BY_CODE.get(provinceCode) ?? null;

  if (!province) {
    reasons.push(POSTAL_CODE_REASON_CODES.INVALID_PROVINCE_CODE);
    return buildResult(input, normalized, reasons, null);
  }

  return buildResult(input, normalized, reasons, province);
}

export function normalizePostalCodeInput(input: string): string {
  return input.replace(/[\s-]+/g, "");
}

function buildResult(
  input: string,
  normalized: string,
  reasons: PostalCodeReasonCode[],
  province: PostalCodeProvinceInfo | null,
): PostalCodeValidationResult {
  const base = createValidationResult(input, normalized, dedupeReasons(reasons));
  return {
    ...base,
    province,
  };
}

function dedupeReasons<TReason extends string>(reasons: TReason[]): TReason[] {
  return [...new Set(reasons)];
}
