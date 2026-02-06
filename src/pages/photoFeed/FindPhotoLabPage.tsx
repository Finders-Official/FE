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

type Step = "search" | "confirm";

export default function FindPhotoLabPage() {
  const [step, setStep] = useState<Step>("search");

  const [keyword, setKeyword] = useState("");
  const [searching, setSearching] = useState(false);
  const [checked, setChecked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 사용자 ID 가져오기
  const memberId = useAuthStore((s) => s.user?.memberId);

  // 이전 페이지에서 작성한 데이터 가져오기
  const title = useNewPostState((s) => s.title);
  const content = useNewPostState((s) => s.content);

  const files = useNewPostState((s) => s.files);
  const imageMetas = useNewPostState((s) => s.imageMetas);

  // 자가현상 여부 및 현상소 정보 저장
  const setIsSelfDeveloped = useNewPostState((s) => s.setIsSelfDeveloped);
  const setLabInfo = useNewPostState((s) => s.setLabInfo);

  // 게시글 등록한 직후인지에 대한 정보 저장
  const setIsNewPost = useNewPostState((s) => s.setIsNewPost);

  // store 전체 reset
  const reset = useNewPostState((s) => s.reset);

  // 선택된 현상소
  const [selectedLab, setSelectedLab] = useState<LabSearchResponse | null>(
    null,
  );

  const navigate = useNavigate();

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

  // 검색 화면 초기화
  const handleResetSearch = () => {
    setStep("search");
    setSearching(false);
    setKeyword("");
    setSelectedLab(null);
  };

  // 현상소 선택
  const handleLabSelect = (lab: LabSearchResponse) => {
    inputRef.current?.blur();
    setLabInfo(lab.labId, lab.name);
    setSelectedLab(lab);
    setSearching(false);
    setIsSelfDeveloped(false);
    setStep("confirm");
  };

  // GCS에 사진 등록 + 게시글 등록 API
  const { submit, isPending } = useCreatePostWithUpload({
    onSuccess: (postId) => {
      reset();
      setIsNewPost(true);
      navigate(`/photoFeed/post/${postId}`);
    },
    onError: (err) => console.error("게시글 생성 실패", err),
  });

  const handleSubmit = async () => {
    try {
      await submit({
        title,
        content,
        files,
        imageMetas,
        memberId,
        isSelfDeveloped: true,
      });
    } catch (e) {
      console.error("게시글 업로드 실패", e);
    }
  };

  /** 현상소 선택 후 Confirm 화면  */
  if (step === "confirm" && selectedLab) {
    return (
      <div className="mx-auto min-h-dvh w-full max-w-[23.4375rem] py-[1rem]">
        <Header title="현상소 입력하기" showBack onBack={() => navigate(-1)} />
        {/* 상단 영역 */}
        <div className="flex flex-col gap-6 pt-10 pb-10">
          <h1 className="text-left text-[1.375rem] font-semibold text-white">
            이용하신 현상소가 이곳이 맞나요?
          </h1>
          <div className="border-neutral-750 gap-[0.625rem] rounded-2xl border p-[1.25rem]">
            <p className="font-semibold text-white">{selectedLab.name}</p>
            <p className="text-sm text-neutral-400">
              {selectedLab.address} ({selectedLab.distance})
            </p>
          </div>
        </div>
        {/* 하단 버튼 영역 */}
        <div className="fixed right-0 bottom-0 left-0 flex justify-center gap-3 px-5 py-5">
          <CTA_Button
            text="아니요 달라요"
            size="medium"
            color="black"
            onClick={handleResetSearch}
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
      </div>
    );
  }

  /** 검색모드일 때: 결과 리스트 출력 */
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

  /** 검색 화면(Search) 렌더링 */
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[23.4375rem] py-[1rem]">
      <Header title="현상소 입력하기" showBack onBack={() => navigate(-1)} />
      {/* 검색모드일 때: 화면 전체 클릭을 감지하는 투명 오버레이 */}
      {searching && (
        <button
          type="button"
          className="fixed inset-0 z-10 cursor-default"
          aria-label="검색 닫기"
          onClick={() => setSearching(false)}
        />
      )}

      <section className="flex flex-col gap-6 pt-10 pb-10">
        <h1 className="text-left text-[1.375rem] font-semibold text-white">
          어느 현상소를 이용하셨나요?
        </h1>
        <div className="relative z-20 flex flex-col gap-4">
          <SearchBar
            value={keyword}
            inputRef={inputRef}
            onChange={setKeyword}
            placeholder="이용하신 현상소를 찾아보세요."
            showBack={false}
            debounceMs={0}
            rightIcon="search"
            onFocus={() => setSearching(true)} // 포커스 되면 검색모드
            onSearch={() => {}}
          />

          {/* 검색모드일 때: 결과 리스트 출력 */}
          {searching && keyword.length > 0 && renderSearchList()}

          {/* 기본모드일 때: 체크박스 + 다음 버튼 */}
          {!searching && (
            <>
              <div className="flex items-center gap-2 pr-4 pl-4">
                <Checkbox
                  checked={checked}
                  onChange={setChecked}
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
                  disabled={!checked || isPending}
                  color={checked ? "orange" : "black"}
                  onClick={handleSubmit} // 자가현상 게시글 등록 API 호출 후 링크
                />
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
/**
 * CO-023 FindPhotoLabPage.tsx
 * Description: 현상소 찾기 페이지
 */
