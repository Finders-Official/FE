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
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return { method: "clipboard" as const };
    }
    throw new Error("공유하기를 지원하지 않는 환경입니다.");
  }

  // 이미지를 파일로 첨부해야 iOS 공유 시트에 "이미지 저장"이 노출됨.
  // blob.type이 비어있으면(서버 content-type 누락/CORS) "파일에 저장"만 뜨므로
  // image mime을 보장하고 확장자도 맞춘다.
  let file: File | null = null;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const type =
      blob.type && blob.type.startsWith("image/") ? blob.type : "image/png";
    const ext = type === "image/jpeg" ? "jpg" : type.slice("image/".length);
    const base = filename.replace(/\.[a-z0-9]+$/i, "");
    file = new File([blob], `${base}.${ext}`, { type });
  } catch {
    file = null;
  }

  try {
    // files 공유 시 text를 넣으면 "여러 항목 공유"가 되어 "이미지 저장"이
    // 사라질 수 있으므로 files와 title만 전달한다.
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title });
      return { method: "share-files" as const };
    }
    await navigator.share({ title, text, url });
    return { method: "share-url" as const };
  } catch (e) {
    // 사용자가 공유 시트를 닫으면 AbortError로 reject됨 -> 에러 아님
    if (e instanceof DOMException && e.name === "AbortError") {
      return { method: "cancelled" as const };
    }
    throw e;
  }
}
