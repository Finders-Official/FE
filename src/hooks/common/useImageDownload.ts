// src/hooks/common/useImageDownload.ts
import { useCallback } from "react";

type DownloadOptions = {
  delayMs?: number; // 다운로드 간 딜레이
  prefixSingle?: string; // 단일 파일명 prefix
  prefixAll?: string; // 전체 다운로드 파일명 prefix
  extension?: string; // 확장자
};

export function useImageDownload(options: DownloadOptions = {}) {
  const {
    delayMs = 300,
    prefixSingle = "scan",
    prefixAll = "scan_all",
    extension = "jpg",
  } = options;

  const downloadImage = useCallback(
    async (imageUrl: string, fileName?: string) => {
      const name =
        fileName || imageUrl.split("/").pop() || `download-image.${extension}`;

      const response = await fetch(imageUrl);
      if (!response.ok)
        throw new Error(`Failed to fetch image: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = name;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    [extension],
  );

  const downloadOne = useCallback(
    async (imageUrl: string, index: number) => {
      const fileName = `${prefixSingle}_${index + 1}.${extension}`;
      await downloadImage(imageUrl, fileName);
    },
    [downloadImage, extension, prefixSingle],
  );

  const downloadAll = useCallback(
    async (images: string[]) => {
      for (let i = 0; i < images.length; i++) {
        const fileName = `${prefixAll}_${i + 1}.${extension}`;
        await downloadImage(images[i], fileName);

        if (delayMs > 0) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }
    },
    [delayMs, downloadImage, extension, prefixAll],
  );

  return { downloadImage, downloadOne, downloadAll };
}
