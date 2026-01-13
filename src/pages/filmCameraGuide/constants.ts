import type { FilmCameraGuide } from "./types";

export const FILM_CAMERA_GUIDE_DATA: FilmCameraGuide[] = [
  {
    id: 1,
    title: "동작구 출사 맛집 Best 5.",
    summary: "추운 날씨도 따뜻해보이게 만드는 사진 명소 추천합니다",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&q=80&w=1000",
    toc: [
      "노을이 예쁜 한강 뷰",
      "필름 감성 골목",
      "빛이 고운 공원",
      "조용한 동네 산책길",
      "오래된 건물과 거리",
    ],
    introText: `셔터를 누르기 전의 망설임도 필름 사진의 일부라고 생각해요. 어디서 찍을지 고민하는 그 시간까지도 사진의 분위기가 되는 곳.\n\n동작구는 천천히 걷다 보면 자연스럽게 카메라를 들게 되는 동네입니다. 그래서, 필름으로 담기 좋은 동작구 출사 맛집 다섯 곳을 소개해볼게요!`,
    contents: [
      {
        locationHeading: "📍 노을이 예쁜 한강 뷰",
        subHeading: "| 노량진 한강공원 · 노들섬 인근",
        imageUrl:
          "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&q=80&w=1000",
        description:
          "해 질 무렵의 한강은 필름 사진으로 담기기 가장 좋은 순간이에요. 강 너머로 떨어지는 햇빛과 물 위에 번지는 색감이 자연스럽게 프레임을 채워줍니다.\n\n삼각대 없이도 촬영하기 좋고, 실루엣 위주의 구도로 찍으면 노출에 크게 신경 쓰지 않아도 안정적인 결과를 얻을 수 있어요. 처음 출사를 나가는 날이라면, 해 질 시간에 맞춰 천천히 산책하듯 촬영해보세요!",
      },
      {
        locationHeading: "📍 필름 감성 골목",
        subHeading: "| 상도동 주택가",
        imageUrl:
          "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&q=80&w=1000",
        description:
          "오래된 붉은 벽돌과 좁은 골목길은 필름 카메라와 가장 잘 어울리는 피사체입니다. 화려하지 않지만 따뜻한 색감을 담을 수 있어요.",
      },
      {
        locationHeading: "📍 빛이 고운 공원",
        subHeading: "| 보라매 공원",
        imageUrl:
          "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1000",
        description:
          "나무 사이로 들어오는 빛내림을 포착해보세요. 숲의 초록색과 필름 특유의 그레인이 만나면 몽환적인 분위기가 연출됩니다.",
      },
    ],
  },
  {
    id: 2,
    title: "현상소 사장님과 Q&A",
    summary: "현상소 사장님이 다 답해준다!",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&q=80&w=1000",
    introText:
      "필름 카메라를 처음 샀을 때 가장 많이 하는 질문들! 현상소 사장님께 직접 들어봤습니다.",
    contents: [
      {
        heading: "Q1. 필름을 넣었는데 컷 수가 안 올라가요.",
        imageUrl:
          "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/dlau/image/6zNbIUZQ9nV-jmV8Rcq_yDk1ynI.jpg",
        description:
          "필름이 헛돌고 있을 가능성이 큽니다. 리와인드 크랭크가 돌아가는지 확인하면서 장전해보세요.",
      },
      {
        heading: "Q2. 유통기한 지난 필름, 써도 되나요?",
        imageUrl:
          "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/dlau/image/6zNbIUZQ9nV-jmV8Rcq_yDk1ynI.jpg",
        description:
          "네, 가능합니다! 다만 감도가 떨어졌을 수 있으니 빛을 충분히 확보해서 찍는 것이 좋습니다.",
      },
    ],
  },
  {
    id: 3,
    title: "내 카메라랑 더 친해지기",
    summary: "카메라 부품 별 기능들을 알려드립니다! 😎",
    thumbnailUrl:
      "https://cdn.100ssd.co.kr/news/photo/201908/63230_43229_1525.jpg",
    introText:
      "내 카메라에 달린 버튼들, 도대체 어디에 쓰는 걸까요? 하나씩 파헤쳐 봅니다.",
    contents: [
      {
        heading: "1. 조리개 (Aperture)",
        imageUrl:
          "https://images.unsplash.com/photo-1606208225572-c5187e59b964?auto=format&fit=crop&q=80&w=1000",
        description:
          "빛의 양을 조절하고 심도를 결정합니다. 숫자가 작을수록 배경이 흐려집니다(아웃포커싱).",
      },
      {
        heading: "2. 셔터 스피드 (Shutter Speed)",
        imageUrl:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000",
        description:
          "찰칵! 하는 속도입니다. 빠르게 움직이는 피사체를 잡으려면 숫자를 높여보세요.",
      },
    ],
  },
];
