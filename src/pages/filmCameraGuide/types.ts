export interface GuideContentSection {
  heading: string; // 소제목
  subHeading?: string; // 부가 정보
  imageUrl: string; // 섹션별 이미지
  description: string; // 본문 설명
}

export interface FilmCameraGuide {
  id: number;
  title: string; // 카드 및 헤더 제목
  summary: string; // 카드 요약문
  thumbnailUrl: string; // 리스트 썸네일 및 상세 페이지 헤더 이미지

  // 상세 페이지용
  introText?: string; // 본격적인 리스트 시작 전 서론
  toc?: string[]; // 목차 리스트
  contents?: GuideContentSection[]; // 본문 섹션 배열
}
