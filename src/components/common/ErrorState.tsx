import { Press } from "@/components/common/motion";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

// 조회 실패 상태 공용 뷰. onRetry가 있으면 재시도 버튼(Press)을 노출. 등장은 t-fade-in.
export function ErrorState({
  message = "불러오기에 실패했어요.",
  onRetry,
  retryLabel = "다시 시도",
  className,
}: ErrorStateProps) {
  if (onRetry) {
    return (
      <div
        className={`t-fade-in p-6 text-neutral-100${className ? ` ${className}` : ""}`}
      >
        <p className="text-red-400">{message}</p>
        <Press
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md border border-neutral-700 px-3 py-2 text-sm"
        >
          {retryLabel}
        </Press>
      </div>
    );
  }

  return (
    <div
      className={
        className ??
        "pointer-events-none fixed inset-0 flex items-center justify-center"
      }
    >
      <p className="t-fade-in text-red-400">{message}</p>
    </div>
  );
}
