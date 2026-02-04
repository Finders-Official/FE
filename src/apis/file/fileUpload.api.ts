// src/apis/file/uploadToPresignedUrl.api.ts
import type { UploadToPresignedUrlArgs } from "@/types/file/presignedUrl";
import axios from "axios";

export async function uploadToPresignedUrl({
  url,
  file,
  contentType,
}: UploadToPresignedUrlArgs): Promise<void> {
  await axios.put(url, file, {
    headers: {
      "Content-Type": contentType,
    },
    withCredentials: false,
    timeout: 60_000,
  });
}
