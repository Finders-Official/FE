import { useState } from "react";
import PhotoCard from "@/components/photoFeed/PhotoCard";
import { photoMock } from "@/types/photo";
import NewPostModal from "@/components/photoFeed/NewPostModal";
import { FloatingIcon } from "@/assets/icon";

export default function PhotoFeedPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* Masonry 레이아웃 */}
      <section className="columns-2 gap-4 md:columns-3 xl:columns-4">
        {photoMock.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </section>

      {/* 새 게시물 작성 플로팅 버튼 */}
      <button
        type="button"
        aria-label="새 게시물 작성"
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed right-6 bottom-24 z-50 flex h-[3.5625rem] w-[3.5625rem]"
      >
        <FloatingIcon className="h-[3.5625rem] w-[3.5625rem]" />
      </button>

      {isCreateModalOpen && (
        <NewPostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </main>
  );
}

/**
 * CO-010 PhotoFeedPage.tsx
 * Description: 사진수다 전체 피드 페이지
 */
