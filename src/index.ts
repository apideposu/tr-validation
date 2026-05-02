export type { ValidationResult } from "./common/result";
export {
  COMMON_REASON_CODES,
  IBAN_REASON_CODES,
  LOCATION_REASON_CODES,
  PHONE_REASON_CODES,
  TCKN_REASON_CODES,
  VKN_REASON_CODES,
} from "./common/reasons";
export type {
  CommonReasonCode,
  IbanReasonCode,
  LocationReasonCode,
  PhoneReasonCode,
  TcknReasonCode,
  VknReasonCode,
} from "./common/reasons";
export { formatIban } from "./iban/format-iban";
export { validateIban } from "./iban/validate-iban";
export type { IbanValidationResult } from "./iban/validate-iban";
export { getDistrictsByProvince } from "./location/get-districts-by-province";
export { getProvinces } from "./location/get-provinces";
export { normalizeDistrict } from "./location/normalize-district";
export type { NormalizeDistrictOptions, NormalizeDistrictResult } from "./location/normalize-district";
export { normalizeProvince } from "./location/normalize-province";
export type { NormalizeProvinceResult } from "./location/normalize-province";
export type { DistrictRecord, ProvinceRecord } from "./location/types";
export { normalizePhone } from "./phone/normalize-phone";
export type { NormalizePhoneOptions, PhoneNormalizationResult, PhoneNumberType, PhoneOperator } from "./phone/normalize-phone";
export { validateTckn } from "./tckn/validate-tckn";
export type { TcknValidationResult } from "./tckn/validate-tckn";
export { normalizeTurkishText } from "./text/normalize-turkish";
export type { NormalizedTurkishText } from "./text/normalize-turkish";
export { slugifyTurkish } from "./text/slugify-turkish";
export { validateVkn } from "./vkn/validate-vkn";
export type { VknValidationResult } from "./vkn/validate-vkn";
