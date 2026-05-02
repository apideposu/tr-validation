import { COMMON_REASON_CODES, PLATE_REASON_CODES, type PlateReasonCode } from "../common/reasons";
import { createValidationResult, type ValidationResult } from "../common/result";
import { PROVINCES } from "../location/data";

export type PlateProvinceInfo = {
  code: string;
  name: string;
};

export type PlateValidationResult = ValidationResult<PlateReasonCode> & {
  province: PlateProvinceInfo | null;
  letters: string | null;
  digits: string | null;
  formatted: string | null;
};

const UNSUPPORTED_PLATE_CHARACTERS = /[^A-Za-z0-9\s.\-_/]/;
const FORBIDDEN_LETTERS = new Set(["Q", "W", "X"]);
const PLATE_STRUCTURE = /^(\d{2})([A-Z]{1,3})(\d{1,4})$/;

const PROVINCE_CODE_SET = new Set(PROVINCES.map((province) => province.code));
const PROVINCE_BY_CODE = new Map(
  PROVINCES.map((province) => [province.code, { code: province.code, name: province.name }] as const),
);

export function validatePlate(input: string): PlateValidationResult {
  const reasons: PlateReasonCode[] = [];
  const hasUnsupportedCharacters = UNSUPPORTED_PLATE_CHARACTERS.test(input);

  if (hasUnsupportedCharacters) {
    reasons.push(COMMON_REASON_CODES.UNSUPPORTED_CHARACTERS);
  }

  const normalized = normalizePlateInput(input);

  if (normalized.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return buildResult(input, normalized, reasons, null, null, null);
  }

  if (normalized.length < 5 || normalized.length > 8) {
    reasons.push(COMMON_REASON_CODES.INVALID_LENGTH);
    return buildResult(input, normalized, reasons, null, null, null);
  }

  const match = PLATE_STRUCTURE.exec(normalized);
  if (!match) {
    reasons.push(PLATE_REASON_CODES.INVALID_FORMAT);
    return buildResult(input, normalized, reasons, null, null, null);
  }

  const [, provinceCode, letters, digits] = match as unknown as [string, string, string, string];

  if (!PROVINCE_CODE_SET.has(provinceCode)) {
    reasons.push(PLATE_REASON_CODES.INVALID_PROVINCE_CODE);
  }

  if (!isValidLetterBlock(letters)) {
    reasons.push(PLATE_REASON_CODES.INVALID_LETTER_BLOCK);
  }

  if (!isValidDigitBlock(letters.length, digits.length)) {
    reasons.push(PLATE_REASON_CODES.INVALID_DIGIT_BLOCK);
  }

  if (reasons.length > 0) {
    return buildResult(input, normalized, reasons, null, null, null, null);
  }

  const province = PROVINCE_BY_CODE.get(provinceCode) ?? null;
  const formatted = `${provinceCode} ${letters} ${digits}`;

  return buildResult(input, normalized, reasons, province, letters, digits, formatted);
}

export function normalizePlateInput(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/[\s.\-_/]+/g, "")
    .toUpperCase();
}

function isValidLetterBlock(letters: string): boolean {
  if (letters.length < 1 || letters.length > 3) {
    return false;
  }
  for (const letter of letters) {
    if (FORBIDDEN_LETTERS.has(letter)) {
      return false;
    }
  }
  return true;
}

function isValidDigitBlock(letterCount: number, digitCount: number): boolean {
  if (digitCount < 1 || digitCount > 4) {
    return false;
  }
  if (letterCount === 1) {
    return digitCount === 4;
  }
  if (letterCount === 2) {
    return digitCount === 3 || digitCount === 4;
  }
  if (letterCount === 3) {
    return digitCount === 2 || digitCount === 3;
  }
  return false;
}

function buildResult(
  input: string,
  normalized: string,
  reasons: PlateReasonCode[],
  province: PlateProvinceInfo | null,
  letters: string | null,
  digits: string | null,
  formatted: string | null = null,
): PlateValidationResult {
  const base = createValidationResult(input, normalized, dedupeReasons(reasons));
  return {
    ...base,
    province,
    letters,
    digits,
    formatted,
  };
}

function dedupeReasons<TReason extends string>(reasons: TReason[]): TReason[] {
  return [...new Set(reasons)];
}
