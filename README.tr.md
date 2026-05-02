# @apideposu/tr-validation

`@apideposu/tr-validation`, Türkiye'ye özgü form verileri için local-only çalışan bir doğrulama ve normalizasyon paketidir.

English documentation: [README.md](./README.md)

## Local-Only ve Gizlilik

- Paket tamamen kullanıcının kendi projesi içinde çalışır.
- API Deposu backend'ine istek atmaz.
- Veriyi dışarı göndermez.
- Registry lookup yapmaz.
- Resmi kişi, şirket, vergi veya banka hesabı doğrulaması yapmaz.
- Sadece yapısal kontrol, bilinen kontrol algoritmaları ve normalizasyon sağlar.

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

## Kurulum

```bash
npm install @apideposu/tr-validation
```

## Kullanım

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

## Notlar

- `normalizePhone`, `libphonenumber-js` paketini local olarak kullanır ve E.164, national format, country, type ve prefix tabanlı olası ilk operatör bilgisini döndürebilir.
- Paket güncel operatör doğrulaması iddia etmez ve numara taşıma kayıtlarını sorgulamaz.
- `getProvinces` ve `getDistrictsByProvince`, paketle gelen statik JSON verisini kullanır.
- `normalizeProvince` ve `normalizeDistrict`, paket içindeki statik veri seti ile Türkçe text normalization yaklaşımını birlikte kullanır.
- `validateIban` yalnızca `TR` IBAN için çalışır ve yapısal kontrol ile MOD-97 checksum uygular.

## Dokümanlar

- Dataset maintenance: [DATASETS.md](./DATASETS.md)
- Release notes: [RELEASE_NOTES.md](./RELEASE_NOTES.md)
- Roadmap: [ROADMAP.md](./ROADMAP.md)

## Geliştirme

```bash
npm test
npm run build
```
