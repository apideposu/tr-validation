# Dataset Maintenance

This document defines how bundled static data should be maintained in `@apideposu/tr-validation`.

## Scope

This package currently bundles local-only location data for:

- provinces
- districts

Data files:

- [data/provinces.tr.json](./data/provinces.tr.json)
- [data/districts.tr.json](./data/districts.tr.json)

Runtime loading:

- [src/location/data.ts](./src/location/data.ts)

## Product Boundary

The bundled dataset is for local normalization and static lookup only.

It does not provide:

- official registry lookup
- UAVT lookup
- MERNIS lookup
- tax registry lookup
- company registry lookup
- current telecom/operator verification

All dataset usage must remain local-only.

## Data Shape

`provinces.tr.json` records:

- `code`
- `name`
- `normalized`
- `phoneAreaCodes`
- `districtCount`

`districts.tr.json` records:

- `provinceCode`
- `provinceName`
- `provinceNormalized`
- `name`
- `normalized`

## Source Expectations

Maintainers should only use public, redistribution-safe reference material for static province and district names.

When updating:

- prefer stable public administrative naming
- keep spelling consistent with current package conventions
- keep `normalized` values aligned with `slugifyTurkish`
- avoid inventing unofficial aliases unless there is a strong compatibility reason

## Update Triggers

Consider a dataset update when one of these happens:

- a province or district name changes officially
- a district is added, removed, merged, or split
- a record is missing from the bundled static dataset
- a normalization slug is clearly wrong
- a province phone area code entry is clearly wrong
- tests reveal an incorrect ambiguity or lookup outcome caused by data quality

Do not update the dataset for:

- cosmetic formatting preferences only
- unofficial nicknames
- speculative future administrative changes

## Update Rules

When editing bundled data:

1. update the relevant JSON file
2. verify `normalized` fields match package slug behavior
3. verify `districtCount` stays correct for every affected province
4. update or add tests for the changed behavior
5. run:

```bash
npm test
npm run build
npm pack --dry-run
```

## Versioning Policy

While the package is still in `0.x`:

- any dataset change that can affect lookup, normalization, ambiguity, or result shape should be released as a minor version
- documentation-only dataset notes can be patch releases

After `1.0.0`:

- patch:
  - non-behavioral corrections
  - comments or documentation only
- minor:
  - additive records or aliases that make previously failing input succeed without changing existing successful output
- major:
  - changes that alter existing normalized output
  - changes that alter ambiguity decisions
  - removed records
  - renamed normalized values

When in doubt, prefer the more conservative release type.

## Review Checklist

Before merging a dataset change, confirm:

- no network behavior was added
- no backend integration was added
- the package still works fully offline
- changed lookups are covered by tests
- ambiguous district behavior is still intentional
- `README` wording still reflects static dataset boundaries

## Recommended Future Improvement

If dataset updates become frequent, add a small maintainer script that:

- validates record shape
- recomputes province district counts
- checks duplicate district slug collisions
- checks that `normalized` matches `slugifyTurkish(name)`

That script should remain a local development utility, not a runtime dependency.
