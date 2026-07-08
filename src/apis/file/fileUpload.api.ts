// src/apis/file/uploadToPresignedUrl.api.ts
import type { UploadToPresignedUrlArgs } from "@/types/file/presignedUrl";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { FileTransfer } from "@capacitor/file-transfer";

const UPLOAD_TIMEOUT_MS = 60_000;

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("파일을 base64로 변환하지 못했습니다."));
        return;
      }
      resolve(result.slice(result.indexOf(",") + 1));
    };

    reader.onerror = () => {
      const domError = reader.error;
      reject(
        new Error(
          `파일 읽기 실패: ${domError?.name ?? "unknown"} ${domError?.message ?? ""}`.trim(),
        ),
      );
    };

    reader.readAsDataURL(blob);
  });
}

/**
 * 네이티브 앱에서는 GCS presigned URL PUT을 CapacitorHttp/브라우저 fetch가 아니라
 * 네이티브 HTTP 클라이언트(@capacitor/file-transfer)로 직접 업로드한다.
 * 브라우저 CORS 검사를 받지 않고, JS<->네이티브 브리지로 파일 바이트를 실어 나르지
 * 않으므로 대용량/다중 이미지 동시 업로드 시 브리지 부하로 실패하던 문제도 사라진다.
 */
async function uploadViaNativeFileTransfer({
  url,
  file,
  contentType,
}: UploadToPresignedUrlArgs): Promise<void> {
  // 하위 디렉토리를 쓰지 않는다: 두 파일을 Promise.all로 동시에 쓸 때
  // 같은 부모 디렉토리 생성 경합으로 Android에서 writeFile이 실패한다(OS-PLUG-FILE-0011).
  const tempPath = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`;
  const base64Data = await blobToBase64(file);

  const { uri } = await Filesystem.writeFile({
    path: tempPath,
    data: base64Data,
    directory: Directory.Cache,
    recursive: true,
  });

  try {
    await FileTransfer.uploadFile({
      url,
      path: uri,
      method: "PUT",
      headers: { "Content-Type": contentType },
      connectTimeout: UPLOAD_TIMEOUT_MS,
      readTimeout: UPLOAD_TIMEOUT_MS,
    });
  } finally {
    await Filesystem.deleteFile({
      path: tempPath,
      directory: Directory.Cache,
    }).catch(() => {});
  }
}

/** 순수 웹(브라우저) 환경: 네이티브 브리지가 없으므로 기존처럼 브라우저 fetch로 업로드 */
async function uploadViaFetch({
  url,
  file,
  contentType,
}: UploadToPresignedUrlArgs): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `GCS 업로드 실패 (status: ${response.status} ${response.statusText})`,
      );
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function uploadToPresignedUrl(
  args: UploadToPresignedUrlArgs,
): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await uploadViaNativeFileTransfer(args);
  } else {
    await uploadViaFetch(args);
  }
}
