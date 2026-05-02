import type { BarcodeValidationResult } from "../barcode/validate-barcode";
import { validateBarcode } from "../barcode/validate-barcode";
import type { CardValidationResult } from "../card/validate-card";
import { validateCreditCard } from "../card/validate-card";
import type { TurkishCurrencyParseResult } from "../format/parse-turkish-currency";
import { parseTurkishCurrency } from "../format/parse-turkish-currency";
import type { TurkishNumberParseResult } from "../format/parse-turkish-number";
import { parseTurkishNumber } from "../format/parse-turkish-number";
import type { IbanValidationResult } from "../iban/validate-iban";
import { validateIban } from "../iban/validate-iban";
import type {
  NormalizeDistrictOptions,
  NormalizeDistrictResult,
} from "../location/normalize-district";
import { normalizeDistrict } from "../location/normalize-district";
import type { NormalizeProvinceResult } from "../location/normalize-province";
import { normalizeProvince } from "../location/normalize-province";
import type { MersisValidationResult } from "../mersis/validate-mersis";
import { validateMersis } from "../mersis/validate-mersis";
import type {
  NormalizePhoneOptions,
  PhoneNormalizationResult,
} from "../phone/normalize-phone";
import { normalizePhone } from "../phone/normalize-phone";
import type { PlateValidationResult } from "../plate/validate-plate";
import { validatePlate } from "../plate/validate-plate";
import type { PostalCodeValidationResult } from "../postal-code/validate-postal-code";
import { validatePostalCode } from "../postal-code/validate-postal-code";
import type { TcknValidationResult } from "../tckn/validate-tckn";
import { validateTckn } from "../tckn/validate-tckn";
import type { VknValidationResult } from "../vkn/validate-vkn";
import { validateVkn } from "../vkn/validate-vkn";

export type BatchItemId = string | number;

type BatchItemBase<TType extends string> = {
  id?: BatchItemId;
  type: TType;
  value: string;
};

export type ValidateBatchTcknItem = BatchItemBase<"tckn">;
export type ValidateBatchVknItem = BatchItemBase<"vkn">;
export type ValidateBatchIbanItem = BatchItemBase<"iban">;
export type ValidateBatchPhoneItem = BatchItemBase<"phone"> & {
  options?: NormalizePhoneOptions;
};
export type ValidateBatchProvinceItem = BatchItemBase<"province">;
export type ValidateBatchDistrictItem = BatchItemBase<"district"> & {
  options?: NormalizeDistrictOptions;
};
export type ValidateBatchPlateItem = BatchItemBase<"plate">;
export type ValidateBatchCreditCardItem = BatchItemBase<"creditCard">;
export type ValidateBatchMersisItem = BatchItemBase<"mersis">;
export type ValidateBatchPostalCodeItem = BatchItemBase<"postalCode">;
export type ValidateBatchBarcodeItem = BatchItemBase<"barcode">;
export type ValidateBatchTurkishNumberItem = BatchItemBase<"turkishNumber">;
export type ValidateBatchTurkishCurrencyItem = BatchItemBase<"turkishCurrency">;

export type ValidateBatchItem =
  | ValidateBatchTcknItem
  | ValidateBatchVknItem
  | ValidateBatchIbanItem
  | ValidateBatchPhoneItem
  | ValidateBatchProvinceItem
  | ValidateBatchDistrictItem
  | ValidateBatchPlateItem
  | ValidateBatchCreditCardItem
  | ValidateBatchMersisItem
  | ValidateBatchPostalCodeItem
  | ValidateBatchBarcodeItem
  | ValidateBatchTurkishNumberItem
  | ValidateBatchTurkishCurrencyItem;

export type ValidateBatchResultMap = {
  tckn: TcknValidationResult;
  vkn: VknValidationResult;
  iban: IbanValidationResult;
  phone: PhoneNormalizationResult;
  province: NormalizeProvinceResult;
  district: NormalizeDistrictResult;
  plate: PlateValidationResult;
  creditCard: CardValidationResult;
  mersis: MersisValidationResult;
  postalCode: PostalCodeValidationResult;
  barcode: BarcodeValidationResult;
  turkishNumber: TurkishNumberParseResult;
  turkishCurrency: TurkishCurrencyParseResult;
};

export type ValidateBatchItemType = keyof ValidateBatchResultMap;

type ValidateBatchItemByType<TType extends ValidateBatchItemType> = Extract<
  ValidateBatchItem,
  { type: TType }
>;

export type ValidateBatchResultItem<
  TType extends ValidateBatchItemType = ValidateBatchItemType,
> = {
  index: number;
  id?: BatchItemId;
  type: TType;
  input: ValidateBatchItemByType<TType>["value"];
  ok: boolean;
  result: ValidateBatchResultMap[TType];
};

export type ValidateBatchResultTuple<TItems extends readonly ValidateBatchItem[]> = {
  [K in keyof TItems]: TItems[K] extends { type: infer TType extends ValidateBatchItemType }
    ? ValidateBatchResultItem<TType>
    : never;
};

export function validateBatch<const TItems extends readonly ValidateBatchItem[]>(
  items: TItems,
): ValidateBatchResultTuple<TItems> {
  return items.map((item, index) => {
    const result = executeBatchItem(item);

    return {
      index,
      id: item.id,
      type: item.type,
      input: item.value,
      ok: result.ok,
      result,
    };
  }) as ValidateBatchResultTuple<TItems>;
}

function executeBatchItem(
  item: ValidateBatchItem,
): ValidateBatchResultMap[ValidateBatchItemType] {
  switch (item.type) {
    case "tckn":
      return validateTckn(item.value);
    case "vkn":
      return validateVkn(item.value);
    case "iban":
      return validateIban(item.value);
    case "phone":
      return normalizePhone(item.value, item.options);
    case "province":
      return normalizeProvince(item.value);
    case "district":
      return normalizeDistrict(item.value, item.options);
    case "plate":
      return validatePlate(item.value);
    case "creditCard":
      return validateCreditCard(item.value);
    case "mersis":
      return validateMersis(item.value);
    case "postalCode":
      return validatePostalCode(item.value);
    case "barcode":
      return validateBarcode(item.value);
    case "turkishNumber":
      return parseTurkishNumber(item.value);
    case "turkishCurrency":
      return parseTurkishCurrency(item.value);
    default: {
      const unreachable: never = item;
      return unreachable;
    }
  }
}
