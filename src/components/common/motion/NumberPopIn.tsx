import { useEffect, useState } from "react";

interface NumberPopInProps {
  value: number | string;
  className?: string;
}

export function NumberPopIn({ value, className = "" }: NumberPopInProps) {
  const text = String(value);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(false);
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimating(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [text]);

  return (
    <span
      className={`t-digit-group${animating ? "is-animating" : ""} ${className}`.trim()}
    >
      {text.split("").map((ch, i) => (
        <span key={i} className="t-digit" data-stagger={i > 0 ? i : undefined}>
          {ch}
        </span>
      ))}
    </span>
  );
}
