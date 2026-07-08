import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";

import Header from "@/components/common/Header";
import RestorationSavedOverlay from "@/components/photoRestoration/RestorationSavedOverlay";
import { getCreditBalance } from "@/apis/member";
import { useAuthStore } from "@/store/useAuth.store";

import { RestorationImageContainer } from "@/components/photoRestoration/RestorationImageContainer";
import { RestorationDialogs } from "@/components/photoRestoration/RestorationDialogs";
import { RestorationLoadingOverlay } from "@/components/photoRestoration/RestorationLoadingOverlay";
import RestorationControls from "@/components/photoRestoration/RestorationControls";
import { RestorationFooter } from "@/components/photoRestoration/RestorationFooter";

import { useCanvasDrawing } from "@/hooks/photoRestoration/useCanvasDrawing";
import { useRestoration } from "@/hooks/photoRestoration/useRestoration";
import { useRestorationSave } from "@/hooks/photoRestoration/useRestorationSave";

import { RestorationCompareIcon } from "@/assets/icon";

type ViewMode = "MAIN" | "SAVED";

type DialogType =
  | "NONE"
  | "MASKING_BACK"
  | "SERVER_ERROR"
  | "REGENERATE_CONFIRM"
  | "DISCARD_CONFIRM"
  | "NO_MASK"
  | "NO_CREDIT";

