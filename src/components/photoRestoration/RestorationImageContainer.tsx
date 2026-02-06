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
      className="relative grid h-58 w-85.75 place-items-center overflow-hidden rounded-[0.625rem] bg-neutral-800"
      onMouseDown={startCompare}
      onMouseUp={endCompare}
      onMouseLeave={endCompare}
      onTouchStart={startCompare}
      onTouchEnd={endCompare}
    >
      <img
        src={currentImageSrc}
        alt="Target"
        className="pointer-events-none block max-h-full max-w-full object-contain select-none"
        onLoad={() => setIsImageLoaded(true)}
      />

      {!restoredImageUrl && !isGenerating && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 cursor-crosshair touch-none"
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
