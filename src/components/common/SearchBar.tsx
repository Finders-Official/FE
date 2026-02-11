import { useState, useEffect, type RefObject } from "react";
import { ChevronLeftIcon, XMarkIcon, MagnifyingGlassIcon } from "@/assets/icon";
import Icon from "./Icon";

type RightIconType = "clear" | "search" | "none";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
  debounceMs?: number;
  rightIcon?: RightIconType;
  onSearch?: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
  onFocus?: () => void;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "",
  showBack = false,
  onBack,
  className = "",
  debounceMs = 300,
  rightIcon = "clear",
  onSearch,
  inputRef,
  onFocus,
  onClear,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  // 마지막으로 onChange로 보낸 값 추적 (ref 대신 state로, lint..)
  const [lastEmitted, setLastEmitted] = useState(value);

  // 외부 변경만 동기화
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== lastEmitted) {
      setLocalValue(value);
    }
    setLastEmitted(value);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        setLastEmitted(localValue);
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  const handleClear = () => {
    setLocalValue("");
    setLastEmitted("");
    onChange("");
    onClear?.();
    inputRef?.current?.blur();
  };

  return (
    <div
      className={`flex h-12.5 w-full items-center gap-5 overflow-hidden rounded-[3.125rem] border border-neutral-600 px-[1rem] py-3 ${className}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-6 w-6 items-center justify-center"
            aria-label="뒤로 가기"
          >
            <ChevronLeftIcon className="h-6 w-6 text-neutral-500" />
          </button>
        )}
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={onFocus}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSearch) {
              e.preventDefault();
              e.currentTarget.blur();
              onSearch(localValue);
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[1.0625rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200 placeholder:text-neutral-700 focus:outline-none"
        />
      </div>
      {rightIcon === "clear" && localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="flex h-6 w-6 items-center justify-center"
          aria-label="검색어 지우기"
        >
          <Icon className="text-neutral-500">
            <XMarkIcon />
          </Icon>
        </button>
      )}
      {rightIcon === "search" && onSearch && (
        <button
          type="button"
          onClick={() => onSearch(localValue)}
          className="flex h-6 w-6 items-center justify-center"
          aria-label="검색"
        >
          <Icon className="text-neutral-500">
            <MagnifyingGlassIcon />
          </Icon>
        </button>
      )}
    </div>
  );
}

export type { SearchBarProps, RightIconType };
