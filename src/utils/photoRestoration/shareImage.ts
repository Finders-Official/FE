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

  // Web Share 및 Clipboard API는 보안 컨텍스트(HTTPS)에서만 작동함
  if (!window.isSecureContext) {
    throw new Error("공유 기능은 보안 연결(HTTPS) 환경에서만 사용 가능합니다.");
  }

  // Web Share 미지원이면 fallback: 링크 복사
  if (!navigator.share) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return { method: "clipboard" as const };
    }
    throw new Error("공유하기를 지원하지 않는 환경입니다.");
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
