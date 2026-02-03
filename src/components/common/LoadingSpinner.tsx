type LoadingProps = {
  open: boolean;
};

export function LoadingSpinner({ open }: LoadingProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="alert"
      aria-live="polite"
      aria-busy="true"
      aria-label="로딩중"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      <div className="relative flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-700 border-t-orange-500" />
      </div>
    </div>
  );
}
