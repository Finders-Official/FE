import { SparklesFillIcon } from "@/assets/icon";
import React from "react";

interface RestorationLoadingOverlayProps {
  isGenerating: boolean;
  statusMessage: string;
  progress: number;
}

export const RestorationLoadingOverlay: React.FC<
  RestorationLoadingOverlayProps
> = ({ isGenerating, statusMessage, progress }) => {
  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-[2px]">
      <div className="flex w-48.75 flex-col items-center gap-3">
        <div className="relative h-12.5 w-13.25">
          <SparklesFillIcon className="absolute top-0 left-[36.41%] h-[31.1px] w-[29.3px] animate-pulse text-[#E94E16]" />
        </div>

        <h2 className="flex h-6.5 items-center text-center text-[20px] leading-[1.28] font-semibold tracking-[-0.02em] text-[#F0F0F0]">
          {statusMessage}
        </h2>

        <span className="flex h-4.5 items-center text-center text-[15px] leading-4.5 font-medium text-[#F0F0F0]">
          {progress < 10 ? `0${progress}` : progress}%
        </span>
      </div>
    </div>
  );
};
