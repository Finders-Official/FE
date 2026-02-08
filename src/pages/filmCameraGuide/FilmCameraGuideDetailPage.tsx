import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { FILM_CAMERA_GUIDE_DATA } from "./constants";
import Header from "@/components/common/Header";

const FilmCameraGuideDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 컴포넌트가 렌더링될 때 바로 데이터를 찾아 변수에 할당합니다.
  const data = FILM_CAMERA_GUIDE_DATA.find((item) => item.id === Number(id));

  useEffect(() => {
    // 스크롤 최상단 이동
    window.scrollTo(0, 0);

    // 데이터가 없을 경우 뒤로가기 처리
    if (!data) {
      navigate(-1);
    }
  }, [data, navigate]);

  // 데이터가 없으면 렌더링 하지 않음 (useEffect에서 리다이렉트 될 때까지 빈 화면)
  if (!data) return null;

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-neutral-900 pb-20 text-neutral-100">
      {/* 1. 헤더 (공용 컴포넌트 적용) */}
      <Header
        title={data.title}
        showBack={true}
        onBack={() => navigate(-1)}
        className="sticky top-0 z-20 bg-neutral-900"
      />

      {/* 2. 히어로 이미지 섹션 */}
      <section className="h-54.74 relative w-full">
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          className="h-full w-full object-cover"
        />
      </section>

      {/* 3. 본문 영역 */}
      <div className="pt-8">
        {/* 3-1. 목차 */}
        {data.toc && (
          <div className="mb-10 space-y-1">
            {data.toc.map((item, index) => (
              <div
                key={index}
                className="font-regular text-[0.875rem] leading-[155%] tracking-[-0.02%] text-neutral-200"
              >
                <span className="font-regular mr-1 text-[0.875rem] leading-[155%] tracking-[-0.02%] text-neutral-200">
                  {index + 1}.
                </span>
                {item}
              </div>
            ))}
          </div>
        )}

        {/* 3-2. 인트로 텍스트 */}
        {data.introText && (
          <div className="mb-12 text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02%] whitespace-pre-wrap text-neutral-100">
            {data.introText}
          </div>
        )}

        {/* 3-3. 섹션별 상세 내용 */}
        <div className="flex flex-col gap-12">
          {data.contents?.map((section, idx) => (
            <article key={idx} className="flex flex-col gap-4">
              {/* 소제목 영역 */}
              <div>
                {/* Case 1: Heading */}
                {section.heading && (
                  <h3 className="mb-1 text-[1rem] leading-[155%] font-bold tracking-[-0.02%] whitespace-pre-wrap text-orange-500">
                    {section.heading}
                  </h3>
                )}

                {/* Case 2: LocationHeading */}
                {section.locationHeading && (
                  <h3 className="mb-1 text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02%] whitespace-pre-wrap text-neutral-100">
                    {section.locationHeading}
                  </h3>
                )}

                {/* 서브 헤딩 */}
                {section.subHeading && (
                  <p className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02%] whitespace-pre-wrap text-neutral-500">
                    {section.subHeading}
                  </p>
                )}
              </div>

              {/* 섹션 이미지 */}
              {section.imageUrl ? (
                <div className="overflow-hidden rounded-[0.625rem]">
                  <img
                    src={section.imageUrl}
                    alt=""
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}

              {/* 설명글 */}
              <p className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02%] whitespace-pre-wrap text-neutral-100">
                {section.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilmCameraGuideDetailPage;
