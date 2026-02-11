import React from "react";
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

  return (
    <div
      ref={containerRef}
      className="relative flex max-h-full max-w-full items-center justify-center overflow-hidden rounded-[0.625rem] bg-neutral-800"
      onMouseDown={startCompare}
      onMouseUp={endCompare}
      onMouseLeave={endCompare}
      onTouchStart={startCompare}
      onTouchEnd={endCompare}
    >
      <img
        src={currentImageSrc}
        alt="Target"
        className="block max-h-full max-w-full touch-none object-contain select-none"
        style={{ maxHeight: "100%" }}
        onLoad={() => setIsImageLoaded(true)}
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
