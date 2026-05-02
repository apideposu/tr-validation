import {
  getReasonMessage,
  validateBatch,
  validatePlate,
} from "@apideposu/tr-validation";

import { ValidationDemo } from "./validation-demo";

const serverBatch = validateBatch([
  { type: "tckn", value: "10000000146" },
  { type: "phone", value: "0532 123 45 67" },
  { type: "turkishCurrency", value: "₺1.234,56" },
] as const);

const serverPlate = validatePlate("34 ABC 123");

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: "980px",
        margin: "0 auto",
        padding: "3rem 1.25rem 4rem",
        display: "grid",
        gap: "1.5rem",
      }}
    >
      <section style={{ display: "grid", gap: "0.75rem" }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#0f766e",
          }}
        >
          Next.js example
        </p>
        <h1 style={{ margin: 0, fontSize: "2.25rem", lineHeight: 1.1 }}>
          Local-only validation in a Next.js App Router app
        </h1>
        <p style={{ margin: 0, color: "#57534e", lineHeight: 1.7 }}>
          This example shows both server-side usage and client-side form validation with
          `@apideposu/tr-validation`. No API route or backend request is involved.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gap: "1rem",
          borderRadius: "20px",
          border: "1px solid #d6d3d1",
          background: "#ffffff",
          padding: "1.25rem",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.125rem" }}>Server-side usage</h2>
          <p style={{ margin: 0, color: "#57534e", lineHeight: 1.6 }}>
            These results are computed in the server component during render.
          </p>
        </div>
        <pre
          style={{
            margin: 0,
            borderRadius: "14px",
            background: "#fafaf9",
            padding: "1rem",
            overflowX: "auto",
            fontSize: "0.85rem",
          }}
        >
          {JSON.stringify(
            {
              plate: serverPlate,
              batch: serverBatch,
              sampleMessage: getReasonMessage("INVALID_CHECKSUM", "en"),
            },
            null,
            2,
          )}
        </pre>
      </section>

      <ValidationDemo />
    </main>
  );
}
