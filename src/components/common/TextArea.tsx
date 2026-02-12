import { useRef, useEffect, forwardRef } from "react";

type TextAreaType = "title" | "content";

const HEIGHT_BY_TYPE: Record<TextAreaType, { min: string; max: string }> = {
  title: {
    min: "2.25rem",
    max: "5.5rem",
  },
  content: {
    min: "5.5rem",
    max: "11.4375rem",
  },
};

type TextAreaProps = {
  type?: TextAreaType;
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  /** 입력 전 힌트: "min" = 최소 N자 이상 (기본), "max" = 최대 N자 이내 */
  emptyHint?: "min" | "max";

  className?: string;
  textareaClassName?: string;
  disabled?: boolean;

  isError?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      type,
      value,
      onChange,
      placeholder = "",
      maxLength,
      minLength,
      emptyHint = "min",
      className = "",
      textareaClassName = "",
      disabled = false,
      isError = false,
    },
    forwardedRef,
  ) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    // forwardedRef + innerRef 같이 연결
    const setRefs = (el: HTMLTextAreaElement | null) => {
      innerRef.current = el;
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") forwardedRef(el);
      else forwardedRef.current = el;
    };

    const length = value.length;
    const hasTyped = length > 0; // 한 글자라도 입력했는가
    const isOverMax = typeof maxLength === "number" && length > maxLength;

    const heightStyle =
      type && HEIGHT_BY_TYPE[type]
        ? {
            minHeight: HEIGHT_BY_TYPE[type].min,
            maxHeight: HEIGHT_BY_TYPE[type].max,
          }
        : {
            minHeight: "5.5rem",
            maxHeight: "11.4375rem",
          };

    // 내용에 따라 높이 자동 조절
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      el.style.height = "auto"; // 초기화
      el.style.height = `${el.scrollHeight}px`; // 내용만큼 증가
    }, [value]);

    return (
      <div
        className={[
          "flex flex-col gap-[0.625rem] rounded-2xl border bg-neutral-900 p-[1.25rem]",
          isError ? "border-red-500" : "border-neutral-750",
          className,
        ].join(" ")}
      >
        <textarea
          ref={setRefs}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`textarea-scrollbar placeholder:text-neutral-750 w-full resize-none overflow-y-auto bg-transparent text-[1rem] text-neutral-200 outline-none ${textareaClassName} `}
          style={heightStyle}
        />

        {/* 우측 하단: 입력 전에는 안내 / 입력 후에는 카운터 */}
        <div className="flex justify-end text-[0.75rem]">
          {!hasTyped && emptyHint === "max" && typeof maxLength === "number" ? (
            <span className="text-neutral-500">최대 {maxLength}자 이내</span>
          ) : !hasTyped &&
            emptyHint === "min" &&
            typeof minLength === "number" ? (
            <span className="text-neutral-500">최소 {minLength}자 이상</span>
          ) : typeof maxLength === "number" ? (
            <span
              className={isOverMax ? "text-orange-500" : "text-neutral-400"}
            >
              {length}/{maxLength}
            </span>
          ) : null}
        </div>
      </div>
    );
  },
);
