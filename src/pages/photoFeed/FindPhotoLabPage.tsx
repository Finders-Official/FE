import SearchBar from "@/components/common/SearchBar";
import { CTA_Button } from "@/components/common/CTA_Button";
import { Checkbox } from "@/components/common/CheckBox";
import { useRef, useState } from "react";
import { HighlightText } from "@/components/photoFeed/upload/highlightText";
import type { LabSearchResponse } from "@/types/photoFeed/labSearch";
import { useNewPostState } from "@/store/useNewPostState.store";
import { useNavigate } from "react-router";
import { Header } from "@/components/common";
import { useGeolocation } from "@/hooks/common/useGeolocation";
import EmptyView from "@/components/common/EmptyView";
import { useSearchLabs, useCreatePostWithUpload } from "@/hooks/photoFeed";
import { useAuthStore } from "@/store/useAuth.store";
import { useShallow } from "zustand/shallow";

export default function FindPhotoLabPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // 사용자 ID 가져오기
  const memberId = useAuthStore((s) => s.user?.memberId);

  // 게시글 등록 정보 가져오기
  const { labReviewStep, title, content, files, imageMetas, labInfo } =
    useNewPostState(
      useShallow((s) => ({
        labReviewStep: s.labReviewStep,
        title: s.title,
        content: s.content,
        files: s.files,
        imageMetas: s.imageMetas,
        labInfo: s.labInfo,
      })),
    );

  const setLabReviewStep = useNewPostState((s) => s.setLabReviewStep);
  const setIsSelfDeveloped = useNewPostState((s) => s.setIsSelfDeveloped);
  const setLabInfo = useNewPostState((s) => s.setLabInfo);
  const setIsNewPost = useNewPostState((s) => s.setIsNewPost);
  const reset = useNewPostState((s) => s.reset);

  const [keyword, setKeyword] = useState(""); // 검색어
  const [isSelf, setIsSelf] = useState(false); // 자가현상 여부
  const [selectedLab, setSelectedLab] = useState<LabSearchResponse | null>(
    labInfo,
  ); // 선택된 현상소

  // 사용자 위치 정보
  const { latitude, longitude, locationAgreed } = useGeolocation();

  const params = {
    keyword: keyword,
    latitude: locationAgreed ? (latitude ?? undefined) : undefined,
    longitude: locationAgreed ? (longitude ?? undefined) : undefined,
    locationAgreed,
  };

  // 현상소 검색 기록 조회 API
  const { data, isLoading, isError } = useSearchLabs(params);

  // GCS에 사진 등록 + 게시글 등록 API
  const { submit, isPending } = useCreatePostWithUpload({
    onSuccess: (postId) => {
      reset();
      setIsNewPost(true);
      navigate(`/photoFeed/post/${postId}`);
    },
    onError: (err) => console.error("게시글 생성 실패", err),
  });

  // 검색어 지우고 기본 모드로 전환
  const resetSearch = () => {
    setKeyword("");
    setSelectedLab(null);
    setLabReviewStep("default");
  };

  // 현상소 선택
  const handleLabSelect = (lab: LabSearchResponse) => {
    inputRef.current?.blur();
    setLabInfo(lab);
    setSelectedLab(lab);
    setIsSelfDeveloped(false);
    setIsSelf(false);
    setLabReviewStep("confirm");
  };

  const handleSubmit = async () => {
    try {
      await submit({
        title,
        content,
        files,
        imageMetas,
        memberId,
        isSelfDeveloped: isSelf,
      });
    } catch (e) {
      console.error("게시글 업로드 실패", e);
    }
  };

  const handleGoBack = () => {
    if (labReviewStep === "default") return navigate(-1);
    if (labReviewStep === "search") {
      resetSearch();
      return setLabReviewStep("default");
    }
    if (labReviewStep === "confirm") return setLabReviewStep("search");
  };

  /** 기본 화면 렌더링 */
  const renderDefault = () => {
    return (
      <>
        <div className="relative z-20 flex flex-col gap-4">
          <SearchBar
            value={keyword}
            inputRef={inputRef}
            onChange={setKeyword}
            placeholder="이용하신 현상소를 찾아보세요."
            showBack={false}
            debounceMs={0}
            rightIcon="search"
            onFocus={() => {
              setLabReviewStep("search");
            }} // 포커스 되면 검색모드
            onSearch={() => {}}
          />

          {/* 기본모드 */}
          {labReviewStep === "default" && renderDefaultStep()}

          {/* 검색모드 */}
          {labReviewStep === "search" &&
            keyword.length > 0 &&
            renderSearchList()}
        </div>
      </>
    );
  };

  /** 자가 현상 여부 체크 */
  const renderDefaultStep = () => {
    return (
      <>
        <div className="flex items-center gap-2 pr-4 pl-4">
          <Checkbox
            checked={isSelf}
            onChange={setIsSelf}
            onClick={() => {
              setIsSelfDeveloped(true);
            }}
          />
          <p className="text-[0.875rem] text-white">자가 현상했어요.</p>
        </div>
        <div className="fixed right-0 bottom-0 left-0 flex justify-center px-5 py-5">
          <CTA_Button
            text="다음"
            size="xlarge"
            disabled={!isSelf || isPending}
            color={isSelf ? "orange" : "black"}
            onClick={handleSubmit}
          />
        </div>
      </>
    );
  };

  /** 검색 결과 리스트 */
  const renderSearchList = () => {
    if (isLoading) {
      return (
        <ul className="flex flex-col gap-4 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="list-none">
              <div className="flex flex-col gap-2 py-4">
                <div className="h-5 w-52 animate-pulse rounded-md bg-neutral-800/60" />
                <div className="h-4 w-72 animate-pulse rounded-md bg-neutral-800/40" />
              </div>
            </li>
          ))}
        </ul>
      );
    }
    if (isError) {
      return (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
          <p className="text-red-400">불러오기에 실패했어요.</p>
        </div>
      );
    }
    if (!data) {
      return <EmptyView />;
    }
    return (
      <ul className="divide-y divide-neutral-800 px-4">
        {data.map((r) => (
          <li
            key={r.labId}
            className="py-4"
            onPointerDown={(e) => {
              e.preventDefault();
              inputRef.current?.blur();
            }}
            onClick={() => handleLabSelect(r)}
          >
            <p className="font-semibold">
              <HighlightText text={r.name} keyword={keyword} />
            </p>
            <p className="text-sm text-neutral-400">
              {r.address} ({r.distance})
            </p>
          </li>
        ))}
      </ul>
    );
  };

  /** 현상소 선택 후 Confirm 화면  */
  const renderConfirm = () => {
    return (
      <>
        <div className="border-neutral-750 gap-[0.625rem] rounded-2xl border p-[1.25rem]">
          <p className="font-semibold text-white">{selectedLab?.name}</p>
          <p className="text-sm text-neutral-400">
            {selectedLab?.address} ({selectedLab?.distance})
          </p>
        </div>
        {/* 하단 버튼 영역 */}
        <div className="fixed right-0 bottom-0 left-0 flex justify-center gap-3 px-5 py-5">
          <CTA_Button
            text="아니요 달라요"
            size="medium"
            color="black"
            onClick={resetSearch}
          />
          <CTA_Button
            text="네 맞아요"
            size="medium"
            color="orange"
            onClick={() => {
              navigate("/photoFeed/lab/review");
            }}
          />
        </div>
      </>
    );
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[23.4375rem] py-[1rem]">
      <Header title="현상소 입력하기" showBack onBack={handleGoBack} />

      {/* 검색모드일 때: 화면 전체 클릭을 감지하는 투명 오버레이 */}
      {labReviewStep === "search" && (
        <button
          type="button"
          className="fixed inset-0 z-10 cursor-default"
          aria-label="검색 닫기"
          onClick={() => setLabReviewStep("default")}
        />
      )}

      <section className="flex flex-col gap-6 pt-10 pb-10">
        <h1 className="text-left text-[1.375rem] font-semibold text-white">
          {labReviewStep === "confirm"
            ? "이용하신 현상소가 이곳이 맞나요?"
            : "어느 현상소를 이용하셨나요?"}
        </h1>
        {/* 기본 화면 */}
        {!(labReviewStep === "confirm") && renderDefault()}

        {/* 컨펌모드일 때 */}
        {labReviewStep === "confirm" && selectedLab && renderConfirm()}
      </section>
    </div>
  );
}
/**
 * CO-023 FindPhotoLabPage.tsx
 * Description: 현상소 찾기 페이지
 */
