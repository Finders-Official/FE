import React from "react";

// 개별 토스트 메시지 컴포넌트
interface ToastItemProps {
  message: string;
  icon?: React.ReactNode;
}

export const ToastItem = ({ message, icon }: ToastItemProps) => {
  return (
    <div className="animate-toast-in relative min-h-[3.75rem] w-[20.3125rem]">
      {/* blur 배경 레이어 - opacity 항상 1 */}
      <div className="bg-neutral-875/70 absolute inset-0 rounded-[1.125rem] border border-neutral-800 shadow-lg backdrop-blur-3xl" />

      {/* content 레이어 - fade in */}
      <div className="animate-toast-content relative flex items-center gap-[1rem] px-[1.25rem] py-[1rem]">
        {/* 아이콘 영역 */}
        {icon && (
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-neutral-400">
            {icon}
          </div>
        )}

        {/* 텍스트 영역 */}
        <span className="text-[0.938rem] leading-[155%] font-semibold tracking-[-0.02em] whitespace-pre-wrap text-neutral-200">
          {message}
        </span>
      </div>
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
