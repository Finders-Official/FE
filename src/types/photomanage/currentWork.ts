// src/types/photomanage/currentWork.ts
export interface CurrentWorkData {
  developmentStatus: "developing" | "scanning" | "printing" | "delivering";
  imageUrl: string;
  photoId: number;
  orderedAt: string;
}

export interface CurrentWorkResponse {
  data: CurrentWorkData | null;
}
