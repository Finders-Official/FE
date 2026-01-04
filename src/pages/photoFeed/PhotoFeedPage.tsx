import { useState } from "react";
import PhotoCard from "../../components/photoFeed/PhotoCard";
import { photoMock } from "@/types/photo";
import NewPostModal from "@/components/photoFeed/NewPostModal";
import FloatingIcon from "@/assets/icon/floating.svg?react";

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
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed right-6 bottom-6 z-50 flex h-[57px] w-[57px]"
      >
        <FloatingIcon className="h-[57px] w-[57px]" />
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
