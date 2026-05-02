import { describe, expect, it } from "vitest";

import { getReasonMessage } from "../src/index";

describe("getReasonMessage", () => {
  it("returns English messages by default", () => {
    expect(getReasonMessage("INVALID_CHECKSUM")).toBe(
      "Input failed a known control algorithm.",
    );
    expect(getReasonMessage("NON_TR_PHONE")).toBe(
      "The phone number is valid but not Turkish.",
    );
  });

  it("returns Turkish messages when requested", () => {
    expect(getReasonMessage("INVALID_CHECKSUM", "tr")).toBe(
      "Bilinen kontrol algoritmasindan gecemedi.",
    );
    expect(getReasonMessage("AMBIGUOUS_GROUPING", "tr")).toBe(
      "Gruplama formati belirsiz; cagiran tarafin ayrim yapmasi gerekiyor.",
    );
  });

  it("falls back to the raw code for unknown runtime values", () => {
    expect(getReasonMessage("SOME_FUTURE_REASON")).toBe("SOME_FUTURE_REASON");
  });
});
