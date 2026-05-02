export type ValidationResult<TReason extends string> = {
  ok: boolean;
  input: string;
  normalized: string;
  reasons: TReason[];
  mode: "structural_validation";
  localOnly: true;
  officialVerification: false;
  registryLookup: false;
};

export function createValidationResult<TReason extends string>(
  input: string,
  normalized: string,
  reasons: TReason[],
): ValidationResult<TReason> {
  return {
    ok: reasons.length === 0,
    input,
    normalized,
    reasons,
    mode: "structural_validation",
    localOnly: true,
    officialVerification: false,
    registryLookup: false,
  };
}
