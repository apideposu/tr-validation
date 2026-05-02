# Node Example

This example shows how to use `@apideposu/tr-validation` in plain Node.js with both ESM and CommonJS.

## Install

From this directory:

```bash
npm install
```

This example uses a local `file:../..` dependency so it runs against the current repository checkout.

For a real project, replace the dependency with the published package version:

```json
{
  "dependencies": {
    "@apideposu/tr-validation": "^0.3.0"
  }
}
```

## Run

ESM:

```bash
npm run start
```

CommonJS:

```bash
npm run start:cjs
```

## What it demonstrates

- `validateIban`
- `validatePlate`
- `validateBatch`
- `getReasonMessage`
