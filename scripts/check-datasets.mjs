import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const provincesPath = resolve(rootDir, "data", "provinces.tr.json");
const districtsPath = resolve(rootDir, "data", "districts.tr.json");

const provinces = JSON.parse(readFileSync(provincesPath, "utf8"));
const districts = JSON.parse(readFileSync(districtsPath, "utf8"));

const provinceCodePattern = /^\d{2}$/;
const phoneAreaCodePattern = /^\d{3}$/;

const foldMap = {
  Ç: "C",
  ç: "c",
  Ğ: "G",
  ğ: "g",
  İ: "I",
  ı: "i",
  Ö: "O",
  ö: "o",
  Ş: "S",
  ş: "s",
  Ü: "U",
  ü: "u",
};

const turkishCharacters = /[ÇçĞğİıÖöŞşÜü]/g;

const errors = [];
const ambiguousDistricts = [];

function fail(message) {
  errors.push(message);
}

function normalizeWhitespace(input) {
  return input.trim().replace(/\s+/g, " ");
}

function foldTurkish(input) {
  return input
    .replace(turkishCharacters, (character) => foldMap[character] ?? character)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function slugifyTurkish(input) {
  const trimmed = normalizeWhitespace(input);
  const normalized = trimmed.toLocaleLowerCase("tr-TR");
  const ascii = foldTurkish(normalized).toLowerCase();
  return ascii.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

if (!Array.isArray(provinces)) {
  fail("provinces.tr.json must contain a top-level array.");
}

if (!Array.isArray(districts)) {
  fail("districts.tr.json must contain a top-level array.");
}

if (errors.length > 0) {
  flushAndExit();
}

const provinceByCode = new Map();
const provinceByNormalized = new Map();
const districtCounts = new Map();
const districtKeysInProvince = new Set();
const districtsByNormalized = new Map();

for (const [index, province] of provinces.entries()) {
  const label = `provinces[${index}]`;

  if (typeof province !== "object" || province === null) {
    fail(`${label} must be an object.`);
    continue;
  }

  if (typeof province.code !== "string" || !provinceCodePattern.test(province.code)) {
    fail(`${label}.code must be a two-digit string.`);
  }

  if (typeof province.name !== "string" || province.name.trim().length === 0) {
    fail(`${label}.name must be a non-empty string.`);
  }

  if (typeof province.normalized !== "string" || province.normalized.trim().length === 0) {
    fail(`${label}.normalized must be a non-empty string.`);
  }

  if (!isStringArray(province.phoneAreaCodes)) {
    fail(`${label}.phoneAreaCodes must be a string array.`);
  } else {
    for (const areaCode of province.phoneAreaCodes) {
      if (!phoneAreaCodePattern.test(areaCode)) {
        fail(`${label}.phoneAreaCodes contains invalid area code "${areaCode}".`);
      }
    }
  }

  if (!Number.isInteger(province.districtCount) || province.districtCount < 0) {
    fail(`${label}.districtCount must be a non-negative integer.`);
  }

  if (typeof province.name === "string" && typeof province.normalized === "string") {
    const expectedSlug = slugifyTurkish(province.name);
    if (province.normalized !== expectedSlug) {
      fail(
        `${label}.normalized mismatch: expected "${expectedSlug}" for province name "${province.name}".`,
      );
    }
  }

  if (provinceByCode.has(province.code)) {
    fail(`${label}.code duplicates province code "${province.code}".`);
  } else if (typeof province.code === "string") {
    provinceByCode.set(province.code, province);
  }

  if (provinceByNormalized.has(province.normalized)) {
    fail(`${label}.normalized duplicates province normalized value "${province.normalized}".`);
  } else if (typeof province.normalized === "string") {
    provinceByNormalized.set(province.normalized, province);
  }
}

for (const [index, district] of districts.entries()) {
  const label = `districts[${index}]`;

  if (typeof district !== "object" || district === null) {
    fail(`${label} must be an object.`);
    continue;
  }

  if (typeof district.provinceCode !== "string" || !provinceCodePattern.test(district.provinceCode)) {
    fail(`${label}.provinceCode must be a two-digit string.`);
    continue;
  }

  const province = provinceByCode.get(district.provinceCode);
  if (!province) {
    fail(`${label}.provinceCode "${district.provinceCode}" does not match any province.`);
    continue;
  }

  if (typeof district.provinceName !== "string" || district.provinceName !== province.name) {
    fail(
      `${label}.provinceName mismatch: expected "${province.name}" for province code "${district.provinceCode}".`,
    );
  }

  if (
    typeof district.provinceNormalized !== "string" ||
    district.provinceNormalized !== province.normalized
  ) {
    fail(
      `${label}.provinceNormalized mismatch: expected "${province.normalized}" for province code "${district.provinceCode}".`,
    );
  }

  if (typeof district.name !== "string" || district.name.trim().length === 0) {
    fail(`${label}.name must be a non-empty string.`);
  }

  if (typeof district.normalized !== "string" || district.normalized.trim().length === 0) {
    fail(`${label}.normalized must be a non-empty string.`);
  }

  if (typeof district.name === "string" && typeof district.normalized === "string") {
    const expectedSlug = slugifyTurkish(district.name);
    if (district.normalized !== expectedSlug) {
      fail(
        `${label}.normalized mismatch: expected "${expectedSlug}" for district name "${district.name}".`,
      );
    }
  }

  districtCounts.set(district.provinceCode, (districtCounts.get(district.provinceCode) ?? 0) + 1);

  const perProvinceKey = `${district.provinceCode}:${district.normalized}`;
  if (districtKeysInProvince.has(perProvinceKey)) {
    fail(
      `${label} duplicates district slug "${district.normalized}" inside province "${district.provinceCode}".`,
    );
  } else {
    districtKeysInProvince.add(perProvinceKey);
  }

  const globalMatches = districtsByNormalized.get(district.normalized) ?? [];
  globalMatches.push(district);
  districtsByNormalized.set(district.normalized, globalMatches);
}

for (const province of provinces) {
  const actualDistrictCount = districtCounts.get(province.code) ?? 0;
  if (province.districtCount !== actualDistrictCount) {
    fail(
      `Province "${province.code}" districtCount mismatch: expected ${actualDistrictCount}, found ${province.districtCount}.`,
    );
  }
}

for (const [normalized, matches] of districtsByNormalized.entries()) {
  if (matches.length > 1) {
    ambiguousDistricts.push({
      normalized,
      matches: matches.map((entry) => `${entry.provinceCode}:${entry.name}`),
    });
  }
}

flushAndExit();

function flushAndExit() {
  if (errors.length > 0) {
    console.error("Dataset validation failed.\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Dataset validation passed.");
  console.log(`- Provinces: ${provinces.length}`);
  console.log(`- Districts: ${districts.length}`);
  console.log(`- Ambiguous district slugs across provinces: ${ambiguousDistricts.length}`);

  if (ambiguousDistricts.length > 0) {
    console.log("\nAmbiguous district slugs intentionally present across provinces:");
    for (const entry of ambiguousDistricts.slice(0, 20)) {
      console.log(`- ${entry.normalized}: ${entry.matches.join(", ")}`);
    }

    if (ambiguousDistricts.length > 20) {
      console.log(`- ...and ${ambiguousDistricts.length - 20} more`);
    }
  }

  process.exit(0);
}
