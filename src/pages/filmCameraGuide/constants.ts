import type { FilmCameraGuide } from "../../types/filmCameraGuide";
import thumb1 from "@/assets/filmNews/film-news-section-1.png";
import thumb2 from "@/assets/filmNews/film-news-section-2.png";
import thumb3 from "@/assets/filmNews/film-news-section-3.png";

export const FILM_CAMERA_GUIDE_DATA: FilmCameraGuide[] = [
  {
    id: 1,
    title: "동작구 출사 맛집 Best 5.",
    summary: "추운 날씨도 따뜻해보이게 만드는 사진 명소 추천합니다",
    thumbnailUrl: thumb1,
    toc: [
      "노을이 예쁜 한강 뷰",
      "필름 감성 골목",
      "빛이 고운 공원",
      "조용한 동네 산책길",
      "오래된 건물과 거리",
    ],
    introText: `셔터를 누르기 전의 망설임도 필름 사진의 일부라고 생각해요. 어디서 찍을지 고민하는 그 시간까지도 사진의 분위기가 되는 곳.

동작구는 천천히 걷다 보면 자연스럽게 카메라를 들게 되는 동네입니다. 그래서, 필름으로 담기 좋은 동작구 출사 맛집 다섯 곳을 소개해볼게요!`,
    contents: [
      {
        locationHeading: "📍 노을이 예쁜 한강 뷰",
        subHeading: "| 노량진 한강공원 · 노들섬 인근",
        imageUrl:
          "https://ojsfile.ohmynews.com/STD_IMG_FILE/2023/0210/IE003111451_STD.jpg",
        description:
          "해 질 무렵의 한강은 필름 사진으로 담기기 가장 좋은 순간이에요. 강 너머로 떨어지는 햇빛과 물 위에 번지는 색감이 자연스럽게 프레임을 채워줍니다.",
      },
      {
        locationHeading: "📍 필름 감성 골목",
        subHeading: "| 상도동 주택가",
        imageUrl:
          "https://image.kkday.com/v2/image/get/c_fit%2Cq_55%2Ct_webp%2Cw_960/s1.kkday.com/product_104798/20201102064621_GWpeL/jpg",
        description:
          "오래된 붉은 벽돌과 좁은 골목길은 필름 카메라와 가장 잘 어울리는 피사체입니다.",
      },
      {
        locationHeading: "📍 빛이 고운 공원",
        subHeading: "| 보라매 공원",
        imageUrl:
          "https://i.namu.wiki/i/1_o0aTZiACCi-DXc93A6g8YlBJMJ3U3xxUIfCyIZ_j32V08rK8NuEX-kCzzWLPNvmYZlkfeICefe3atEZP6ZOA.webp",
        description:
          "나무 사이로 들어오는 빛내림을 포착해보세요. 숲의 초록색과 필름 특유의 그레인이 만나면 몽환적인 분위기가 연출됩니다.",
      },
    ],
  },
  {
    id: 2,
    title: "현상소 사장님과 Q&A",
    summary: "현상소 사장님이 다 답해준다!",
    thumbnailUrl: thumb2,
    toc: [
      "필름은 어떻게 보관하면 좋을까요?",
      "한 롤은 다 못 찍어도 괜찮을까요?",
      "현상과 스캔, 꼭 같이 해야 하나요?",
      "오래된 카메라도 쓸 수 있나요?",
      "처음이라면 어떤 필름이 좋을까요?",
    ],
    introText:
      "필름 카메라를 처음 쓰다 보면 검색해도 답이 다 달라서 더 헷갈릴 때가 많아요. 그래서 이 글에서는 현상소 사장님이 실제로 자주 받는 초보자 질문 다섯 가지를 골라 답해볼게요.",
    contents: [
      {
        heading: "Q1. 필름은 꼭 냉장 보관해야 하나요?",
        description:
          "꼭 냉장 보관을 해야 하는 건 아니에요. 오래 보관할 예정이라면 냉장이 좋고, 당장 쓸 필름이라면 서늘한 실내 보관도 충분합니다.",
      },
      {
        heading: "Q2. 유통기한 지난 필름, 써도 되나요?",
        description: `꼭 다 찍고 오지 않아도 괜찮아요.
중간에 촬영을 멈추고 현상 맡기는 분들도 생각보다 많아요.
다만 필름을 되감는 과정에서 이미 찍은 컷이 겹치거나 날아갈 수 있어서 현상소에 미리 말씀해주는 게 중요해요.
한 롤 다 못 찍었어요 라고만 알려주셔도 현상 과정에서 그에 맞게 조심해서 작업해드려요.
여행 중이거나 더 이상 촬영이 어려운 상황이라면 굳이 무리해서 다 채우지 않아도 됩니다.`,
      },
    ],
  },
  {
    id: 3,
    title: "내 카메라랑 더 친해지기",
    summary: "카메라 부품 별 기능들을 알려드립니다!",
    thumbnailUrl: thumb3,
    toc: [
      "카메라를 천천히 들여다보는 시간",
      "셔터를 누르기 전, 한 번 더 바라보기",
      "같은 장소를 다른 프레임으로 찍어보기",
      "실패한 사진도 남겨두기",
      "카메라를 자주 들고 나가기",
    ],
    introText: `카메라를 처음 샀을 때는 뭔가 대단한 사진을 찍어야 할 것 같은 마음이 먼저 들어요.
설정을 제대로 맞췄는지, 이 장면이 찍을 만한 순간인지 계속 고민하다 보면 정작 카메라를 손에 익힐 시간은 부족해지죠.

이 글은 사진을 잘 찍는 방법보다, 내 카메라에 조금 더 익숙해지는 방법에 대한 이야기예요. 천천히, 자주, 부담 없이 쓰다 보면 카메라는 자연스럽게 손에 남습니다.`,
    contents: [
      {
        heading: "카메라를 천천히 들여다보는 시간 📸",
        description: `처음부터 모든 기능을 이해할 필요는 없어요.
지금 내 카메라에 어떤 버튼이 있고, 어디를 누르면 어떤 반응이 오는지만 알아도 충분합니다.

셔터를 누르지 않아도 좋아요.
전원을 켜고, 다이얼을 돌려보고, 뷰파인더를 통해 주변을 한 번 바라보는 것만으로도 카메라는 조금씩 익숙해집니다.

사진은 결국 손에 익은 도구로 찍을 때 가장 편안한 결과가 나와요.
서두르지 말고, 카메라를 알아가는 시간을 먼저 가져보세요.`,
      },
    ],
  },
];
