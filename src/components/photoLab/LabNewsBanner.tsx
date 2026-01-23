import { useEffect, useState } from "react";
import type { LabNews } from "@/types/photoLab";

interface LabNewsBannerProps {
  newsList: LabNews[];
  intervalMs?: number;
  className?: string;
  onNewsClick?: (news: LabNews) => void;
}

export default function LabNewsBanner({
  newsList,
  intervalMs = 5000,
  className = "",
  onNewsClick,
}: LabNewsBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (newsList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsList.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [newsList.length, intervalMs]);

  if (newsList.length === 0) return null;

  const news = newsList[currentIndex];

  const handleClick = () => {
    onNewsClick?.(news);
  };

  return (
    <div
      role={onNewsClick ? "button" : undefined}
      tabIndex={onNewsClick ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={`flex h-[2.3125rem] items-center gap-2 overflow-hidden rounded-[0.625rem] bg-[#282828] px-4 py-2 ${onNewsClick ? "cursor-pointer" : ""} ${className}`}
    >
      {/* key가 바뀌면 re-mount, animation 재실행 */}
      <div
        key={currentIndex}
        className="animate-slide-up flex items-center gap-2"
      >
        {/* 타입 뱃지 */}
        <span className="shrink-0 rounded-full border border-neutral-300 px-2 py-1 text-[0.625rem] leading-[126%] font-semibold tracking-[-0.02em] text-neutral-300">
          {news.type}
        </span>

        {/* 현상소명 + 내용 */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="shrink-0 text-[0.75rem] leading-[126%] font-semibold tracking-[-0.02em] text-neutral-300">
            {news.labName}
          </span>
          <span className="truncate text-[0.75rem] leading-[126%] font-normal tracking-[-0.02em] text-neutral-300">
            {news.content}
          </span>
        </div>
      </div>
    </div>
  );
}

export type { LabNewsBannerProps };
