import React from "react";
import { CapsuleButton } from "@/components/common/CapsuleButton";
import { RestoraionSparkleIcon } from "@/assets/icon";

interface RestorationActionButtonsProps {
  historyStep: number;
  restoredImageUrl: string | null;
  isGenerating: boolean;
  handleGenerateClick: () => void;
  handleRegenerateClick: () => void;
}

// 표시 여부(!isHintState)는 RestorationFooter가 결정한다.
export const RestorationActionButtons: React.FC<
  RestorationActionButtonsProps
> = ({
  historyStep,
  restoredImageUrl,
  isGenerating,
  handleGenerateClick,
  handleRegenerateClick,
}) => {
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
