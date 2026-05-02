import { performance } from "node:perf_hooks";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const api = await import(pathToFileURL(path.join(rootDir, "dist/index.js")).href);

const iterations = Number(process.env.BENCH_ITERS ?? "25000");
const warmupIterations = Math.min(2_500, Math.max(500, Math.floor(iterations / 10)));

const benchmarks = [
  {
    name: "validateTckn",
    samples: ["10000000146", "100 000 001-46", "11111111110"],
    run: (input) => api.validateTckn(input),
  },
  {
    name: "validateIban",
    samples: [
      "TR62 0001 0012 3456 7890 1234 56",
      "TR62-0001-0012-3456-7890-1234-56",
      "TR00 0001 0012 3456 7890 1234 56",
    ],
    run: (input) => api.validateIban(input),
  },
  {
    name: "normalizePhone",
    samples: ["0532 123 45 67", "+90 212 555 01 23", "444 0 444"],
    run: (input) => api.normalizePhone(input),
  },
  {
    name: "normalizeProvince",
    samples: ["34", "Istanbul", "Sanliurfa"],
    run: (input) => api.normalizeProvince(input),
  },
  {
    name: "validateBatch",
    samples: [
      [
        { type: "iban", value: "TR62 0001 0012 3456 7890 1234 56" },
        { type: "phone", value: "0532 123 45 67" },
        { type: "plate", value: "34 ABC 123" },
      ],
      [
        { type: "tckn", value: "10000000146" },
        { type: "postalCode", value: "34000" },
        { type: "barcode", value: "8691234567890" },
      ],
    ],
    run: (input) => api.validateBatch(input),
  },
];

function assertBenchmarkSample(name, result) {
  if (!result || typeof result !== "object" || typeof result.ok !== "boolean") {
    if (!Array.isArray(result)) {
      throw new Error(`${name} sanity check failed`);
    }
  }
}

function formatUsPerOp(elapsedMs, count) {
  return ((elapsedMs * 1000) / count).toFixed(2);
}

function formatOpsPerSecond(elapsedMs, count) {
  return (count / (elapsedMs / 1000)).toFixed(0);
}

console.log(
  `Benchmarking built distribution with ${iterations} iterations (${warmupIterations} warmup)...`,
);

for (const benchmark of benchmarks) {
  const sampleResult = benchmark.run(benchmark.samples[0]);
  assertBenchmarkSample(benchmark.name, sampleResult);

  for (let index = 0; index < warmupIterations; index += 1) {
    benchmark.run(benchmark.samples[index % benchmark.samples.length]);
  }

  const startedAt = performance.now();
  for (let index = 0; index < iterations; index += 1) {
    benchmark.run(benchmark.samples[index % benchmark.samples.length]);
  }
  const elapsedMs = performance.now() - startedAt;

  console.log(
    `${benchmark.name}: ${formatOpsPerSecond(elapsedMs, iterations)} ops/s (${formatUsPerOp(
      elapsedMs,
      iterations,
    )} us/op)`,
  );
}
