import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import { shareImageFromUrl } from "@/utils/photoRestoration/shareImage";
import { ShareIcon } from "@/assets/icon";

interface RestorationSavedOverlayProps {
  imageUrl: string;
  onClose: () => void;
}

export default function RestorationSavedOverlay({
  imageUrl,
  onClose,
}: RestorationSavedOverlayProps) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // 이미지 비율을 동적으로 적용
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    let objectUrl = "";

    async function loadPreview() {
      if (!imageUrl) return;
      setIsLoading(true);
      setHasError(false);
      setAspectRatio(null);

      try {
        const response = await fetch(imageUrl, { mode: "cors" });
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

        const blob = await response.blob();
        if (!isMounted) return;

        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
        setIsLoading(false);
      } catch {
        if (isMounted) {
          if (retryCount < 2) {
            setTimeout(() => {
              if (isMounted) setRetryCount((prev) => prev + 1);
            }, 500);
          } else {
            setHasError(true);
            setIsLoading(false);
          }
        }
      }
    }

    loadPreview();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageUrl, retryCount]);

  const handleShare = async () => {
    try {
      await shareImageFromUrl(imageUrl, { title: "복원한 사진" });
    } catch (e) {
      if (e instanceof Error) alert(e.message);
      else alert("공유하기를 사용할 수 없습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-neutral-900">
      <div className="relative z-[10000]">
        <Header
          title="저장 완료"
          showBack
          onBack={onClose}
          rightAction={{
            type: "icon",
            icon: <ShareIcon className="h-6 w-6 text-neutral-200" />,
            onClick: handleShare,
          }}
          className="px-4"
        />
      </div>

      <main className="relative z-30 flex flex-1 items-center justify-center pb-15.25 text-white">
        <div className="flex w-full justify-center px-4">
          <div
            className="flex w-full max-w-140 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-neutral-900"
            style={{
              maxHeight: "calc(100dvh - 160px)",
              aspectRatio: aspectRatio ?? undefined,
            }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                <div className="text-sm text-neutral-400">
                  사진을 불러오는 중...
                </div>
              </div>
            ) : hasError ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-neutral-300">
                <div className="text-sm font-medium">
                  이미지를 불러오지 못했어요
                </div>
                <div className="text-xs leading-relaxed text-neutral-500">
                  네트워크 연결을 확인하거나 상단의 공유 버튼을 통해
                  <br />
                  이미지 링크를 확인해보세요.
                </div>
              </div>
            ) : (
              <img
                src={previewUrl}
                alt="restored"
                className="block h-full w-full object-contain"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    setAspectRatio(img.naturalWidth / img.naturalHeight);
                  }
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
