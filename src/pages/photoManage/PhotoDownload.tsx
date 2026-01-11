import { CTA_Button, Header, ImageCard } from "@/components/common";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { photoMock } from "@/types/photo";
import { PhotoCardPreview } from "@/components/photoManage/PhotoCardPreview";

export default function PhotoDownload() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const checked = selectedSet.size > 0;

  const photoById = useMemo(() => {
    const m = new Map<number, (typeof photoMock)[number]>();
    photoMock.forEach((p) => m.set(p.id, p));
    return m;
  }, []);

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

  return (
    <main className="mx-auto max-w-6xl overflow-x-hidden py-6">
      <Header
        title="사진 다운로드"
        showBack
        onBack={() => navigate(-1)}
        rightAction={{
          type: "text",
          text:
            selectedIds.length === photoMock.length ? "전체 해제" : "전체 선택",
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
          <div>
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
                    alt=""
                    onClose={() => toggle(id)}
                  />
                );
              })}
            </div>
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
    </main>
  );
}

/**
 * PM-021 PhotoDownload.tsx
 * Description: 현상관리 사진 다운로드 페이지
 */
