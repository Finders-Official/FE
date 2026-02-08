import React from "react";
import { CapsuleButton } from "@/components/common/CapsuleButton";
import { RestoraionSparkleIcon } from "@/assets/icon";

import type { DrawPath } from "@/hooks/photoRestoration/useCanvasDrawing";

interface RestorationActionButtonsProps {
  historyStep: number;
  currentPath: DrawPath | null;
  restoredImageUrl: string | null;
  isGenerating: boolean;
  handleGenerateClick: () => void;
  handleRegenerateClick: () => void;
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
}) => {
  const showHintTooltip =
    historyStep === -1 && !currentPath && !restoredImageUrl && !isGenerating;

  if (showHintTooltip) return null;

  return (
    <div className="pointer-events-auto flex items-center justify-center">
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
        <CapsuleButton
          text="다시 생성하기"
          image={RestoraionSparkleIcon}
          size="medium"
          onClick={handleRegenerateClick}
        />
      )}
    </div>
  );
};
