# @apideposu/tr-validation

`@apideposu/tr-validation`, Türkiye-specific form data icin local-only validation ve normalization paketidir.

## Local-Only ve Privacy

- Paket tamamen local calisir.
- API Deposu backend'ine istek atmaz.
- Veri disari gonderilmez.
- Resmi kisi, sirket, vergi veya banka hesabi dogrulamasi yapmaz.
- Registry lookup yapmaz.
- Sadece yapisal kontrol, bilinen kontrol algoritmalari ve normalizasyon saglar.

## Kapsam

v1 export'lari:

- `validateTckn`
- `validateVkn`
- `validateIban`
- `formatIban`
- `normalizeTurkishText`
- `slugifyTurkish`

## Kurulum

```bash
npm install @apideposu/tr-validation
```

## Kullanim

```ts
import {
  formatIban,
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
```

CommonJS kullanim:

```js
const { validateIban, validateTckn } = require("@apideposu/tr-validation");

const result = validateTckn("10000000146");
```

## Ornek Sonuclar

```ts
validateTckn("10000000146");
// {
//   ok: true,
//   input: "10000000146",
//   normalized: "10000000146",
//   reasons: [],
//   mode: "structural_validation",
//   localOnly: true,
//   officialVerification: false,
//   registryLookup: false
// }

validateIban("GB82WEST12345698765432");
// {
//   ok: false,
//   input: "GB82WEST12345698765432",
//   normalized: "GB82WEST12345698765432",
//   reasons: ["NON_TR_IBAN", "INVALID_LENGTH"],
//   mode: "structural_validation",
//   localOnly: true,
//   officialVerification: false,
//   registryLookup: false,
//   country: null,
//   formatted: null
// }

normalizeTurkishText("  ISTANBUL / Kadikoy  ");
// {
//   input: "  ISTANBUL / Kadikoy  ",
//   trimmed: "ISTANBUL / Kadikoy",
//   normalized: "ıstanbul / kadikoy",
//   ascii: "istanbul / kadikoy",
//   slug: "istanbul-kadikoy",
//   searchKey: "istanbul kadikoy"
// }
```

## Privacy ve Guvenlik

- Paket tamamen local calisir.
- API Deposu backend'ine istek atmaz.
- Veri disari gonderilmez.
- HTTP istegi, telemetry, analytics veya backend entegrasyonu yoktur.
- Registry lookup yapmaz.
- Bu paket resmi kisi, sirket, vergi veya banka hesabi dogrulamasi yapmaz.

## Notlar

- `validateTckn` ve `validateVkn`, yaygin ayiraclari temizleyip bilinen kontrol algoritmasi ile yapisal kontrol yapar.
- `validateIban`, yalnizca `TR` IBAN yapisini ve MOD-97 kontrolunu dogrular.
- `formatIban`, girdiyi 4'lu bloklar halinde gorunur formata cevirir.
- `normalizeTurkishText` ve `slugifyTurkish`, Turkce karakterleri ve bosluklari normalize eder.

## Gelistirme

```bash
npm test
npm run build
```
