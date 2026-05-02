# @apideposu/tr-validation

`@apideposu/tr-validation`, Turkiye'ye ozgu form verileri icin local-only calisan bir dogrulama ve normalizasyon paketidir.

English documentation: [README.md](./README.md)

## Local-Only ve Gizlilik

- Paket tamamen kullanicinin kendi projesi icinde calisir.
- API Deposu backend'ine istek atmaz.
- Veriyi disari gondermez.
- Registry lookup yapmaz.
- Telemetry, analytics veya network call icermez.
- Resmi kisi, sirket, vergi veya banka hesabi dogrulamasi yapmaz.
- Sadece yapisal kontrol, bilinen kontrol algoritmalari ve normalizasyon saglar.

## Sinirlar

- `validateIban` yalnizca `TR` IBAN icin calisir.
- `normalizePhone` guncel operatoru dogrulamaz ve numara tasima kayitlarini sorgulamaz.
- `possibleOriginalOperator` alani sadece prefix tabanli bir ipucudur.
- `normalizeProvince` ve `normalizeDistrict`, canli resmi kayitlar yerine paketle gelen statik veri setini kullanir.
- `Merkez` gibi belirsiz ilce adlarinda province context gerekebilir.
- Basarili sonuc, resmi dogrulama yapildigi anlamina gelmez.

## Kurulum

```bash
npm install @apideposu/tr-validation
```

## Hizli Baslangic

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

## Mevcut Kapsam

Export edilen fonksiyonlar:

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
- `validateBatch`
- `getReasonMessage`

## API Ozeti

Temel validation result yapisi:

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

Fonksiyon ozeti:

| Fonksiyon | Amac | Not |
| --- | --- | --- |
| `validateTckn(input)` | TCKN icin yapisal kontrol | Sadece format + bilinen kontrol algoritmasi |
| `validateVkn(input)` | VKN icin yapisal kontrol | Sadece format + bilinen kontrol algoritmasi |
| `validateIban(input)` | TR IBAN icin yapisal kontrol | TR-only, MOD-97 checksum |
| `formatIban(input)` | IBAN'i 4'lu gruplar halinde formatlar | Separator ve casing normalize edilir |
| `normalizeTurkishText(input)` | Turkce odakli text normalization | `trimmed`, `normalized`, `ascii`, `slug`, `searchKey` doner |
| `slugifyTurkish(input)` | Turkce slug helper | `normalizeTurkishText(input).slug` ile tutarlidir |
| `normalizePhone(input, options?)` | Turk telefon numarasini local normalize eder | `e164`, `national`, `country`, `type` ve prefix tabanli operator hint ekler |
| `getProvinces()` | Paket icindeki il listesini doner | Sadece statik dataset |
| `getDistrictsByProvince(provinceCodeOrSlug)` | Bir ile ait ilceleri doner | Sadece statik dataset |
| `normalizeProvince(input)` | Il kodu, adi veya slug ile eslesme yapar | Basariliysa `province` doner |
| `normalizeDistrict(input, options?)` | Ilce eslesmesi yapar, gerekirse province context kullanir | Basariliysa `district` ve `province` doner |
| `validateBatch(items)` | Karisik validator/parser islemlerini sirayla calistirir | Input sirasini korur ve mevcut core fonksiyonlara delege eder |
| `getReasonMessage(code, locale?)` | Reason code'lari UI dostu metne cevirir | Form ve import akislari icin `tr` / `en` mesajlar saglar |

## Genis Kullanim

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
  getReasonMessage,
  validateBatch,
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
const batch = validateBatch([
  { type: "tckn", value: "10000000146" },
  { type: "iban", value: "TR62 0001 0012 3456 7890 1234 56" },
  { type: "phone", value: "0532 123 45 67" },
]);
const message = getReasonMessage("INVALID_CHECKSUM", "tr");
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

## Ornek Sonuclar

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

Ortak reason code'lar:

| Kod | Anlami |
| --- | --- |
| `EMPTY_INPUT` | Normalizasyondan sonra input bos kaldi |
| `UNSUPPORTED_CHARACTERS` | Input desteklenmeyen karakterler iceriyor |
| `INVALID_LENGTH` | Uzunluk beklenen yapisal uzunluga uymuyor |
| `INVALID_CHECKSUM` | Bilinen kontrol algoritmasini gecemedi |

TCKN'ye ozel:

| Kod | Anlami |
| --- | --- |
| `LEADING_ZERO` | Ilk hane `0` |
| `REPEATED_DIGITS` | Tum haneler ayni |

VKN'ye ozel:

| Kod | Anlami |
| --- | --- |
| `REPEATED_DIGITS` | Tum haneler ayni |

IBAN'a ozel:

| Kod | Anlami |
| --- | --- |
| `NON_TR_IBAN` | IBAN `TR` ile baslamiyor |

Phone'a ozel:

| Kod | Anlami |
| --- | --- |
| `INVALID_PHONE` | Input gecerli bir telefon numarasi olarak parse edilemedi |
| `NON_TR_PHONE` | Numara gecerli ama Turk numarasi degil |

Location'a ozel:

| Kod | Anlami |
| --- | --- |
| `PROVINCE_NOT_FOUND` | Il eslesmesi cozulemedi |
| `DISTRICT_NOT_FOUND` | Ilce eslesmesi cozulemedi |
| `AMBIGUOUS_DISTRICT` | Ilce adi birden fazla ilde bulunuyor |

## Notlar

- `normalizePhone`, `libphonenumber-js` paketini local olarak kullanir.
- `possibleOriginalOperator`, sadece numara prefix'inden turetilir ve numara tasima nedeniyle guncel olmayabilir.
- `getProvinces` ve `getDistrictsByProvince`, paketle gelen statik JSON verisini kullanir.
- `normalizeProvince` ve `normalizeDistrict`, statik dataset ile Turkce text normalization yaklasimini birlikte kullanir.
- `validateIban`, sadece TR IBAN icin yapisal kontrol ve MOD-97 checksum uygular.

## Dokumanlar

- Katki rehberi: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Dataset maintenance: [DATASETS.md](./DATASETS.md)
- Ekosistem yol haritasi: [ECOSYSTEM_ROADMAP.md](./ECOSYSTEM_ROADMAP.md)
- Ornekler: [examples/README.md](./examples/README.md)
- Release notes: [RELEASE_NOTES.md](./RELEASE_NOTES.md)
- Roadmap: [ROADMAP.md](./ROADMAP.md)

## Gelistirme

```bash
npm run datasets:check
npm test
npm run build
npm run smoke:runtime
npm run size:check
npm run benchmark
```
