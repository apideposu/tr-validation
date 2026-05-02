# Release Notes

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
