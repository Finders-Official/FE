import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { FILM_CAMERA_GUIDE_DATA } from "./constants";
import { ChevronLeftIcon } from "@/assets/icon";

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
      {/* 1. 헤더 (Navigation Bar) */}
      <header className="sticky top-0 z-20 flex h-15.25 w-full items-center gap-5 bg-neutral-900 px-4 py-4.5">
        <button
          onClick={() => navigate(-1)}
          className="-ml-1 flex items-center justify-center"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="h-6 w-6 text-neutral-200" />
        </button>
        <h1 className="mx-auto truncate text-[16px] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
          {data.title}
        </h1>
      </header>

      {/* 2. 히어로 이미지 섹션 */}
      <section className="h-54.74 relative w-full">
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          className="h-full w-full object-cover"
        />

        {/* 히어로 텍스트 */}
        <div className="absolute bottom-6 left-0 px-4">
          <h2 className="mb-2 text-[18px] leading-tight font-semibold text-neutral-100">
            {data.title}
          </h2>
          <p className="font-regular text-[16px] text-neutral-100">
            {data.summary}
          </p>
        </div>
      </section>

      {/* 3. 본문 영역 */}
      <div className="px-4 pt-8">
        {/* 3-1. 목차 */}
        {data.toc && (
          <div className="mb-10 space-y-1">
            {data.toc.map((item, index) => (
              <div
                key={index}
                className="font-regular text-[14px] leading-[155%] tracking-[-0.02%] text-neutral-200"
              >
                <span className="font-regular mr-1 text-[14px] leading-[155%] tracking-[-0.02%] text-neutral-200">
                  {index + 1}.
                </span>
                {item}
              </div>
            ))}
          </div>
        )}

        {/* 3-2. 인트로 텍스트 */}
        {data.introText && (
          <div className="mb-12 text-[15px] leading-[155%] font-normal tracking-[-0.02%] whitespace-pre-wrap text-neutral-100">
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
                  <h3 className="mb-1 text-[16px] leading-[155%] font-bold tracking-[-0.02%] whitespace-pre-wrap text-orange-500">
                    {section.heading}
                  </h3>
                )}

                {/* Case 2: LocationHeading */}
                {section.locationHeading && (
                  <h3 className="mb-1 text-[15px] leading-[155%] font-normal tracking-[-0.02%] whitespace-pre-wrap text-neutral-100">
                    {section.locationHeading}
                  </h3>
                )}

                {/* 서브 헤딩 */}
                {section.subHeading && (
                  <p className="text-[14px] leading-[155%] font-normal tracking-[-0.02%] whitespace-pre-wrap text-neutral-500">
                    {section.subHeading}
                  </p>
                )}
              </div>

              {/* 섹션 이미지 */}
              <div className="overflow-hidden rounded-[10px]">
                <img
                  src={section.imageUrl}
                  alt={section.heading || section.locationHeading}
                  className="h-auto w-full object-cover"
                />
              </div>

              {/* 설명글 */}
              <p className="text-[15px] leading-[155%] font-normal tracking-[-0.02%] whitespace-pre-wrap text-neutral-100">
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
