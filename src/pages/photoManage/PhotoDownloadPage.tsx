import { CTA_Button, Header, ImageCard } from "@/components/common";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { PhotoCardPreview } from "@/components/photoManage/PhotoCardPreview";
import { EmptyCheckCircleIcon } from "@/assets/icon";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useInfiniteScanResults } from "@/hooks/photoManage";
import ImageCardSkeleton from "@/components/common/ImageCardSkeleton";

type Step = "GRID" | "DETAIL";

export default function PhotoDownload() {
  const navigate = useNavigate();
  const location = useLocation();
  const developedOrderId = (location.state as { developedOrderId: number })
    ?.developedOrderId;

  useEffect(() => {
    if (!developedOrderId) navigate("/photoManage/main", { replace: true });
  }, [developedOrderId, navigate]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPhotoId, setCurrentPhotoId] = useState<number | null>(null);
  const step: Step = currentPhotoId ? "DETAIL" : "GRID";

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const checked = selectedSet.size > 0;

  const previewRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteScanResults(developedOrderId);

  const results = useMemo(
    () => data?.pages.flatMap((page) => page.data.scanResultList) ?? [],
    [data],
  );

  const onIntersect = () => fetchNextPage();

  useInfiniteScroll({
    target: sentinelRef,
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: onIntersect,
  });

  const photoById = useMemo(() => {
    const m = new Map<number, (typeof results)[number]>();
    results.forEach((p) => m.set(p.scannedPhotoId, p));
    return m;
  }, [results]);

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
    if (selectedIds.length === results.length) {
      setSelectedIds([]); // 모두 선택된 상태면 전체 해제
    } else {
      setSelectedIds(results.map((p) => p.scannedPhotoId)); // 전체 선택
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

  const renderGrid = () => {
    return (
      <div>
        <Header
          title="사진 다운로드"
          showBack
          onBack={() => navigate(-1)}
          rightAction={{
            type: "text",
            text:
              selectedIds.length === results.length ? "전체 해제" : "전체 선택",
            onClick: handleAllSelect,
          }}
        />

        <section className="flex flex-col">
          {/* 제목 */}
          <div className="flex flex-col gap-2 pt-[1.875rem] pb-[0.9375rem] text-left text-white">
            <h1 className="text-[1.25rem] font-semibold">
              다운로드 할 사진을 선택해주세요
            </h1>
            <p className="text-[0.9375rem]">
              사진을 선택하면 크게 볼 수 있어요!
            </p>
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
                    src={photo.signedUrl}
                    showClose={true}
                    alt=""
                    onClose={() => toggle(id)}
                  />
                );
              })}
            </div>
          )}
          {/* 사진 그리드 */}
          <div className="mt-[0.9375rem] grid grid-cols-3 gap-1">
            {results.map((p) => {
              const isSelected = selectedSet.has(p.scannedPhotoId);
              const selectionIndex = isSelected
                ? selectedIndexMap.get(p.scannedPhotoId)
                : undefined;

              if (isLoading) return <ImageCardSkeleton />;
              return (
                <ImageCard
                  key={p.scannedPhotoId}
                  src={p.signedUrl}
                  mode="multi"
                  isSelected={isSelected}
                  selectionIndex={selectionIndex}
                  onToggle={() => toggle(p.scannedPhotoId)}
                  onOpen={() => {
                    setCurrentPhotoId(p.scannedPhotoId);
                  }}
                  className="mx-auto"
                />
              );
            })}
            {/* 센티널 요소 */}
            <div ref={sentinelRef} style={{ height: 1 }} />
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
    );
  };

  const renderDetail = () => {
    return (
      <div className="flex flex-col">
        {/** 헤더 영역 */}
        <div>
          <Header
            title="사진 다운로드"
            showBack
            onBack={() => setCurrentPhotoId(null)}
          />
        </div>

        {/** 선택 영역 */}
        <div className="mb-5 flex h-[3.4375rem] w-full justify-end">
          <button
            type="button"
            onClick={() => {
              if (currentPhotoId !== null) {
                toggle(currentPhotoId);
              }
            }}
          >
            {typeof currentIndex === "number" ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-[1.25rem] font-bold text-white">
                {currentIndex + 1}
              </div>
            ) : (
              <EmptyCheckCircleIcon className="h-10 w-10" />
            )}
          </button>
        </div>

        {/** 확대한 사진 노출 영역 */}
        <div className="mb-10 flex h-[23.6875rem] w-full">
          {(() => {
            const currentPhoto =
              currentPhotoId !== null ? photoById.get(currentPhotoId) : null;
            if (!currentPhoto) return null;
            return (
              <div className="w-full max-w-full">
                <div className="relative mb-8 h-[23.6875rem] w-full overflow-hidden">
                  <img
                    src={currentPhoto.signedUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </div>
              </div>
            );
          })()}
        </div>

        {/** 선택된 사진 그리드 영역 */}
        <div
          className="fixed right-0 bottom-0 left-0 flex h-[5.625rem] w-full min-w-0 gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {/* 왼쪽 스페이서 */}
          <div className="w-[calc(50vw-2.5rem)] shrink-0" />

          {selectedIds.map((id) => {
            const photo = photoById.get(id);
            if (!photo) return null;

            return (
              <div
                key={id}
                ref={(el) => {
                  if (el) previewRefs.current.set(id, el);
                }}
                onClick={() => setCurrentPhotoId(id)}
                className="shrink-0"
              >
                <PhotoCardPreview
                  src={photo.signedUrl}
                  showClose={false}
                  className={id === currentPhotoId ? "scale-110" : ""}
                />
              </div>
            );
          })}

          {/* 오른쪽 스페이서 */}
          <div className="w-[calc(50vw-2.5rem)] shrink-0" />
        </div>
      </div>
    );
  };

  return (
    <main className="mx-auto w-full max-w-6xl overflow-x-hidden pt-6">
      {/* 에러 처리 */}
      {isError && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
          <p className="text-red-400">불러오기에 실패했어요.</p>
        </div>
      )}
      {step === "GRID" ? renderGrid() : renderDetail()}
    </main>
  );
}

/**
 * PM-021 PhotoDownload.tsx
 * Description: 현상관리 사진 다운로드 페이지
 */
