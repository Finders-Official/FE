import PhotoCard from "@/components/photoFeed/mainFeed/PhotoCard";
import { photoMock } from "@/types/photoFeed/postPreview";

export function LikedPostPage() {
  return (
    <main className="mx-auto max-w-6xl py-6">
      <section className="columns-2 gap-4 md:columns-3 xl:columns-4">
        {photoMock.previewList.map((photo) => (
          <PhotoCard key={photo.postId} photo={photo} isLiked={photo.isLiked} />
        ))}
      </section>
    </main>
  );
}
