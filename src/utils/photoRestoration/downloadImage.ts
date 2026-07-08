import { Capacitor } from "@capacitor/core";
import { Media } from "@capacitor-community/media";

const ALBUM_NAME = "Finders";

// Android는 savePhoto에 albumIdentifier가 필수라서 앨범을 찾거나 만들어서 반환.
// iOS는 identifier 없이 저장하면 카메라 롤로 들어가므로 undefined 반환.
async function getAlbumIdentifier(): Promise<string | undefined> {
  if (Capacitor.getPlatform() !== "android") return undefined;

  const findAlbum = async () => {
    const { albums } = await Media.getAlbums();
    return albums.find((a) => a.name === ALBUM_NAME);
  };

  let album = await findAlbum();
  if (!album) {
    await Media.createAlbum({ name: ALBUM_NAME });
    album = await findAlbum();
  }

  if (!album) throw new Error("갤러리 앨범을 생성하지 못했습니다.");
  return album.identifier;
}

// 네이티브: Media 플러그인이 URL을 직접 받아 네이티브에서 다운로드 후 갤러리에 저장
async function saveToGallery(url: string, filename: string) {
  const albumIdentifier = await getAlbumIdentifier();

  await Media.savePhoto({
    path: url,
    albumIdentifier,
    // fileName은 확장자 제외 (Android 전용 옵션)
    fileName: filename.replace(/\.[a-z0-9]+$/i, ""),
  });
}

// 웹: 기존 anchor 다운로드 방식 유지
async function downloadViaAnchor(url: string, filename: string) {
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

  // iOS Safari 대응: 즉시 revoke할 경우 다운로드 프로세스가 취소되거나
  // 미리보기 이미지 로드와 간섭이 생길 수 있으므로 지연 해제
  requestAnimationFrame(() => {
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  });
}

export async function downloadImageFromUrl(
  url: string,
  filename = "finders-restored.png",
) {
  if (Capacitor.isNativePlatform()) {
    await saveToGallery(url, filename);
    return;
  }
  await downloadViaAnchor(url, filename);
}
