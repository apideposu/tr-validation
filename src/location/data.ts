import districtRecords from "../../data/districts.tr.json";
import provinceRecords from "../../data/provinces.tr.json";
import type { DistrictRecord, ProvinceRecord } from "./types";

export const PROVINCES = provinceRecords as ProvinceRecord[];
export const DISTRICTS = districtRecords as DistrictRecord[];
