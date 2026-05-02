export function formatIban(input: string): string {
  return normalizeIbanDisplayInput(input).replace(/(.{4})/g, "$1 ").trim();
}

function normalizeIbanDisplayInput(input: string): string {
  return input.replace(/[\s-]+/g, "").toUpperCase();
}
