import { Press } from "@/components/common/motion";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

// 조회 실패 상태 공용 뷰. onRetry가 있으면 재시도 버튼(Press)을 노출
export function ErrorState({
  message = "불러오기에 실패했어요.",
  onRetry,
  retryLabel = "다시 시도",
  className,
}: ErrorStateProps) {
  const wrapper =
    className ??
    (onRetry
      ? "flex min-h-[60vh] items-center justify-center p-6"
      : "pointer-events-none fixed inset-0 flex items-center justify-center");

  return (
    <div className={wrapper}>
      <div className="t-fade-in flex flex-col items-center gap-3 text-center">
        <p className="text-red-400">{message}</p>
        {onRetry ? (
          <Press
            type="button"
            onClick={onRetry}
            className="pointer-events-auto rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-100"
          >
            {retryLabel}
          </Press>
        ) : null}
      </div>
    </div>
  );
}
