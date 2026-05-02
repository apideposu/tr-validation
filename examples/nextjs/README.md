# Next.js Example

This example shows how to use `@apideposu/tr-validation` inside a minimal Next.js App Router project.

It demonstrates:

- server-side usage in an App Router page
- client-side form validation in a `"use client"` component
- `validateBatch`
- `getReasonMessage`

## Install

From this directory:

```bash
npm install
```

This example uses a local `file:../..` dependency so it runs against the current repository checkout.

For a real project, replace that dependency with the published package version.

## Run

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## Notes

- The package runs entirely inside the Next.js app.
- No API route is required.
- No backend call or telemetry is used.
