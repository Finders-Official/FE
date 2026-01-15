import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/components/common";
import { LabBasicInfo } from "@/components/photoLab/detail";
import { MOCK_LAB_DETAIL } from "@/constants/photoLab";
import type { PhotoLabDetail } from "@/types/photoLab";

export default function PhotoLabDetailPage() {
  const navigate = useNavigate();
  const [lab, setLab] = useState<PhotoLabDetail>(MOCK_LAB_DETAIL);

  const handleBack = () => {
    navigate(-1);
  };

  const handleFavoriteToggle = () => {
    setLab((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const mainImage = lab.images.find((img) => img.isMain) || lab.images[0];

  return (
    <div className="flex w-full flex-col">
      <div className="px-4">
        <Header title="파인더스 상도점" showBack onBack={handleBack} />
      </div>

      <main>
        {/* 메인 이미지 */}
        {mainImage && (
          <div className="-mx-4">
            <img
              src={mainImage.imageUrl}
              alt={lab.name}
              className="h-[13.6875rem] w-full object-cover"
            />
          </div>
        )}

        {/* 기본 정보 */}
        <LabBasicInfo lab={lab} onFavoriteToggle={handleFavoriteToggle} />
      </main>
    </div>
  );
}
