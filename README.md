# @apideposu/tr-validation

`@apideposu/tr-validation` is a local-only validation and normalization toolkit for Turkiye-specific form data.

Turkish documentation: [README.tr.md](./README.tr.md)

## Local-Only and Privacy

- The package runs completely inside the user's own project.
- It does not call API Deposu backend.
- It does not send data anywhere.
- It does not perform registry lookup.
- It does not include telemetry, analytics, or network calls.
- It does not perform official person, company, tax, or bank-account verification.
- It provides structural validation, known control algorithms, and normalization only.

## Limitations

- `validateIban` is TR-only.
- `normalizePhone` does not verify the current operator and does not check portability records.
- `possibleOriginalOperator` is a prefix-based hint only.
- `normalizeProvince` and `normalizeDistrict` rely on bundled static data, not live government or address registries.
- Ambiguous district names such as `Merkez` may require province context.
- A successful result does not mean official verification.

## Installation

```bash
npm install @apideposu/tr-validation
```

## Quick Start

```ts
import {
  normalizePhone,
  validateIban,
  validateTckn,
} from "@apideposu/tr-validation";

const tckn = validateTckn("100 000 001-46");
const iban = validateIban("tr62 0001 0012 3456 7890 1234 56");
const phone = normalizePhone("0532 123 45 67");
```

## Current Scope

Exports:

- `validateTckn`
- `validateVkn`
- `validateIban`
- `formatIban`
- `normalizeTurkishText`
- `slugifyTurkish`
- `normalizePhone`
- `getProvinces`
- `getDistrictsByProvince`
- `normalizeProvince`
- `normalizeDistrict`

## API Overview

Base validation result shape:

```ts
{
  ok: boolean;
  input: string;
  normalized: string;
  reasons: string[];
  mode: "structural_validation" | "number_plan_parse" | "static_dataset";
  localOnly: true;
  officialVerification: false;
  registryLookup: false;
}
```

Function summary:

| Function | Purpose | Notes |
| --- | --- | --- |
| `validateTckn(input)` | Structural validation for TCKN | Format + known control algorithm only |
| `validateVkn(input)` | Structural validation for VKN | Format + known control algorithm only |
| `validateIban(input)` | Structural validation for TR IBAN | TR-only, MOD-97 checksum |
| `formatIban(input)` | Formats an IBAN in 4-character groups | Normalizes separators and casing |
| `normalizeTurkishText(input)` | Turkish-aware text normalization | Returns `trimmed`, `normalized`, `ascii`, `slug`, `searchKey` |
| `slugifyTurkish(input)` | Slug helper for Turkish text | Consistent with `normalizeTurkishText(input).slug` |
| `normalizePhone(input, options?)` | Local Turkish phone parsing and normalization | Adds `e164`, `national`, `country`, `type`, and prefix-based operator hint |
| `getProvinces()` | Returns bundled province records | Static dataset only |
| `getDistrictsByProvince(provinceCodeOrSlug)` | Returns districts for a province | Static dataset only |
| `normalizeProvince(input)` | Matches a province by code, name, or slug | Returns `province` on success |
| `normalizeDistrict(input, options?)` | Matches a district, optionally within a province | Returns `district` and `province` on success |

## Extended Usage

```ts
import {
  formatIban,
  getDistrictsByProvince,
  getProvinces,
  normalizeDistrict,
  normalizePhone,
  normalizeProvince,
  normalizeTurkishText,
  slugifyTurkish,
  validateIban,
  validateTckn,
  validateVkn,
} from "@apideposu/tr-validation";

const tckn = validateTckn("100 000 001-46");
const vkn = validateVkn("734.033.4753");
const iban = validateIban("tr62 0001 0012 3456 7890 1234 56");
const formattedIban = formatIban("tr620001001234567890123456");
const text = normalizeTurkishText("  ISTANBUL / Kadikoy  ");
const slug = slugifyTurkish("Cekmekoy Belediyesi");

const phone = normalizePhone("0532 123 45 67");
const provinces = getProvinces();
const districts = getDistrictsByProvince("34");
const province = normalizeProvince("Istanbul");
const district = normalizeDistrict("Kadikoy", { province: "34" });
```

