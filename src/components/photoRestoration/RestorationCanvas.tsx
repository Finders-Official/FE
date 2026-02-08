import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/common/Header";
import { Tooltip } from "@/components/common/ToolTip";
import { getCreditBalance } from "@/apis/member";

import { RestorationImageContainer } from "./RestorationImageContainer";
import { RestorationActionButtons } from "./RestorationActionButtons";
import { RestorationHintTooltip } from "./RestorationHintTooltip";
import { RestorationDialogs } from "./RestorationDialogs";

import { RestorationLoadingOverlay } from "./RestorationLoadingOverlay";

import { useCanvasDrawing } from "@/hooks/photoRestoration/useCanvasDrawing";
import { useRestoration } from "@/hooks/photoRestoration/useRestoration";
import RestorationControls from "./RestorationControls";

import { RestorationCompareIcon } from "@/assets/icon";

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

  const [isCreditTooltipOpen, setIsCreditTooltipOpen] = useState(true);

  const { data: creditRes, isLoading: isCreditLoading } = useQuery({
    queryKey: ["credit-balance"],
    queryFn: getCreditBalance,
    enabled: !!localStorage.getItem("accessToken"), // 토큰 없으면 요청 안 함(선택)
  });

  const creditBalance = creditRes?.data.creditBalance ?? 0;
  const totalFree = 3;
  const usedFree = Math.max(0, totalFree - creditBalance);

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

  // 생성하기 or 다시 생성하기 캡슐 버튼이 보일 때만
  const shouldShowCapsuleAction =
    (!restoredImageUrl && historyStep >= 0) || !!restoredImageUrl;

  const shouldShowCreditTooltip =
    isCreditTooltipOpen &&
    !isGenerating &&
    !isCreditLoading &&
    shouldShowCapsuleAction;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-neutral-900">
      <Header
        title="탄 사진 복원하기"
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

        {/* 비교하기: 이미지 바로 아래 (결과 있을 때만) */}
        {restoredImageUrl && !isGenerating && (
          <div className="mt-3 flex w-85.75 justify-end">
            <div
              onMouseDown={startCompare}
              onMouseUp={endCompare}
              onMouseLeave={endCompare}
              onTouchStart={startCompare}
              onTouchEnd={endCompare}
              className="pointer-events-auto cursor-pointer rounded-full p-2"
            >
              <RestorationCompareIcon className="h-10 w-10" />
            </div>
          </div>
        )}

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

        <div className="relative mt-2 inline-flex">
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

          <RestorationActionButtons
            historyStep={historyStep}
            currentPath={currentPath}
            restoredImageUrl={restoredImageUrl}
            isGenerating={isGenerating}
            handleGenerateClick={handleGenerateClick}
            handleRegenerateClick={handleRegenerateClick}
          />
        </div>
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
