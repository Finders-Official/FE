import { SectionHeader } from "@/components/common/SectionHeader";
import CommunityGallerySectionCard from "./CommunityGallerySectionCard";
import { useCommunityPostsQuery } from "@/hooks/mainPage/useMainPageQueries";

export default function CommunityGallerySection() {
  const { data: posts, isLoading, isError } = useCommunityPostsQuery();

  if (isLoading) return <div>로딩 중...</div>; // TODO: 스켈레톤 UI
  if (isError || !posts || posts.length === 0) return null;

  return (
    <section className="flex flex-col gap-7 py-6">
      <SectionHeader
        title={"파인더들이 찍은 사진\n같이 보실래요?"}
        link="/community"
      />

      <div className="scrollbar-hide flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4">
        {posts.map((post) => (
          <div key={post.postId} className="flex-none snap-center">
            <CommunityGallerySectionCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}
