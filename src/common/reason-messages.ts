import type { AnyReasonCode } from "./reasons";

export type ReasonMessageLocale = "tr" | "en";

type ReasonMessages = Record<ReasonMessageLocale, string>;

const REASON_MESSAGES: Record<AnyReasonCode, ReasonMessages> = {
  EMPTY_INPUT: {
    tr: "Normalizasyondan sonra girdi bos kaldi.",
    en: "Input is empty after normalization.",
  },
  UNSUPPORTED_CHARACTERS: {
    tr: "Girdi desteklenmeyen karakterler iceriyor.",
    en: "Input contains unsupported characters.",
  },
  INVALID_LENGTH: {
    tr: "Girdi uzunlugu beklenen yapisal uzunluga uymuyor.",
    en: "Input length does not match the expected structural length.",
  },
  INVALID_CHECKSUM: {
    tr: "Bilinen kontrol algoritmasindan gecemedi.",
    en: "Input failed a known control algorithm.",
  },
  LEADING_ZERO: {
    tr: "Ilk hane 0 olamaz.",
    en: "The first digit cannot be 0.",
  },
  REPEATED_DIGITS: {
    tr: "Tum haneler ayni olamaz.",
    en: "All digits cannot be the same.",
  },
  NON_TR_IBAN: {
    tr: "IBAN TR ile baslamiyor.",
    en: "IBAN does not start with TR.",
  },
  INVALID_PHONE: {
    tr: "Girdi gecerli bir telefon numarasi olarak ayrisamadi.",
    en: "Input could not be parsed as a valid phone number.",
  },
  NON_TR_PHONE: {
    tr: "Numara gecerli ama Turk numarasi degil.",
    en: "The phone number is valid but not Turkish.",
  },
  PROVINCE_NOT_FOUND: {
    tr: "Il eslesmesi cozumlenemedi.",
    en: "Province match could not be resolved.",
  },
  DISTRICT_NOT_FOUND: {
    tr: "Ilce eslesmesi cozumlenemedi.",
    en: "District match could not be resolved.",
  },
  AMBIGUOUS_DISTRICT: {
    tr: "Ilce adi birden fazla il ile eslesiyor.",
    en: "District name matches multiple provinces.",
  },
  INVALID_FORMAT: {
    tr: "Girdi beklenen yapisal formata uymuyor.",
    en: "Input does not match the expected structural format.",
  },
  INVALID_PROVINCE_CODE: {
    tr: "Il kodu gecersiz veya taninmiyor.",
    en: "Province code is invalid or unrecognized.",
  },
  INVALID_LETTER_BLOCK: {
    tr: "Harf blogu gecersiz veya izin verilmeyen karakterler iceriyor.",
    en: "Letter block is invalid or contains forbidden characters.",
  },
  INVALID_DIGIT_BLOCK: {
    tr: "Rakam blogu bu yapi icin gecersiz.",
    en: "Digit block is invalid for this structure.",
  },
  UNKNOWN_SCHEME: {
    tr: "Kart seklinin BIN araligi taninmadi.",
    en: "Card scheme could not be recognized from the BIN range.",
  },
  INVALID_LENGTH_FOR_SCHEME: {
    tr: "Kart uzunlugu tespit edilen kart sekligiyle uyusmuyor.",
    en: "Card length does not match the detected scheme.",
  },
  INVALID_EMBEDDED_VKN: {
    tr: "Gomulu VKN gecersiz.",
    en: "Embedded VKN is invalid.",
  },
  UNSUPPORTED_BARCODE_TYPE: {
    tr: "Desteklenen barkod tiplerinden biri degil.",
    en: "Barcode type is not supported.",
  },
  INVALID_NUMBER_FORMAT: {
    tr: "Girdi gecerli bir sayi formatinda degil.",
    en: "Input does not parse as a valid number format.",
  },
  AMBIGUOUS_GROUPING: {
    tr: "Gruplama formati belirsiz; cagiran tarafin ayrim yapmasi gerekiyor.",
    en: "Grouping is ambiguous and must be disambiguated by the caller.",
  },
  INVALID_CURRENCY_FORMAT: {
    tr: "Para birimi formati gecersiz veya birden fazla para birimi token'i iceriyor.",
    en: "Currency format is invalid or contains multiple currency tokens.",
  },
  UNKNOWN_CURRENCY: {
    tr: "Para birimi token'i taninmiyor.",
    en: "Currency token is not recognized.",
  },
};

export function getReasonMessage(
  code: AnyReasonCode | string,
  locale: ReasonMessageLocale = "en",
): string {
  return REASON_MESSAGES[code as AnyReasonCode]?.[locale] ?? code;
}
