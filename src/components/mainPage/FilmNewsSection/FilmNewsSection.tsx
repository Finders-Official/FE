import FilmNewsCard, { type NewsData } from "./FilmNewsCard";
import { SectionHeader } from "@/components/common/SectionHeader";

const NEWS_LIST: NewsData[] = [
  {
    id: 1,
    title: "동작구 출사 맛집 best 5.",
    description: "추운 날씨도 따뜻해보이게 만드는 사진 명소 추천합니다.",
    thumbnail:
      "https://img.freepik.com/free-psd/transparent-background-image-blank-canvas-creativity_191095-80818.jpg?semt=ais_hybrid&w=740&q=80",
    link: "/contents/1", // hm-031
  },
  {
    id: 2,
    title: "현상소 사장님이 답해주는 초보자를 위한 질문 5가지",
    description: "사진이 여전히 어렵다면...? 🥹",
    thumbnail:
      "https://mblogthumb-phinf.pstatic.net/MjAxODA4MjlfMTIy/MDAxNTM1NDk4MjgwNjc3.0VdqWGg4rxG29LFDIAxO0GZ3OV6P2PZM69Y7gqN9moIg.3l7uVUJGl_nrSKa2a94Ikg0M2KJ9tf9couNLHDiAV9kg.JPEG.ju4349/IMG_1834.JPG?type=w800",
    link: "/contents/2", // hm-032
  },
  {
    id: 3,
    title: "내 카메라랑 더 친해지기",
    description: "카메라 부품별 기능들을 알려드립니다! 😎",
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    link: "/contents/3", // hm-033
  },
];

export default function FilmNewsSection() {
  return (
    <section className="flex flex-col gap-3.5 px-5 py-6">
      <SectionHeader title="꼭 알아야 할 필름 소식" link="/" />
      {/* 카드 리스트 (세로 스택) */}
      <div className="flex flex-col gap-5">
        {NEWS_LIST.map((news) => (
          <FilmNewsCard key={news.id} news={news} />
        ))}
      </div>
    </section>
  );
}
