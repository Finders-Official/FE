// 캔버스 초기화, 그리기, Undo/Redo, 마스크 Blob 생성 로직을 담당
import { useState, useEffect, type RefObject, useCallback } from "react";

export interface DrawPath {
  points: { x: number; y: number }[];
  lineWidth: number;
}

interface UseCanvasDrawingProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  isImageLoaded: boolean;
  disabled: boolean;
}

export const useCanvasDrawing = ({
  canvasRef,
  containerRef,
  isImageLoaded,
  disabled,
}: UseCanvasDrawingProps) => {
  const [paths, setPaths] = useState<DrawPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawPath | null>(null);
  const [historyStep, setHistoryStep] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);

  // 헬퍼: 경로 그리기
  const drawPathOnCtx = useCallback(
    (ctx: CanvasRenderingContext2D, path: DrawPath, color: string) => {
      if (path.points.length < 1) return;
      ctx.lineWidth = path.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      if (path.points.length === 1)
        ctx.lineTo(path.points[0].x, path.points[0].y);
      else path.points.forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.stroke();
    },
    [],
  );

  // 캔버스 다시 그리기
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const visiblePaths = paths.slice(0, historyStep + 1);
    visiblePaths.forEach((path) =>
      drawPathOnCtx(ctx, path, "rgba(233, 78, 22, 0.5)"),
    );
    if (currentPath) drawPathOnCtx(ctx, currentPath, "rgba(233, 78, 22, 0.5)");
  }, [canvasRef, currentPath, drawPathOnCtx, historyStep, paths]);

  // 리사이즈 대응
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !isImageLoaded) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    ctx?.scale(dpr, dpr);
  }, [isImageLoaded, canvasRef, containerRef]);

  // 다시 그리기 Effect
  useEffect(() => {
    if (!isImageLoaded) return;
    redrawCanvas();
  }, [isImageLoaded, redrawCanvas]);

  // 좌표 계산
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // 이벤트 핸들러
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    setIsDrawing(true);
    const pos = getPos(e);
    setCurrentPath({ points: [pos], lineWidth: 25 });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentPath) return;
    const pos = getPos(e);
    setCurrentPath((prev) =>
      prev ? { ...prev, points: [...prev.points, pos] } : null,
    );
  };

  const stopDrawing = useCallback(() => {
    if (!isDrawing || !currentPath) return;
    setIsDrawing(false);
    const newPaths = paths.slice(0, historyStep + 1);
    const updatedPaths = [...newPaths, currentPath];
    setPaths(updatedPaths);
    setHistoryStep(updatedPaths.length - 1);
    setCurrentPath(null);
  }, [isDrawing, currentPath, paths, historyStep]);

  const handleUndo = useCallback(() => {
    if (historyStep >= 0) {
      setHistoryStep((prev) => prev - 1);
    }
  }, [historyStep]);

  const handleRedo = useCallback(() => {
    if (historyStep < paths.length - 1) {
      setHistoryStep((prev) => prev + 1);
    }
  }, [historyStep, paths]);

  // 마스크 생성 (API 전송용)
  const createMaskBlob = async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const offCanvas = document.createElement("canvas");
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;
    const ctx = offCanvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, offCanvas.width, offCanvas.height);
    const visiblePaths = paths.slice(0, historyStep + 1);
    visiblePaths.forEach((path) => drawPathOnCtx(ctx, path, "white"));

    return new Promise((resolve) => offCanvas.toBlob(resolve, "image/png"));
  };

  return {
    paths,
    currentPath,
    historyStep,
    startDrawing,
    draw,
    stopDrawing,
    handleUndo,
    handleRedo,
    createMaskBlob,
  };
};
