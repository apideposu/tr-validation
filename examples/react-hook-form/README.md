# React Hook Form Example

This example shows how to use `@apideposu/tr-validation-zod` with `react-hook-form` and Zod inside a small Vite React app.

It demonstrates:

- React Hook Form field state and submit flow
- Zod resolver integration through `@hookform/resolvers/zod`
- local-only validators from `@apideposu/tr-validation-zod`
- normalized output coming back from the schema, not only boolean pass/fail results

## Install

From this directory:

```bash
npm install
```

This example uses:

- a local `file:../..` dependency for `@apideposu/tr-validation`
- the published `@apideposu/tr-validation-zod` package from npm

In a real project, replace the local core dependency with the published package version.

## Run

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Notes

- No API route is required.
- No backend call or telemetry is used.
- This example intentionally uses RHF through Zod first, rather than introducing a separate React Hook Form adapter package too early.
