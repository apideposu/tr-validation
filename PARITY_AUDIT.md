# Backend vs Package Core Parity Audit

This audit compares the pure validation behavior in `../api-deposu-be` against `@apideposu/tr-validation`.

## Scope

Included:

- `validateTckn` valid/invalid decision
- `validateVkn` valid/invalid decision
- `validateIban` valid/invalid decision
- normalized output
- reason/error behavior for edge cases

Excluded:

- backend API response shape
- `warnings`
- `dataVersion`
- `bankName`
- `bankCode`
- `officialRegistryChecked`
- `accountNumberMasked`
- `paymentProviderType`
- billing/auth/API key logic
- HTTP controllers

## Sources Reviewed

- `../api-deposu-be/src/api-products/tr-validation/validators/id.validator.ts`
- `../api-deposu-be/src/api-products/tr-validation/validators/iban.validator.ts`
- `../api-deposu-be/src/api-products/tr-validation/validators/text-normalizer.ts`
- `../api-deposu-be/test/tr-validation.spec.ts`

## Matching Behaviors

### TCKN

- Normalization strips all non-digit characters before checksum evaluation.
- Inputs with common separators such as spaces, dots, underscores, slashes, and hyphens normalize to the same digit string.
- First digit cannot be `0`.
- Repeated-digit values such as `11111111111` are invalid.
- The 10th and 11th digit checksum logic matches the backend implementation.
- Unsupported characters cause the value to be treated as invalid even when the digit sequence itself would otherwise pass.

### VKN

- Normalization strips all non-digit characters before evaluation.
- Inputs with common separators normalize to the same digit string.
- Repeated-digit values such as `1111111111` are invalid.
- The core VKN checksum algorithm matches the backend implementation.
- Unsupported characters cause the value to be treated as invalid.

### IBAN

- Normalization removes spaces and hyphens, then uppercases the result.
- Validation is TR-only for the package and the backend validator path reviewed.
- Length gate is effectively `TR` plus 26-character electronic format.
- Alphanumeric structure check matches the backend behavior.
- MOD-97 checksum behavior matches the backend implementation.
- Invalid non-TR IBAN inputs remain invalid.

### Turkish Text Normalization

- `trim` + whitespace collapse behavior matches.
- `toLocaleLowerCase("tr-TR")` behavior matches.
- Turkish character folding to ASCII matches.
- `slug` and `searchKey` generation match the backend helper behavior.

## Differences Found

### Fixed in this pass

- ID inputs made entirely of unsupported letters, such as `TCKN` or `VKN`, were previously returning only `EMPTY_INPUT` in the package after digit stripping.
- The backend still marks these inputs as invalid because unsupported characters are present.
- The package now preserves `UNSUPPORTED_CHARACTERS` alongside `EMPTY_INPUT` for this case, which better reflects backend behavior and keeps reason semantics closer to the source validator.

### Still different by design

- The package uses code-based reasons such as `INVALID_LENGTH` and `INVALID_CHECKSUM`.
- The backend uses product-facing warning strings and extra metadata fields.
- This is acceptable because parity target is core decision behavior, normalized output, and edge-case intent, not literal response shape.

## Recommended Fixes

- No further algorithmic fixes are required for the current v1 scope.
- Keep package tests focused on decision parity and edge-case reasons, not backend-only metadata.
- In the next phase, refactor backend validators to consume `@apideposu/tr-validation` as the core source of truth instead of duplicating checksum logic.

## Risky Edge Cases

- Any future backend changes to accepted separators for TCKN/VKN could silently drift from the package if both sides continue to own their own normalization regexes.
- Any future backend change from TR-only IBAN to generic multi-country IBAN validation would create a deliberate parity split unless the package scope is updated too.
- Text normalization parity depends on preserving `toLocaleLowerCase("tr-TR")` and the exact Turkish fold map; small refactors here can create subtle search-key drift.
- Reason ordering is currently deterministic in the package, but consumers should treat `reasons` as a set-like list rather than depending on order.

## Conclusion

Core validation parity is in good shape for the audited scope.

- Valid/invalid decisions are aligned for TCKN, VKN, and TR IBAN validation.
- Normalized outputs are aligned for the reviewed validators.
- One edge-case reason mismatch for unsupported-only ID input was fixed.
- Remaining differences are response-model differences, which are intentionally out of scope for the package.
