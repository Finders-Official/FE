// Presigned URL 발급, 업로드, 복원 요청, 폴링 로직을 담당
import { useState, useRef } from "react";
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
    setIsGenerating(true);

    try {
      setStatusMessage("이미지 처리 중...");

      const originalBlob = await fetch(originalImageUrl).then((r) => r.blob());
      const originalFile = new File([originalBlob], "original.png", {
        type: "image/png",
      });

      setStatusMessage("업로드 URL 발급 중...");
      const [originalPresigned, maskPresigned] = await Promise.all([
        getPresignedUrl("RESTORATION_ORIGINAL", "original.png"),
        getPresignedUrl("RESTORATION_MASK", "mask.png"),
      ]);

      // -----------------------------------------------------------
      // Presigned URL 발급 결과 확인
      // -----------------------------------------------------------
      console.log("🔍 [1] Presigned API 응답 데이터:");
      console.log("원본 objectPath:", originalPresigned.data.objectPath);
      console.log("마스크 objectPath:", maskPresigned.data.objectPath);

      setStatusMessage("클라우드 업로드 중...");
      await Promise.all([
        uploadToGCS(originalPresigned.data.url, originalFile),
        uploadToGCS(maskPresigned.data.url, maskBlob),
      ]);

      setStatusMessage("AI 복원 요청 중...");
      const restorationRes = await requestRestoration(
        originalPresigned.data.objectPath,
        maskPresigned.data.objectPath,
      );

      setStatusMessage("AI가 열심히 복원하고 있어요...");
      pollStatus(restorationRes.data.id);
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  const pollStatus = (id: number) => {
    const MAX_RETRIES = 60;
    let count = 0;

    clearPolling(); // 기존 폴링 있으면 제거

    intervalRef.current = setInterval(async () => {
      count++;
      try {
        const res = await getRestorationStatus(id);
        const data = res.data;

        if (data.status === "COMPLETED") {
          clearPolling();
          setIsGenerating(false);
          setStatusMessage("");
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
        console.error(e);
        clearPolling();
        setIsGenerating(false);
        setStatusMessage("");
        alert("복원 결과를 가져오는데 실패했습니다.");
      }
    }, 1000);
  };

  // 초기화 함수 (재편집 시 사용)
  const resetRestoration = () => {
    setRestoredImageUrl(null);
    setStatusMessage("");
    setIsGenerating(false);
    clearPolling();
  };

  return {
    isGenerating,
    statusMessage,
    restoredImageUrl,
    startRestoration,
    resetRestoration,
  };
};
