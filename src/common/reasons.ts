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
