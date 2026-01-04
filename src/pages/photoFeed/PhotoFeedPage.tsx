import PhotoCard from "../../components/photoFeed/PhotoCard";
import { photoMock } from "@/types/photo";

export default function PhotoFeedPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* Masonry 레이아웃 */}
      <section className="columns-2 gap-4 md:columns-3 xl:columns-4">
        {photoMock.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </section>
    </main>
  );
}
