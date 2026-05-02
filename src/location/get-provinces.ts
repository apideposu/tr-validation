import { listProvinceRecords } from "./shared";
import type { ProvinceRecord } from "./types";

export function getProvinces(): ProvinceRecord[] {
  return listProvinceRecords();
}
