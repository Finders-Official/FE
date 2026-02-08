export async function downloadImageFromUrl(
  url: string,
  filename = "finders-restored.png",
) {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error("이미지 다운로드 실패");

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(objectUrl);
}
