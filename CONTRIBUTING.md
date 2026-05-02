# Contributing

Thanks for contributing to `@apideposu/tr-validation`.

## Project Direction

This repository is the core local-only validation engine.

- Keep validation and normalization logic local-only.
- Do not add backend servers, HTTP routes, telemetry, database access, auth, billing, or API key logic.
- Do not add API Deposu backend integration inside this package.
- Do not claim official person, company, taxpayer, bank-account, or registry verification.

The intended architecture is:

- package = core engine
- backend = hosted wrapper + metadata

## Scope Rules

Good contributions usually fit one of these areas:

- core validation or normalization behavior
- edge-case tests
- documentation
- dataset maintenance for bundled province and district records
- packaging and release hygiene

Changes that should stay out of scope:

- hosted API response fields
- gateway or billing behavior
- official registry lookup
- fraud or scoring systems
- AI-generated risk decisions

## Local Setup

```bash
npm install
npm run datasets:check
npm test
npm run build
```

## Change Expectations

- Keep named exports stable unless a breaking change is explicitly planned.
- Prefer small, explicit reason codes over vague error text.
- Add or update tests for every behavior change.
- Keep README wording privacy-safe and local-only.
- Do not log sensitive inputs.
- New core features should normally provide at least one of these:
  - checksum or known control algorithm
  - bundled dataset cross-checking
  - canonical parsing/normalization with ambiguity handling
- Regex-only helpers should not be added to the core package.
- Framework ergonomics such as Zod, React Hook Form, Valibot, NestJS, or similar integrations belong in optional adapter packages, not in core.

## Dataset Changes

If you update bundled province or district data:

- run `npm run datasets:check`
- document the change in `RELEASE_NOTES.md` if it affects consumers
- avoid silent schema or naming drift

See [DATASETS.md](./DATASETS.md) for the dataset maintenance policy.

## Pull Request Checklist

- `npm run datasets:check`
- `npm test`
- `npm run build`
- README updated if public behavior or usage changed
- no network calls, telemetry, or backend-only concerns introduced
