import type { PhotoLabDetail } from "@/types/photoLab";
import mock1 from "@/assets/mocks/mock1.jpg";
import mock2 from "@/assets/mocks/mock2.jpg";
import mock3 from "@/assets/mocks/mock3.jpg";
import mock4 from "@/assets/mocks/mock4.jpg";
import mock5 from "@/assets/mocks/mock5.jpg";
import mock6 from "@/assets/mocks/mock6.jpg";
import mock7 from "@/assets/mocks/mock7.jpg";

export const MOCK_LAB_DETAIL: PhotoLabDetail = {
  photoLabId: 1,
  name: "파인더스 현상소 상도점",
  keywords: ["따뜻한 색감", "빈티지한", "택배 접수"],
  isFavorite: true,
  address: "서울특별시 동작구 상도로",
  distanceKm: 1.5,
  location: {
    latitude: 37.50287963116875,
    longitude: 126.94790892178148,
  },
  workCount: 52,
  avgWorkTimeMinutes: 30,
  images: [
    { imageUrl: mock1, isMain: true, displayOrder: 0 },
    { imageUrl: mock2, isMain: false, displayOrder: 1 },
    { imageUrl: mock3, isMain: false, displayOrder: 2 },
  ],
  notices: [
    {
      noticeId: 1,
      noticeType: "EVENT",
      title: "첫 방문 손님 대상 10% 할인 이벤트",
      startDate: "2026-01-14",
      endDate: "2026-02-15",
      isActive: true,
    },
    {
      noticeId: 2,
      noticeType: "NOTICE",
      title: "택배 접수 시작합니다",
      startDate: "2026-01-14",
      endDate: "2026-02-15",
      isActive: true,
    },
  ],
  workResults: {
    count: 123,
    previewImageUrls: [mock4, mock5, mock6, mock7],
  },
};
