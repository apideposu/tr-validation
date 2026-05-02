export type ProvinceRecord = {
  code: string;
  name: string;
  normalized: string;
  phoneAreaCodes: string[];
  districtCount: number;
};

export type DistrictRecord = {
  provinceCode: string;
  provinceName: string;
  provinceNormalized: string;
  name: string;
  normalized: string;
};
