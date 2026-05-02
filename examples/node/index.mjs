import {
  getReasonMessage,
  validateBatch,
  validateIban,
  validatePlate,
} from "@apideposu/tr-validation";

const iban = validateIban("TR62 0001 0012 3456 7890 1234 56");
const plate = validatePlate("34 ABC 123");
const batch = validateBatch([
  { type: "tckn", value: "10000000146" },
  { type: "phone", value: "0532 123 45 67" },
  { type: "turkishCurrency", value: "₺1.234,56" },
]);

console.log("ESM example");
console.log({ iban, plate, batch });
console.log(getReasonMessage("INVALID_CHECKSUM", "tr"));
