export const COMMON_REASON_CODES = {
  EMPTY_INPUT: "EMPTY_INPUT",
  UNSUPPORTED_CHARACTERS: "UNSUPPORTED_CHARACTERS",
  INVALID_LENGTH: "INVALID_LENGTH",
  INVALID_CHECKSUM: "INVALID_CHECKSUM",
} as const;

export const TCKN_REASON_CODES = {
  LEADING_ZERO: "LEADING_ZERO",
  REPEATED_DIGITS: "REPEATED_DIGITS",
} as const;

export const VKN_REASON_CODES = {
  REPEATED_DIGITS: "REPEATED_DIGITS",
} as const;

export const IBAN_REASON_CODES = {
  NON_TR_IBAN: "NON_TR_IBAN",
} as const;

export const PHONE_REASON_CODES = {
  INVALID_PHONE: "INVALID_PHONE",
  NON_TR_PHONE: "NON_TR_PHONE",
} as const;

export const LOCATION_REASON_CODES = {
  PROVINCE_NOT_FOUND: "PROVINCE_NOT_FOUND",
  DISTRICT_NOT_FOUND: "DISTRICT_NOT_FOUND",
  AMBIGUOUS_DISTRICT: "AMBIGUOUS_DISTRICT",
} as const;

export const PLATE_REASON_CODES = {
  INVALID_FORMAT: "INVALID_FORMAT",
  INVALID_PROVINCE_CODE: "INVALID_PROVINCE_CODE",
  INVALID_LETTER_BLOCK: "INVALID_LETTER_BLOCK",
  INVALID_DIGIT_BLOCK: "INVALID_DIGIT_BLOCK",
} as const;

export const CARD_REASON_CODES = {
  UNKNOWN_SCHEME: "UNKNOWN_SCHEME",
  INVALID_LENGTH_FOR_SCHEME: "INVALID_LENGTH_FOR_SCHEME",
} as const;

export const MERSIS_REASON_CODES = {
  INVALID_EMBEDDED_VKN: "INVALID_EMBEDDED_VKN",
} as const;

export const POSTAL_CODE_REASON_CODES = {
  INVALID_PROVINCE_CODE: "INVALID_PROVINCE_CODE",
} as const;

export const BARCODE_REASON_CODES = {
  UNSUPPORTED_BARCODE_TYPE: "UNSUPPORTED_BARCODE_TYPE",
} as const;

export type CommonReasonCode =
  (typeof COMMON_REASON_CODES)[keyof typeof COMMON_REASON_CODES];

export type TcknReasonCode =
  | CommonReasonCode
  | (typeof TCKN_REASON_CODES)[keyof typeof TCKN_REASON_CODES];

export type VknReasonCode =
  | CommonReasonCode
  | (typeof VKN_REASON_CODES)[keyof typeof VKN_REASON_CODES];

export type IbanReasonCode =
  | CommonReasonCode
  | (typeof IBAN_REASON_CODES)[keyof typeof IBAN_REASON_CODES];

export type PhoneReasonCode =
  | CommonReasonCode
  | (typeof PHONE_REASON_CODES)[keyof typeof PHONE_REASON_CODES];

export type LocationReasonCode =
  | CommonReasonCode
  | (typeof LOCATION_REASON_CODES)[keyof typeof LOCATION_REASON_CODES];

export type PlateReasonCode =
  | CommonReasonCode
  | (typeof PLATE_REASON_CODES)[keyof typeof PLATE_REASON_CODES];

export type CardReasonCode =
  | CommonReasonCode
  | (typeof CARD_REASON_CODES)[keyof typeof CARD_REASON_CODES];

export type MersisReasonCode =
  | CommonReasonCode
  | (typeof MERSIS_REASON_CODES)[keyof typeof MERSIS_REASON_CODES];

export type PostalCodeReasonCode =
  | CommonReasonCode
  | (typeof POSTAL_CODE_REASON_CODES)[keyof typeof POSTAL_CODE_REASON_CODES];

export type BarcodeReasonCode =
  | CommonReasonCode
  | (typeof BARCODE_REASON_CODES)[keyof typeof BARCODE_REASON_CODES];
