// src/pages/development/constants.ts
import type { DevelopmentLog } from "../../types/developmentHistory/developmentHistory";

export const DEVELOPMENT_HISTORY_DATA: DevelopmentLog[] = [
  {
    id: 1,
    shopName: "파인더스 상도점",
    shopAddress: "서울 동작구 상도로 00길 00",
    status: "배송",
    date: "12/25(목)",
    tags: "현상 · 스캔 · 인화 · 2롤",
    price: 44000,
    deliveryAddress: "서울 동작구 상도로 00길 00 (000호)",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
    resultImageUrls: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
      "https://i.pinimg.com/736x/94/23/5c/94235cbf189313ff8693f55a502af32b.jpg",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
    ],
  },
  {
    id: 2,
    shopName: "파인더스 상도점",
    shopAddress: "서울 동작구 상도로 00길 00",
    status: "직접 수령",
    date: "12/25(목)",
    tags: "현상 · 스캔 · 인화 · 2롤",
    price: 44000,
    // 직접 수령은 deliveryAddress 없음
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
    resultImageUrls: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
    ],
  },
];
