import { useState } from "react";
import PhotoCard from "@/components/photoFeed/PhotoCard";
import { mockPreviewList } from "@/types/photo";
import NewPostModal from "@/components/photoFeed/NewPostModal";
import { FloatingIcon, SearchIcon } from "@/assets/icon";
import { Header } from "@/components/common";
import { useNavigate } from "react-router";

export default function PhotoFeedPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-6xl py-6">
      <Header
        title="사진수다"
        rightAction={{
          type: "icon",
          icon: <SearchIcon className="h-4.5 w-4.5 text-neutral-200" />,
          onClick: () => {
            navigate("/photoFeed/search");
          },
        }}
      />
      {/* Masonry 레이아웃 */}
      <section className="mb-20 columns-2 gap-4 md:columns-3 xl:columns-4">
        {mockPreviewList.previewList.map((photo) => (
          <PhotoCard key={photo.postId} photo={photo} />
        ))}
      </section>

      {/* 새 게시물 작성 플로팅 버튼 */}
      <button
        type="button"
        aria-label="새 게시물 작성"
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed right-6 bottom-[calc(var(--tabbar-height)+var(--fab-gap))] z-50 flex h-[3.5625rem] w-[3.5625rem]"
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
