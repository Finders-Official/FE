// src/components/common/DropBox.tsx
import { ChevronLeftIcon } from "@/assets/icon";
import type {
  DropDownCategory,
  DropDownOption,
} from "@/types/photomanage/category";

type DropBoxProps = {
  category: DropDownCategory;
  value: DropDownOption | null;
  isOpen: boolean;
  onToggle: (key: DropDownCategory["key"]) => void;
  onSelect: (key: DropDownCategory["key"], option: DropDownOption) => void;
};

export function DropBox({
  category,
  value,
  isOpen,
  onToggle,
  onSelect,
}: DropBoxProps) {
  //선택되면: 왼쪽(흰색)은 옵션 label
  //미선택이면: 왼쪽(흰색)은 카테고리 title
  const leftText = value ? value.label : category.title;

  const leftTextClass = value ? "text-neutral-100" : "text-neutral-400";

  // 선택되면: 오른쪽(회색)은 가격/배수(priceText)
  // 미선택이면: placeholder
  const rightText = value ? value.priceText : category.placeholder;

  return (
    <div className="w-full">
      {/* 상단 박스(첫번째 스크린샷) */}
      <div className="border-neutral-850 flex h-12.75 w-full items-center justify-between gap-2.5 rounded-[0.625rem] border px-4 py-3">
        <div className="flex flex-1 justify-between">
          <p className={`${leftTextClass}`}>{leftText}</p>
          <p className="text-neutral-400">{rightText}</p>
        </div>

        <button
          type="button"
          onClick={() => onToggle(category.key)}
          aria-expanded={isOpen}
          className="shrink-0"
        >
          <ChevronLeftIcon
            className={`h-4 w-4 text-neutral-200 transition-transform ${
              isOpen ? "rotate-90" : "rotate-270"
            }`}
          />
        </button>
      </div>

      {/* 펼쳐졌을 때 옵션 리스트 */}
      {isOpen && (
        <div className="border-neutral-850 mt-2 overflow-hidden rounded-[0.625rem] border">
          <ul>
            {category.options.map((opt) => {
              const selected = value?.value === opt.value;

              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => onSelect(category.key, opt)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left ${
                      selected ? "bg-neutral-850" : "bg-neutral-900"
                    }`}
                  >
                    <span className="text-neutral-100">{opt.label}</span>
                    <span className="text-neutral-400">{opt.priceText}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
