import { PhotoLabCard } from "@/components/mypage";
import { PHOTO_LABS } from "@/constants/mypage/photolab.constant";

export function LikedPhotoLabPage() {
  return (
    <div>
      <main className="px-4">
        {PHOTO_LABS.map((photolab) => (
          <PhotoLabCard key={photolab.id} photoLab={photolab} />
        ))}
      </main>
    </div>
  );
}
