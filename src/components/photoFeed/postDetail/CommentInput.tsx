import type { RefObject } from "react";
import { PaperAirplaneFillIcon } from "@/assets/icon";
import Icon from "@/components/common/Icon";
import { Press } from "@/components/common/motion";

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  disabled?: boolean;
}

export default function CommentInput({
  value,
  onChange,
  onSubmit,
  placeholder = "",
  inputRef,
  disabled = false,
}: CommentInputProps) {
  const canSubmit = value.trim().length > 0 && !disabled;

  // 시트 flex column의 하단 footer — 시트와 함께 슬라이드/드래그
  return (
    <div className="bg-neutral-875 shrink-0 px-4 pt-3 pb-7">
      <div className="bg-neutral-875 flex items-center rounded-[3.125rem] border border-neutral-600 px-4 py-3">
        <input
          type="text"
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-[1.0625rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200 placeholder:text-neutral-700 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit) onSubmit();
          }}
        />

        <Press
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="댓글 전송"
          className="flex h-6 w-6 items-center justify-center disabled:opacity-40"
        >
          <Icon>
            <PaperAirplaneFillIcon />
          </Icon>
        </Press>
      </div>
    </div>
  );
}
