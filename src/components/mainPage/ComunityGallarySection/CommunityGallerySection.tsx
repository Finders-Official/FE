import { SectionHeader } from "@/components/common/SectionHeader";
import CommunityGallerySectionCard, {
  type CommunityPost,
} from "./CommunityGallerySectionCard";

// 인기 게시글 10개
const MOCK_POSTS: CommunityPost[] = Array.from({ length: 10 }).map(
  (_, index) => ({
    id: index + 1,
    thumbnail: `https://images.unsplash.com/photo-${
      [
        "1492691527719-9d1e07e534b4",
        "1470071459604-3b5ec3a7fe05",
        "1492691527719-9d1e07e534b4",
        "1470071459604-3b5ec3a7fe05",
        "1492691527719-9d1e07e534b4",
      ][index % 5]
    }?w=800&q=80`,
    caption:
      index % 2 === 0
        ? "지난 주말 행궁동 나들이 다녀왔어요. 너무 예쁘죠? 다음에 한 번 더 가보려구요!"
        : "필름 카메라 처음 사봤는데 색감이 너무 마음에 드네요 ㅎㅎ 추천합니다!",
    likeCount: 120 + index,
    commentCount: 5 + index,
    isLiked: index % 3 === 0, // 일부는 좋아요 눌린 상태로 모킹
  }),
);

export default function CommunityGallerySection() {
  return (
    <section className="flex flex-col gap-7 py-6">
      <SectionHeader title="파인더들이 찍은 사진 같이 보실래요?" link="/" />

      {/* 가로 스크롤 컨테이너  */}
      <div className="scrollbar-hide flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4">
        {MOCK_POSTS.map((post) => (
          <div key={post.id} className="flex-none snap-center">
            <CommunityGallerySectionCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}

// SectionHeader 링크 수정
