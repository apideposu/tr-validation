export type NormalizedTurkishText = {
  input: string;
  trimmed: string;
  normalized: string;
  ascii: string;
  slug: string;
  searchKey: string;
};

const TURKISH_FOLD_MAP = {
  "\u00c7": "C",
  "\u00e7": "c",
  "\u011e": "G",
  "\u011f": "g",
  "\u0130": "I",
  "\u0131": "i",
  "\u00d6": "O",
  "\u00f6": "o",
  "\u015e": "S",
  "\u015f": "s",
  "\u00dc": "U",
  "\u00fc": "u",
} as const;

const TURKISH_CHARACTERS = /[\u00c7\u00e7\u011e\u011f\u0130\u0131\u00d6\u00f6\u015e\u015f\u00dc\u00fc]/g;

export function normalizeTurkishText(input: string): NormalizedTurkishText {
  const trimmed = normalizeWhitespace(input);
  const normalized = trimmed.toLocaleLowerCase("tr-TR");
  const ascii = foldTurkish(normalized).toLowerCase();
  const slug = ascii.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const searchKey = ascii.replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");

  return {
    input,
    trimmed,
    normalized,
    ascii,
    slug,
    searchKey,
  };
}

export function normalizeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

export function foldTurkish(input: string): string {
  return input
    .replace(TURKISH_CHARACTERS, (character) => TURKISH_FOLD_MAP[character as keyof typeof TURKISH_FOLD_MAP] ?? character)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}
