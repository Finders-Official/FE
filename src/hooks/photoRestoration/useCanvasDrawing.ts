// 캔버스 초기화, 그리기, Undo/Redo, 마스크 Blob 생성 로직을 담당
import {
  useState,
  useEffect,
  type RefObject,
  useCallback,
  useRef,
} from "react";

export interface DrawPath {
  points: { x: number; y: number }[];
  lineWidth: number; // CSS px 기준
}

interface UseCanvasDrawingProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  isImageLoaded: boolean; // redraw 트리거로만 사용(사이즈 보장과 무관)
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

  // 최신 state를 resize/redraw 콜백에서 안전하게 쓰기 위한 ref
  const pathsRef = useRef(paths);
  const currentPathRef = useRef(currentPath);
  const historyStepRef = useRef(historyStep);

  useEffect(() => {
    pathsRef.current = paths;
  }, [paths]);

  useEffect(() => {
    currentPathRef.current = currentPath;
  }, [currentPath]);

  useEffect(() => {
    historyStepRef.current = historyStep;
  }, [historyStep]);

  const getDpr = () => window.devicePixelRatio || 1;

  const getCanvasCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    return { canvas, ctx };
  }, [canvasRef]);

  // 헬퍼: 경로 그리기 (좌표계: CSS px)
  const drawPathOnCtx = useCallback(
    (ctx: CanvasRenderingContext2D, path: DrawPath, color: string) => {
      if (path.points.length < 1) return;

      ctx.lineWidth = path.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;

      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);

      if (path.points.length === 1) {
        ctx.lineTo(path.points[0].x, path.points[0].y);
      } else {
        for (const p of path.points) ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    },
    [],
  );

  // 캔버스 다시 그리기 (좌표계: CSS px)
  const redrawCanvas = useCallback(() => {
    const res = getCanvasCtx();
    const container = containerRef.current;
    if (!res || !container) return;

    const { ctx } = res;

    // ctx는 항상 setTransform(dpr,...) 상태라고 가정
    const rect = container.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);

    const visiblePaths = pathsRef.current.slice(0, historyStepRef.current + 1);
    for (const path of visiblePaths) {
      drawPathOnCtx(ctx, path, "rgba(233, 78, 22, 0.5)");
    }
    if (currentPathRef.current) {
      drawPathOnCtx(ctx, currentPathRef.current, "rgba(233, 78, 22, 0.5)");
    }
  }, [containerRef, drawPathOnCtx, getCanvasCtx]);

  // 캔버스 사이즈/transform을 항상 보장 (isImageLoaded와 무관)
  const syncCanvasSizeToContainer = useCallback(() => {
    const res = getCanvasCtx();
    const container = containerRef.current;
    if (!res || !container) return;

    const { canvas, ctx } = res;

    const dpr = getDpr();
    const rect = container.getBoundingClientRect();

    const cssW = rect.width;
    const cssH = rect.height;

    const nextW = Math.max(1, Math.round(cssW * dpr));
    const nextH = Math.max(1, Math.round(cssH * dpr));

    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    // buffer size가 달라질 때만 바꾼다 (바꾸면 컨텍스트 초기화됨)
    const sizeChanged = canvas.width !== nextW || canvas.height !== nextH;
    if (sizeChanged) {
      canvas.width = nextW;
      canvas.height = nextH;
    }

    // 누적 방지: 매번 transform을 고정 (좌표계 = CSS px)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 리사이즈/사이즈 초기화 이후에는 항상 다시 그림
    redrawCanvas();
  }, [containerRef, getCanvasCtx, redrawCanvas]);

  // ResizeObserver + window resize로 컨테이너 크기 변화 추적
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 최초 1회 강제 동기화 (이미지 실패/서버 에러여도 300x150 방지)
    syncCanvasSizeToContainer();

    const ro = new ResizeObserver(() => {
      syncCanvasSizeToContainer();
    });

    ro.observe(container);

    const onWindowResize = () => syncCanvasSizeToContainer();
    window.addEventListener("resize", onWindowResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onWindowResize);
    };
  }, [containerRef, syncCanvasSizeToContainer]);

  // 이미지 로드/실패 등 상태 변화로 배경이 바뀌는 타이밍에 선을 다시 그려주기
  useEffect(() => {
    // 이미지가 안 뜨는 상태(서버 에러)에서도 선은 유지되어야 하니 redraw는 OK
    redrawCanvas();
  }, [isImageLoaded, redrawCanvas]);

  // 좌표 계산 (CSS px 기준)
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0]?.clientX ?? 0;
      clientY = e.touches[0]?.clientY ?? 0;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // 이벤트 핸들러
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;

    // 그리기 시작 전에 혹시 모를 사이즈 싱크 (가끔 레이아웃 직후 타이밍 이슈 방지)
    syncCanvasSizeToContainer();

    setIsDrawing(true);
    const pos = getPos(e);
    setCurrentPath({ points: [pos], lineWidth: 25 });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentPathRef.current) return;
    const pos = getPos(e);

    setCurrentPath((prev) =>
      prev ? { ...prev, points: [...prev.points, pos] } : null,
    );
  };

  const stopDrawing = useCallback(() => {
    if (!isDrawing || !currentPathRef.current) return;

    setIsDrawing(false);

    setPaths((prev) => {
      const step = historyStepRef.current;
      const newPaths = prev.slice(0, step + 1);
      const updated = [...newPaths, currentPathRef.current!];

      // historyStep는 updated 길이에 맞춰 동기화
      setHistoryStep(updated.length - 1);
      return updated;
    });

    setCurrentPath(null);
  }, [isDrawing]);

  const handleUndo = useCallback(() => {
    setHistoryStep((prev) => Math.max(-1, prev - 1));
  }, []);

  const handleRedo = useCallback(() => {
    setHistoryStep((prev) => Math.min(pathsRef.current.length - 1, prev + 1));
  }, []);

  // historyStep/paths/currentPath 바뀌면 다시 그림
  useEffect(() => {
    redrawCanvas();
  }, [paths, historyStep, currentPath, redrawCanvas]);

  // 마스크 생성 (API 전송용) - 좌표계/해상도 완전 동일하게 맞춤
  const createMaskBlob = async (): Promise<Blob | null> => {
    const container = containerRef.current;
    if (!container) return null;

    const dpr = getDpr();
    const rect = container.getBoundingClientRect();

    const offCanvas = document.createElement("canvas");
    offCanvas.width = Math.max(1, Math.round(rect.width * dpr));
    offCanvas.height = Math.max(1, Math.round(rect.height * dpr));

    const ctx = offCanvas.getContext("2d");
    if (!ctx) return null;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, rect.width, rect.height);

    const visiblePaths = pathsRef.current.slice(0, historyStepRef.current + 1);
    for (const path of visiblePaths) drawPathOnCtx(ctx, path, "white");

    return new Promise((resolve) =>
      offCanvas.toBlob((b) => resolve(b), "image/png"),
    );
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
