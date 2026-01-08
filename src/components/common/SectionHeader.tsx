import { useNavigate } from "react-router";
import { ChevronLeftIcon } from "@/assets/icon";

interface SectionHeaderProps {
  title: string;
  link?: string; // 이동할 경로
  onMoreClick?: () => void; // 링크 이동 외에 별도 기능이 필요할 때 대비
}

export const SectionHeader = ({
  title,
  link,
  onMoreClick,
}: SectionHeaderProps) => {
  const navigate = useNavigate();

  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick();
    } else if (link) {
      navigate(link);
    }
  };

  return (
    <div className="flex w-full items-center justify-between py-[1.25rem]">
      {/* 1. 왼쪽 타이틀 */}
      <h2 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
        {title}
      </h2>

      {/* 2. 오른쪽 더보기 버튼 (링크나 핸들러가 있을 때만 렌더링) */}
      {(link || onMoreClick) && (
        <button
          onClick={handleMoreClick}
          type="button"
          className="font-regular flex shrink-0 items-center gap-[0.125rem] text-[0.938rem] leading-[155%] tracking-[-0.02em] whitespace-nowrap text-neutral-200"
        >
          더보기
          <ChevronLeftIcon className="h-[1rem] w-[1rem] -scale-x-100 text-neutral-200" />
        </button>
      )}
    </div>
  );
};
