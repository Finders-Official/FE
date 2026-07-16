import type { ReactNode } from "react";
import { ChevronLeftIcon } from "@/assets/icon";
import { Press } from "@/components/common/motion";

type LeftAction =
  | { type: "icon"; icon: ReactNode; onClick: () => void }
  | {
      type: "text";
      text: string;
      onClick: () => void;
      disabled?: boolean;
      loading?: boolean;
    };

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
  leftAction?: LeftAction;
  rightAction?: RightAction;
}

export default function Header({
  title,
  className = "",
  showBack = false,
  onBack,
  leftAction,
  rightAction,
}: HeaderProps) {
  const renderLeft = () => {
    if (!showBack) {
      if (leftAction) {
        if (leftAction.type === "icon") {
          return (
            <Press
              type="button"
              onClick={leftAction.onClick}
              className="flex h-6 w-6 items-center justify-center"
            >
              {leftAction.icon}
            </Press>
          );
        }

        const isDisabled = leftAction.disabled || leftAction.loading;
        return (
          <Press
            type="button"
            onClick={leftAction.onClick}
            disabled={isDisabled}
            className={`text-[0.9375rem] font-normal ${
              isDisabled ? "text-neutral-600" : "text-orange-500"
            }`}
          >
            {leftAction.loading ? "..." : leftAction.text}
          </Press>
        );
      }
      return <div className="h-6 w-6" />;
    }
    return (
      <Press
        type="button"
        onClick={onBack}
        className="flex h-6 w-6 items-center justify-center"
        aria-label="뒤로 가기"
      >
        <ChevronLeftIcon className="h-6 w-6 text-neutral-200" />
      </Press>
    );
  };

  const renderRight = () => {
    if (!rightAction) {
      return <div className="h-6 w-6" />;
    }

    if (rightAction.type === "icon") {
      return (
        <Press
          type="button"
          onClick={rightAction.onClick}
          className="flex h-6 w-6 items-center justify-center"
        >
          {rightAction.icon}
        </Press>
      );
    }

    const isDisabled = rightAction.disabled || rightAction.loading;
    return (
      <Press
        type="button"
        onClick={rightAction.onClick}
        disabled={isDisabled}
        className={`text-[0.9375rem] font-normal ${
          isDisabled ? "text-neutral-600" : "text-orange-500"
        }`}
      >
        {rightAction.loading ? "..." : rightAction.text}
      </Press>
    );
  };

  return (
    <header
      className={`relative flex h-15.25 items-center justify-between py-4.5 ${className}`}
    >
      {renderLeft()}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold tracking-[-0.02em] text-neutral-100">
        {title}
      </h1>
      {renderRight()}
    </header>
  );
}

export type { HeaderProps, RightAction };