export default function PhotoRestorationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const receivedImageUrl =
    (location.state as { imageUrl?: string } | null)?.imageUrl ?? null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogType>("NONE");
  const [viewMode, setViewMode] = useState<ViewMode>("MAIN");
  const [isCreditTooltipOpen, setIsCreditTooltipOpen] = useState(true);

  const imageUrl = useMemo(() => receivedImageUrl ?? "", [receivedImageUrl]);

  // getState()는 스토어를 구독하지 않아 로그인 상태 변화에 반응하지 못하므로 훅으로 구독
  const user = useAuthStore((s) => s.user);

  const { data: creditRes, isLoading: isCreditLoading } = useQuery({
    queryKey: ["credit-balance"],
    queryFn: getCreditBalance,
    enabled: !!user,
  });

  const FREE_CREDIT_CAP = 5;

  const creditBalanceRaw = creditRes?.data.creditBalance ?? 0;
  // 데모 정책(최대 보유 5)에 맞춰 UI/차감 로직 모두 동일 기준 사용
  const creditBalance = Math.min(
    Math.max(creditBalanceRaw, 0),
    FREE_CREDIT_CAP,
  );

  const totalFree = FREE_CREDIT_CAP;
  const usedFree = totalFree - creditBalance;

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

  // 디버깅
  useEffect(() => {
    if (viewMode === "SAVED") {
      console.log("[SAVED] restoredImageUrl:", restoredImageUrl);
    }
  }, [viewMode, restoredImageUrl]);

  const visibleDialog = error ? "SERVER_ERROR" : activeDialog;

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
    imageRef,
    isImageLoaded,
    disabled: !!restoredImageUrl || isGenerating,
  });

  const { isSaving, save } = useRestorationSave({
    restoredImageUrl,
    isGenerating,
  });

  const handleSaveClick = async () => {
    const success = await save();
    if (success) {
      setViewMode("SAVED"); // URL 안 바꾸고 저장완료 화면 오픈
    }
  };

  useEffect(() => {
    if (!receivedImageUrl) navigate("/", { replace: true });
  }, [receivedImageUrl, navigate]);

  // blob URL은 Capacitor WebView에서 페이지 unload가 없어 자동 해제되지 않는다.
  // StrictMode 이중 mount로 fetch가 깨지는 useEffect cleanup 대신,
  // 편집기를 실제로 벗어나는 시점(뒤로가기/폐기)에 revoke한다.
  const revokeReceivedImage = useCallback(() => {
    if (receivedImageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(receivedImageUrl);
    }
  }, [receivedImageUrl]);

  const handleGenerateClick = useCallback(async () => {
    if (creditBalance <= 0) {
      setActiveDialog("NO_CREDIT");
      return;
    }
    if (historyStep === -1) {
      setActiveDialog("NO_MASK");
      return;
    }

    const maskBlob = await createMaskBlob();
    if (!maskBlob) {
      console.error("마스크 생성 실패");
      return;
    }

    startRestoration(imageUrl, maskBlob);
  }, [creditBalance, historyStep, createMaskBlob, startRestoration, imageUrl]);

  const handleBack = useCallback(() => {
    if (isGenerating) return;

    setActiveDialog(restoredImageUrl ? "DISCARD_CONFIRM" : "MASKING_BACK");
  }, [isGenerating, restoredImageUrl]);

  const handleRegenerateClick = useCallback(() => {
    setActiveDialog("REGENERATE_CONFIRM");
  }, []);

  const startCompare = useCallback(() => {
    if (restoredImageUrl) setIsComparing(true);
  }, [restoredImageUrl]);

  const endCompare = useCallback(() => {
    if (restoredImageUrl) setIsComparing(false);
  }, [restoredImageUrl]);

  const handleDialogConfirm = useCallback(() => {
    switch (visibleDialog) {
      case "MASKING_BACK": {
        revokeReceivedImage();
        navigate(-1);
        break;
      }
      case "SERVER_ERROR": {
        setError(null);
        break;
      }
      case "REGENERATE_CONFIRM": {
        resetRestoration();
        break;
      }
      case "DISCARD_CONFIRM": {
        resetRestoration();
        revokeReceivedImage();
        navigate(-1);
        break;
      }
      case "NO_CREDIT": {
        navigate("/mypage/credit?tab=buy");
        break;
      }
      case "NO_MASK": {
        // 닫기만
        break;
      }
      default:
        break;
    }
    setActiveDialog("NONE");
  }, [
    visibleDialog,
    navigate,
    resetRestoration,
    setError,
    revokeReceivedImage,
  ]);

  const handleDialogCancel = useCallback(() => {
    if (visibleDialog === "SERVER_ERROR") setError(null);
    setActiveDialog("NONE");
  }, [visibleDialog, setError]);

  if (!receivedImageUrl) return null;

  const shouldShowCapsuleAction =
    (!restoredImageUrl && historyStep >= 0) || !!restoredImageUrl;

  const shouldShowCreditTooltip =
    isCreditTooltipOpen &&
    !isGenerating &&
    !isCreditLoading &&
    shouldShowCapsuleAction &&
    viewMode === "MAIN";

  return (
    <div className="relative flex h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full flex-col overflow-hidden bg-neutral-900">
      {viewMode === "MAIN" && (
        <>
          <Header
            title="탄 사진 복원하기"
            showBack
            onBack={handleBack}
            rightAction={
              restoredImageUrl && !isGenerating
                ? {
                    type: "text",
                    text: "저장",
                    onClick: handleSaveClick,
                    loading: isSaving,
                    disabled: isSaving,
                  }
                : undefined
            }
          />

          {/* Main Content Area: Flex column to manage available space */}
          <div className="relative flex w-full flex-1 flex-col overflow-hidden">
            {/* 1. Image Stage Area: Takes all available space, shrinking image if needed */}
            <div className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-center pb-22.5">
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
                imageRef={imageRef}
                startDrawing={startDrawing}
                draw={draw}
                stopDrawing={stopDrawing}
                startCompare={startCompare}
                endCompare={endCompare}
                setIsImageLoaded={setIsImageLoaded}
              />

              {/* 비교하기: 이미지 바로 아래 (결과 있을 때만) */}
              {restoredImageUrl && !isGenerating && (
                <div className="mt-4 flex w-full justify-end">
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

              {/* 편집 모드일 때: Undo/Redo 컨트롤러 */}
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
          </div>

          <RestorationDialogs
            activeDialog={visibleDialog}
            setActiveDialog={setActiveDialog}
            handleDialogConfirm={handleDialogConfirm}
            handleDialogCancel={handleDialogCancel}
            setError={setError}
            resetRestoration={resetRestoration}
          />
        </>
      )}

      {viewMode === "SAVED" && restoredImageUrl && (
        <RestorationSavedOverlay
          imageUrl={restoredImageUrl}
          onClose={() => setViewMode("MAIN")}
        />
      )}

      <RestorationFooter
        viewMode={viewMode}
        historyStep={historyStep}
        currentPath={currentPath}
        restoredImageUrl={restoredImageUrl}
        isGenerating={isGenerating}
        shouldShowCreditTooltip={shouldShowCreditTooltip}
        usedFree={usedFree}
        totalFree={totalFree}
        setIsCreditTooltipOpen={setIsCreditTooltipOpen}
        handleGenerateClick={handleGenerateClick}
        handleRegenerateClick={handleRegenerateClick}
      />
    </div>
  );
}
