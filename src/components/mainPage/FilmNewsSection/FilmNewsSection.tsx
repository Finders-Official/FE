import FilmNewsCard, { type NewsData } from "./FilmNewsCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import thumb1 from "@/assets/filmNews/film-news-section-1.png";
import thumb2 from "@/assets/filmNews/film-news-section-2.png";
import thumb3 from "@/assets/filmNews/film-news-section-3.png";

const NEWS_LIST: NewsData[] = [
  {
    id: 1,
    thumbnail: thumb1,
    link: "/film-camera-guide/1", // hm-031
  },
  {
    id: 2,
    thumbnail: thumb2,
    link: "/film-camera-guide/2", // hm-032
  },
  {
    id: 3,
    thumbnail: thumb3,
    link: "/film-camera-guide/3", // hm-033
  },
];

export default function FilmNewsSection() {
  return (
    <div className="whitespace-pre-line">
      <SectionHeader title="꼭 알아야 할 필름 소식" link="/film-camera-guide" />
      <section className="flex flex-col gap-3.5 py-6">
        {/* 카드 리스트 (세로 스택) */}
        <div className="flex flex-col gap-5">
          {NEWS_LIST.map((news) => (
            <FilmNewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>
    </div>
  );
}
