import { CARD_REASON_CODES, COMMON_REASON_CODES, type CardReasonCode } from "../common/reasons";
import { createValidationResult, type ValidationResult } from "../common/result";
import binsData from "../../data/card-bins.tr.json";

export type CardScheme =
  | "visa"
  | "mastercard"
  | "amex"
  | "troy"
  | "discover"
  | "jcb"
  | "diners"
  | "unionpay";

export type CardValidationResult = ValidationResult<CardReasonCode> & {
  scheme: CardScheme | null;
  bin: string | null;
  last4: string | null;
};

type SchemeRange = { from: string; to: string };

type SchemeEntry = {
  scheme: CardScheme;
  ranges: SchemeRange[];
  lengths: number[];
};

const UNSUPPORTED_CARD_CHARACTERS = /[^0-9\s-]/;
const SCHEMES = (binsData.schemes as SchemeEntry[]).slice().sort(byMostSpecificRangeFirst);

export function validateCreditCard(input: string): CardValidationResult {
  const reasons: CardReasonCode[] = [];
  const hasUnsupportedCharacters = UNSUPPORTED_CARD_CHARACTERS.test(input);

  if (hasUnsupportedCharacters) {
    reasons.push(COMMON_REASON_CODES.UNSUPPORTED_CHARACTERS);
  }

  const normalized = normalizeCardInput(input);

  if (normalized.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return buildResult(input, normalized, reasons, null, null, null);
  }

  if (normalized.length < 12 || normalized.length > 19) {
    reasons.push(COMMON_REASON_CODES.INVALID_LENGTH);
    return buildResult(input, normalized, reasons, null, null, null);
  }

  const scheme = detectScheme(normalized);

  if (!scheme) {
    reasons.push(CARD_REASON_CODES.UNKNOWN_SCHEME);
  } else if (!scheme.lengths.includes(normalized.length)) {
    reasons.push(CARD_REASON_CODES.INVALID_LENGTH_FOR_SCHEME);
  }

  if (!hasValidLuhnChecksum(normalized)) {
    reasons.push(COMMON_REASON_CODES.INVALID_CHECKSUM);
  }

  if (reasons.length > 0) {
    return buildResult(input, normalized, reasons, scheme?.scheme ?? null, null, null);
  }

  return buildResult(
    input,
    normalized,
    reasons,
    scheme?.scheme ?? null,
    normalized.slice(0, 6),
    normalized.slice(-4),
  );
}

export function normalizeCardInput(input: string): string {
  return input.replace(/[\s-]+/g, "");
}

function detectScheme(value: string): SchemeEntry | null {
  for (const scheme of SCHEMES) {
    for (const range of scheme.ranges) {
      if (numericPrefixInRange(value, range)) {
        return scheme;
      }
    }
  }
  return null;
}

function numericPrefixInRange(value: string, range: SchemeRange): boolean {
  const length = range.from.length;
  if (value.length < length) {
    return false;
  }
  const prefix = value.slice(0, length);
  if (!/^\d+$/.test(prefix)) {
    return false;
  }
  const numericPrefix = Number(prefix);
  const numericFrom = Number(range.from);
  const numericTo = Number(range.to);
  return numericPrefix >= numericFrom && numericPrefix <= numericTo;
}

function hasValidLuhnChecksum(value: string): boolean {
  if (!/^\d+$/.test(value)) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let index = value.length - 1; index >= 0; index -= 1) {
    const char = value.charAt(index);
    let digit = Number(char);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function byMostSpecificRangeFirst(a: SchemeEntry, b: SchemeEntry): number {
  const aMaxLength = Math.max(...a.ranges.map((range) => range.from.length));
  const bMaxLength = Math.max(...b.ranges.map((range) => range.from.length));
  return bMaxLength - aMaxLength;
}

function buildResult(
  input: string,
  normalized: string,
  reasons: CardReasonCode[],
  scheme: CardScheme | null,
  bin: string | null,
  last4: string | null,
): CardValidationResult {
  const base = createValidationResult(input, normalized, dedupeReasons(reasons));
  return {
    ...base,
    scheme,
    bin,
    last4,
  };
}

function dedupeReasons<TReason extends string>(reasons: TReason[]): TReason[] {
  return [...new Set(reasons)];
}
