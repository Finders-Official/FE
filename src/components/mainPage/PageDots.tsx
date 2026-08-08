interface PageDotsProps {
  count: number;
  activeIndex: number;
  className?: string;
}

export function PageDots({
  count,
  activeIndex,
  className = "",
}: PageDotsProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`ease-smooth-out h-1 w-1 rounded-full transition-colors duration-[var(--duration-quick)] ${
            i === activeIndex ? "bg-orange-500" : "bg-neutral-400"
          }`}
        />
      ))}
    </div>
  );
}
