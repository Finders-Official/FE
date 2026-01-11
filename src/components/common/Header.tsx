import type { ReactNode } from "react";
import { ChevronLeftIcon } from "@/assets/icon";

type RightAction =
  | { type: "icon"; icon: ReactNode; onClick: () => void }
  | {
      type: "text";
      text: string;
      onClick: () => void;
      disabled?: boolean;
      loading?: boolean;
    };

interface HeaderProps {
  title: string;
  className?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: RightAction;
}

export default function Header({
  title,
  className = "",
  showBack = false,
  onBack,
  rightAction,
}: HeaderProps) {
  const renderLeft = () => {
    if (!showBack) {
      return <div className="h-6 w-6" />;
    }
    return (
      <button
        type="button"
        onClick={onBack}
        className="flex h-6 w-6 items-center justify-center"
        aria-label="뒤로 가기"
      >
        <ChevronLeftIcon className="h-6 w-6 text-neutral-200" />
      </button>
    );
  };

  const renderRight = () => {
    if (!rightAction) {
      return <div className="h-6 w-6" />;
    }

    if (rightAction.type === "icon") {
      return (
        <button
          type="button"
          onClick={rightAction.onClick}
          className="flex h-6 w-6 items-center justify-center"
        >
          {rightAction.icon}
        </button>
      );
    }

    const isDisabled = rightAction.disabled || rightAction.loading;
    return (
      <button
        type="button"
        onClick={rightAction.onClick}
        disabled={isDisabled}
        className={`text-[0.9375rem] font-normal ${
          isDisabled ? "text-neutral-600" : "text-orange-500"
        }`}
      >
        {rightAction.loading ? "..." : rightAction.text}
      </button>
    );
  };

  return (
    <header className={`flex h-15.25 items-center gap-5 py-4.5 ${className}`}>
      {renderLeft()}
      <h1 className="flex-1 text-center text-base font-semibold tracking-[-0.02em] text-neutral-100">
        {title}
      </h1>
      {renderRight()}
    </header>
  );
}

export type { HeaderProps, RightAction };
