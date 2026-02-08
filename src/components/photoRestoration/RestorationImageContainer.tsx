import React, { useState } from "react";
import type { RefObject } from "react";

interface RestorationImageContainerProps {
  imageUrl: string;
  restoredImageUrl: string | null;
  isComparing: boolean;
  isGenerating: boolean;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  startDrawing: (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => void;
  draw: (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => void;
  stopDrawing: () => void;
  startCompare: () => void;
  endCompare: () => void;
  setIsImageLoaded: (loaded: boolean) => void;
}

export const RestorationImageContainer: React.FC<
  RestorationImageContainerProps
> = ({
  imageUrl,
  restoredImageUrl,
  isComparing,
  isGenerating,
  canvasRef,
  containerRef,
  startDrawing,
  draw,
  stopDrawing,
  startCompare,
  endCompare,
  setIsImageLoaded,
}) => {
  const showOriginal = !restoredImageUrl || isComparing;
  const currentImageSrc = showOriginal ? imageUrl : restoredImageUrl;
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
    setIsImageLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-md items-center justify-center overflow-hidden rounded-[0.625rem] bg-neutral-800"
      style={{
        aspectRatio: aspectRatio,
        maxHeight: "calc(100dvh - 260px)",
      }}
      onMouseDown={startCompare}
      onMouseUp={endCompare}
      onMouseLeave={endCompare}
      onTouchStart={startCompare}
      onTouchEnd={endCompare}
    >
      <img
        src={currentImageSrc}
        alt="Target"
        className="pointer-events-none absolute inset-0 block h-full w-full object-contain select-none"
        onLoad={handleImageLoad}
      />

      {isGenerating && (
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="absolute inset-0 bg-[#E94E16]/30" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      )}

      {!restoredImageUrl && !isGenerating && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 h-full w-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
      )}
    </div>
  );
};
