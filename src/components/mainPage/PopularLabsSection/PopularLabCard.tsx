import { Link } from "react-router";

export interface Lab {
  photoLabId: number;
  name: string;
  mainImageUrl: string;
  workCount: number;
  tags: string[];
}

interface PopularLabCardProps {
  lab: Lab;
}

export default function PopularLabCard({ lab }: PopularLabCardProps) {
  const baseUrl = import.meta.env.VITE_PUBLIC_API_URL;

  // 이미지가 'http'로 시작하면 그대로 쓰고, 아니면 앞에 baseUrl 붙이기
  const imageUrl = lab.mainImageUrl.startsWith("http")
    ? lab.mainImageUrl
    : `${baseUrl}/${lab.mainImageUrl}`;

  const fallbackImage =
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80";

  return (
    <Link
      to={`/lab/${lab.photoLabId}`}
      className="relative block aspect-163/230 w-full overflow-hidden rounded-[0.625rem] border border-neutral-800"
    >
      <img
        src={imageUrl}
        alt={lab.name}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackImage;
        }}
      />

      <div
        className="absolute right-0 bottom-16.25 left-0 z-10 h-13.25 w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(22, 22, 22, 0) 0%, rgba(20, 20, 20, 0.677885) 28.37%, #131313 100%)",
        }}
      />

      {/* 태그 영역: 가로 스크롤 & 줄바꿈 방지 */}
      <div className="scrollbar-hide absolute right-0 bottom-18.75 left-0 z-20 flex gap-1.5 overflow-x-auto px-2.5">
        {lab.tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 px-2 py-1.5 text-[0.625rem] leading-[126%] font-semibold tracking-[-0.02em] whitespace-nowrap text-neutral-200 backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-20 flex h-16.25 flex-col justify-start gap-0.5 rounded-b-[0.625rem] bg-neutral-900 px-2.5 py-3.5">
        <h3 className="w-full truncate text-[0.875rem] leading-[140%] font-semibold tracking-[-0.02em] text-neutral-100">
          {lab.name}
        </h3>

        <div className="flex items-center gap-1">
          <span className="font-regular text-[0.75rem] leading-[126%] tracking-[-0.02em] text-neutral-200">
            총 작업 건 수
          </span>
          <span className="font-regular text-[0.75rem] leading-[126%] tracking-[-0.02em] text-orange-500">
            {lab.workCount}건
          </span>
        </div>
      </div>
    </Link>
  );
}
