# Ecosystem Roadmap

This document defines how `@apideposu/tr-validation` should evolve now that it is a published dependency package, not just a small internal validator repo.

## Core Principle

The package should optimize for:

1. stability
2. integration ergonomics
3. adapter ecosystem fit
4. package size and dependency quality
5. multi-runtime compatibility
6. only then, new parser or dataset-heavy domains

The rule is simple:

- core stays light
- adapters stay optional
- heavy datasets stay isolated

## What Counts as a Core Feature

A new core feature should normally be accepted only if it provides at least one of these:

- a checksum or known control algorithm
- bundled static dataset cross-checking
- canonical parsing or normalization with ambiguity handling

Features that are only regex wrappers should not be added to the core package.

## Core Package Policy

The core package must continue behaving like a safe shared dependency:

- no runtime network calls
- no telemetry
- no backend integration
- no global mutable state
- no side effects on import
- tree-shaking friendly exports
- browser + Node compatibility
- ESM + CJS publish output until a deliberate major-version decision changes that
- breaking changes only in major releases
- new runtime dependencies only with strong justification

## Repo and Package Strategy

Do not create many repos at once.

Safe sequence:

1. keep this repository as the source of truth for the core package
2. add `examples/` inside this repo first
3. create adapter packages only when their API is real and publish-ready
4. move heavy address or neighborhood logic into separate packages instead of inflating core

Recommended package split:

- `@apideposu/tr-validation`
  - core algorithms, structural validators, canonical parsers, lightweight static datasets
- `@apideposu/tr-validation-zod`
  - optional Zod schemas and helpers
- `@apideposu/tr-validation-valibot`
  - optional Valibot integration if real demand appears
- `@apideposu/tr-validation-rhf`
  - optional React Hook Form resolver and helpers
- `@apideposu/tr-validation-address`
  - heavier address intelligence and larger static datasets

Recommended repo timing:

- now: no new repo required
- first: add examples in the current repo
- later: open adapter repos when the first adapter leaves RFC stage
- later: open a dedicated address repo only if dataset size or release cadence diverges from core

## Immediate Operational Work

Before new feature expansion:

1. create a Git tag and GitHub release for each published npm version
2. keep release notes current
3. run package smoke checks:
   - `npm test`
   - `npm run build`
   - `npm pack --dry-run`
4. watch tarball size and dependency growth
5. keep backend parity limited to core behavior, not hosted metadata

## Phase Plan

## Phase 0: Release Hygiene

Goal:

- make every release trustworthy and reproducible

Scope:

- GitHub release notes
- npm package page review
- changelog discipline
- bundle-size tracking
- lightweight benchmark baseline

Non-goals:

- new validators
- new framework dependencies

## Phase 1: Core DX and Integration

Goal:

- make the package easier to integrate into real applications

Priority items:

- `validateBatch([...])`
- `getReasonMessage(code, lang)`
- examples for:
  - Node.js
  - Next.js
  - NestJS
- better integration snippets in README

Why first:

- these changes improve adoption without expanding algorithm scope
- they strengthen the package as infrastructure

## Phase 2: Optional Adapter Packages

Goal:

- improve framework ergonomics without polluting core

Priority items:

- `@apideposu/tr-validation-zod`
- evaluate `@apideposu/tr-validation-rhf`
- evaluate `@apideposu/tr-validation-valibot`

Rules:

- adapters must depend on core, not the other way around
- core must not gain Zod, React, or framework dependencies
- adapters should start only after the interface they wrap is stable enough

## Phase 3: Runtime and Package Quality

Goal:

- keep the package safe as a transitive dependency

Priority items:

- explicit bundle-size checks
- smoke tests for Node + browser bundlers
- import-surface tests for ESM and CJS
- verify tree-shaking expectations
- dependency review before each new runtime package is added

## Phase 4: Address Intelligence RFC

Goal:

- design a high-value parser domain without bloating core prematurely

Start with an RFC before implementation.

Candidate scope:

- `parseAddress`
- `normalizeAddressComponents`
- province/district/postal-code cross-check
- ambiguity reporting

Why RFC first:

- address parsing can become dataset-heavy very quickly
- mahalle/neighborhood layers can explode tarball size
- ambiguity rules must be explicit before public API design

Default direction:

- keep the first address MVP small
- consider a separate `@apideposu/tr-validation-address` package for larger datasets

## Phase 5: Business and Company Layer

Goal:

- add high-signal business helpers that still fit the core philosophy

Candidates:

- company-title normalization
- tax-office normalization
- richer MERSIS component parsing

Only accept these when they do more than shape checking.

## Things We Should Not Chase

These would either dilute the package or create misleading expectations:

- passport validation with only format checks
- drivers-license validation with only format checks
- identity serial-number checks that are effectively regex-only
- official registry lookup
- bank-account ownership verification
- live operator verification
- fraud scoring
- AI-based risk scoring

## Evaluating External References

People will keep pointing at existing TR validation libraries on GitHub, npm, Packagist, and gists. Most of them are not worth a deep look. Use this matrix as a fast filter before spending time on any external reference.

A reference deserves real evaluation only if **all four** of these are true:

1. The repository is Node.js or TypeScript. PHP, C#, .NET, ASP.NET, Laravel, and standalone regex gists do not produce portable code for this package.
2. The license is MIT, Apache-2.0, BSD, or ISC. GPL and AGPL create license-incompatibility risk for an MIT package and should be ruled out immediately.
3. The repository has been actively maintained in the last twelve months. Stale, archived, abandoned, or single-author single-day repositories have no review value.
4. It does something this package does not already cover, or covers a known case better than the current implementation.

If any of the four answers is no, the reference is noise and should be closed without further discussion.

If all four answers are yes, the reference may still not be merged, copied, or depended on. The most we should do is:

- treat it as a black-box behavior comparison through input/output test fixtures
- never paste code, identifiers, comments, or test data verbatim
- never name the source in README, source code, commit messages, or release notes — to avoid implied endorsement and to avoid widening the license-contact surface

Specifically out of bounds even when the four answers are yes:

- any code that calls NVI, KPSPublic, KPSPublicV2, e-Devlet, or any registry endpoint
- any code that disables TLS verification (for example `CURLOPT_SSL_VERIFYPEER => false` or its language equivalents)
- any code shipped as a Laravel translation file, an ASP.NET error describer, or another framework-specific i18n bundle — those are not validators
- any "official verification adapter" idea inside this package, regardless of how the source repository structures it

This rule exists so that scope decisions stay based on the package philosophy in [Core Package Policy](#core-package-policy) and [Things We Should Not Chase](#things-we-should-not-chase), not on what other repositories happen to do.

## Definition of Progress

The package is improving when:

- integration gets easier
- the public contract gets more stable
- package weight stays under control
- runtime safety stays obvious
- algorithmic value stays high

The package is not improving when:

- it accumulates low-value regex helpers
- core starts depending on frameworks
- tarball size grows faster than real value
- users can no longer tell the difference between structural validation and official verification
