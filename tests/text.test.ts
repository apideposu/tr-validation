import { describe, expect, it } from "vitest";

import { normalizeTurkishText, slugifyTurkish } from "../src/index";

describe("normalizeTurkishText", () => {
  it("normalizes whitespace, Turkish casing, ascii fold, slug, and search key", () => {
    const result = normalizeTurkishText("  \u0130STANBUL / Kad\u0131k\u00f6y  ");

    expect(result.trimmed).toBe("\u0130STANBUL / Kad\u0131k\u00f6y");
    expect(result.normalized).toBe("istanbul / kad\u0131k\u00f6y");
    expect(result.ascii).toBe("istanbul / kadikoy");
    expect(result.slug).toBe("istanbul-kadikoy");
    expect(result.searchKey).toBe("istanbul kadikoy");
  });

  it("handles Turkish lowercasing for dotted and dotless I", () => {
    const result = normalizeTurkishText("I\u011eDIR \u0130ZM\u0130R");

    expect(result.normalized).toBe("\u0131\u011fd\u0131r izmir");
    expect(result.ascii).toBe("igdir izmir");
    expect(result.slug).toBe("igdir-izmir");
  });

  it("collapses tabs, newlines, and non-breaking spaces", () => {
    const result = normalizeTurkishText("\tI\u011eDIR\n\u0130ZM\u0130R  ");
    const nbspResult = normalizeTurkishText("  foo\u00a0\u00a0bar  ");

    expect(result.trimmed).toBe("I\u011eDIR \u0130ZM\u0130R");
    expect(result.searchKey).toBe("igdir izmir");

    expect(nbspResult.trimmed).toBe("foo bar");
    expect(nbspResult.slug).toBe("foo-bar");
  });

  it("strips combining marks and punctuation from slug-oriented outputs", () => {
    const withCombiningMark = normalizeTurkishText("Cafe\u0301 \u0130stanbul");
    const withPunctuation = normalizeTurkishText("\u015eanl\u0131urfa!!!");

    expect(withCombiningMark.normalized).toBe("cafe\u0301 istanbul");
    expect(withCombiningMark.ascii).toBe("cafe istanbul");
    expect(withCombiningMark.slug).toBe("cafe-istanbul");

    expect(withPunctuation.ascii).toBe("sanliurfa!!!");
    expect(withPunctuation.slug).toBe("sanliurfa");
    expect(withPunctuation.searchKey).toBe("sanliurfa");
  });

  it("returns empty slug and search key for whitespace-only input", () => {
    const result = normalizeTurkishText("   ");

    expect(result.trimmed).toBe("");
    expect(result.normalized).toBe("");
    expect(result.slug).toBe("");
    expect(result.searchKey).toBe("");
  });
});

describe("slugifyTurkish", () => {
  it("stays consistent with normalizeTurkishText", () => {
    const input = "\u00c7ekmek\u00f6y Belediyesi";

    expect(slugifyTurkish(input)).toBe(normalizeTurkishText(input).slug);
    expect(slugifyTurkish(input)).toBe("cekmekoy-belediyesi");
  });
});
