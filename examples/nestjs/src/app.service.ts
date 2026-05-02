import { Injectable } from "@nestjs/common";
import {
  getReasonMessage,
  validateBatch,
  type ReasonMessageLocale,
  type ValidateBatchItem,
} from "@apideposu/tr-validation";

export interface BatchRequestBody {
  items?: ValidateBatchItem[];
  locale?: ReasonMessageLocale;
}

@Injectable()
export class AppService {
  public getOverview() {
    return {
      package: "@apideposu/tr-validation",
      localOnly: true,
      note: "Validation runs inside the NestJS process. No external API call, registry lookup, or telemetry is used.",
      routes: {
        overview: "GET /",
        batch: "POST /batch",
      },
      sample: this.runBatch({
        locale: "tr",
        items: [
          { type: "iban", value: "TR62 0001 0012 3456 7890 1234 56" },
          { type: "phone", value: "0532 123 45 67" },
          { type: "plate", value: "34 ABC 123" },
        ],
      }),
    };
  }

  public runBatch(body?: BatchRequestBody) {
    const items = Array.isArray(body?.items) ? body.items : [];
    const locale = body?.locale === "en" ? "en" : "tr";

    return {
      localOnly: true,
      locale,
      invalidChecksumMessage: getReasonMessage("INVALID_CHECKSUM", locale),
      results: validateBatch(items),
    };
  }
}
