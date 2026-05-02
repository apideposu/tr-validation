export type ValidationMode =
  | "structural_validation"
  | "number_plan_parse"
  | "static_dataset";

export type ValidationResult<
  TReason extends string,
  TMode extends ValidationMode = "structural_validation",
> = {
  ok: boolean;
  input: string;
  normalized: string;
  reasons: TReason[];
  mode: TMode;
  localOnly: true;
  officialVerification: false;
  registryLookup: false;
};

export function createValidationResult<
  TReason extends string,
  TMode extends ValidationMode = "structural_validation",
>(
  input: string,
  normalized: string,
  reasons: TReason[],
  mode?: TMode,
): ValidationResult<TReason, TMode> {
  return {
    ok: reasons.length === 0,
    input,
    normalized,
    reasons,
    mode: (mode ?? "structural_validation") as TMode,
    localOnly: true,
    officialVerification: false,
    registryLookup: false,
  };
}
