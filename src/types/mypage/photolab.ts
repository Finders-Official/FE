// src/types/photolab.ts (혹은 한 파일에 같이 둬도 OK)

export type PhotoLabTag = "따뜻한 색감" | "빈티지한" | "택배 접수";

export type PhotoLab = {
  id: number;
  name: string; // 예: "파인더스 현상소 상도점"
  tags: PhotoLabTag[]; // ["따뜻한 색감", "빈티지한", "택배 접수"]
  address: string; // 예: "서울 동작구 상도 1동 000"
  distanceKm: number; // 예: 1.5
  totalWorkCount: number; // 예: 52
  estimatedMinutes: number; // 예: 30
  isFavorite: boolean; // 별(즐겨찾기) 상태
};
