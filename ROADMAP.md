# Roadmap

## Direction

`@apideposu/tr-validation` is the core validation engine.

Long term:

- This package owns local-only validation and normalization logic.
- API Deposu backend consumes this package and adds hosted API metadata.
- Core algorithms should live in one place to avoid behavior drift.

## Near Term

- Keep result objects and reason codes stable across minor releases.
- Finish release hygiene for every published version: tag, GitHub release, npm smoke check, changelog.
- Improve examples and integration docs for Node.js, browsers, and form workflows.
- Add `validateBatch` and `getReasonMessage` before opening new algorithm-heavy domains.
- Add bundle-size and runtime-compatibility checks so the core package stays dependency-safe.
- Expand parity coverage between the package and backend for core behavior only.

## Possible Next Features

- `validateBatch([...])` for import, CRM, and bulk form-cleaning flows
- `getReasonMessage(code, lang)` for UI-friendly localized error text
- Optional adapter packages such as `@apideposu/tr-validation-zod`
- Framework examples for Next.js, NestJS, and plain Node.js
- Phone area-code to province hints and emergency-number classification
- Address-focused helpers built on top of the existing province and district dataset
- Turkish-formatted date parser (DD.MM.YYYY, written month names)
- Company-title normalization and tax-office normalization

## Ecosystem Strategy

- Keep `@apideposu/tr-validation` as the lightweight core package.
- Keep framework dependencies out of core. React, Zod, Valibot, NestJS, and similar integrations belong in optional adapter packages.
- Do not open multiple new repos at once. Start with examples in this repo, then create adapter repos only when the first adapter is real and publish-ready.
- Treat heavy datasets such as neighborhood/address layers as separate package candidates rather than growing the core tarball by default.
- See [ECOSYSTEM_ROADMAP.md](./ECOSYSTEM_ROADMAP.md) for the detailed phased plan.

## Out of Scope

These are intentionally not package goals:

- Backend server creation
- HTTP endpoints or API routes
- API Deposu backend integration inside the package
- Database access
- Prisma, auth, billing, subscription, or API key logic
- Telemetry or network calls
- Official registry lookup
- Official person, company, taxpayer, or bank-account verification

## Versioning

- `0.x` means the package is usable but still settling public API details.
- `1.0.0` should only happen after the core API surface and edge-case behavior are considered stable.

## 1.0.0 Before

The package should not move to `1.0.0` until all of the following are true:

- Public API shape is stable and no breaking changes are planned.
- Reason codes are finalized for the current scope.
- Real usage feedback has been collected from package consumers.
- No known core parity issues remain between the package and the hosted API wrapper.
- README limitations and privacy boundaries are clear enough to prevent common misuse.
- Core feature scope has been stable long enough to justify a stronger compatibility promise.
