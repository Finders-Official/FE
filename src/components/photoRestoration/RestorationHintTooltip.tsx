import { PaintBrushIcon } from "@/assets/icon";

// 표시 여부는 RestorationFooter의 isHintState가 결정한다.
export const RestorationHintTooltip = () => {
  return (
    <div className="fade-in bg-neutral-875/80 flex h-15 w-81.25 items-center gap-4 rounded-[1.125rem] border border-neutral-800 px-5 shadow-lg backdrop-blur-md duration-300">
      <PaintBrushIcon className="h-7 w-7 text-orange-500" />
      <span className="font-pretendard text-[0.9375rem] font-semibold text-neutral-200">
        복원이 필요한 부분을 색칠해주세요.
      </span>
    </div>
  );
};
