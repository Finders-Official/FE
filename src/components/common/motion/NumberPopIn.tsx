import { useState } from "react";

interface NumberPopInProps {
  value: number | string;
  className?: string;
}

export function NumberPopIn({ value, className = "" }: NumberPopInProps) {
  const text = String(value);
  const [prevText, setPrevText] = useState(text);
  const [animKey, setAnimKey] = useState(0);

  if (prevText !== text) {
    setPrevText(text);
    setAnimKey((k) => k + 1);
  }

  const animate = animKey > 0;
  const groupClassName = ["t-digit-group", animate && "is-animating", className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={groupClassName}>
      {text.split("").map((ch, i) => (
        <span
          key={`${animKey}-${i}`}
          className="t-digit"
          data-stagger={i > 0 ? Math.min(i, 2) : undefined}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
