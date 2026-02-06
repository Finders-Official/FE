import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Header from "@/components/common/Header";

import { RestorationImageContainer } from "./RestorationImageContainer";
import { RestorationActionButtons } from "./RestorationActionButtons";
import { RestorationHintTooltip } from "./RestorationHintTooltip";
import { RestorationDialogs } from "./RestorationDialogs";

import { RestorationLoadingOverlay } from "./RestorationLoadingOverlay";

import { useCanvasDrawing } from "@/hooks/photoRestoration/useCanvasDrawing";
import { useRestoration } from "@/hooks/photoRestoration/useRestoration";
import RestorationControls from "./RestorationControls";

type DialogType =
  | "NONE"
  | "MASKING_BACK"
  | "SERVER_ERROR"
  | "REGENERATE_CONFIRM"
  | "DISCARD_CONFIRM"
  | "NO_MASK";

export default function RestorationCanvas() {
  const navigate = useNavigate();
  const location = useLocation();
  const receivedImageUrl = location.state?.imageUrl as string | null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 로컬 UI 상태
  const [imageUrl] = useState<string>(receivedImageUrl || "");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogType>("NONE");

  // 1. 커스텀 훅: 복원 API 로직 (수정된 버전 사용)
  const {
    isGenerating,
    statusMessage,
    progress,
    error,
    setError,
    restoredImageUrl,
    startRestoration,
    resetRestoration,
  } = useRestoration();

  // 2. 커스텀 훅: 캔버스 드로잉 로직
  const {
    paths,
    currentPath,
    historyStep,
    startDrawing,
    draw,
    stopDrawing,
    handleUndo,
    handleRedo,
    createMaskBlob,
  } = useCanvasDrawing({
    canvasRef,
    containerRef,
    isImageLoaded,
    disabled: !!restoredImageUrl || isGenerating, // 결과가 있거나 생성 중이면 드로잉 금지
  });

  // 초기 진입 체크
  useEffect(() => {
    if (!receivedImageUrl) {
      // 편의상 리다이렉트는 즉시 수행
      navigate("/");
    }
  }, [receivedImageUrl, navigate]);

  // 에러 발생 시 Dialog 띄우기
  useEffect(() => {
    if (error) {
      // eslint-disable-next-line
      setActiveDialog("SERVER_ERROR");
    }
  }, [error]);

  // --- 핸들러 ---

  // 복원 시작
  const handleGenerateClick = async () => {
    if (historyStep === -1) {
      setActiveDialog("NO_MASK"); // "색칠해주세요" 알림
      return;
    }
    const maskBlob = await createMaskBlob();
    if (maskBlob) {
      startRestoration(imageUrl, maskBlob);
    } else {
      console.error("마스크 생성 실패");
    }
  };

  // 뒤로가기 (Header)
  const handleBack = () => {
    if (isGenerating) return; // 생성 중 뒤로가기 방지

    if (restoredImageUrl) {
      // 3-4. 결과 화면에서 뒤로가기
      setActiveDialog("DISCARD_CONFIRM");
    } else {
      // 1-2. 편집 중 뒤로가기
      setActiveDialog("MASKING_BACK");
    }
  };

  // 다시 생성하기
  const handleRegenerateClick = () => {
    setActiveDialog("REGENERATE_CONFIRM");
  };

  // 비교 버튼 (Press & Hold)
  const startCompare = () => restoredImageUrl && setIsComparing(true);
  const endCompare = () => restoredImageUrl && setIsComparing(false);

  // Dialog 확인 처리
  const handleDialogConfirm = () => {
    switch (activeDialog) {
      case "MASKING_BACK":
        navigate(-1); // 진짜 뒤로가기
        break;
      case "SERVER_ERROR":
        setError(null);
        break;
      case "REGENERATE_CONFIRM":
        resetRestoration(); // 결과 초기화
        // startRestoration(imageUrl, null);
        // *수정*: 재시작 시 기존 마스크를 재사용하려면 state에 저장해두거나,
        // UI상에서 "다시 그리기" 상태로 돌아가는 것이라면 resetRestoration()만 호출하면 됩니다.
        // 기획 의도가 "같은 마스크로 다시 돌리기"라면 createMaskBlob 로직 재호출이 필요합니다.
        // 여기서는 "초기화(다시 그리기)"로 가정합니다.
        break;
      case "DISCARD_CONFIRM":
        resetRestoration();
        navigate(-1); // 뒤로가기
        break;
      case "NO_MASK":
        // 확인만 하면 됨
        break;
      default:
        break;
    }
    setActiveDialog("NONE");
  };

  // Dialog 취소 처리
  const handleDialogCancel = () => {
    if (activeDialog === "SERVER_ERROR") setError(null);
    setActiveDialog("NONE");
  };

  if (!receivedImageUrl) return null;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-neutral-900">
      <Header
        title={restoredImageUrl ? "복원 결과" : "탄 사진 복원하기"}
        showBack={true}
        onBack={handleBack}
        className="z-20"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
        <RestorationLoadingOverlay
          isGenerating={isGenerating}
          statusMessage={statusMessage}
          progress={progress}
        />

        {/* 상단 힌트 (결과 화면용) */}
        {restoredImageUrl && (
          <div className="absolute top-4 z-30 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-md transition-opacity">
            {isComparing ? "원본 이미지" : "복원된 이미지"}
          </div>
        )}

        <RestorationImageContainer
          imageUrl={imageUrl}
          restoredImageUrl={restoredImageUrl}
          isComparing={isComparing}
          isGenerating={isGenerating}
          canvasRef={canvasRef}
          containerRef={containerRef}
          startDrawing={startDrawing}
          draw={draw}
          stopDrawing={stopDrawing}
          startCompare={startCompare}
          endCompare={endCompare}
          setIsImageLoaded={setIsImageLoaded}
        />

        {/* 편집 모드일 때: Undo/Redo 컨트롤러 (위치: 이미지 하단) */}
        {!restoredImageUrl && !isGenerating && (
          <div className="mt-4">
            <RestorationControls
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyStep >= 0}
              canRedo={historyStep < paths.length - 1}
            />
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute right-0 bottom-13 left-0 z-30 flex w-full flex-col items-center justify-center px-4">
        <RestorationHintTooltip
          historyStep={historyStep}
          currentPath={currentPath}
          restoredImageUrl={restoredImageUrl}
          isGenerating={isGenerating}
        />
        <RestorationActionButtons
          historyStep={historyStep}
          currentPath={currentPath}
          restoredImageUrl={restoredImageUrl}
          isGenerating={isGenerating}
          handleGenerateClick={handleGenerateClick}
          handleRegenerateClick={handleRegenerateClick}
          startCompare={startCompare}
          endCompare={endCompare}
        />
      </div>

      <RestorationDialogs
        activeDialog={activeDialog}
        setActiveDialog={setActiveDialog}
        handleDialogConfirm={handleDialogConfirm}
        handleDialogCancel={handleDialogCancel}
        setError={setError}
        resetRestoration={resetRestoration}
      />
    </div>
  );
}
