export function parseMinute(raw) {
  if (typeof raw !== "string" || !/^-?\d+$/.test(raw.trim())) return null;
  const n = Number(raw.trim());
  return Number.isSafeInteger(n) ? n : null;
}
export function toClock(n) {
  if (n === 1440) return "24:00";
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
}
export function checkAvailability(start, end, now, blocked, bookings) {
  const no = (reason) => ({ status: "unavailable", reason });
  if (!Number.isInteger(now) || now < 0 || now > 1439)
    return no("Invalid simulated current time.");
  if (!Number.isInteger(start) || !Number.isInteger(end))
    return no("Enter whole-number start and end minutes.");
  if (start < 0 || end > 1440 || start >= end)
    return no("Use 0 <= start < end <= 1440.");
  if (start <= now)
    return no("Start must be strictly after 09:00 (minute 540).");
  if (end - start > 120) return no("Maximum duration is 120 minutes.");
  if (blocked) return no("This room is blocked.");
  const conflict = bookings.find((b) => start < b.end && end > b.start);
  if (conflict)
    return no(
      `Overlaps ${conflict.label || "existing booking"} (${toClock(conflict.start)}-${toClock(conflict.end)}).`,
    );
  return {
    status: "available",
    reason: `Free for ${end - start} minutes (${toClock(start)}-${toClock(end)}).`,
  };
}
