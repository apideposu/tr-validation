# @apideposu/tr-validation

`@apideposu/tr-validation` is a local-only validation and normalization toolkit for Turkiye-specific form data.

## Local-Only and Privacy

- The package runs completely inside the user's own project.
- It does not call API Deposu backend.
- It does not send data anywhere.
- It does not perform registry lookup.
- It does not perform official person, company, tax, or bank-account verification.
- It provides structural validation, known control algorithms, and normalization only.

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

## Installation

```bash
npm install @apideposu/tr-validation
```

## Usage

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

## Notes

- `normalizePhone` uses `libphonenumber-js` locally and can return E.164, national format, country, type, and a prefix-based possible original operator hint.
- The package does not claim current operator verification and does not consult portability records.
- `getProvinces` and `getDistrictsByProvince` use bundled static JSON data.
- `normalizeProvince` and `normalizeDistrict` use the bundled static dataset plus Turkish text normalization.
- `validateIban` remains TR-only and performs structural validation plus MOD-97 checksum.

## Docs

- Release notes: [RELEASE_NOTES.md](./RELEASE_NOTES.md)
- Roadmap: [ROADMAP.md](./ROADMAP.md)

## Development

```bash
npm test
npm run build
```
