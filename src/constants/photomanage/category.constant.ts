// src/entities/dropbox/constants.ts (또는 너 프로젝트의 category.constant.ts)

import type { DropDownCategory } from "@/types/photomanage/category";

export const DROPBOX_CATEGORIES: readonly DropDownCategory[] = [
  {
    key: "FILM",
    title: "필름",
    placeholder: "추가 내용",
    options: [
      { value: "SLIDE", label: "슬라이드", priceWon: 0, priceText: "0원" },
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
    placeholder: "추가 내용",
    options: [
      { value: "INKJET", label: "잉크젯", priceWon: 0, priceText: "+1000원" },
      { value: "CPRINT", label: "CPRINT", priceWon: 500, priceText: "+0원" },
    ],
  },
  {
    key: "PAPER",
    title: "인화지",
    placeholder: "추가 내용",
    options: [
      {
        value: "FUJI_CRYSTAL",
        label: "후지 크리스탈",
        priceWon: 0,
        priceText: "0원",
      },
      {
        value: "KODAK_PRO",
        label: "코닥 프로",
        priceWon: 1000,
        priceText: "+1,000원",
      },
    ],
  },
  {
    key: "PROCESS",
    title: "프로세스",
    placeholder: "추가 내용",
    options: [
      { value: "DEV_ONLY", label: "현상만", priceWon: 0, priceText: "0원" },
      {
        value: "DEV_SCAN",
        label: "현상+스캔",
        priceWon: 0,
        priceText: "+(0.2배)",
      },
      {
        value: "DEV_PRINT",
        label: "현상+인화",
        priceWon: 0,
        priceText: "+(0.3배)",
      },
    ],
  },
  {
    key: "SIZE",
    title: "사이즈",
    placeholder: "추가 내용",
    options: [
      { value: "3X5", label: "3x5", priceWon: 0, priceText: "0원" },
      { value: "4X6", label: "4x6", priceWon: 500, priceText: "+500원" },
      { value: "5X7", label: "5x7", priceWon: 1000, priceText: "+1,000원" },
    ],
  },
  {
    key: "PRINT_TYPE",
    title: "인화 유형",
    placeholder: "추가 내용",
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
  {
    key: "CUTS",
    title: "컷 수",
    placeholder: "추가 내용",
    options: [
      { value: "12", label: "12컷", priceWon: 0, priceText: "0원" },
      { value: "24", label: "24컷", priceWon: 0, priceText: "+(0.1배)" },
      { value: "36", label: "36컷", priceWon: 0, priceText: "+(0.2배)" },
    ],
  },
] as const;

export const DELIVERY_FEE_WON = 3000;
//옵션은 변경될 수 있음
