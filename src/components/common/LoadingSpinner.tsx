export function LoadingSpinner() {
  return (
    <div className="flex h-dvh items-center justify-center bg-neutral-900">
      <div
        className="mb-28 h-8 w-8 animate-spin rounded-full border-2 border-neutral-700 border-t-orange-500"
        aria-label="로딩 중"
      />
    </div>
  );
}
