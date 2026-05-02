import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const packageJson = JSON.parse(
  readFileSync(path.join(rootDir, "package.json"), "utf8"),
);

assert.equal(packageJson.main, "./dist/index.cjs");
assert.equal(packageJson.module, "./dist/index.js");
assert.equal(packageJson.types, "./dist/index.d.ts");
assert.equal(packageJson.exports["."].import, "./dist/index.js");
assert.equal(packageJson.exports["."].require, "./dist/index.cjs");

const esm = await import(pathToFileURL(path.join(rootDir, "dist/index.js")).href);
const cjs = require(path.join(rootDir, "dist/index.cjs"));

function runSharedAssertions(api, runtime) {
  assert.equal(typeof api.validateTckn, "function", `${runtime}: validateTckn`);
  assert.equal(typeof api.validateBatch, "function", `${runtime}: validateBatch`);
  assert.equal(
    typeof api.getReasonMessage,
    "function",
    `${runtime}: getReasonMessage`,
  );

  const tckn = api.validateTckn("100 000 001-46");
  assert.equal(tckn.ok, true, `${runtime}: valid TCKN should pass`);
  assert.equal(tckn.localOnly, true, `${runtime}: TCKN should be local-only`);

  const iban = api.validateIban("TR62 0001 0012 3456 7890 1234 56");
  assert.equal(iban.ok, true, `${runtime}: valid IBAN should pass`);
  assert.equal(
    iban.formatted,
    "TR62 0001 0012 3456 7890 1234 56",
    `${runtime}: formatted IBAN mismatch`,
  );

  const phone = api.normalizePhone("0532 123 45 67");
  assert.equal(phone.ok, true, `${runtime}: valid phone should pass`);
  assert.equal(
    phone.e164,
    "+905321234567",
    `${runtime}: phone normalization mismatch`,
  );

  const numberResult = api.parseTurkishNumber("1.234,56");
  assert.equal(numberResult.ok, true, `${runtime}: TR number should parse`);
  assert.equal(numberResult.value, 1234.56, `${runtime}: number parse mismatch`);

  const batch = api.validateBatch([
    { type: "plate", value: "34 ABC 123" },
    { type: "mersis", value: "7340334753000001" },
  ]);
  assert.equal(batch.length, 2, `${runtime}: batch length mismatch`);
  assert.equal(batch[0].ok, true, `${runtime}: plate batch item should pass`);
  assert.equal(batch[1].ok, true, `${runtime}: mersis batch item should pass`);

  const message = api.getReasonMessage("INVALID_CHECKSUM", "tr");
  assert.match(
    message,
    /kontrol algoritmasi/i,
    `${runtime}: localized message mismatch`,
  );

  return {
    tckn,
    iban,
    phone,
    batch,
    message,
  };
}

const esmResults = runSharedAssertions(esm, "esm");
const cjsResults = runSharedAssertions(cjs, "cjs");

assert.deepEqual(
  {
    tckn: esmResults.tckn,
    iban: esmResults.iban,
    phone: esmResults.phone,
    batch: esmResults.batch,
    message: esmResults.message,
  },
  {
    tckn: cjsResults.tckn,
    iban: cjsResults.iban,
    phone: cjsResults.phone,
    batch: cjsResults.batch,
    message: cjsResults.message,
  },
  "esm and cjs smoke outputs should match",
);

console.log("Runtime smoke check passed for ESM and CJS entrypoints.");
