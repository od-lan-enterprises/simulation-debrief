/** Small, pure formatting helpers. Deterministic — no locale/time dependence. */

/** Seconds → "M:SS" (e.g. 82 → "1:22"). Used for timeline clock labels. */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Seconds → compact human duration (e.g. 17 → "17s", 136 → "2m 16s"). */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  if (safe < 60) return `${safe}s`;
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
}
