import {
  COMMON_REASON_CODES,
  CURRENCY_REASON_CODES,
  NUMBER_REASON_CODES,
  type CurrencyReasonCode,
} from "../common/reasons";
import { createValidationResult, type ValidationResult } from "../common/result";
import { parseTurkishNumber, type TurkishNumberLocale } from "./parse-turkish-number";

export type CurrencyCode =
  | "TRY"
  | "USD"
  | "EUR"
  | "GBP"
  | "CHF"
  | "JPY"
  | "AUD"
  | "CAD"
  | "RUB"
  | "AED"
  | "CNY"
  | "SAR";

export type TurkishCurrencyParseResult = ValidationResult<CurrencyReasonCode, "format_parse"> & {
  value: number | null;
  currency: CurrencyCode | null;
  currencyToken: string | null;
  detectedLocale: TurkishNumberLocale | null;
};

const SYMBOL_TO_CODE: Record<string, CurrencyCode> = {
  "₺": "TRY",
  "$": "USD",
  "€": "EUR",
  "£": "GBP",
  "¥": "JPY",
  "₽": "RUB",
};

const CODE_ALIASES: Record<string, CurrencyCode> = {
  TL: "TRY",
  TRY: "TRY",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  CHF: "CHF",
  JPY: "JPY",
  AUD: "AUD",
  CAD: "CAD",
  RUB: "RUB",
  AED: "AED",
  CNY: "CNY",
  SAR: "SAR",
};

const KNOWN_TOKEN_PATTERN = /([A-Za-z]{2,3}|[₺$€£¥₽])/g;

export function parseTurkishCurrency(input: string): TurkishCurrencyParseResult {
  const reasons: CurrencyReasonCode[] = [];

  if (input.length === 0) {
    reasons.push(COMMON_REASON_CODES.EMPTY_INPUT);
    return buildResult(input, "", reasons, null, null, null, null);
  }

  const tokens = extractTokens(input);

  if (tokens.unknownTokens.length > 0) {
    reasons.push(COMMON_REASON_CODES.UNSUPPORTED_CHARACTERS);
  }

  let currency: CurrencyCode | null = null;
  let currencyToken: string | null = null;

  if (tokens.knownTokens.length === 1) {
    currencyToken = tokens.knownTokens[0] ?? null;
    currency = currencyToken ? resolveCurrency(currencyToken) : null;
  } else if (tokens.knownTokens.length > 1) {
    reasons.push(CURRENCY_REASON_CODES.INVALID_CURRENCY_FORMAT);
  } else if (tokens.unrecognizedAlphaTokens.length > 0) {
    currencyToken = tokens.unrecognizedAlphaTokens[0] ?? null;
    reasons.push(CURRENCY_REASON_CODES.UNKNOWN_CURRENCY);
  }

  const numericPart = tokens.numericPart;
  if (numericPart.length === 0) {
    reasons.push(NUMBER_REASON_CODES.INVALID_NUMBER_FORMAT);
    return buildResult(input, "", reasons, null, currency, currencyToken, null);
  }

  const numberResult = parseTurkishNumber(numericPart);
  for (const reason of numberResult.reasons) {
    reasons.push(reason);
  }

  const normalized = currencyToken
    ? `${numberResult.normalized} ${currency ?? currencyToken}`
    : numberResult.normalized;

  if (numberResult.value === null) {
    return buildResult(
      input,
      normalized,
      reasons,
      null,
      currency,
      currencyToken,
      numberResult.detectedLocale,
    );
  }

  if (reasons.some((reason) => reason !== CURRENCY_REASON_CODES.UNKNOWN_CURRENCY)) {
    return buildResult(
      input,
      normalized,
      reasons,
      null,
      currency,
      currencyToken,
      numberResult.detectedLocale,
    );
  }

  return buildResult(
    input,
    normalized,
    reasons,
    numberResult.value,
    currency,
    currencyToken,
    numberResult.detectedLocale,
  );
}

type TokenSplit = {
  numericPart: string;
  knownTokens: string[];
  unrecognizedAlphaTokens: string[];
  unknownTokens: string[];
};

function extractTokens(input: string): TokenSplit {
  const knownTokens: string[] = [];
  const unrecognizedAlphaTokens: string[] = [];
  const unknownTokens: string[] = [];

  let working = input.replace(KNOWN_TOKEN_PATTERN, (match) => {
    if (match.length === 1 && SYMBOL_TO_CODE[match]) {
      knownTokens.push(match);
      return " ";
    }
    const upper = match.toUpperCase();
    if (CODE_ALIASES[upper]) {
      knownTokens.push(upper);
      return " ";
    }
    unrecognizedAlphaTokens.push(match);
    return " ";
  });

  for (const char of working) {
    if (!/[0-9+\-.,\s ]/.test(char)) {
      unknownTokens.push(char);
    }
  }

  working = working.replace(/[^0-9+\-.,\s ]/g, "");

  return {
    numericPart: working.trim(),
    knownTokens,
    unrecognizedAlphaTokens,
    unknownTokens,
  };
}

function resolveCurrency(token: string): CurrencyCode | null {
  if (token.length === 1) {
    return SYMBOL_TO_CODE[token] ?? null;
  }
  return CODE_ALIASES[token.toUpperCase()] ?? null;
}

function buildResult(
  input: string,
  normalized: string,
  reasons: CurrencyReasonCode[],
  value: number | null,
  currency: CurrencyCode | null,
  currencyToken: string | null,
  detectedLocale: TurkishNumberLocale | null,
): TurkishCurrencyParseResult {
  const base = createValidationResult(input, normalized, dedupeReasons(reasons), "format_parse");
  return {
    ...base,
    value,
    currency,
    currencyToken,
    detectedLocale,
  };
}

function dedupeReasons<TReason extends string>(reasons: TReason[]): TReason[] {
  return [...new Set(reasons)];
}
