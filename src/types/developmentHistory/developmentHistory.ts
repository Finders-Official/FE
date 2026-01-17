export interface DevelopmentLog {
  id: number;
  shopName: string; // 예: 파인더스 상도점
  shopAddress: string; // 예: 서울 동작구 상도로 00길 00
  status: string; // 예: 배송, 직접 수령
  date: string; // 예: 12/25(목)
  tags: string; // 예: 현상 · 스캔 · 인화 · 2롤
  price: number; // 예: 44000
  deliveryAddress?: string; // 배송일 경우 표시될 주소
  thumbnailUrl: string; // 현상소 대표 이미지
  resultImageUrls: string[]; // 스캔 결과 이미지 리스트
}
