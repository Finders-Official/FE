import type { PopularLab, LabPreview } from "@/types/photoLabSearch";
import mockSearchImg from "@/assets/mocks/mocksearch.png";

// 인기 현상소 (1~8위)
export const MOCK_POPULAR_LABS: PopularLab[] = [
  { rank: 1, photoLabId: 1, name: "파인더스 현상소 상도점" },
  { rank: 2, photoLabId: 2, name: "파인더스 현상소 흑석점" },
  { rank: 3, photoLabId: 3, name: "파인더스 현상소 홍대점" },
  { rank: 4, photoLabId: 4, name: "파인더스 현상소 상도점" },
  { rank: 5, photoLabId: 5, name: "파인더스 현상소 상도점" },
  { rank: 6, photoLabId: 6, name: "파인더스 현상소 상도점" },
  { rank: 7, photoLabId: 7, name: "파인더스 현상소 상도점" },
  { rank: 8, photoLabId: 8, name: "파인더스 현상소 상도점" },
];

// 연관 검색어 (자동완성용)
export const MOCK_KEYWORD_SUGGESTIONS: string[] = [
  "초보자 현상소",
  "초보자 환영 현상소",
  "초보자 이벤트 진행",
  "따뜻한 색감",
  "청량한",
  "빈티지한",
  "영화용 필름",
  "택배 접수",
];

// 현상소 프리뷰 (자동완성용)
export const MOCK_LAB_PREVIEWS: LabPreview[] = [
  {
    photoLabId: 1,
    name: "파인더스 현상소 상도점",
    address: "서울 동작구 상도로 00길 00",
    distanceKm: 1.5,
    mainImageUrl: mockSearchImg,
  },
  {
    photoLabId: 2,
    name: "초보자를 위한 현상소 흑석점",
    address: "서울 동작구 흑석동 00길 00",
    distanceKm: 2.1,
    mainImageUrl: mockSearchImg,
  },
];
