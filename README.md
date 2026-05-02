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
- `validatePlate`
- `validateCreditCard`
- `validateMersis`
- `validatePostalCode`
- `validateBarcode`
- `parseTurkishNumber`
- `parseTurkishCurrency`
- `resolveIbanBank`
- `listTrBanks`
- `titleCaseTurkish`
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
| `validatePlate(input)` | Structural validation for TR license plate | KGM block rules + province code cross-check |
| `validateCreditCard(input)` | Luhn checksum + BIN-based scheme detection | Visa, Mastercard, Amex, Troy, Discover, JCB, Diners, UnionPay |
| `validateMersis(input)` | Structural validation for 16-digit MERSIS number | Extracts the embedded VKN and reuses the VKN checksum |
| `validatePostalCode(input)` | Structural validation for 5-digit TR postal code | First two digits cross-checked against the province dataset |
| `validateBarcode(input)` | EAN-13 / EAN-8 checksum validation | Detects type and flags Turkish GS1 prefixes (868, 869) |
| `parseTurkishNumber(input)` | Locale-aware numeric parser | Detects TR (`1.234,56`) vs EN (`1,234.56`) grouping; flags ambiguous `1.234` |
| `parseTurkishCurrency(input)` | Currency-aware numeric parser | Recognizes `₺`, `$`, `€`, `£`, `TL`, ISO 4217 codes (TRY, USD, EUR, GBP, ...) |
| `resolveIbanBank(input)` | Resolves a bank from a valid TR IBAN | Uses bundled BDDK code table, returns `null` for unknown codes |
| `listTrBanks()` | Returns the bundled TR bank list | Defensive copy, suitable for dropdowns |
| `titleCaseTurkish(input)` | Title-cases text with Turkish I/İ rules | Treats whitespace, `-`, `/` as word separators; keeps apostrophe-suffixed words single |
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

validatePlate("34 ABC 12");
// {
//   ok: true,
//   input: "34 ABC 12",
//   normalized: "34ABC12",
//   reasons: [],
//   mode: "structural_validation",
//   localOnly: true,
//   officialVerification: false,
//   registryLookup: false,
//   province: { code: "34", name: "İstanbul" },
//   letters: "ABC",
//   digits: "12",
//   formatted: "34 ABC 12"
// }

validateCreditCard("4111 1111 1111 1111");
// {
//   ok: true,
//   input: "4111 1111 1111 1111",
//   normalized: "4111111111111111",
//   reasons: [],
//   mode: "structural_validation",
//   localOnly: true,
//   officialVerification: false,
//   registryLookup: false,
//   scheme: "visa",
//   bin: "411111",
//   last4: "1111"
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

Plate-specific:

| Code | Meaning |
| --- | --- |
| `INVALID_FORMAT` | Plate does not match the `<2-digit code><1-3 letters><1-4 digits>` structure |
| `INVALID_PROVINCE_CODE` | First two digits are not a recognized province code (01-81) |
| `INVALID_LETTER_BLOCK` | Letter block contains forbidden letters (Q/W/X) or wrong count |
| `INVALID_DIGIT_BLOCK` | Digit count does not match the letter block (e.g. 1 letter requires 4 digits) |

Card-specific:

| Code | Meaning |
| --- | --- |
| `UNKNOWN_SCHEME` | Card prefix does not match any known scheme (Visa, Mastercard, Amex, Troy, Discover, JCB, Diners, UnionPay) |
| `INVALID_LENGTH_FOR_SCHEME` | Card length does not match the detected scheme's allowed lengths |

MERSIS-specific:

| Code | Meaning |
| --- | --- |
| `INVALID_EMBEDDED_VKN` | The first 10 digits do not form a valid VKN (fail VKN checksum) |

Postal-code-specific:

| Code | Meaning |
| --- | --- |
| `INVALID_PROVINCE_CODE` | First two digits are not a recognized province code (01-81) |

Barcode-specific:

| Code | Meaning |
| --- | --- |
| `UNSUPPORTED_BARCODE_TYPE` | Length does not match any supported barcode type (currently EAN-13 and EAN-8) |

Number-specific:

| Code | Meaning |
| --- | --- |
| `INVALID_NUMBER_FORMAT` | Input does not parse as a valid number under either locale |
| `AMBIGUOUS_GROUPING` | Input like `1.234` could be either thousands grouping or a decimal — caller must disambiguate |

Currency-specific:

| Code | Meaning |
| --- | --- |
| `INVALID_CURRENCY_FORMAT` | Multiple currency tokens or otherwise malformed currency input |
| `UNKNOWN_CURRENCY` | Currency token is not in the bundled ISO 4217 / symbol set |

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
