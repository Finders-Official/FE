import React from "react";
import { CapsuleButton } from "@/components/common/CapsuleButton";
import { RestoraionSparkleIcon, RestorationCompareIcon } from "@/assets/icon";

import type { DrawPath } from "@/hooks/photoRestoration/useCanvasDrawing";

interface RestorationActionButtonsProps {
  historyStep: number;
  currentPath: DrawPath | null;
  restoredImageUrl: string | null;
  isGenerating: boolean;
  handleGenerateClick: () => void;
  handleRegenerateClick: () => void;
  startCompare: () => void;
  endCompare: () => void;
}

export const RestorationActionButtons: React.FC<
  RestorationActionButtonsProps
> = ({
  historyStep,
  currentPath,
  restoredImageUrl,
  isGenerating,
  handleGenerateClick,
  handleRegenerateClick,
  startCompare,
  endCompare,
}) => {
  const showHintTooltip =
    historyStep === -1 && !currentPath && !restoredImageUrl && !isGenerating;

  if (showHintTooltip) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 pointer-events-auto flex items-center justify-center duration-300">
      {!restoredImageUrl ? (
        historyStep >= 0 && (
          <CapsuleButton
            text="생성하기"
            image={RestoraionSparkleIcon}
            size="small"
            onClick={handleGenerateClick}
            className={isGenerating ? "pointer-events-none opacity-50" : ""}
          />
        )
      ) : (
        <div className="flex items-center gap-4">
          <div
            onMouseDown={startCompare}
            onMouseUp={endCompare}
            onMouseLeave={endCompare}
            onTouchStart={startCompare}
            onTouchEnd={endCompare}
            className="cursor-pointer transition-transform active:scale-95"
          >
            <CapsuleButton
              text="비교하기"
              image={RestorationCompareIcon}
              size="small"
            />
          </div>

          <CapsuleButton
            text="다시 생성하기"
            image={RestoraionSparkleIcon}
            size="medium"
            onClick={handleRegenerateClick}
          />
        </div>
      )}
    </div>
  );
};
