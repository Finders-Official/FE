import { useEffect } from "react";
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
  // === ADD LOGS ===
  useEffect(() => {
    console.log(`[Overlay] Mounted with imageUrl:`, imageUrl);
  }, [imageUrl]);
  // ================

  const handleShare = async () => {
    try {
      await shareImageFromUrl(imageUrl, {
        title: "복원한 사진",
      });
    } catch (e) {
      console.error("공유 실패", e);
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-neutral-900">
      <Header
        title="저장 완료"
        showBack
        onBack={onClose}
        rightAction={{
          type: "icon",
          icon: <ShareIcon className="h-6 w-6 text-neutral-200" />,
          onClick: handleShare,
        }}
      />

      <main className="flex flex-1 items-center justify-center text-white">
        <div className="flex w-full -translate-y-[30.5px] justify-center">
          <div
            className="flex w-full max-w-140 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-neutral-900"
            style={{
              maxHeight: "calc(100dvh - 160px)",
            }}
          >
            <img
              src={imageUrl}
              alt="saved"
              className="block h-full w-full object-contain"
              // === ADD PROPS ===
              onLoad={(e) => {
                const img = e.currentTarget;
                console.log(`[Overlay] Image Load Success`);
                console.log(
                  `[Overlay] Natural Dims: ${img.naturalWidth}x${img.naturalHeight}`,
                );
                console.log(`[Overlay] CurrentSrc: ${img.currentSrc}`);
              }}
              onError={(e) => {
                console.error(`[Overlay] Image Load Error`);
                console.error(`[Overlay] Event:`, e);
              }}
              // ================
            />
          </div>
        </div>
      </main>
    </div>
  );
}
