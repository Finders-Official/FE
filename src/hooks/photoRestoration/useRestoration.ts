import { useState, useRef } from "react";
import { isAxiosError } from "axios";
import {
  getPresignedUrl,
  uploadToGCS,
  requestRestoration,
  getRestorationStatus,
} from "@/apis/photoRestoration/restoration.api";

export const useRestoration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [restoredImageUrl, setRestoredImageUrl] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 폴링 인터벌 제어용 Ref
  const intervalRef = useRef<number | null>(null);

  const clearPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startRestoration = async (originalImageUrl: string, maskBlob: Blob) => {
    if (isGenerating) return;

    // 상태 초기화
    setIsGenerating(true);
    setError(null);
    setRestoredImageUrl(null);
    setProgress(10); // 시작

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
      setProgress(85); // 폴링 직전
      pollStatus(restorationRes.data.id);
    } catch (e) {
      if (isAxiosError(e)) {
        console.error("Axios error:", {
          status: e.response?.status,
          data: e.response?.data,
          headers: e.response?.headers,
        });
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

        if (data.status === "COMPLETED") {
          clearPolling();
          setIsGenerating(false);
          setStatusMessage("");
          setProgress(100); // 완료
          setRestoredImageUrl(data.restoredUrl);
        } else if (data.status === "FAILED") {
          clearPolling();
          throw new Error(data.errorMessage || "복원 실패");
        }

        if (count >= MAX_RETRIES) {
          clearPolling();
          throw new Error("시간 초과");
        }
      } catch (e) {
        if (isAxiosError(e)) {
          console.error("Axios error during polling:", {
            status: e.response?.status,
            data: e.response?.data,
            headers: e.response?.headers,
          });
        } else {
          console.error("Unknown error during polling:", e);
        }
        clearPolling();
        setIsGenerating(false);
        setStatusMessage("");
        setError("복원 결과를 가져오는데 실패했습니다."); // 에러 처리
      }
    }, 1000); // 1초마다 폴링
  };

  const resetRestoration = () => {
    setRestoredImageUrl(null);
    setStatusMessage("");
    setIsGenerating(false);
    setProgress(0);
    setError(null);
    clearPolling();
  };

  return {
    isGenerating,
    statusMessage,
    progress,
    restoredImageUrl,
    error,
    setError,
    startRestoration,
    resetRestoration,
  };
};
