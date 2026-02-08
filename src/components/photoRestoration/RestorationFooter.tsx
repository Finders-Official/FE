import { useNavigate } from "react-router";

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

  return (
    <div className="pointer-events-none absolute right-0 bottom-13 left-0 z-50 flex w-full flex-col items-center px-4">
      {viewMode === "MAIN" && (
        <RestorationHintTooltip
          historyStep={historyStep}
          currentPath={currentPath}
          restoredImageUrl={restoredImageUrl}
          isGenerating={isGenerating}
        />
      )}

      <div className="pointer-events-auto relative mt-2 inline-flex">
        {shouldShowCreditTooltip && (
          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2">
            <div className="pointer-events-auto mb-4.5">
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
            size="medium"
            onClick={() => navigate("/photoFeed")}
          />
        ) : (
          <RestorationActionButtons
            historyStep={historyStep}
            currentPath={currentPath}
            restoredImageUrl={restoredImageUrl}
            isGenerating={isGenerating}
            handleGenerateClick={handleGenerateClick}
            handleRegenerateClick={handleRegenerateClick}
          />
        )}
      </div>
    </div>
  );
};
