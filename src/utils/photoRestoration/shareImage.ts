type ShareOptions = {
  title?: string;
  text?: string;
  filename?: string;
};

export async function shareImageFromUrl(
  url: string,
  options: ShareOptions = {},
) {
  const {
    title = "복원한 사진",
    text = "",
    filename = "finders-restored.png",
  } = options;

  // Web Share 미지원이면 fallback: 링크 복사
  if (!navigator.share) {
    await navigator.clipboard.writeText(url);
    return { method: "clipboard" as const };
  }

  // 가능한 경우 파일로 공유 시도
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const file = new File([blob], filename, { type: blob.type });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title, text });
      return { method: "share-files" as const };
    }
  } catch {
    // 파일 공유 실패하면 아래 url 공유로 fallback
  }

  await navigator.share({ title, text, url });
  return { method: "share-url" as const };
}
