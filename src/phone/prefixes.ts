export type TrMobilePrefixEntry = {
  readonly prefix: string;
  readonly possibleOriginalOperator: "Turkcell" | "Vodafone" | "Turk Telekom";
};

export const TR_MOBILE_PREFIXES: readonly TrMobilePrefixEntry[] = [
  { prefix: "500", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "501", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "502", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "503", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "504", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "505", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "506", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "507", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "508", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "509", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "530", possibleOriginalOperator: "Turkcell" },
  { prefix: "531", possibleOriginalOperator: "Turkcell" },
  { prefix: "532", possibleOriginalOperator: "Turkcell" },
  { prefix: "533", possibleOriginalOperator: "Turkcell" },
  { prefix: "534", possibleOriginalOperator: "Turkcell" },
  { prefix: "535", possibleOriginalOperator: "Turkcell" },
  { prefix: "536", possibleOriginalOperator: "Turkcell" },
  { prefix: "537", possibleOriginalOperator: "Turkcell" },
  { prefix: "538", possibleOriginalOperator: "Turkcell" },
  { prefix: "539", possibleOriginalOperator: "Turkcell" },
  { prefix: "540", possibleOriginalOperator: "Vodafone" },
  { prefix: "541", possibleOriginalOperator: "Vodafone" },
  { prefix: "542", possibleOriginalOperator: "Vodafone" },
  { prefix: "543", possibleOriginalOperator: "Vodafone" },
  { prefix: "544", possibleOriginalOperator: "Vodafone" },
  { prefix: "545", possibleOriginalOperator: "Vodafone" },
  { prefix: "546", possibleOriginalOperator: "Vodafone" },
  { prefix: "547", possibleOriginalOperator: "Vodafone" },
  { prefix: "548", possibleOriginalOperator: "Vodafone" },
  { prefix: "549", possibleOriginalOperator: "Vodafone" },
  { prefix: "551", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "552", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "553", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "554", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "555", possibleOriginalOperator: "Turk Telekom" },
  { prefix: "559", possibleOriginalOperator: "Turk Telekom" },
] as const;

export const TR_MOBILE_PREFIX_BY_PREFIX = new Map(
  TR_MOBILE_PREFIXES.map((entry) => [entry.prefix, entry] as const),
);
