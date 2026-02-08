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

      <main className="flex flex-1 flex-col items-center pt-24 text-white">
        <div className="w-full max-w-140 overflow-hidden rounded-2xl border border-white/10">
          <img src={imageUrl} alt="saved" className="block h-auto w-full" />
        </div>
      </main>
    </div>
  );
}
