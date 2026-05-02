"use client";

import { useState } from "react";

import {
  getReasonMessage,
  normalizePhone,
  validateIban,
  validateTckn,
} from "@apideposu/tr-validation";

type DemoState = {
  tckn: string;
  iban: string;
  phone: string;
};

const INITIAL_STATE: DemoState = {
  tckn: "10000000146",
  iban: "TR62 0001 0012 3456 7890 1234 56",
  phone: "0532 123 45 67",
};

export function ValidationDemo() {
  const [form, setForm] = useState(INITIAL_STATE);

  const tcknResult = validateTckn(form.tckn);
  const ibanResult = validateIban(form.iban);
  const phoneResult = normalizePhone(form.phone);

  const invalidReasons = [
    ...tcknResult.reasons,
    ...ibanResult.reasons,
    ...phoneResult.reasons,
  ];

  return (
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
        <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.125rem" }}>Client-side validation</h2>
        <p style={{ margin: 0, color: "#57534e", lineHeight: 1.6 }}>
          This form runs entirely in the browser. No request is sent anywhere.
        </p>
      </div>

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span>TCKN</span>
        <input
          value={form.tckn}
          onChange={(event) =>
            setForm((current) => ({ ...current, tckn: event.target.value }))
          }
          style={inputStyle}
        />
      </label>

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span>IBAN</span>
        <input
          value={form.iban}
          onChange={(event) =>
            setForm((current) => ({ ...current, iban: event.target.value }))
          }
          style={inputStyle}
        />
      </label>

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span>Phone</span>
        <input
          value={form.phone}
          onChange={(event) =>
            setForm((current) => ({ ...current, phone: event.target.value }))
          }
          style={inputStyle}
        />
      </label>

      <div
        style={{
          borderRadius: "14px",
          background: "#fafaf9",
          padding: "1rem",
          overflowX: "auto",
        }}
      >
        <pre style={{ margin: 0, fontSize: "0.85rem" }}>
          {JSON.stringify(
            {
              tckn: tcknResult,
              iban: ibanResult,
              phone: phoneResult,
              uiMessages: invalidReasons.map((code) => ({
                code,
                tr: getReasonMessage(code, "tr"),
                en: getReasonMessage(code, "en"),
              })),
            },
            null,
            2,
          )}
        </pre>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  borderRadius: "12px",
  border: "1px solid #d6d3d1",
  padding: "0.8rem 0.9rem",
  fontSize: "0.95rem",
};
