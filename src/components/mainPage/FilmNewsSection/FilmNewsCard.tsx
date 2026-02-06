import { useRequireAuth } from "@/hooks/mainPage/useRequireAuth";

export interface NewsData {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  link: string;
}

interface FilmNewsCardProps {
  news: NewsData;
}

export default function FilmNewsCard({ news }: FilmNewsCardProps) {
  const { requireAuthNavigate } = useRequireAuth();

  return (
    <div
      onClick={() => requireAuthNavigate(news.link)}
      className="group relative block h-57.5 w-full cursor-pointer overflow-hidden rounded-[0.625rem]"
    >
      {/* 배경 이미지 */}
      <img
        src={news.thumbnail}
        alt={news.title}
        className="absolute inset-0 h-57.5 w-full object-cover"
      />

      {/* 텍스트 컨텐츠 (하단 배치) */}
      <div className="absolute right-0 bottom-0 left-0 z-20 flex flex-col gap-1 p-5">
        {/* 제목 */}
        <h3 className="line-clamp-2 text-[1.125rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-800">
          {news.title}
        </h3>

        {/* 요약문 (최대 2줄, 넘치면 ...) */}
        <p className="font-regular line-clamp-2 text-[1rem] leading-[155%] tracking-[-0.02em] text-neutral-800">
          {news.description}
        </p>
      </div>
    </div>
  );
}
