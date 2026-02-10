import type { Region } from "@/types/photoLab";

// 지역 최대 선택 개수
export const MAX_REGION_SELECTIONS = 10;

// 서울
const SEOUL_AREAS = [
  "전체",
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구",
];

// 경기
const GYEONGGI_AREAS = [
  "전체",
  "수원시",
  "성남시",
  "고양시",
  "용인시",
  "부천시",
  "안산시",
  "안양시",
  "남양주시",
  "화성시",
  "평택시",
  "의정부시",
  "시흥시",
  "파주시",
  "광명시",
  "김포시",
  "군포시",
  "광주시",
  "이천시",
  "양주시",
  "오산시",
  "구리시",
  "안성시",
  "포천시",
  "의왕시",
  "하남시",
  "여주시",
  "양평군",
  "동두천시",
  "과천시",
  "가평군",
  "연천군",
];

// 인천
const INCHEON_AREAS = [
  "전체",
  "중구",
  "동구",
  "미추홀구",
  "연수구",
  "남동구",
  "부평구",
  "계양구",
  "서구",
  "강화군",
  "옹진군",
];

// 강원
const GANGWON_AREAS = [
  "전체",
  "춘천시",
  "원주시",
  "강릉시",
  "동해시",
  "태백시",
  "속초시",
  "삼척시",
  "홍천군",
  "횡성군",
  "영월군",
  "평창군",
  "정선군",
  "철원군",
  "화천군",
  "양구군",
  "인제군",
  "고성군",
  "양양군",
];

// 대전
const DAEJEON_AREAS = ["전체", "동구", "중구", "서구", "유성구", "대덕구"];

// 충청
const CHUNGCHEONG_AREAS = [
  "전체",
  "천안시",
  "공주시",
  "보령시",
  "아산시",
  "서산시",
  "논산시",
  "계룡시",
  "당진시",
  "청주시",
  "충주시",
  "제천시",
];

// 대구
const DAEGU_AREAS = [
  "전체",
  "중구",
  "동구",
  "서구",
  "남구",
  "북구",
  "수성구",
  "달서구",
  "달성군",
];

// 부산
const BUSAN_AREAS = [
  "전체",
  "중구",
  "서구",
  "동구",
  "영도구",
  "부산진구",
  "동래구",
  "남구",
  "북구",
  "해운대구",
  "사하구",
  "금정구",
  "강서구",
  "연제구",
  "수영구",
  "사상구",
  "기장군",
];

// 울산
const ULSAN_AREAS = ["전체", "중구", "남구", "동구", "북구", "울주군"];

// 경상
const GYEONGSANG_AREAS = [
  "전체",
  "포항시",
  "경주시",
  "김천시",
  "안동시",
  "구미시",
  "영주시",
  "창원시",
  "진주시",
  "통영시",
  "김해시",
  "밀양시",
  "거제시",
  "양산시",
];

// 광주
const GWANGJU_AREAS = ["전체", "동구", "서구", "남구", "북구", "광산구"];

// 전라
const JEOLLA_AREAS = [
  "전체",
  "목포시",
  "여수시",
  "순천시",
  "나주시",
  "광양시",
  "전주시",
  "군산시",
  "익산시",
  "정읍시",
  "남원시",
  "김제시",
];

// 제주
const JEJU_AREAS = ["전체", "제주시", "서귀포시"];

// 헬퍼: subRegions에서 "전체" 제외한 개수
const getCount = (subRegions: string[]) => subRegions.length - 1;

// 지역 목록 (추후 API 연동)
export const REGIONS: Region[] = [
  { name: "서울", count: getCount(SEOUL_AREAS), subRegions: SEOUL_AREAS },
  { name: "경기", count: getCount(GYEONGGI_AREAS), subRegions: GYEONGGI_AREAS },
  { name: "인천", count: getCount(INCHEON_AREAS), subRegions: INCHEON_AREAS },
  { name: "강원", count: getCount(GANGWON_AREAS), subRegions: GANGWON_AREAS },
  { name: "대전", count: getCount(DAEJEON_AREAS), subRegions: DAEJEON_AREAS },
  {
    name: "충청",
    count: getCount(CHUNGCHEONG_AREAS),
    subRegions: CHUNGCHEONG_AREAS,
  },
  { name: "대구", count: getCount(DAEGU_AREAS), subRegions: DAEGU_AREAS },
  { name: "부산", count: getCount(BUSAN_AREAS), subRegions: BUSAN_AREAS },
  { name: "울산", count: getCount(ULSAN_AREAS), subRegions: ULSAN_AREAS },
  {
    name: "경상",
    count: getCount(GYEONGSANG_AREAS),
    subRegions: GYEONGSANG_AREAS,
  },
  { name: "광주", count: getCount(GWANGJU_AREAS), subRegions: GWANGJU_AREAS },
  { name: "전라", count: getCount(JEOLLA_AREAS), subRegions: JEOLLA_AREAS },
  { name: "제주", count: getCount(JEJU_AREAS), subRegions: JEJU_AREAS },
];
