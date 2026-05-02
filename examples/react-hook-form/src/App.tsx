import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ibanSchema,
  phoneSchema,
  plateSchema,
  tcknSchema,
} from "@apideposu/tr-validation-zod";

const formSchema = z.object({
  tckn: tcknSchema({ output: "normalized" }),
  iban: ibanSchema({ output: "normalized" }),
  phone: phoneSchema({ output: "result", locale: "en" }),
  plate: plateSchema({ output: "normalized" }),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const sampleValues: FormInput = {
  tckn: "100 000 001-46",
  iban: "TR62 0001 0012 3456 7890 1234 56",
  phone: "0532 123 45 67",
  plate: "34 ABC 123",
};

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <span className="field__hint">{hint}</span>
      {children}
      <span className={`field__error${error ? " is-visible" : ""}`}>
        {error ?? " "}
      </span>
    </label>
  );
}

export default function App() {
  const [submitted, setSubmitted] = useState<FormOutput | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormInput, undefined, FormOutput>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: sampleValues,
  });

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Example</p>
        <h1>React Hook Form + Zod + local-only validation</h1>
        <p className="hero__copy">
          This example uses <code>@apideposu/tr-validation-zod</code> inside a
          React Hook Form flow. Validation stays inside the browser. No backend
          call, telemetry, or registry lookup is involved.
        </p>
      </section>

      <section className="layout">
        <form
          className="card form-card"
          onSubmit={handleSubmit((values) => setSubmitted(values))}
        >
          <div className="card__header">
            <div>
              <p className="card__eyebrow">Form</p>
              <h2>Capture raw input, submit normalized output</h2>
            </div>
            <div className="card__actions">
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  reset(sampleValues);
                  setSubmitted(null);
                }}
              >
                Reset sample
              </button>
            </div>
          </div>

          <div className="field-grid">
            <Field
              label="TCKN"
              hint="Returns the normalized 11-digit value on success."
              error={errors.tckn?.message}
            >
              <input {...register("tckn")} autoComplete="off" spellCheck={false} />
            </Field>

            <Field
              label="TR IBAN"
              hint="Runs structural checks plus MOD-97 locally."
              error={errors.iban?.message}
            >
              <input {...register("iban")} autoComplete="off" spellCheck={false} />
            </Field>

            <Field
              label="Phone"
              hint="Returns the full local-only normalization result object."
              error={errors.phone?.message}
            >
              <input
                {...register("phone")}
                autoComplete="tel-national"
                spellCheck={false}
              />
            </Field>

            <Field
              label="Plate"
              hint="Checks province code and structural plate blocks."
              error={errors.plate?.message}
            >
              <input {...register("plate")} autoComplete="off" spellCheck={false} />
            </Field>
          </div>

          <div className="submit-row">
            <button className="primary-button" disabled={isSubmitting} type="submit">
              Validate locally
            </button>
            <span className="submit-row__meta">
              {isValid
                ? "Schema is currently valid."
                : "Blur a field to see resolver-backed messages."}
            </span>
          </div>
        </form>

        <aside className="stack">
          <section className="card">
            <p className="card__eyebrow">What this proves</p>
            <h2>No custom RHF adapter required</h2>
            <ul className="bullet-list">
              <li>RHF handles field state and submit flow.</li>
              <li>Zod handles schema composition.</li>
              <li>`tr-validation-zod` wraps the core validators.</li>
              <li>The browser receives normalized output, not just booleans.</li>
            </ul>
          </section>

          <section className="card result-card">
            <div className="card__header">
              <div>
                <p className="card__eyebrow">Resolver output</p>
                <h2>Submit result</h2>
              </div>
              <span className={`pill ${submitted ? "is-success" : ""}`}>
                {submitted ? "Valid" : "Waiting"}
              </span>
            </div>

            {submitted ? (
              <>
                <div className="result-summary">
                  <div>
                    <span className="result-summary__label">Normalized TCKN</span>
                    <strong>{submitted.tckn}</strong>
                  </div>
                  <div>
                    <span className="result-summary__label">Formatted phone</span>
                    <strong>{submitted.phone.national}</strong>
                  </div>
                  <div>
                    <span className="result-summary__label">E.164</span>
                    <strong>{submitted.phone.e164}</strong>
                  </div>
                  <div>
                    <span className="result-summary__label">Operator hint</span>
                    <strong>{submitted.phone.possibleOriginalOperator ?? "Unknown"}</strong>
                  </div>
                </div>

                <pre className="result-json">
                  {JSON.stringify(submitted, null, 2)}
                </pre>
              </>
            ) : (
              <div className="empty-state">
                Submit the form to inspect the exact transformed payload that
                RHF receives from the Zod resolver.
              </div>
            )}
          </section>
        </aside>
      </section>
    </main>
  );
}
