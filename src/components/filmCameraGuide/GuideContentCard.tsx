import type { FilmCameraGuide } from "@/types/filmCameraGuide";

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
      {/* 카드 배경 이미지 영역 */}
      <div
        className="h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${content.thumbnailUrl})` }}
      />
    </div>
  );
};
