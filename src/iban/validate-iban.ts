import { COMMON_REASON_CODES, IBAN_REASON_CODES, type IbanReasonCode } from "../common/reasons";
import { createValidationResult, type ValidationResult } from "../common/result";
import { formatIban } from "./format-iban";

export type IbanValidationResult = ValidationResult<IbanReasonCode> & {
  country: "TR" | null;
  formatted: string | null;
};

const IBAN_ALPHANUMERIC = /^[A-Z0-9]+$/;
const UNSUPPORTED_IBAN_CHARACTERS = /[^A-Za-z0-9\s-]/;

export function validateIban(input: string): IbanValidationResult {
  const normalized = normalizeIbanInput(input);
  const reasons: IbanReasonCode[] = [];

  if (normalized.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return {
      ...createValidationResult(input, normalized, reasons),
      country: null,
      formatted: null,
    };
  }

  if (UNSUPPORTED_IBAN_CHARACTERS.test(input)) {
    reasons.push(COMMON_REASON_CODES.UNSUPPORTED_CHARACTERS);
  }

  const isTrIban = normalized.startsWith("TR");
  if (!isTrIban) {
    reasons.push(IBAN_REASON_CODES.NON_TR_IBAN);
  }

  if (normalized.length !== 26) {
    reasons.push(COMMON_REASON_CODES.INVALID_LENGTH);
  }

  if (!IBAN_ALPHANUMERIC.test(normalized)) {
    reasons.push(COMMON_REASON_CODES.UNSUPPORTED_CHARACTERS);
  }

  if (reasons.length === 0 && ibanMod97(normalized) !== 1) {
    reasons.push(COMMON_REASON_CODES.INVALID_CHECKSUM);
  }

  const result = createValidationResult(input, normalized, dedupeReasons(reasons));

  return {
    ...result,
    country: result.ok ? "TR" : isTrIban ? "TR" : null,
    formatted: result.ok ? formatIban(normalized) : null,
  };
}

export function normalizeIbanInput(input: string): string {
  return input.replace(/[\s-]+/g, "").toUpperCase();
}

function ibanMod97(iban: string): number {
  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
  let remainder = 0;

  for (const char of rearranged) {
    const code = char.charCodeAt(0);
    const expanded = code >= 65 && code <= 90 ? String(code - 55) : char;

    for (const digit of expanded) {
      if (digit < "0" || digit > "9") {
        return -1;
      }
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }

  return remainder;
}

function dedupeReasons<TReason extends string>(reasons: TReason[]): TReason[] {
  return [...new Set(reasons)];
}
