export async function downloadImageFromUrl(
  url: string,
  filename = "finders-restored.png",
) {
  const start = performance.now();
  console.log(`[Download] Starting fetch for: ${url}`);

  try {
    const res = await fetch(url, { mode: "cors" });

    // === ADD LOGS ===
    console.log(`[Download] Fetch Status: ${res.status} ${res.statusText}`);
    console.log(`[Download] Type: ${res.type}, Redirected: ${res.redirected}`);
    res.headers.forEach((val, key) =>
      console.log(`[Download] Header ${key}: ${val}`),
    );
    // ================

    if (!res.ok) throw new Error("이미지 다운로드 실패");

    const blob = await res.blob();

    // === ADD LOGS ===
    const sizeMB = blob.size / (1024 * 1024);
    console.log(`[Download] Blob created. Size: ${sizeMB.toFixed(2)} MB`);
    console.log(
      `[Download] Time to blob: ${(performance.now() - start).toFixed(2)}ms`,
    );
    // ================

    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    console.log(`[Download] Revoked objectURL: ${objectUrl}`);
    URL.revokeObjectURL(objectUrl);
  } catch (e) {
    console.error(`[Download] Error:`, e);
    throw e;
  }
}
