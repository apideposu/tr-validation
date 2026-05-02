export type { ValidationResult } from "./common/result";
export {
  CARD_REASON_CODES,
  COMMON_REASON_CODES,
  IBAN_REASON_CODES,
  LOCATION_REASON_CODES,
  MERSIS_REASON_CODES,
  PHONE_REASON_CODES,
  PLATE_REASON_CODES,
  POSTAL_CODE_REASON_CODES,
  TCKN_REASON_CODES,
  VKN_REASON_CODES,
} from "./common/reasons";
export type {
  CardReasonCode,
  CommonReasonCode,
  IbanReasonCode,
  LocationReasonCode,
  MersisReasonCode,
  PhoneReasonCode,
  PlateReasonCode,
  PostalCodeReasonCode,
  TcknReasonCode,
  VknReasonCode,
} from "./common/reasons";
export { validateCreditCard } from "./card/validate-card";
export type { CardScheme, CardValidationResult } from "./card/validate-card";
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
export { validateMersis } from "./mersis/validate-mersis";
export type { MersisValidationResult } from "./mersis/validate-mersis";
export { normalizePhone } from "./phone/normalize-phone";
export type { NormalizePhoneOptions, PhoneNormalizationResult, PhoneNumberType, PhoneOperator } from "./phone/normalize-phone";
export { validatePlate } from "./plate/validate-plate";
export type { PlateProvinceInfo, PlateValidationResult } from "./plate/validate-plate";
export { validatePostalCode } from "./postal-code/validate-postal-code";
export type { PostalCodeProvinceInfo, PostalCodeValidationResult } from "./postal-code/validate-postal-code";
export { validateTckn } from "./tckn/validate-tckn";
export type { TcknValidationResult } from "./tckn/validate-tckn";
export { normalizeTurkishText } from "./text/normalize-turkish";
export type { NormalizedTurkishText } from "./text/normalize-turkish";
export { slugifyTurkish } from "./text/slugify-turkish";
export { validateVkn } from "./vkn/validate-vkn";
export type { VknValidationResult } from "./vkn/validate-vkn";
