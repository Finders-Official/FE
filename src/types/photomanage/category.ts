export type CategoryKey =
  | "FILM"
  | "PRINT_METHOD"
  | "PAPER"
  | "SIZE"
  | "PRINT_TYPE";

export type DropDownOption = {
  /** 선택 값(서버/스토어에 저장할 값) */
  value: string;
  /** 화면에 보여줄 라벨 */
  label: string;
  /** 계산용 (원 단위). 배수 옵션 등은 일단 0으로 두고 추후 정책에 맞게 확장 */
  priceWon: number;
  /** 우측 가격/배수 표기 (예: "0원", "+(0.1배)") */
  priceText: string;
};

export type DropDownCategory = {
  key: CategoryKey;
  title: string;
  /** 선택 안됐을 때 오른쪽(회색)에 보여줄 기본 문구 */
  placeholder: string;
  options: readonly DropDownOption[];
};

/** 선택 상태를 한 방에 들고가기 좋은 타입 */
export type DropDownSelection = Record<CategoryKey, DropDownOption | null>;

// 인화 옵션 API 응답

export interface PrintOptionItem {
  code: string;
  label: string;
  basePrice: number | null;
  extraPrice: number | null;
  rate: number | null;
  roundingPolicy: string | null;
}

export interface PrintOptionsResponse {
  deliveryFee: number;
  filmTypes: PrintOptionItem[];
  printMethods: PrintOptionItem[];
  paperTypes: PrintOptionItem[];
  sizes: PrintOptionItem[];
  frameTypes: PrintOptionItem[];
}
