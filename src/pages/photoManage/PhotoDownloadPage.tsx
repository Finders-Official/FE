import { CTA_Button, Header, ImageCard } from "@/components/common";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { photoMock } from "@/types/photo";
import { PhotoCardPreview } from "@/components/photoManage/PhotoCardPreview";
import { EmptyCheckCircleIcon } from "@/assets/icon";

type Step = "GRID" | "DETAIL";

export default function PhotoDownload() {
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPhotoId, setCurrentPhotoId] = useState<number | null>(null);
  const step: Step = currentPhotoId ? "DETAIL" : "GRID";

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const checked = selectedSet.size > 0;

  const previewRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const photoById = useMemo(() => {
    const m = new Map<number, (typeof photoMock)[number]>();
    photoMock.forEach((p) => m.set(p.id, p));
    return m;
  }, []);

  // 확대하는 이미지가 바뀔 때마다 중앙으로 오게
  useEffect(() => {
    if (currentPhotoId === null) return;

    const el = previewRefs.current.get(currentPhotoId);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentPhotoId]);

  const handleAllSelect = () => {
    if (selectedIds.length === photoMock.length) {
      setSelectedIds([]); // 모두 선택된 상태면 전체 해제
    } else {
      setSelectedIds(photoMock.map((p) => p.id)); // 전체 선택
    }
  };

  const toggle = (id: number) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  const selectedIndexMap = useMemo(() => {
    const m = new Map<number, number>();
    selectedIds.forEach((id, idx) => m.set(id, idx));
    return m;
  }, [selectedIds]);

  const currentIndex =
    currentPhotoId !== null ? selectedIndexMap.get(currentPhotoId) : undefined;

  if (step === "DETAIL" && currentPhotoId === null) return null;

  return (
    <main className="mx-auto max-w-6xl overflow-x-hidden py-6">
      {step === "GRID" ? (
        <div>
          <Header
            title="사진 다운로드"
            showBack
            onBack={() => navigate(-1)}
            rightAction={{
              type: "text",
              text:
                selectedIds.length === photoMock.length
                  ? "전체 해제"
                  : "전체 선택",
              onClick: handleAllSelect,
            }}
          />

          <section className="flex flex-col">
            {/* 제목 */}
            <div className="flex flex-col gap-2 pt-[30px] pb-[15px] text-left text-white">
              <h1 className="text-[20px] font-semibold">
                다운로드 할 사진을 선택해주세요
              </h1>
              <p className="text-[15px]">사진을 선택하면 크게 볼 수 있어요!</p>
            </div>
            {/* 선택된 사진 미리보기(가로 스크롤) */}
            {selectedIds.length > 0 && (
              <div
                className="flex w-full max-w-full min-w-0 gap-2 overflow-x-auto pt-2"
                style={{
                  scrollbarWidth: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {selectedIds.map((id) => {
                  const photo = photoById.get(id);
                  if (!photo) return null;

                  return (
                    <PhotoCardPreview
                      key={id}
                      src={photo.src}
                      showClose={true}
                      alt=""
                      onClose={() => toggle(id)}
                    />
                  );
                })}
              </div>
            )}
            {/* 사진 그리드 */}
            <div className="mt-[15px] grid grid-cols-3 gap-1">
              {photoMock.map((p) => {
                const isSelected = selectedSet.has(p.id);
                const selectionIndex = isSelected
                  ? selectedIndexMap.get(p.id)
                  : undefined;

                return (
                  <ImageCard
                    key={p.id}
                    src={p.src}
                    mode="multi"
                    isSelected={isSelected}
                    selectionIndex={selectionIndex}
                    onToggle={() => toggle(p.id)}
                    onOpen={() => {
                      setCurrentPhotoId(p.id);
                    }}
                    className="mx-auto"
                  />
                );
              })}
            </div>
            {/** 다음 버튼 */}
            <div className="py-5">
              <CTA_Button
                text="다운로드"
                size="xlarge"
                disabled={!checked}
                link="" // TODO: 수정 예정
                color={checked ? "orange" : "black"}
                onClick={() => {}}
              />
            </div>
          </section>
        </div>
      ) : (
        <div>
          <Header
            title="사진 다운로드"
            showBack
            onBack={() => setCurrentPhotoId(null)}
          />
          <section className="flex flex-col">
            {/** 이미지 선택 */}
            <div className="flex justify-end py-5">
              <button
                type="button"
                onClick={() => {
                  if (currentPhotoId !== null) {
                    toggle(currentPhotoId);
                  }
                }}
              >
                {typeof currentIndex === "number" ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-[20px] font-bold text-white">
                    {currentIndex + 1}
                  </div>
                ) : (
                  <EmptyCheckCircleIcon className="h-10 w-10" />
                )}
              </button>
            </div>

            {/* 선택된 사진 크게 보기 */}
            {currentPhotoId !== null && photoById.get(currentPhotoId) && (
              <div className="w-full max-w-full">
                <div className="relative mb-8 h-[379px] w-full overflow-hidden">
                  <img
                    src={photoById.get(currentPhotoId)!.src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* 선택된 사진 리스트(가로 스크롤) */}
            {selectedIds.length > 0 && (
              <div
                className="flex w-full max-w-full min-w-0 gap-2 overflow-x-auto px-[50vw] py-5 pt-2"
                style={{
                  scrollbarWidth: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {selectedIds.map((id) => {
                  const photo = photoById.get(id);
                  if (!photo) return null;

                  return (
                    <div
                      key={id}
                      ref={(el) => {
                        if (el) previewRefs.current.set(id, el);
                      }}
                      onClick={() => setCurrentPhotoId(id)} // 클릭 시 해당 사진으로 이동
                    >
                      <PhotoCardPreview
                        src={photo.src}
                        showClose={false}
                        className={id === currentPhotoId ? "scale-110" : ""}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

/**
 * PM-021 PhotoDownload.tsx
 * Description: 현상관리 사진 다운로드 페이지
 */
