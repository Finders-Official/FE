import { useNavigate } from "react-router";
import { FILM_CAMERA_GUIDE_DATA } from "./constants";
import { GuideContentCard } from "@/components/filmCameraGuide/GuideContentCard";
import Header from "@/components/common/Header";

const FilmCameraGuidePage = () => {
  const navigate = useNavigate();

  const handleCardClick = (id: number) => {
    navigate(`/film-camera-guide/${id}`);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-neutral-900 pb-10 text-neutral-100">
      <Header
        title={"필카 입문 101"}
        showBack={true}
        onBack={() => navigate(-1)}
        className="sticky top-0 z-20 bg-neutral-900 px-4"
      />

      {/* 서브 헤더 */}
      <section className="sticky top-15 z-10 bg-neutral-900 pt-2 pb-5">
        <h2 className="mb-1.5 text-[20px] leading-[1.3] font-semibold tracking-[-0.02] text-neutral-100">
          필름 카메라, 처음이라면 여기부터
        </h2>
        <p className="text-[16px] leading-normal font-normal text-neutral-100">
          필름 초심자를 위한 콘텐츠를 다 모아
        </p>
      </section>

      {/* 히어로 이미지 리스트 */}
      <section className="flex flex-col gap-5">
        {FILM_CAMERA_GUIDE_DATA.map((data) => (
          <GuideContentCard
            key={data.id}
            content={data}
            onClick={handleCardClick}
          />
        ))}
      </section>
    </div>
  );
};

export default FilmCameraGuidePage;
