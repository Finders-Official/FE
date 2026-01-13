export type PhotoLabTag = "따뜻한 색감" | "빈티지한" | "택배 접수";

export type PhotoLab = {
  id: number;
  name: string;
  tags: PhotoLabTag[];
  address: string;
  distanceKm: number;
  totalWorkCount: number;
  estimatedMinutes: number;
  isFavorite: boolean;
};
