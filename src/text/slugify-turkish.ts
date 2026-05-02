import { normalizeTurkishText } from "./normalize-turkish";

export function slugifyTurkish(input: string): string {
  return normalizeTurkishText(input).slug;
}
