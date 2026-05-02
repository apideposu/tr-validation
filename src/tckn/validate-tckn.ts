import { COMMON_REASON_CODES, TCKN_REASON_CODES, type TcknReasonCode } from "../common/reasons";
import { createValidationResult, type ValidationResult } from "../common/result";

export type TcknValidationResult = ValidationResult<TcknReasonCode>;

const UNSUPPORTED_TCKN_CHARACTERS = /[^0-9\s._/-]/;
const REPEATED_DIGITS = /^(\d)\1+$/;

export function validateTckn(input: string): TcknValidationResult {
  const normalized = normalizeTcknInput(input);
  const reasons: TcknReasonCode[] = [];
  const hasUnsupportedCharacters = UNSUPPORTED_TCKN_CHARACTERS.test(input);

  if (hasUnsupportedCharacters) {
    reasons.push(COMMON_REASON_CODES.UNSUPPORTED_CHARACTERS);
  }

  if (normalized.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return createValidationResult(input, normalized, dedupeReasons(reasons));
  }

  if (normalized.length !== 11) {
    reasons.push(COMMON_REASON_CODES.INVALID_LENGTH);
    return createValidationResult(input, normalized, dedupeReasons(reasons));
  }

  if (normalized.startsWith("0")) {
    reasons.push(TCKN_REASON_CODES.LEADING_ZERO);
  }

  if (REPEATED_DIGITS.test(normalized)) {
    reasons.push(TCKN_REASON_CODES.REPEATED_DIGITS);
  }

  if (reasons.length === 0 && !hasValidTcknChecksum(normalized)) {
    reasons.push(COMMON_REASON_CODES.INVALID_CHECKSUM);
  }

  return createValidationResult(input, normalized, dedupeReasons(reasons));
}

export function normalizeTcknInput(input: string): string {
  return input.replace(/\D+/g, "");
}

function hasValidTcknChecksum(value: string): boolean {
  if (!/^[1-9][0-9]{10}$/.test(value)) {
    return false;
  }

  const digits = value.split("").map((digit) => Number(digit));
  const [
    first,
    second,
    third,
    fourth,
    fifth,
    sixth,
    seventh,
    eighth,
    ninth,
    tenthValue,
    eleventhValue,
  ] = digits as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  const oddSum = first + third + fifth + seventh + ninth;
  const evenSum = second + fourth + sixth + eighth;
  const tenthDigit = ((oddSum * 7 - evenSum) % 10 + 10) % 10;
  const eleventhDigit = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10;

  return tenthValue === tenthDigit && eleventhValue === eleventhDigit;
}

function dedupeReasons<TReason extends string>(reasons: TReason[]): TReason[] {
  return [...new Set(reasons)];
}
