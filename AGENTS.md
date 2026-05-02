# Repository Guidelines

This repository is an open-source TypeScript npm package named `@apideposu/tr-validation`.

## Product Goal

Build a local-only validation and normalization toolkit for Turkiye-specific form data.

## Hard Constraints

- This is not a hosted API.
- Do not create any backend server.
- Do not create HTTP endpoints or API routes.
- Do not add API Deposu backend integration.
- Do not add database, Prisma, NestJS, auth, billing, API key, or subscription logic.
- Do not add telemetry, analytics, or network requests.
- All validation must run locally inside the user's own project.
- User data must never be sent anywhere.

## Current v1 Scope

- `validateTckn`
- `validateVkn`
- `validateIban`
- `formatIban`
- `normalizeTurkishText`
- `slugifyTurkish`

## Tooling

- TypeScript
- tsup
- Vitest
- named exports
- strict types
- MIT license

## Language Rules

Never claim official identity, tax, company, bank account, or government registry verification.

Prefer wording like:

- structural validation
- known control algorithm
- normalization
- not official verification
- no registry lookup
- local-only

## Done Criteria

- `npm test` passes
- `npm run build` passes
- `README.md` explains local-only usage and privacy clearly
