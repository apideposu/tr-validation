# NestJS Example

This example shows how to use `@apideposu/tr-validation` inside a minimal NestJS application.

It demonstrates:

- local-only validation inside a NestJS service
- `validateBatch`
- `getReasonMessage`
- a simple controller endpoint without any API Deposu backend dependency

## Install

From this directory:

```bash
npm install
```

This example uses a local `file:../..` dependency so it runs against the current repository checkout.

For a real project, replace that dependency with the published package version.

## Run

Build:

```bash
npm run build
```

Start the example server:

```bash
npm run start
```

The app listens on `http://localhost:3000`.

If port `3000` is already in use, set a different port before starting:

```bash
set PORT=3210 && npm run start
```

## Try it

Overview:

```bash
curl http://localhost:3000/
```

Batch validation:

```bash
curl -X POST http://localhost:3000/batch ^
  -H "Content-Type: application/json" ^
  -d "{\"locale\":\"tr\",\"items\":[{\"type\":\"iban\",\"value\":\"TR62 0001 0012 3456 7890 1234 56\"},{\"type\":\"phone\",\"value\":\"0532 123 45 67\"}]}"
```

## Notes

- The package runs entirely inside the NestJS process.
- No external API call or telemetry is used.
- The example intentionally avoids framework-specific validation libraries so the core package stays framework-agnostic.
