import { COMMON_REASON_CODES, MERSIS_REASON_CODES, type MersisReasonCode } from "../common/reasons";
import { createValidationResult, type ValidationResult } from "../common/result";
import { validateVkn } from "../vkn/validate-vkn";

export type MersisValidationResult = ValidationResult<MersisReasonCode> & {
  embeddedVkn: string | null;
  serial: string | null;
};

const UNSUPPORTED_MERSIS_CHARACTERS = /[^0-9\s._/-]/;

export function validateMersis(input: string): MersisValidationResult {
  const reasons: MersisReasonCode[] = [];
  const hasUnsupportedCharacters = UNSUPPORTED_MERSIS_CHARACTERS.test(input);

  if (hasUnsupportedCharacters) {
    reasons.push(COMMON_REASON_CODES.UNSUPPORTED_CHARACTERS);
  }

  const normalized = normalizeMersisInput(input);

  if (normalized.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return buildResult(input, normalized, reasons, null, null);
  }

  if (normalized.length !== 16) {
    reasons.push(COMMON_REASON_CODES.INVALID_LENGTH);
    return buildResult(input, normalized, reasons, null, null);
  }

  const embeddedVkn = normalized.slice(0, 10);
  const serial = normalized.slice(10);

  const vknResult = validateVkn(embeddedVkn);
  if (!vknResult.ok) {
    reasons.push(MERSIS_REASON_CODES.INVALID_EMBEDDED_VKN);
    return buildResult(input, normalized, reasons, embeddedVkn, serial);
  }

  return buildResult(input, normalized, reasons, embeddedVkn, serial);
}

export function normalizeMersisInput(input: string): string {
  return input.replace(/\D+/g, "");
}

function buildResult(
  input: string,
  normalized: string,
  reasons: MersisReasonCode[],
  embeddedVkn: string | null,
  serial: string | null,
): MersisValidationResult {
  const base = createValidationResult(input, normalized, dedupeReasons(reasons));
  return {
    ...base,
    embeddedVkn,
    serial,
  };
}

function dedupeReasons<TReason extends string>(reasons: TReason[]): TReason[] {
  return [...new Set(reasons)];
}
