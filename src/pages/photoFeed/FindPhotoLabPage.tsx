import SearchBar from "@/components/common/SearchBar";
import { CTA_Button } from "@/components/common/CTA_Button";
import { Checkbox } from "@/components/common/CheckBox";
import { useMemo, useRef, useState } from "react";
import { HighlightText } from "@/components/photoFeed/highlightText";
import type { PhotoLab } from "@/types/photoLab";
import { results } from "@/types/photoLab";
import { useNewPostState } from "@/store/useNewPostState.store";
import { useNavigate } from "react-router";
import { Header } from "@/components/common";

type Step = "search" | "confirm";

export default function FindPhotoLabPage() {
  const [step, setStep] = useState<Step>("search");

  const [text, setText] = useState("");
  const [searching, setSearching] = useState(false);
  const [checked, setChecked] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedLab, setSelectedLab] = useState<PhotoLab | null>(null);

  const setIsSelfDeveloped = useNewPostState((s) => s.setIsSelfDeveloped);
  const setLabInfo = useNewPostState((s) => s.setLabInfo);

  const navigate = useNavigate();

  const filteredResults = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return [];
    return results.filter((r) => r.name.toLowerCase().includes(q));
  }, [text]);

  const handleResetSearch = () => {
    setStep("search");
    setSearching(false);
    setText("");
    setSelectedLab(null);
  };

  const handleLabSelect = (lab: PhotoLab) => {
    inputRef.current?.blur();
    setLabInfo(lab.id, lab.name);
    setSelectedLab(lab);
    setSearching(false);
    setStep("confirm");
  };

  /** 확인 화면(Confirm) 렌더링  */
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
              {selectedLab.addr} ({selectedLab.dist})
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
            value={text}
            inputRef={inputRef}
            onChange={setText}
            placeholder="이용하신 현상소를 찾아보세요."
            showBack={false}
            debounceMs={0}
            rightIcon="search"
            onFocus={() => setSearching(true)} // 포커스 되면 검색모드
            onSearch={() => {
              /* TODO: 실제 검색 실행 */
            }}
          />

          {/* 검색모드일 때: 결과 리스트 출력 */}
          {searching && (
            <>
              {text.length > 0 && (
                <ul className="divide-y divide-neutral-800 px-4">
                  {filteredResults.map((r) => (
                    <li
                      key={r.id}
                      className="py-4"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        inputRef.current?.blur();
                      }}
                      onClick={() => handleLabSelect(r)}
                    >
                      <p className="font-semibold">
                        <HighlightText text={r.name} keyword={text} />
                      </p>
                      <p className="text-sm text-neutral-400">
                        {r.addr} ({r.dist})
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* 기본모드일 때: 체크박스 + 다음 버튼 */}
          {!searching && (
            <>
              <div className="flex items-center gap-2 pr-4 pl-4">
                <Checkbox
                  checked={checked}
                  onChange={setChecked}
                  onClick={() => {
                    setIsSelfDeveloped(true);
                    // TODO: 현상소 관련 로직 없이 바로 post 요청
                  }}
                />
                <p className="text-[0.875rem] text-white">자가 현상했어요.</p>
              </div>
              <div className="fixed right-0 bottom-0 left-0 flex justify-center px-5 py-5">
                <CTA_Button
                  text="다음"
                  size="xlarge"
                  disabled={!checked}
                  link="/photoFeed/post/1" // TODO: 수정 예정
                  color={checked ? "orange" : "black"}
                  onClick={() => {}}
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
