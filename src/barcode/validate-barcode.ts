import {
  BARCODE_REASON_CODES,
  COMMON_REASON_CODES,
  type BarcodeReasonCode,
} from "../common/reasons";
import { createValidationResult, type ValidationResult } from "../common/result";

export type BarcodeType = "EAN_13" | "EAN_8";

export type BarcodeValidationResult = ValidationResult<BarcodeReasonCode> & {
  type: BarcodeType | null;
  gs1Prefix: string | null;
  isTurkishGs1Prefix: boolean;
};

const UNSUPPORTED_BARCODE_CHARACTERS = /[^0-9\s-]/;
const TURKISH_GS1_PREFIXES = new Set(["868", "869"]);

export function validateBarcode(input: string): BarcodeValidationResult {
  const reasons: BarcodeReasonCode[] = [];
  const hasUnsupportedCharacters = UNSUPPORTED_BARCODE_CHARACTERS.test(input);

  if (hasUnsupportedCharacters) {
    reasons.push(COMMON_REASON_CODES.UNSUPPORTED_CHARACTERS);
  }

  const normalized = normalizeBarcodeInput(input);

  if (normalized.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return buildResult(input, normalized, reasons, null, null);
  }

  const type = detectType(normalized.length);
  if (!type) {
    reasons.push(BARCODE_REASON_CODES.UNSUPPORTED_BARCODE_TYPE);
    return buildResult(input, normalized, reasons, null, null);
  }

  if (!hasValidEanChecksum(normalized)) {
    reasons.push(COMMON_REASON_CODES.INVALID_CHECKSUM);
    return buildResult(input, normalized, reasons, type, null);
  }

  const gs1Prefix = type === "EAN_13" ? normalized.slice(0, 3) : null;
  return buildResult(input, normalized, reasons, type, gs1Prefix);
}

export function normalizeBarcodeInput(input: string): string {
  return input.replace(/[\s-]+/g, "");
}

function detectType(length: number): BarcodeType | null {
  if (length === 13) return "EAN_13";
  if (length === 8) return "EAN_8";
  return null;
}

function hasValidEanChecksum(value: string): boolean {
  if (!/^\d+$/.test(value)) {
    return false;
  }

  const digits = [...value].map(Number);
  const checkDigit = digits[digits.length - 1];
  if (checkDigit === undefined) {
    return false;
  }

  let sum = 0;
  for (let index = 0; index < digits.length - 1; index += 1) {
    const digit = digits[index];
    if (digit === undefined) {
      return false;
    }
    const positionFromRight = digits.length - 1 - index;
    const weight = positionFromRight % 2 === 0 ? 1 : 3;
    sum += digit * weight;
  }

  const expected = (10 - (sum % 10)) % 10;
  return checkDigit === expected;
}

function buildResult(
  input: string,
  normalized: string,
  reasons: BarcodeReasonCode[],
  type: BarcodeType | null,
  gs1Prefix: string | null,
): BarcodeValidationResult {
  const base = createValidationResult(input, normalized, dedupeReasons(reasons));
  return {
    ...base,
    type,
    gs1Prefix,
    isTurkishGs1Prefix: gs1Prefix !== null && TURKISH_GS1_PREFIXES.has(gs1Prefix),
  };
}

function dedupeReasons<TReason extends string>(reasons: TReason[]): TReason[] {
  return [...new Set(reasons)];
}
