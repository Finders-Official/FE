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
  const leftText = value ? value.label : category.title;
  const leftTextClass = value ? "text-neutral-100" : "text-neutral-600";
  const rightText = value ? value.priceText : category.placeholder;

  return (
    <button
      type="button"
      onClick={() => onToggle(category.key)}
      aria-expanded={isOpen}
      className="w-full"
    >
      <div className="border-neutral-850 flex h-12.75 w-full items-center justify-between gap-2.5 rounded-[0.625rem] border px-4 py-3">
        <div className="flex flex-1 justify-between">
          <p className={leftTextClass}>{leftText}</p>
          <p className="text-neutral-400">{rightText}</p>
        </div>

        <div className="shrink-0">
          <ChevronLeftIcon
            className={`h-4 w-4 text-neutral-200 transition-transform ${
              isOpen ? "rotate-90" : "rotate-270"
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="border-neutral-850 mt-2 overflow-hidden rounded-[0.625rem] border">
          <ul>
            {category.options.map((opt) => {
              const selected = value?.value === opt.value;

              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); //핵심: 바깥 토글 버튼 클릭 막기
                      onSelect(category.key, opt); //부모에서 setOpenKey(null)로 닫힘
                    }}
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
    </button>
  );
}