CommonJS:

```js
const {
  normalizePhone,
  validateIban,
  validateTckn,
} = require("@apideposu/tr-validation");

const result = normalizePhone("0532 123 45 67");
```

## Example Results

```ts
normalizePhone("0532 123 45 67");
// {
//   ok: true,
//   input: "0532 123 45 67",
//   normalized: "+905321234567",
//   reasons: [],
//   mode: "number_plan_parse",
//   localOnly: true,
//   officialVerification: false,
//   registryLookup: false,
//   e164: "+905321234567",
//   national: "0532 123 45 67",
//   extension: null,
//   country: "TR",
//   type: "mobile",
//   possibleOriginalOperator: "Turkcell",
//   operatorConfidence: "prefix_based"
// }

normalizeProvince("34");
// {
//   ok: true,
//   input: "34",
//   normalized: "istanbul",
//   reasons: [],
//   mode: "static_dataset",
//   localOnly: true,
//   officialVerification: false,
//   registryLookup: false,
//   province: {
//     code: "34",
//     name: "Istanbul",
//     normalized: "istanbul",
//     phoneAreaCodes: ["212", "216"],
//     districtCount: 39
//   }
// }

normalizeDistrict("Merkez");
// {
//   ok: false,
//   input: "Merkez",
//   normalized: "merkez",
//   reasons: ["AMBIGUOUS_DISTRICT"],
//   mode: "static_dataset",
//   localOnly: true,
//   officialVerification: false,
//   registryLookup: false,
//   district: null,
//   province: null
// }
```

## Reason Codes

Common reason codes:

| Code | Meaning |
| --- | --- |
| `EMPTY_INPUT` | Input is empty after normalization |
| `UNSUPPORTED_CHARACTERS` | Input contains unsupported characters |
| `INVALID_LENGTH` | Input length does not match the expected structural length |
| `INVALID_CHECKSUM` | Input fails a known control algorithm |

TCKN-specific:

| Code | Meaning |
| --- | --- |
| `LEADING_ZERO` | First digit is `0` |
| `REPEATED_DIGITS` | All digits are the same |

VKN-specific:

| Code | Meaning |
| --- | --- |
| `REPEATED_DIGITS` | All digits are the same |

IBAN-specific:

| Code | Meaning |
| --- | --- |
| `NON_TR_IBAN` | IBAN does not start with `TR` |

Phone-specific:

| Code | Meaning |
| --- | --- |
| `INVALID_PHONE` | Input cannot be parsed as a valid phone number |
| `NON_TR_PHONE` | Input is valid as a phone number but not a Turkish one |

Location-specific:

| Code | Meaning |
| --- | --- |
| `PROVINCE_NOT_FOUND` | Province match could not be resolved |
| `DISTRICT_NOT_FOUND` | District match could not be resolved |
| `AMBIGUOUS_DISTRICT` | District name matches multiple provinces |

## Notes

- `normalizePhone` uses `libphonenumber-js` locally.
- `possibleOriginalOperator` is derived from number prefixes only and may be outdated because of number portability.
- `getProvinces` and `getDistrictsByProvince` use bundled static JSON data.
- `normalizeProvince` and `normalizeDistrict` use the bundled static dataset plus Turkish text normalization.
- `validateIban` performs structural validation plus MOD-97 checksum for TR IBAN values only.

## Docs

- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Dataset maintenance: [DATASETS.md](./DATASETS.md)
- Release notes: [RELEASE_NOTES.md](./RELEASE_NOTES.md)
- Roadmap: [ROADMAP.md](./ROADMAP.md)

## Development

```bash
npm run datasets:check
npm test
npm run build
```
