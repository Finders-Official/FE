import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Header from "@/components/common/Header";
import {
  PaintBrushIcon,
  SparklesFillIcon,
  RestorationCompareIcon,
} from "@/assets/icon";

// Hooks & Components
import { useCanvasDrawing } from "@/hooks/photoRestoration/useCanvasDrawing";
import { useRestoration } from "@/hooks/photoRestoration/useRestoration";
import RestorationControls from "./RestorationControls";
import { DialogBox } from "@/components/common/DialogBox";
import { CapsuleButton } from "@/components/common/CapsuleButton";

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
    progress, // (추가됨)
    error, // (추가됨)
    setError, // (추가됨)
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
      // 여기는 시스템 alert 써도 무방하지만 일관성을 위해 Dialog 처리 가능
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

  const showOriginal = !restoredImageUrl || isComparing;
  const currentImageSrc = showOriginal ? imageUrl : restoredImageUrl;

  return (
    <div className="flex h-full w-full flex-col bg-neutral-900">
      <Header
        title={restoredImageUrl ? "복원 결과" : "탄 사진 복원하기"}
        showBack={true}
        onBack={handleBack}
        className="z-20 px-4"
        // rightAction 제거 (하단 버튼으로 대체)
      />

      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
        {/* 2-1. 로딩 오버레이 (퍼센트 포함) */}
        {isGenerating && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mb-2 text-lg font-bold text-white">{statusMessage}</p>
            <p className="text-2xl font-bold text-orange-500">{progress}%</p>
          </div>
        )}

        {/* 상단 힌트 (결과 화면용) */}
        {restoredImageUrl && (
          <div className="absolute top-4 z-30 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-md transition-opacity">
            {isComparing ? "원본 이미지" : "복원된 이미지"}
          </div>
        )}

        {/* 이미지 & 캔버스 컨테이너 */}
        <div
          ref={containerRef}
          className="relative w-85.75 overflow-hidden rounded-[0.625rem] bg-neutral-800"
          // 이미지 영역 터치로 비교하기 기능 유지 (UX 보조)
          onMouseDown={startCompare}
          onMouseUp={endCompare}
          onMouseLeave={endCompare}
          onTouchStart={startCompare}
          onTouchEnd={endCompare}
        >
          <img
            src={currentImageSrc}
            alt="Target"
            className="pointer-events-none h-auto w-full object-contain select-none"
            onLoad={() => setIsImageLoaded(true)}
          />

          {/* 복원 전이고, 생성 중이 아닐 때만 캔버스 활성화 */}
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

      {/* --- 하단 버튼 영역 (CapsuleButton) --- */}
      <div className="z-20 flex w-full justify-center bg-neutral-900 px-4 pt-4 pb-10">
        {!restoredImageUrl ? (
          /* [1-1] 마스킹 완료(Undo 가능 상태)일 때만 -> 생성하기 버튼 표시 */
          historyStep >= 0 && (
            <CapsuleButton
              text="복원 실행하기"
              image={SparklesFillIcon}
              size="medium"
              onClick={handleGenerateClick}
              className={isGenerating ? "pointer-events-none opacity-50" : ""}
            />
          )
        ) : (
          /* [3] 결과 확인 -> 비교하기 & 다시하기 버튼 */
          <div className="flex items-center gap-4">
            {/* [3-2] 비교하기 버튼 (Press & Hold Wrapper) */}
            <div
              onMouseDown={startCompare}
              onMouseUp={endCompare}
              onMouseLeave={endCompare}
              onTouchStart={startCompare}
              onTouchEnd={endCompare}
            >
              <CapsuleButton
                text="비교하기"
                image={RestorationCompareIcon}
                size="small"
              />
            </div>

            {/* [3-1] 다시 생성하기 버튼 */}
            <CapsuleButton
              text="다시 해보기"
              image={SparklesFillIcon}
              size="small"
              onClick={handleRegenerateClick}
            />
          </div>
        )}
      </div>

      {/* --- 하단 힌트 툴팁 (초기 상태일 때만) --- */}
      {historyStep === -1 &&
        !currentPath &&
        !restoredImageUrl &&
        !isGenerating && (
          <div className="fade-in pointer-events-none absolute right-0 bottom-28 left-0 z-30 flex justify-center px-4 duration-300">
            <div className="bg-neutral-875/80 flex h-15 w-81.25 items-center gap-4 rounded-[1.125rem] border border-neutral-800 px-5 shadow-lg backdrop-blur-md">
              <PaintBrushIcon className="h-7 w-7 text-orange-500" />
              <span className="text-[0.9375rem] font-semibold text-neutral-200">
                복원이 필요한 부분을 색칠해주세요.
              </span>
            </div>
          </div>
        )}

      {/* --- 다이얼로그 --- */}
      <DialogBox
        isOpen={activeDialog === "MASKING_BACK"}
        title="아직 사진을 다듬고 있어요"
        description="지금 나가면 작업한 내용이 사라져요."
        cancelText="저장 안 함"
        onCancel={() => {
          navigate(-1); // 뒤로가기 실행
        }}
        confirmText="계속 편집"
        onConfirm={() => {
          setActiveDialog("NONE"); // 다이얼로그만 닫고 편집 계속
        }}
        confirmButtonStyle="filled" // 오른쪽 버튼을 주황색으로 채움
      />

      <DialogBox
        isOpen={activeDialog === "SERVER_ERROR"}
        title="서버 연결이 불안정합니다"
        description="잠시 후 다시 시도해주세요."
        align="left"
        confirmButtonStyle="text"
        confirmText="확인"
        onConfirm={handleDialogConfirm}
      />

      <DialogBox
        isOpen={activeDialog === "NO_MASK"}
        title="영역을 선택해주세요"
        description="복원할 부분을 색칠해야 합니다."
        confirmText="확인"
        onConfirm={handleDialogConfirm}
      />

      <DialogBox
        isOpen={activeDialog === "REGENERATE_CONFIRM"}
        title="복원을 한 번 더 진행할까요?"
        description="기존에 생성된 이미지는 저장되지 않습니다."
        confirmText="다시 하기"
        cancelText="취소"
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />

      <DialogBox
        isOpen={activeDialog === "DISCARD_CONFIRM"}
        title="생성된 이미지를 폐기할까요?"
        description="이 페이지를 벗어나면 복원된 사진이 삭제됩니다."
        confirmText="폐기하기"
        cancelText="취소"
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
        confirmButtonStyle="text"
      />
    </div>
  );
}
