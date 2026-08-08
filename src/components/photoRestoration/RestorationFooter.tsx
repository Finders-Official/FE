import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
import { useReveal } from "@/transitions";

import { Tooltip } from "@/components/common/ToolTip";
import { CapsuleButton } from "@/components/common/CapsuleButton";

import { RestorationHintTooltip } from "./RestorationHintTooltip";
import { RestorationActionButtons } from "./RestorationActionButtons";

import { PhotoFillIcon } from "@/assets/icon";

import type { DrawPath } from "@/hooks/photoRestoration/useCanvasDrawing";

interface RestorationFooterProps {
  viewMode: "MAIN" | "SAVED";
  historyStep: number;
  currentPath: DrawPath | null;
  restoredImageUrl: string | null;
  isGenerating: boolean;
  shouldShowCreditTooltip: boolean;
  usedFree: number;
  totalFree: number;
  setIsCreditTooltipOpen: (isOpen: boolean) => void;
  handleGenerateClick: () => void;
  handleRegenerateClick: () => void;
}

export const RestorationFooter = ({
  viewMode,
  historyStep,
  currentPath,
  restoredImageUrl,
  isGenerating,
  shouldShowCreditTooltip,
  usedFree,
  totalFree,
  setIsCreditTooltipOpen,
  handleGenerateClick,
  handleRegenerateClick,
}: RestorationFooterProps) => {
  const navigate = useNavigate();
  const tip = useReveal(shouldShowCreditTooltip, { variant: "popover" });

  // 힌트 툴팁 표시 상태(초기 편집)와 액션 버튼 표시 상태는 상호배타
  const isHintState =
    viewMode === "MAIN" &&
    historyStep === -1 &&
    !currentPath &&
    !restoredImageUrl &&
    !isGenerating;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-50 flex w-full flex-col items-center px-4 ${
        isHintState ? "pb-4.5" : "pb-5.75"
      }`}
    >
      <RestorationHintTooltip open={isHintState} />

      <div className="pointer-events-auto relative mt-2 inline-flex">
        {tip.mounted && (
          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2">
            <div
              {...tip.getRevealProps({
                className: "pointer-events-auto mb-4.5",
              })}
              style={{ "--reveal-origin": "50% 100%" } as CSSProperties}
            >
              <Tooltip
                used={usedFree}
                total={totalFree}
                onClose={() => setIsCreditTooltipOpen(false)}
              />
            </div>
          </div>
        )}

        {viewMode === "SAVED" ? (
          <CapsuleButton
            text="사진수다에 자랑하기"
            image={PhotoFillIcon}
            size="large"
            onClick={() => navigate("/photoFeed")}
          />
        ) : (
          !isHintState && (
            <RestorationActionButtons
              historyStep={historyStep}
              restoredImageUrl={restoredImageUrl}
              isGenerating={isGenerating}
              handleGenerateClick={handleGenerateClick}
              handleRegenerateClick={handleRegenerateClick}
            />
          )
        )}
      </div>
    </div>
  );
};
