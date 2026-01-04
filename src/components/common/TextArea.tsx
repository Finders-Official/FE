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
  const length = value.length;
  const hasTyped = length > 0; // 한 글자라도 입력했는가
  const isOverMax = typeof maxLength === "number" && length > maxLength;

  return (
    <div
      className={`mx-auto flex h-[150px] w-[343px] flex-col gap-[10px] rounded-2xl bg-[#222222] p-[20px] ${className} `}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`textarea-scrollbar w-full flex-1 resize-none overflow-y-auto bg-transparent text-[15px] text-[#D6D6D6] outline-none placeholder:text-[#707070] ${textareaClassName} `}
      />

      {/* 우측 하단: 입력 전에는 최소 글자 안내 / 입력 후에는 카운터 */}
      <div className="flex justify-end text-[12px]">
        {!hasTyped && typeof minLength === "number" ? (
          <span className="text-[#707070]">최소 {minLength}자 이상</span>
        ) : typeof maxLength === "number" ? (
          <span className={isOverMax ? "text-[#E94E16]" : "text-[#A3A3A3]"}>
            {length}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
}
