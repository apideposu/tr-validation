import { execSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const limits = {
  tarballBytes: 160_000,
  unpackedBytes: 1_400_000,
  entryCount: 12,
  files: {
    "dist/index.js": { raw: 230_000, gzip: 32_000 },
    "dist/index.cjs": { raw: 230_000, gzip: 32_000 },
    "dist/index.d.ts": { raw: 20_000, gzip: 4_000 },
  },
};

const packJson = execSync(`${npmCommand} pack --json --dry-run`, {
  cwd: rootDir,
  encoding: "utf8",
});

const [packResult] = JSON.parse(packJson);
const failures = [];

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

for (const [relativePath, fileLimits] of Object.entries(limits.files)) {
  const absolutePath = path.join(rootDir, relativePath);
  const rawSize = statSync(absolutePath).size;
  const gzipSize = gzipSync(readFileSync(absolutePath)).length;

  console.log(
    `${relativePath}: raw=${formatBytes(rawSize)} gzip=${formatBytes(gzipSize)}`,
  );

  if (rawSize > fileLimits.raw) {
    failures.push(
      `${relativePath} raw size ${rawSize} exceeds ${fileLimits.raw} bytes`,
    );
  }

  if (gzipSize > fileLimits.gzip) {
    failures.push(
      `${relativePath} gzip size ${gzipSize} exceeds ${fileLimits.gzip} bytes`,
    );
  }
}

console.log(
  `tarball: size=${formatBytes(packResult.size)} unpacked=${formatBytes(
    packResult.unpackedSize,
  )} files=${packResult.entryCount}`,
);

if (packResult.size > limits.tarballBytes) {
  failures.push(
    `tarball size ${packResult.size} exceeds ${limits.tarballBytes} bytes`,
  );
}

if (packResult.unpackedSize > limits.unpackedBytes) {
  failures.push(
    `unpacked size ${packResult.unpackedSize} exceeds ${limits.unpackedBytes} bytes`,
  );
}

if (packResult.entryCount > limits.entryCount) {
  failures.push(
    `tarball entry count ${packResult.entryCount} exceeds ${limits.entryCount}`,
  );
}

if (failures.length > 0) {
  console.error("\nBundle size check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("\nBundle size check passed.");
}
