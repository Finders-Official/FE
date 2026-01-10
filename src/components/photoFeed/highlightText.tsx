export function HighlightText({
  text,
  keyword,
}: {
  text: string;
  keyword: string;
}) {
  const key = keyword.trim();
  if (!key) return <span className="text-white">{text}</span>;

  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === key.toLowerCase() ? (
          <span key={i} className="text-orange-500">
            {part}
          </span>
        ) : (
          <span key={i} className="text-white">
            {part}
          </span>
        ),
      )}
    </>
  );
}
