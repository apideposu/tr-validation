# Roadmap

## Direction

`@apideposu/tr-validation` is the core validation engine.

Long term:

- This package owns local-only validation and normalization logic.
- API Deposu backend consumes this package and adds hosted API metadata.
- Core algorithms should live in one place to avoid behavior drift.

## Near Term

- Keep result objects and reason codes stable across minor releases.
- Improve examples and integration docs for Node.js, browsers, and form workflows.
- Add clearer dataset versioning notes for bundled static location data.
- Expand parity coverage between the package and backend for core behavior only.

## Possible Next Features

- Address-focused helpers built on top of the existing province and district dataset
- Additional normalization helpers for common Turkiye-specific form inputs
- More fixture-based edge-case tests for phone, district ambiguity, and mixed-format input

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
