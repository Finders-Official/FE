import { useRef, useEffect } from "react";

type TextAreaProps = {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;
  maxLength?: number;
  minLength?: number;

  className?: string;
  textareaClassName?: string;
  disabled?: boolean;
};

export function TextArea({
  value,
  onChange,
  placeholder = "",
  maxLength,
  minLength,
  className = "",
  textareaClassName = "",
  disabled = false,
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const length = value.length;
  const hasTyped = length > 0; // 한 글자라도 입력했는가
  const isOverMax = typeof maxLength === "number" && length > maxLength;

  // 내용에 따라 높이 자동 조절
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto"; // 초기화
    el.style.height = `${el.scrollHeight}px`; // 내용만큼 증가
  }, [value]);

  return (
    <div
      className={`border-neutral-750 flex flex-col gap-[0.625rem] rounded-2xl border bg-neutral-900 p-[1.25rem] ${className}`}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`textarea-scrollbar w-full resize-none overflow-y-auto bg-transparent text-[0.9375rem] text-neutral-200 outline-none placeholder:text-neutral-500 ${textareaClassName} `}
        style={{
          minHeight: "5.5rem",
          maxHeight: "11.4375rem",
        }}
      />

      {/* 우측 하단: 입력 전에는 최소 글자 안내 / 입력 후에는 카운터 */}
      <div className="flex justify-end text-[0.75rem]">
        {!hasTyped && typeof minLength === "number" ? (
          <span className="text-neutral-500">최소 {minLength}자 이상</span>
        ) : typeof maxLength === "number" ? (
          <span className={isOverMax ? "text-orange-500" : "text-neutral-400"}>
            {length}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
}
