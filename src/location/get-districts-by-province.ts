import { listDistrictRecordsByProvince } from "./shared";
import type { DistrictRecord } from "./types";

export function getDistrictsByProvince(provinceCodeOrSlug: string): DistrictRecord[] {
  return listDistrictRecordsByProvince(provinceCodeOrSlug);
}
