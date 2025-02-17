export interface ScientistSearchReq {
  name?: string;
  fosCd?: string;
  century?: number;
  page?: number;
  size?: number;
}
export interface ScientistImage {
  id: string;
  scientistId: number;
  imageDesc: string;
  imageDate: string;
}
export interface ScientistSearchRes {
  id: number;
  name: string;
  fosNm: string;
  birthYear: number;
  deathYear: number;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
  images?: ScientistImage[];
}

export interface ScientistImageSearchReq {
  imageDesc?: string;
  imageDate?: string;
  scientistId?: number;
  name?: string;
  fosCd?: string;
  century?: number;
  page?: number;
  size?: number;
}
export interface ScientistImageSearchRes {
  id: string;
  scientistId: number;
  imageDesc: string;
  imageDate: string;
  name: string;
  fosNm: string;
  birthYear: number;
  deathYear: number;
}

export interface ScientistAddReq {
  name: string;
  birthYear: number;
  deathYear: number;
  fosCd: string;
}

export interface ScientistModifyReq {
  id: number;
  name: string;
  birthYear: number;
  deathYear: number;
  fosCd: string;
}
