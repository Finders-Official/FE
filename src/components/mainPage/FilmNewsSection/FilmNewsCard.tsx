import { useRequireAuth } from "@/hooks/mainPage/useRequireAuth";

export interface NewsData {
  id: number;
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
        alt="필름 소식 썸네일"
        className="absolute inset-0 h-57.5 w-full object-cover"
      />
    </div>
  );
}
