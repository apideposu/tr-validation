# Release Notes

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
