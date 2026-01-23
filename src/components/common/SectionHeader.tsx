import { useNavigate } from "react-router";
import { ChevronLeftIcon } from "@/assets/icon";

interface SectionHeaderProps {
  title: string;
  link?: string;
}

export const SectionHeader = ({ title, link }: SectionHeaderProps) => {
  const navigate = useNavigate();

  const handleMoreClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div className="flex w-full items-center justify-between py-5">
      {/* 타이틀 */}
      <h2 className="text-[20px] leading-[128%] font-semibold tracking-[-0.02em] whitespace-pre-wrap text-neutral-100">
        {title}
      </h2>

      {/* 더보기 버튼 (링크 있을 때만 렌더링) */}
      {link && (
        <button
          onClick={handleMoreClick}
          type="button"
          className="font-regular flex shrink-0 items-center gap-0.5 text-[15.008px] leading-[155%] tracking-[-0.02em] whitespace-nowrap text-neutral-200"
        >
          더보기
          <ChevronLeftIcon className="h-4 w-4 -scale-x-100 text-neutral-200" />
        </button>
      )}
    </div>
  );
};
