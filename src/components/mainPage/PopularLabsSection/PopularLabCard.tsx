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
  return (
    <Link
      to={`/lab/${lab.photoLabId}`}
      className="relative block aspect-163/230 w-full overflow-hidden rounded-[0.625rem] border border-neutral-800"
    >
      <img
        src={lab.mainImageUrl}
        alt={lab.name}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute right-0 bottom-16.25 left-0 z-10 h-13.25 w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(22, 22, 22, 0) 0%, rgba(20, 20, 20, 0.677885) 28.37%, #131313 100%)",
        }}
      />

      {/* 태그 */}
      <div className="absolute bottom-18.75 left-2.5 z-20 flex gap-1.5">
        {lab.tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center justify-center rounded-lg border border-neutral-800 px-2 py-1.5 text-[0.625rem] leading-[126%] font-semibold tracking-[-0.02em] text-neutral-200"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-20 flex h-16.25 flex-col justify-start gap-0.5 rounded-b-[0.625rem] bg-neutral-900 px-2.5 py-3.5">
        {/* 상호명 */}
        <h3 className="w-full text-[0.875rem] leading-[140%] font-semibold tracking-[-0.02em] text-neutral-100">
          {lab.name}
        </h3>

        {/* 작업 건수 */}
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

// aspect-163/230
// background 다시 확인하기
