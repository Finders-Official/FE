import { useState, useRef, useEffect } from "react";
import Header from "@/components/common/Header";
import {
  ArrowTurnUpLeftIcon as UndoIcon,
  ArrowTurnUpRightIcon as RedoIcon,
  PaintBrushIcon,
} from "@/assets/icon";

interface RestorationCanvasProps {
  file: File;
  onBack: () => void;
}

const RestorationCanvas = ({ file, onBack }: RestorationCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 파일 -> URL
  useEffect(() => {
    const url = URL.createObjectURL(file);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageUrl(url);
    setIsImageLoaded(false);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container || !isImageLoaded) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    if (canvas.width === 0 || canvas.height === 0) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const settings = {
        willReadFrequently: true,
      } as CanvasRenderingContext2DSettings;
      const ctxOptimized = canvas.getContext("2d", settings) || ctx;
      const initialState = ctxOptimized.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      setHistory([initialState]);
      setHistoryStep(0);
    }
  }, [imageUrl, isImageLoaded]);

  // 드로잉 로직
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.beginPath();
      const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const newHistory = history.slice(0, historyStep + 1);
      setHistory([...newHistory, newState]);
      setHistoryStep(newHistory.length);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 25;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(233, 78, 22, 0.5)";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx && history[prevStep]) {
        ctx.putImageData(history[prevStep], 0, 0);
        setHistoryStep(prevStep);
      }
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx && history[nextStep]) {
        ctx.putImageData(history[nextStep], 0, 0);
        setHistoryStep(nextStep);
      }
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setTimeout(() => {
      alert("서버 전송 완료 (Mock)");
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="flex h-full w-full flex-col bg-neutral-900">
      <Header
        title="탄 사진 복원하기"
        showBack={true}
        onBack={onBack}
        className="z-20 px-4"
        rightAction={{
          type: "text",
          text: "",
          onClick: handleGenerate,
          loading: isGenerating,
          disabled: isGenerating,
        }}
      />

      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
        <div
          ref={containerRef}
          className="relative w-85.75 overflow-hidden rounded-[0.625rem] bg-neutral-800"
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Restore Target"
              className="pointer-events-none h-auto w-full object-contain select-none"
              onLoad={() => setIsImageLoaded(true)}
            />
          )}

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
        </div>

        <div className="mt-4 flex w-85.75 justify-start">
          <div className="flex h-10 items-center gap-3 px-2">
            <button
              onClick={handleUndo}
              disabled={historyStep <= 0}
              className={`flex items-center justify-center p-2 transition-opacity ${
                historyStep <= 0 ? "opacity-30" : "opacity-100"
              }`}
            >
              <UndoIcon className="h-6 w-6 text-neutral-300" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyStep >= history.length - 1}
              className={`flex items-center justify-center p-2 transition-opacity ${
                historyStep >= history.length - 1 ? "opacity-30" : "opacity-100"
              }`}
            >
              <RedoIcon className="h-6 w-6 text-neutral-300" />
            </button>
          </div>
        </div>
      </div>

      {historyStep === 0 && (
        <div className="fade-in pointer-events-none absolute right-0 bottom-12 left-0 z-30 flex justify-center px-4 duration-300">
          <div className="bg-neutral-875/80 flex h-15 w-81.25 items-center gap-4 rounded-[1.125rem] border border-neutral-800 px-5 shadow-lg backdrop-blur-md">
            <PaintBrushIcon className="h-7 w-7 text-orange-500" />
            <span
              className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-neutral-200 shadow-sm"
              style={{ textShadow: "0rem 0.25rem 0.25rem rgba(0, 0, 0, 0.25)" }}
            >
              복원이 필요한 부분을 색칠해주세요.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestorationCanvas;
