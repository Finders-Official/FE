import React from "react";
import { PaintBrushIcon } from "@/assets/icon";

import type { DrawPath } from "@/hooks/photoRestoration/useCanvasDrawing";

interface RestorationHintTooltipProps {
  historyStep: number;
  currentPath: DrawPath | null;
  restoredImageUrl: string | null;
  isGenerating: boolean;
}

export const RestorationHintTooltip: React.FC<RestorationHintTooltipProps> = ({
  historyStep,
  currentPath,
  restoredImageUrl,
  isGenerating,
}) => {
  const showHintTooltip =
    historyStep === -1 && !currentPath && !restoredImageUrl && !isGenerating;

  if (!showHintTooltip) return null;

  return (
    <div className="fade-in bg-neutral-875/80 flex h-15 w-81.25 items-center gap-4 rounded-[1.125rem] border border-neutral-800 px-5 shadow-lg backdrop-blur-md duration-300">
      <PaintBrushIcon className="h-7 w-7 text-orange-500" />
      <span className="font-pretendard text-[0.9375rem] font-semibold text-neutral-200">
        복원이 필요한 부분을 색칠해주세요.
      </span>
    </div>
  );
};
