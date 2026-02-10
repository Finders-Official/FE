import { SparklesFillIcon } from "@/assets/icon";
import React from "react";

interface RestorationLoadingOverlayProps {
  isGenerating: boolean;
  statusMessage: string;
  progress: number;
}

export const RestorationLoadingOverlay: React.FC<
  RestorationLoadingOverlayProps
> = ({ isGenerating, progress }) => {
  if (!isGenerating) return null;

  const FIXED_MESSAGE = "사진 복원을 진행중이에요";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-[2px]">
      <div className="flex w-48.75 flex-col items-center gap-3">
        <div className="flex h-12.5 w-13.25 items-center justify-center">
          <SparklesFillIcon className="h-12.5 w-13.25 text-orange-500" />
        </div>

        <h2 className="flex h-6.5 items-center text-center text-[20px] leading-[1.28] font-semibold tracking-[-0.02em] text-[#F0F0F0]">
          {FIXED_MESSAGE}
        </h2>

        <span className="flex h-4.5 items-center text-center text-[15px] leading-4.5 font-medium text-[#F0F0F0]">
          {progress < 10 ? `0${progress}` : progress}%
        </span>
      </div>
    </div>
  );
};
