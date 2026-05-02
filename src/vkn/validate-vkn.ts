import { COMMON_REASON_CODES, VKN_REASON_CODES, type VknReasonCode } from "../common/reasons";
import { createValidationResult, type ValidationResult } from "../common/result";

export type VknValidationResult = ValidationResult<VknReasonCode>;

const TOLERATED_SEPARATORS = /[\s._/-]+/g;
const UNSUPPORTED_VKN_CHARACTERS = /[^0-9\s._/-]/;
const REPEATED_DIGITS = /^(\d)\1+$/;

export function validateVkn(input: string): VknValidationResult {
  const normalized = normalizeVknInput(input);
  const reasons: VknReasonCode[] = [];

  if (normalized.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return createValidationResult(input, normalized, reasons);
  }

  if (UNSUPPORTED_VKN_CHARACTERS.test(input)) {
    reasons.push(COMMON_REASON_CODES.UNSUPPORTED_CHARACTERS);
  }

  if (normalized.length !== 10) {
    reasons.push(COMMON_REASON_CODES.INVALID_LENGTH);
    return createValidationResult(input, normalized, dedupeReasons(reasons));
  }

  if (REPEATED_DIGITS.test(normalized)) {
    reasons.push(VKN_REASON_CODES.REPEATED_DIGITS);
  }

  if (reasons.length === 0 && !hasValidVknChecksum(normalized)) {
    reasons.push(COMMON_REASON_CODES.INVALID_CHECKSUM);
  }

  return createValidationResult(input, normalized, dedupeReasons(reasons));
}

export function normalizeVknInput(input: string): string {
  return input.replace(/\D+/g, "");
}

function hasValidVknChecksum(value: string): boolean {
  if (!/^[0-9]{10}$/.test(value)) {
    return false;
  }

  const digits = [...value].map(Number);
  let sum = 0;

  for (let index = 0; index < 9; index += 1) {
    const position = 9 - index;
    const currentDigit = digits[index];

    if (currentDigit === undefined) {
      return false;
    }

    const adjusted = (currentDigit + position) % 10;

    if (adjusted === 0) {
      continue;
    }

    const multiplied = (adjusted * 2 ** position) % 9;
    sum += multiplied === 0 ? 9 : multiplied;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return digits[9] === checkDigit;
}

function dedupeReasons<TReason extends string>(reasons: TReason[]): TReason[] {
  return [...new Set(reasons)];
}
