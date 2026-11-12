export type Booking = { start: number; end: number; label: string };
const MIN_IN_DAY = 1440;
const MAX_DURATION = 120;

export type Result =
  | { status: "idle" }
  | { status: "available"; reason: string }
  | { status: "unavailable"; reason: string };

export function parseIntStrict(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  if (!/^-?\d+$/.test(trimmed)) return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n)) return null;
  return n;
}

export function toClock(min: number): string {
  if (min === MIN_IN_DAY) return "24:00";
  const m = ((min % MIN_IN_DAY) + MIN_IN_DAY) % MIN_IN_DAY;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function simulatedNowLabel(raw: string): string {
  const minute = parseIntStrict(raw);
  if (minute === null || minute < 0 || minute >= MIN_IN_DAY) {
    return "Enter a whole minute from 0 to 1439.";
  }
  return `Now is ${toClock(minute)}.`;
}

export type AvailabilityInput = { nowRaw: string; startRaw: string; endRaw: string; blocked: boolean; bookings: Booking[] };

function findOverlappingBooking(start: number, end: number, bookings: Booking[]): Booking | null {
  for (const b of bookings) {
    if (start < b.end && end > b.start) {
      return b;
    }
  }
  return null;
}

export function checkAvailability({nowRaw, startRaw, endRaw, blocked, bookings}: AvailabilityInput): Result {
    const now = parseIntStrict(nowRaw);
    if (now === null || now < 0 || now > 1439) {
      return {
        status: "unavailable",
        reason: "Simulated 'now' must be a whole minute from 0 to 1439.",
      };
    }

    const start = parseIntStrict(startRaw);
    const end = parseIntStrict(endRaw);

    if (start === null || end === null) {
      return {
        status: "unavailable",
        reason: "Enter whole-number start and end minutes.",
      };
    }

    if (start < 0 || end > MIN_IN_DAY) {
      return {
        status: "unavailable",
        reason: `Minutes must stay within the day: 0 to ${MIN_IN_DAY}.`,
      };
    }

    if (start >= end) {
      return {
        status: "unavailable",
        reason: "Start minute must be earlier than the end minute.",
      };
    }

    if (start <= now) {
      return {
        status: "unavailable",
        reason: `Start must be strictly after 'now' (${toClock(now)} / minute ${now}).`,
      };
    }

    const duration = end - start;
    if (duration > MAX_DURATION) {
      return {
        status: "unavailable",
        reason: `Duration is ${duration} minutes; the limit is ${MAX_DURATION} minutes (120 is allowed).`,
      };
    }

    if (blocked) {
      return {
        status: "unavailable",
        reason: "Room A101 is flagged as blocked, so it cannot be used.",
      };
    }

    const conflict = findOverlappingBooking(start, end, bookings);
    if (conflict !== null) {
      return {
        status: "unavailable",
        reason: `Overlaps existing booking ${conflict.label} (${toClock(conflict.start)}-${toClock(conflict.end)}).`,
      };
    }

    return {
      status: "available",
      reason: `Free for ${duration} min (${toClock(start)}-${toClock(end)}).`,
    };
}
