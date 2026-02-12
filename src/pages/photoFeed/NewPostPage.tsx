import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useNewPostState } from "@/store/useNewPostState.store";
import { TextArea } from "@/components/common/TextArea";
import { isValidText } from "@/utils/isValidText";
import { CTA_Button, Header } from "@/components/common";
import { scrollToCenter } from "@/utils/scrollToCenter";

const LIMITS = {
  titleMin: 2,
  titleMax: 30,
  contentMin: 20,
  contentMax: 300,
  maxPhotos: 10,
} as const;

export default function NewPostPage() {
  const navigate = useNavigate();
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const files = useNewPostState((s) => s.files);
  const setPostInfo = useNewPostState((s) => s.setPostInfo);
  const reset = useNewPostState((s) => s.reset);

  const title = useNewPostState((s) => s.title);
  const content = useNewPostState((s) => s.content);

  const previewUrls = useNewPostState((s) => s.previewUrls);

  // store에 저장된 값이 있으면 꺼내오기
  const [titleText, setTitleText] = useState(() => title ?? "");
  const [contentText, setContentText] = useState(() => content ?? "");

  // 파일 없으면(직접 URL 접근/새로고침 등) 피드로
  useEffect(() => {
    if (files.length === 0) {
      navigate("/photoFeed", { replace: true });
    }
  }, [files.length, navigate]);

  const limitedFiles = useMemo(() => files.slice(0, LIMITS.maxPhotos), [files]);

  const isTitleValid = useMemo(
    () => isValidText(titleText, LIMITS.titleMin, LIMITS.titleMax),
    [titleText],
  );

  const isContentValid = useMemo(
    () => isValidText(contentText, LIMITS.contentMin, LIMITS.contentMax),
    [contentText],
  );

  const handleNext = () => {
    if (!isContentValid) {
      setContentError(true);

      if (!isTitleValid) {
        setTitleError(true);

        // 스크롤 + 포커스
        const el = titleRef.current;
        if (el) {
          scrollToCenter(el);
          el.focus();
        }
        return;
      }

      // 스크롤 + 포커스
      const el = contentRef.current;
      if (el) {
        scrollToCenter(el);
        el.focus();
      }
      return;
    }
    setTitleError(false);
    setContentError(false);
    setPostInfo(titleText, contentText);
    navigate("/photoFeed/lab/find");
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[23.4375rem] py-[1rem]">
      <Header
        title="글 작성하기"
        showBack
        onBack={() => {
          reset();
          navigate(-1);
        }}
      />
      {/* 선택된 사진 슬라이딩 */}
      <div
        className="scrollbar-hide mb-[1rem] flex h-[15.1875rem] snap-x snap-mandatory gap-[0.5rem] overflow-x-auto p-[1rem] [-webkit-overflow-scrolling:touch]"
        aria-label="선택된 사진 미리보기"
      >
        {limitedFiles.map((file, idx) => (
          <div
            key={`${file.name}-${file.lastModified}-${idx}`}
            className="h-[13.1875rem] w-[9.9375rem] shrink-0 snap-start overflow-hidden bg-neutral-800"
          >
            <img
              src={previewUrls[idx]}
              alt={`선택한 사진 ${idx + 1}`}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* 내용 작성 + 다음 */}
      <div className="flex flex-col gap-[1rem]">
        <section className="flex flex-col gap-[0.5rem]">
          <p className="text-[0.875rem] text-white">제목</p>
          <TextArea
            ref={titleRef}
            type="title"
            value={titleText}
            onChange={(v) => {
              setTitleText(v);
              if (titleError && isTitleValid) {
                setTitleError(false);
              }
            }}
            placeholder="제목을 입력해주세요."
            minLength={LIMITS.titleMin}
            maxLength={LIMITS.titleMax}
            isError={titleError}
          />
          {titleError && (
            <p
              className={`px-[0.625rem] text-[0.875rem] font-normal text-orange-500`}
            >
              최소 2글자 이상 입력해주세요.
            </p>
          )}
        </section>

        <section className="flex flex-col gap-[0.5rem]">
          <p className="text-[0.875rem] text-white">설명</p>
          <TextArea
            ref={contentRef}
            type="content"
            value={contentText}
            onChange={(v) => {
              setContentText(v);
              if (contentError && isContentValid) {
                setContentError(false);
              }
            }}
            placeholder="나만의 필름 사진 이야기를 공유해주세요."
            minLength={LIMITS.contentMin}
            maxLength={LIMITS.contentMax}
            isError={contentError}
          />
          {contentError && (
            <p
              className={`px-[0.625rem] text-[0.875rem] font-normal text-orange-500`}
            >
              최소 20글자 이상 입력해주세요.
            </p>
          )}
        </section>

        <hr className="border-neutral-800" />

        {/** 유의사항 표시 */}
        <div className="text-[0.75rem] leading-relaxed text-neutral-200">
          <p className="font-semibold">금지 활동 및 제한 사유</p>
          <p className="mb-4">
            다음과 같은 게시물 작성 시, 사전 통보 없이 삭제되거나 서비스 이용이
            제한될 수 있습니다.
          </p>
          <ul className="flex flex-col gap-y-4">
            <li>
              [콘텐츠 관련 위반] 비(非) 필름 사진 업로드: 디지털 사진, 스마트폰
              촬영 사진 등을 필름 사진인 것처럼 업로드하는 경우
            </li>
            <li>
              저작권 침해: 타인의 사진을 무단으로 도용하거나 출처를 밝히지 않고
              사용하는 경우
            </li>
            <li>
              초상권 침해: 타인의 동의 없이 얼굴이 노출된 사진을 게시하여 피해를
              주는 경우
            </li>
            <li>
              불법/유해 정보: 음란물, 도박, 불법 제품 홍보, 청소년에게 유해한
              내용
            </li>
            <li>
              [커뮤니티 매너 위반] 비방 및 욕설: 특정 인물, 타 회원, 현상소
              운영자에 대한 근거 없는 비방, 욕설, 인신공격
            </li>
            <li>
              허위 사실 유포: 현상소에 대한 악의적인 허위 리뷰 작성으로 영업을
              방해하는 경우
            </li>
            <li>
              도배 및 스팸: 동일한 내용을 반복 게시하거나, 커뮤니티 성격과
              무관한 홍보/광고 글 게시
            </li>
          </ul>
        </div>

        <hr className="border-neutral-800" />

        <CTA_Button
          text="다음"
          size="xlarge"
          color={isTitleValid && isContentValid ? "orange" : "black"}
          onClick={handleNext}
        />
      </div>
    </div>
  );
}

/**
 * CO-022 NewPostPage.tsx
 * Description: 텍스트 입력 페이지
 */
