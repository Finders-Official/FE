export function isValidText(value: string, min: number, max: number) {
  const len = value.trim().length;
  if (len === 0) return false;
  return len >= min && len <= max;
}
