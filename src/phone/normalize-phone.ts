import { parsePhoneNumberFromString } from "libphonenumber-js/max";

import { createValidationResult, type ValidationResult } from "../common/result";
import { COMMON_REASON_CODES, PHONE_REASON_CODES, type PhoneReasonCode } from "../common/reasons";
import { TR_MOBILE_PREFIX_BY_PREFIX } from "./prefixes";

export type PhoneNumberType =
  | "mobile"
  | "fixed_line"
  | "toll_free"
  | "premium_rate"
  | "voip"
  | "unknown";

export type PhoneOperator = "Turkcell" | "Vodafone" | "Turk Telekom";

export type NormalizePhoneOptions = {
  country?: "TR";
};

export type PhoneNormalizationResult = ValidationResult<
  PhoneReasonCode,
  "number_plan_parse"
> & {
  e164: string | null;
  national: string | null;
  extension: string | null;
  country: "TR" | null;
  type: PhoneNumberType;
  possibleOriginalOperator: PhoneOperator | null;
  operatorConfidence: "prefix_based" | null;
};

export function normalizePhone(
  input: string,
  options: NormalizePhoneOptions = {},
): PhoneNormalizationResult {
  const country = options.country ?? "TR";
  const normalizedCandidate = normalizePhoneCandidate(input);
  const reasons: PhoneReasonCode[] = [];

  if (normalizedCandidate.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return {
      ...createValidationResult(input, normalizedCandidate, reasons, "number_plan_parse"),
      e164: null,
      national: null,
      extension: null,
      country: null,
      type: "unknown",
      possibleOriginalOperator: null,
      operatorConfidence: null,
    };
  }

  const phoneNumber = parsePhoneNumberFromString(input, country);
  const isValid = Boolean(phoneNumber?.isValid());
  const isTurkishPhone = phoneNumber?.country === "TR";

  if (!isValid) {
    reasons.push(PHONE_REASON_CODES.INVALID_PHONE);
  } else if (!isTurkishPhone) {
    reasons.push(PHONE_REASON_CODES.NON_TR_PHONE);
  }

  const valid = reasons.length === 0;
  const nationalNumber = phoneNumber?.nationalNumber ?? "";
  const prefix = nationalNumber.length >= 3 ? nationalNumber.slice(0, 3) : "";
  const prefixMatch = valid ? TR_MOBILE_PREFIX_BY_PREFIX.get(prefix) : undefined;
  const normalized = valid ? phoneNumber?.number ?? normalizedCandidate : normalizedCandidate;

  return {
    ...createValidationResult(input, normalized, reasons, "number_plan_parse"),
    e164: valid ? phoneNumber?.number ?? null : null,
    national: valid ? phoneNumber?.formatNational() ?? null : null,
    extension: valid ? phoneNumber?.ext ?? null : null,
    country: valid ? "TR" : null,
    type: valid ? mapPhoneType(phoneNumber?.getType()) : "unknown",
    possibleOriginalOperator: valid ? prefixMatch?.possibleOriginalOperator ?? null : null,
    operatorConfidence: valid && prefixMatch ? "prefix_based" : null,
  };
}

function normalizePhoneCandidate(input: string): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return "";
  }

  const keepPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D+/g, "");
  return keepPlus ? `+${digits}` : digits;
}

function mapPhoneType(type: string | undefined): PhoneNumberType {
  switch (type) {
    case "MOBILE":
      return "mobile";
    case "FIXED_LINE":
      return "fixed_line";
    case "FIXED_LINE_OR_MOBILE":
      return "mobile";
    case "TOLL_FREE":
      return "toll_free";
    case "PREMIUM_RATE":
      return "premium_rate";
    case "VOIP":
      return "voip";
    default:
      return "unknown";
  }
}
