import React from "react";

// 개별 토스트 메시지 컴포넌트
interface ToastItemProps {
  message: string;
  iconPath?: string;
}

export const ToastItem = ({ message, iconPath }: ToastItemProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 bg-neutral-875/70 flex min-h-[3.75rem] w-[20.3125rem] items-center gap-[1rem] rounded-[1.125rem] border border-neutral-800 px-[1.25rem] py-[1rem] shadow-lg duration-300">
      {/* 아이콘 영역 */}
      {iconPath && (
        <div className="flex h-[1.5rem] w-[1.5rem] flex-shrink-0 items-center justify-center">
          <img
            src={iconPath}
            alt="icon"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      {/* 텍스트 영역 */}
      <span className="text-[0.938rem] leading-[155%] font-semibold tracking-[-0.02em] whitespace-pre-wrap text-neutral-200">
        {message}
      </span>
    </div>
  );
};

// 토스트 컨테이너
interface ToastListProps {
  children: React.ReactNode;
}

export const ToastList = ({ children }: ToastListProps) => {
  return (
    <div className="fixed bottom-[2rem] left-1/2 z-[9999] flex -translate-x-1/2 flex-col gap-[0.75rem]">
      {children}
    </div>
  );
};
