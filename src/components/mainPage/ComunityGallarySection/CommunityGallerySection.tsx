import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import CommunityGallerySectionCard, {
  type CommunityPost,
} from "./CommunityGallerySectionCard";

interface ApiResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    previewList: CommunityPost[];
    totalCount: number;
    isLast: boolean;
  };
}

export default function CommunityGallerySection() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      const baseUrl = import.meta.env.VITE_PUBLIC_API_URL;
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(`${baseUrl}/posts/preview`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json: ApiResponse = await response.json();

        if (json.success && json.data && Array.isArray(json.data.previewList)) {
          setPosts(json.data.previewList);
        } else {
          console.warn("데이터 구조가 예상과 다릅니다:", json);
          setPosts([]);
        }
      } catch (error) {
        console.error("에러: ", error);
        setPosts([]);
      }
    };

    fetchCommunityPosts();
  }, []);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="flex flex-col gap-7 py-6">
      <SectionHeader
        title="파인더들이 찍은 사진 같이 보실래요?"
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
