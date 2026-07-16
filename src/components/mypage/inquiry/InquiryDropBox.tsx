import { useEffect, useRef } from "react";
import { ChevronLeftIcon } from "@/assets/icon";
import { INQUIRY_OPTIONS, type InquiryOption } from "@/types/mypage/inquiry";
import { Collapse, Press } from "@/components/common";

type InquiryDropBoxProps = {
  value: InquiryOption | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (option: InquiryOption) => void;
  shakeKey?: number;
};

export function InquiryDropBox({
  value,
  isOpen,
  onToggle,
  onSelect,
  shakeKey,
}: InquiryDropBoxProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  // 마운트 시점의 키를 기억해 "값이 바뀐 경우"에만 재생
  const lastShakeKey = useRef(shakeKey);

  useEffect(() => {
    if (shakeKey === undefined || shakeKey === lastShakeKey.current) return;
    lastShakeKey.current = shakeKey;
    const el = rootRef.current;
    if (!el) return;
    el.classList.remove("t-shake");
    void el.offsetWidth;
    el.classList.add("t-shake");
  }, [shakeKey]);

  // 선택된 값이 없으면 기본 텍스트인 '문의 유형' 표시
  const leftText = value ? value.label : "문의 유형";
  const leftTextClass = value
    ? "text-neutral-100 text-[1rem]"
    : "text-neutral-600 text-[1rem]";

  return (
    <div ref={rootRef} className="relative w-full">
      {/* 토글 버튼 */}
      <Press
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="border-neutral-850 flex h-12.75 w-full items-center justify-between gap-2.5 rounded-[0.625rem] border px-4 py-3"
      >
        <p className={leftTextClass}>{leftText}</p>

        <div className="shrink-0">
          <ChevronLeftIcon
            className={`ease-smooth-out h-4 w-4 text-neutral-200 transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none ${
              isOpen ? "rotate-90" : "rotate-270"
            }`}
          />
        </div>
      </Press>

      {/* 드롭다운 메뉴 */}
      <Collapse open={isOpen}>
        <div className="border-neutral-850 mt-2 overflow-hidden rounded-[0.625rem] border">
          <ul>
            {INQUIRY_OPTIONS.map((opt) => {
              const selected = value?.value === opt.value;

              return (
                <li key={opt.value}>
                  <Press
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelect(opt); // 옵션 객체 전체를 부모로 전달
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left ${
                      selected ? "bg-neutral-850" : "bg-neutral-900"
                    }`}
                  >
                    <span className="text-[1rem] text-neutral-100">
                      {opt.label}
                    </span>
                  </Press>
                </li>
              );
            })}
          </ul>
        </div>
      </Collapse>
    </div>
  );
}
