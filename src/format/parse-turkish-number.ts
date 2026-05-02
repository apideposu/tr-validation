import {
  COMMON_REASON_CODES,
  NUMBER_REASON_CODES,
  type NumberReasonCode,
} from "../common/reasons";
import { createValidationResult, type ValidationResult } from "../common/result";

export type TurkishNumberLocale = "tr" | "en";

export type TurkishNumberParseResult = ValidationResult<NumberReasonCode, "format_parse"> & {
  value: number | null;
  detectedLocale: TurkishNumberLocale | null;
};

const SUPPORTED_CHARS = /^[0-9+\-.,\s ]*$/;

export function parseTurkishNumber(input: string): TurkishNumberParseResult {
  const reasons: NumberReasonCode[] = [];

  if (!SUPPORTED_CHARS.test(input)) {
    reasons.push(COMMON_REASON_CODES.UNSUPPORTED_CHARACTERS);
  }

  const stripped = input.replace(/[\s ]+/g, "");

  if (stripped.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return buildResult(input, "", reasons, null, null);
  }

  const signMatch = /^([+-])?(.*)$/.exec(stripped);
  if (!signMatch) {
    reasons.push(NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT);
    return buildResult(input, stripped, reasons, null, null);
  }
  const sign = signMatch[1] === "-" ? -1 : 1;
  const body = signMatch[2] ?? "";

  if (body.length === 0 || /[+\-]/.test(body)) {
    reasons.push(NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT);
    return buildResult(input, stripped, reasons, null, null);
  }

  if (!/[0-9]/.test(body)) {
    reasons.push(NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT);
    return buildResult(input, stripped, reasons, null, null);
  }

  const detection = detectLocaleAndNormalize(body);
  if (!detection.ok) {
    if (detection.reason) {
      reasons.push(detection.reason);
    }
    return buildResult(input, stripped, reasons, null, null);
  }

  const numeric = Number(detection.normalized);
  if (!Number.isFinite(numeric)) {
    reasons.push(NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT);
    return buildResult(input, stripped, reasons, null, detection.locale);
  }

  if (reasons.length > 0) {
    return buildResult(input, stripped, reasons, null, detection.locale);
  }

  return buildResult(input, stripped, reasons, sign * numeric, detection.locale);
}

type DetectionResult =
  | { ok: true; normalized: string; locale: TurkishNumberLocale }
  | { ok: false; reason: NumberReasonCode | null; locale: TurkishNumberLocale | null };

function detectLocaleAndNormalize(body: string): DetectionResult {
  const hasComma = body.includes(",");
  const hasDot = body.includes(".");

  if (!hasComma && !hasDot) {
    return { ok: true, normalized: body, locale: "tr" };
  }

  if (hasComma && hasDot) {
    const lastComma = body.lastIndexOf(",");
    const lastDot = body.lastIndexOf(".");

    if (lastComma > lastDot) {
      return finalizeWithDecimal(body, ",", ".", "tr");
    }
    return finalizeWithDecimal(body, ".", ",", "en");
  }

  if (hasComma) {
    const parts = body.split(",");
    if (parts.length > 2) {
      const allGroupsValid = parts.every((part, index) =>
        index === 0 ? /^\d{1,3}$/.test(part) : /^\d{3}$/.test(part),
      );
      if (allGroupsValid) {
        return { ok: true, normalized: parts.join(""), locale: "en" };
      }
      return { ok: false, reason: NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT, locale: null };
    }
    const [intPart, decimalPart] = parts as [string, string];
    if (!/^\d+$/.test(intPart) || !/^\d+$/.test(decimalPart)) {
      return { ok: false, reason: NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT, locale: null };
    }
    return { ok: true, normalized: `${intPart}.${decimalPart}`, locale: "tr" };
  }

  const parts = body.split(".");
  if (parts.length > 2) {
    const allGroupsValid = parts.every((part, index) =>
      index === 0 ? /^\d{1,3}$/.test(part) : /^\d{3}$/.test(part),
    );
    if (allGroupsValid) {
      return { ok: true, normalized: parts.join(""), locale: "tr" };
    }
    return { ok: false, reason: NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT, locale: null };
  }

  const [intPart, fracPart] = parts as [string, string];
  if (!/^\d+$/.test(intPart) || !/^\d+$/.test(fracPart)) {
    return { ok: false, reason: NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT, locale: null };
  }
  if (fracPart.length === 3 && intPart.length >= 1 && intPart.length <= 3) {
    return { ok: false, reason: NUMBER_REASON_CODES.AMBIGUOUS_GROUPING, locale: null };
  }
  return { ok: true, normalized: `${intPart}.${fracPart}`, locale: "en" };
}

function finalizeWithDecimal(
  body: string,
  decimalSep: string,
  groupSep: string,
  locale: TurkishNumberLocale,
): DetectionResult {
  const lastDecimal = body.lastIndexOf(decimalSep);
  const intRaw = body.slice(0, lastDecimal);
  const fracRaw = body.slice(lastDecimal + 1);

  if (intRaw.includes(decimalSep)) {
    return { ok: false, reason: NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT, locale: null };
  }
  if (!/^[\d]+(?:[\d.,]*)$/.test(intRaw)) {
    return { ok: false, reason: NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT, locale: null };
  }

  const groupParts = intRaw.split(groupSep);
  if (groupParts.length > 1) {
    const allGroupsValid = groupParts.every((part, index) =>
      index === 0 ? /^\d{1,3}$/.test(part) : /^\d{3}$/.test(part),
    );
    if (!allGroupsValid) {
      return { ok: false, reason: NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT, locale: null };
    }
  } else if (!/^\d+$/.test(intRaw)) {
    return { ok: false, reason: NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT, locale: null };
  }

  if (!/^\d+$/.test(fracRaw)) {
    return { ok: false, reason: NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT, locale: null };
  }

  const intMerged = groupParts.join("");
  return { ok: true, normalized: `${intMerged}.${fracRaw}`, locale };
}

function buildResult(
  input: string,
  normalized: string,
  reasons: NumberReasonCode[],
  value: number | null,
  detectedLocale: TurkishNumberLocale | null,
): TurkishNumberParseResult {
  const base = createValidationResult(input, normalized, dedupeReasons(reasons), "format_parse");
  return {
    ...base,
    value,
    detectedLocale,
  };
}

function dedupeReasons<TReason extends string>(reasons: TReason[]): TReason[] {
  return [...new Set(reasons)];
}
