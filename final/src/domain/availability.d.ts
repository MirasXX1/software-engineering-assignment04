import type { Booking, Result } from "./types";
export function parseMinute(raw: string): number | null;
export function toClock(n: number): string;
export function checkAvailability(
  start: number | null,
  end: number | null,
  now: number,
  blocked: boolean,
  bookings: readonly Booking[],
): Result;
