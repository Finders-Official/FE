import React from "react";
import { useNavigate } from "react-router";
import { ChevronRightIcon } from "../../assets/icon";

interface SectionHeaderProps {
  title: string; // 예: "이번주 인기있는 현상소"
  link?: string; // 이동할 경로 (예: "/places/popular") -> 없으면 더보기 버튼 숨김
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
      <h2 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-[#F0F0F0]">
        {title}
      </h2>

      {/* 2. 오른쪽 더보기 버튼 (링크나 핸들러가 있을 때만 렌더링) */}
      {(link || onMoreClick) && (
        <button
          onClick={handleMoreClick}
          type="button"
          className="font-regular flex shrink-0 items-center gap-[0.125rem] text-[0.938rem] leading-[155%] tracking-[-0.02em] whitespace-nowrap text-[#D6D6D6]"
        >
          더보기
          <ChevronRightIcon className="h-[1rem] w-[1rem]" />
        </button>
      )}
    </div>
  );
};
