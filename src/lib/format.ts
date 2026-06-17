/** Small, pure formatting helpers. Deterministic, no locale/time dependence. */

/** Seconds → "M:SS" (e.g. 82 → "1:22"). Used for timeline clock labels. */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * ISO "YYYY-MM-DD" → "12 Jun 2026". Parsed manually (not via `new Date`) so the
 * output is timezone-independent and deterministic across server/client.
 */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const [, year, month, day] = m;
  const monthName = MONTHS[Number(month) - 1] ?? month;
  return `${Number(day)} ${monthName} ${year}`;
}

/** Seconds → compact human duration (e.g. 17 → "17s", 136 → "2m 16s"). */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  if (safe < 60) return `${safe}s`;
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
}
