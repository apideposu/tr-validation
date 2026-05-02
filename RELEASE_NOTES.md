# Release Notes

## 0.3.0 - 2026-05-02

This release significantly expands the local-only toolkit with new validators, parsers, and helpers that go beyond regex by combining structural rules, bundled static data, and known control algorithms.

Added — validators:

- `validatePlate(input)` — Turkish license plate validator. Enforces KGM letter/digit block rules and cross-checks the leading two-digit province code against the bundled province dataset. Forbidden letters (Q/W/X) are rejected.
- `validateCreditCard(input)` — credit card validator that runs Luhn checksum and detects the card scheme (Visa, Mastercard, Amex, Troy, Discover, JCB, Diners, UnionPay) from a bundled static BIN-range dataset. Returns `bin`, `last4`, and `scheme` on success.
- `validateMersis(input)` — 16-digit MERSIS number validator. Extracts the embedded 10-digit VKN and reuses the existing VKN checksum, then exposes the embedded VKN and the trailing serial.
- `validatePostalCode(input)` — 5-digit Turkish postal code validator. Cross-checks the leading two digits against the bundled province dataset and returns the matched province on success.
- `validateBarcode(input)` — EAN-13 and EAN-8 barcode validator. Computes the standard GTIN check digit and flags Turkish GS1 prefixes (868, 869).

Added — parsers:

- `parseTurkishNumber(input)` — locale-aware numeric parser. Detects TR (`1.234,56`) and EN (`1,234.56`) grouping styles. Flags `1.234` as ambiguous so callers can choose how to disambiguate.
- `parseTurkishCurrency(input)` — currency-aware numeric parser. Recognizes `₺`, `$`, `€`, `£`, `TL`, and the ISO 4217 codes for TRY, USD, EUR, GBP, CHF, JPY, AUD, CAD, RUB, AED, CNY, SAR.

Added — IBAN bank resolution:

- `resolveIbanBank(input)` — for a valid TR IBAN, resolves the 5-digit bank code (positions 5-9) against a bundled BDDK code table and returns the bank record (`code`, `name`, `type`).
- `listTrBanks()` — returns a defensive copy of the bundled BDDK bank list, suitable for dropdowns or admin UIs.

Added — text helpers:

- `titleCaseTurkish(input)` — Turkish-aware title casing. Honors `i`/`İ` and `I`/`ı` casing pairs, treats whitespace, `-`, and `/` as word separators, and keeps apostrophe-suffixed words intact.

Added — reason code groups:

- `PLATE_REASON_CODES`, `CARD_REASON_CODES`, `MERSIS_REASON_CODES`, `POSTAL_CODE_REASON_CODES`, `BARCODE_REASON_CODES`, `NUMBER_REASON_CODES`, `CURRENCY_REASON_CODES`.

Added — validation modes:

- `ValidationMode` now also accepts `"format_parse"` for parser results. Existing modes are unchanged. Existing consumers that only read specific known modes remain compatible.

Behavior and packaging:

- Public API of existing functions is unchanged. No breaking changes for current consumers.
- No new runtime dependencies were added.
- The package remains fully local-only. No network calls, no registry lookup, no official verification.
- Card BIN data and the BDDK bank list are shipped as static JSON files alongside the existing province and district datasets.

Notes:

- Plate validation accepts only structural correctness plus province code presence. It does not query the EGM registry.
- Card validation does not authorize, capture, or transmit any payment data. It only computes Luhn locally and matches against bundled BIN ranges.
- MERSIS validation does not query the trade registry; a valid result means the embedded VKN passes its checksum and the overall length is correct.
- Postal code validation only confirms structural shape and the leading province code. It does not resolve neighborhoods or street ranges.
- Barcode validation only verifies the GTIN check digit and length. It does not look up product metadata.
- Number and currency parsers are local-only string parsers; they do not perform exchange rate lookups or currency conversion.
- IBAN bank resolution uses a bundled BDDK code list. Unknown bank codes return `bank: null`. The list reflects the maintainer-curated snapshot at release time.

## 0.2.1 - 2026-05-02

This is a stabilization release focused on release readiness, documentation clarity, and deeper validation coverage.

Added:

- stronger edge-case test coverage across TCKN, VKN, IBAN, phone, location, and text helpers
- a dataset validation script for province and district JSON maintenance
- CI checks for dataset validation, tests, build, and `npm pack --dry-run`
- clearer README guidance for quick start, limitations, and reason codes

Behavior and packaging:

- no new public runtime features were added
- no backend integration was added
- the package remains fully local-only
- published package contents are unchanged except for documentation updates

Notes:

- `npm run datasets:check` now validates bundled static location data before release
- README now makes TR-only IBAN, static dataset boundaries, and prefix-based operator hints more explicit
- this release is intended to harden `0.2.x` before any further scope expansion

## 0.2.0 - 2026-05-02

This release expands the local-only toolkit beyond ID, IBAN, and text helpers.

Added:

- `normalizePhone(input, options?)`
- `getProvinces()`
- `getDistrictsByProvince(provinceCodeOrSlug)`
- `normalizeProvince(input)`
- `normalizeDistrict(input, options?)`
- Bundled static province and district datasets for Turkiye

Behavior and packaging:

- All new features run locally inside the user's own project.
- No API Deposu backend request is made.
- No external API request is made.
- No user data leaves the host application.
- Phone normalization uses `libphonenumber-js` locally.
- Province and district helpers use bundled static JSON data.

Notes:

- Phone output may include a prefix-based possible original operator hint.
- This is not current operator verification and does not check portability records.
- Location helpers normalize names and map them against bundled static data only.
- This is not official address, registry, or UAVT lookup.

## 0.1.0 - 2026-05-02

Initial public release of the local-only core validation engine.

Added:

- `validateTckn(input)`
- `validateVkn(input)`
- `validateIban(input)`
- `formatIban(input)`
- `normalizeTurkishText(input)`
- `slugifyTurkish(input)`

Behavior and packaging:

- ESM-first codebase with dual `ESM + CJS` publish output
- Strict TypeScript types
- Shared reason codes and consistent result objects
- `tsup` build
- `Vitest` test suite

Notes:

- Validation is structural only.
- The package does not perform official identity, tax, company, or bank-account verification.
- The package does not perform registry lookup.
