// src/entities/dropbox/constants.ts
import type { DropDownCategory } from "@/types/photomanage/category";

// 사이즈 기본금
export const BASE_SIZE_WON = 1400 as const;

// 배송비
export const DELIVERY_FEE_WON = 3000 as const;

const formatPlusWon = (n: number) => `+${n.toLocaleString("ko-KR")}원`;

export const DROPBOX_CATEGORIES: readonly DropDownCategory[] = [
  {
    key: "FILM",
    title: "필름",
    placeholder: "",
    options: [
      { value: "SLIDE", label: "슬라이드", priceWon: 0, priceText: "+0원" },
      {
        value: "COLOR_NEGATIVE",
        label: "컬러네가",
        priceWon: 0,
        priceText: "+(0.1배)",
      },
      { value: "B_W", label: "흑백", priceWon: 0, priceText: "+(0.1배)" },
    ],
  },
  {
    key: "PRINT_METHOD",
    title: "인화 방식",
    placeholder: "",
    options: [
      {
        value: "INKJET",
        label: "잉크젯",
        priceWon: 1000,
        priceText: "+1,000원",
      },
      { value: "CPRINT", label: "CPRINT", priceWon: 0, priceText: "+0원" },
    ],
  },
  {
    key: "PAPER",
    title: "인화지",
    placeholder: "",
    options: [
      {
        value: "ECO_GLOSSY_260",
        label: "에코 글로시 260",
        priceWon: 0,
        priceText: "+0원",
      },
      {
        value: "ECO_LUSTER_255",
        label: "에코 러스터 255",
        priceWon: 50,
        priceText: "+50원",
      },
      {
        value: "EPSON_SEMI_GLOSSY_250",
        label: "앱손 세미글로시 250",
        priceWon: 50,
        priceText: "+50원",
      },
    ],
  },
  {
    key: "SIZE",
    title: "사이즈",
    // 선택 전에는 “기본금”이 보이게
    placeholder: "",
    options: [
      //  5*7은 “추가금 0”이 아니라 “기본금 포함 최종 +1,400원”
      {
        value: "5X7",
        label: "5*7",
        priceWon: BASE_SIZE_WON,
        priceText: formatPlusWon(BASE_SIZE_WON),
      },
      {
        value: "6X8",
        label: "6*8",
        priceWon: BASE_SIZE_WON + 1200, // 2600
        priceText: formatPlusWon(BASE_SIZE_WON + 1200), // +2,600원
      },
      {
        value: "8X10",
        label: "8*10",
        priceWon: BASE_SIZE_WON + 3000, // 4400
        priceText: formatPlusWon(BASE_SIZE_WON + 3000), // +4,400원
      },
      {
        value: "8X12",
        label: "8*12",
        priceWon: BASE_SIZE_WON + 4900, // 6300
        priceText: formatPlusWon(BASE_SIZE_WON + 4900), // +6,300원
      },
      {
        value: "A4",
        label: "A4",
        priceWon: BASE_SIZE_WON + 5100, // 6500
        priceText: formatPlusWon(BASE_SIZE_WON + 5100), // +6,500원
      },
      {
        value: "10X15",
        label: "10*15",
        priceWon: BASE_SIZE_WON + 6600, // 8000
        priceText: formatPlusWon(BASE_SIZE_WON + 6600), // +8,000원
      },
      {
        value: "11X14",
        label: "11*14",
        priceWon: BASE_SIZE_WON + 7000, // 8400
        priceText: formatPlusWon(BASE_SIZE_WON + 7000), // +8,400원
      },
    ],
  },
  {
    key: "PRINT_TYPE",
    title: "인화 유형",
    placeholder: "",
    options: [
      {
        value: "FRAME",
        label: "흰색 프레임 나오게",
        priceWon: 0,
        priceText: "+0원",
      },
      {
        value: "NO_FRAME",
        label: "프레임 없게",
        priceWon: 0,
        priceText: "+0원",
      },
    ],
  },
] as const;
