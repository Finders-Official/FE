import type { RefObject } from "react";
import { createPortal } from "react-dom";
import { PaperAirplaneFillIcon } from "@/assets/icon";
import { Icon } from "../common";

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

  // 하단 고정 UI
  const ui = (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[200] px-4 pb-[env(safe-area-inset-bottom)]">
      <div className="bg-neutral-875 pointer-events-auto flex items-center rounded-[3.125rem] border border-neutral-600 px-4 py-3">
        <input
          type="text"
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-[1.0625rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200 placeholder:text-neutral-700 focus:ring-2 focus:ring-orange-500"
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit) onSubmit();
          }}
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="댓글 전송"
          className="flex h-6 w-6 items-center justify-center disabled:opacity-40"
        >
          <Icon>
            <PaperAirplaneFillIcon />
          </Icon>
        </button>
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}
