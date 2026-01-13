import type { FilmCameraGuide } from "@/pages/filmCameraGuide/types";

interface Props {
  content: FilmCameraGuide;
  onClick: (id: number) => void;
}

export const GuideContentCard = ({ content, onClick }: Props) => {
  return (
    <div
      onClick={() => onClick(content.id)}
      className="group relative isolate h-57.5 w-full cursor-pointer overflow-hidden rounded-[10px]"
    >
      {/* 1. 카드 배경 이미지 영역 */}
      <div
        className="h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${content.thumbnailUrl})` }}
      />

      {/* 2. 하단 텍스트 영역 */}
      <div className="absolute bottom-0 left-0 w-full bg-white/90 px-4 py-4 backdrop-blur-sm">
        <h3 className="mb-1 truncate text-[18px] font-semibold text-neutral-800">
          {content.title}
        </h3>
        <p className="truncate text-[16px] font-normal text-neutral-800">
          {content.summary}
        </p>
      </div>
    </div>
  );
};
