import PhotoCard from "@/components/photoFeed/PhotoCard";
import { posts } from "@/constants/mypage/post.constant";

export function LikedPostPage() {
  return (
    <main className="mx-auto max-w-6xl py-6">
      <section className="columns-2 gap-4 md:columns-3 xl:columns-4">
        {posts.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} isLiked={photo.isLiked} />
        ))}
      </section>
    </main>
  );
}
