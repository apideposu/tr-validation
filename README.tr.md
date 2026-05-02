# @apideposu/tr-validation

`@apideposu/tr-validation`, Türkiye'ye özgü form verileri için local-only çalışan bir doğrulama ve normalizasyon paketidir.

English documentation: [README.md](./README.md)

## Local-Only ve Gizlilik

- Paket tamamen kullanıcının kendi projesi içinde çalışır.
- API Deposu backend'ine istek atmaz.
- Veriyi dışarı göndermez.
- Registry lookup yapmaz.
- Telemetry, analytics veya network call içermez.
- Resmi kişi, şirket, vergi veya banka hesabı doğrulaması yapmaz.
- Sadece yapısal kontrol, bilinen kontrol algoritmaları ve normalizasyon sağlar.

## Sınırlar

- `validateIban` yalnızca `TR` IBAN için çalışır.
- `normalizePhone` güncel operatörü doğrulamaz ve numara taşıma kayıtlarını sorgulamaz.
- `possibleOriginalOperator` alanı sadece prefix tabanlı bir ipucudur.
- `normalizeProvince` ve `normalizeDistrict`, canlı resmi kayıtlar yerine paketle gelen statik veri setini kullanır.
- `Merkez` gibi belirsiz ilçe adlarında province context gerekebilir.
- Başarılı sonuç, resmi doğrulama yapıldığı anlamına gelmez.

## Kurulum

```bash
npm install @apideposu/tr-validation
```

## Hızlı Başlangıç

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

## API Özeti

Temel validation result yapısı:

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

Fonksiyon özeti:

| Fonksiyon | Amaç | Not |
| --- | --- | --- |
| `validateTckn(input)` | TCKN için yapısal kontrol | Sadece format + bilinen kontrol algoritması |
| `validateVkn(input)` | VKN için yapısal kontrol | Sadece format + bilinen kontrol algoritması |
| `validateIban(input)` | TR IBAN için yapısal kontrol | TR-only, MOD-97 checksum |
| `formatIban(input)` | IBAN'i 4'lü gruplar halinde formatlar | Separator ve casing normalize edilir |
| `normalizeTurkishText(input)` | Türkçe odaklı text normalization | `trimmed`, `normalized`, `ascii`, `slug`, `searchKey` döner |
| `slugifyTurkish(input)` | Türkçe slug helper | `normalizeTurkishText(input).slug` ile tutarlıdır |
| `normalizePhone(input, options?)` | Türk telefon numarasını local normalize eder | `e164`, `national`, `country`, `type` ve prefix tabanlı operator hint ekler |
| `getProvinces()` | Paket içindeki il listesini döner | Sadece statik dataset |
| `getDistrictsByProvince(provinceCodeOrSlug)` | Bir ile ait ilçeleri döner | Sadece statik dataset |
| `normalizeProvince(input)` | İl kodu, adı veya slug ile eşleme yapar | Başarılıysa `province` döner |
| `normalizeDistrict(input, options?)` | İlçe eşlemesi yapar, gerekirse province context kullanır | Başarılıysa `district` ve `province` döner |

## Geniş Kullanım

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

## Örnek Sonuçlar

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

| Kod | Anlamı |
| --- | --- |
| `EMPTY_INPUT` | Normalizasyondan sonra input boş kaldı |
| `UNSUPPORTED_CHARACTERS` | Input desteklenmeyen karakterler içeriyor |
| `INVALID_LENGTH` | Uzunluk beklenen yapısal uzunluğa uymuyor |
| `INVALID_CHECKSUM` | Bilinen kontrol algoritmasını geçemedi |

TCKN'ye özel:

| Kod | Anlamı |
| --- | --- |
| `LEADING_ZERO` | İlk hane `0` |
| `REPEATED_DIGITS` | Tüm haneler aynı |

VKN'ye özel:

| Kod | Anlamı |
| --- | --- |
| `REPEATED_DIGITS` | Tüm haneler aynı |

IBAN'a özel:

| Kod | Anlamı |
| --- | --- |
| `NON_TR_IBAN` | IBAN `TR` ile başlamıyor |

Phone'a özel:

| Kod | Anlamı |
| --- | --- |
| `INVALID_PHONE` | Input geçerli bir telefon numarası olarak parse edilemedi |
| `NON_TR_PHONE` | Numara geçerli ama Türk numarası değil |

Location'a özel:

| Kod | Anlamı |
| --- | --- |
| `PROVINCE_NOT_FOUND` | İl eşleşmesi çözülemedi |
| `DISTRICT_NOT_FOUND` | İlçe eşleşmesi çözülemedi |
| `AMBIGUOUS_DISTRICT` | İlçe adı birden fazla ilde bulunuyor |

## Notlar

- `normalizePhone`, `libphonenumber-js` paketini local olarak kullanır.
- `possibleOriginalOperator`, sadece numara prefix'inden türetilir ve numara taşıma nedeniyle güncel olmayabilir.
- `getProvinces` ve `getDistrictsByProvince`, paketle gelen statik JSON verisini kullanır.
- `normalizeProvince` ve `normalizeDistrict`, statik dataset ile Türkçe text normalization yaklaşımını birlikte kullanır.
- `validateIban`, sadece TR IBAN için yapısal kontrol ve MOD-97 checksum uygular.

## Dokümanlar

- Dataset maintenance: [DATASETS.md](./DATASETS.md)
- Release notes: [RELEASE_NOTES.md](./RELEASE_NOTES.md)
- Roadmap: [ROADMAP.md](./ROADMAP.md)

## Geliştirme

```bash
npm run datasets:check
npm test
npm run build
```
