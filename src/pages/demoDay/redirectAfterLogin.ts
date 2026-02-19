const REDIRECT_KEY = "finders:redirectAfterLogin";

type RedirectData = { path: string; timestamp: number };

export function setRedirectAfterLogin(path: string): void {
  sessionStorage.setItem(
    REDIRECT_KEY,
    JSON.stringify({ path, timestamp: Date.now() }),
  );
}

export function consumeRedirectAfterLogin(): string | null {
  const raw = sessionStorage.getItem(REDIRECT_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
  if (!raw) return null;
  try {
    const data: RedirectData = JSON.parse(raw);
    const TTL = 30 * 60 * 1000; // 30분
    if (Date.now() - data.timestamp > TTL) return null;
    return data.path;
  } catch {
    return null;
  }
}
