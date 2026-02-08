import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getPresignedUrl,
  uploadToGCS,
  requestRestoration,
  getRestorationStatus,
} from "@/apis/photoRestoration/restoration.api";

export const useRestoration = () => {
  const queryClient = useQueryClient();

  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [restoredImageUrl, setRestoredImageUrl] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 이번 복원에서 서버가 확정한 사용 토큰 수
  const [lastTokenUsed, setLastTokenUsed] = useState<number>(0);

  // 폴링 인터벌 제어용 Ref
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 최종 상태에서 tokenUsed 저장 + 크레딧 잔액 갱신 트리거
  const finalizeTokenAndCredit = (tokenUsed: number | undefined) => {
    setLastTokenUsed(typeof tokenUsed === "number" ? tokenUsed : 0);
    queryClient.invalidateQueries({ queryKey: ["credit-balance"] });
  };

  const startRestoration = async (originalImageUrl: string, maskBlob: Blob) => {
    if (isGenerating) return;

    // 상태 초기화
    setIsGenerating(true);
    setError(null);
    setRestoredImageUrl(null);
    setLastTokenUsed(0); // 매 실행마다 초기화
    setProgress(10);

    try {
      setStatusMessage("이미지 처리 중...");
      const originalBlob = await fetch(originalImageUrl).then((r) => r.blob());
      const originalFile = new File([originalBlob], "original.png", {
        type: "image/png",
      });
      setProgress(30);

      setStatusMessage("업로드 URL 발급 중...");
      const [originalPresigned, maskPresigned] = await Promise.all([
        getPresignedUrl("RESTORATION_ORIGINAL", "original.png"),
        getPresignedUrl("RESTORATION_MASK", "mask.png"),
      ]);
      setProgress(50);

      setStatusMessage("클라우드 업로드 중...");
      await Promise.all([
        uploadToGCS(originalPresigned.data.url, originalFile),
        uploadToGCS(maskPresigned.data.url, maskBlob),
      ]);
      setProgress(70);

      setStatusMessage("AI 복원 요청 중...");
      const restorationRes = await requestRestoration(
        originalPresigned.data.objectPath,
        maskPresigned.data.objectPath,
      );

      setStatusMessage("AI가 열심히 복원하고 있어요...");
      setProgress(85);

      // restorationId로 폴링 시작
      pollStatus(restorationRes.data.id);
    } catch (e) {
      if (e instanceof Error) {
        console.error("Restoration process error:", e.message, e);
      } else {
        console.error("Unknown error:", e);
      }
      setError("서버 연결이 불안정합니다");
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  const pollStatus = (id: number) => {
    const MAX_RETRIES = 60;
    let count = 0;

    clearPolling();

    intervalRef.current = setInterval(async () => {
      count++;

      try {
        const res = await getRestorationStatus(id);
        const data = res.data;
        // console.log("poll:", data.status, "tokenUsed:", data.tokenUsed);

        if (data.status === "COMPLETED") {
          clearPolling();

          // 서버 확정 tokenUsed 반영 + 크레딧 잔액 갱신
          finalizeTokenAndCredit(data.tokenUsed);

          setIsGenerating(false);
          setStatusMessage("");
          setProgress(100);
          setRestoredImageUrl(data.restoredUrl);
          return;
        }

        if (data.status === "FAILED") {
          clearPolling();

          // 실패여도 tokenUsed가 내려올 수 있으니 반영(서버 정책 따라 0일 수 있음)
          finalizeTokenAndCredit(data.tokenUsed);

          throw new Error(data.errorMessage || "복원 실패");
        }

        if (count >= MAX_RETRIES) {
          clearPolling();
          throw new Error("시간 초과");
        }
      } catch (e) {
        if (e instanceof Error) {
          console.error("Restoration polling error:", e.message, e);
        } else {
          console.error("Unknown error during polling:", e);
        }
        clearPolling();
        setIsGenerating(false);
        setStatusMessage("");
        setError("복원 결과를 가져오는데 실패했습니다.");
      }
    }, 1000);
  };

  const resetRestoration = () => {
    setRestoredImageUrl(null);
    setStatusMessage("");
    setIsGenerating(false);
    setProgress(0);
    setError(null);
    setLastTokenUsed(0);
    clearPolling();
  };

  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, []);

  return {
    isGenerating,
    statusMessage,
    progress,
    restoredImageUrl,
    error,
    setError,
    startRestoration,
    resetRestoration,
    lastTokenUsed,
  };
};
