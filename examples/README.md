# Examples

This directory contains small integration examples for `@apideposu/tr-validation`.

Current examples:

- `node/` - plain Node.js usage with both ESM and CommonJS entrypoints
- `nextjs/` - Next.js App Router example with server-side and client-side usage
- `nestjs/` - minimal NestJS controller/service integration with local-only batch validation
- `react-hook-form/` - Vite React example using `react-hook-form`, Zod, and `@apideposu/tr-validation-zod`

Examples inside this repository use a local `file:../..` dependency so they can be run against the current checkout. In a real application, replace that dependency with the published npm version.
