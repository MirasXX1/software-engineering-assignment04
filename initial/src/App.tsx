import { useMemo, useState } from "react";
import { Clock, DoorClosed, CheckCircle2, XCircle, Info } from "lucide-react";

type Booking = { start: number; end: number; label: string };

const EXISTING_BOOKINGS: Booking[] = [
  { start: 600, end: 660, label: "Calculus 101" },
];

const MIN_IN_DAY = 1440;
const MAX_DURATION = 120;
const DEFAULT_NOW = 540;

type Result =
  | { status: "idle" }
  | { status: "available"; reason: string }
  | { status: "unavailable"; reason: string };

function parseIntStrict(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  if (!/^-?\d+$/.test(trimmed)) return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n)) return null;
  return n;
}

function toClock(min: number): string {
  if (min === MIN_IN_DAY) return "24:00";
  const m = ((min % MIN_IN_DAY) + MIN_IN_DAY) % MIN_IN_DAY;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function App() {
  const [nowRaw, setNowRaw] = useState<string>(String(DEFAULT_NOW));
  const [startRaw, setStartRaw] = useState<string>("");
  const [endRaw, setEndRaw] = useState<string>("");
  const [blocked, setBlocked] = useState<boolean>(false);

  const result = useMemo<Result>(() => {
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

    for (const b of EXISTING_BOOKINGS) {
      if (start < b.end && end > b.start) {
        return {
          status: "unavailable",
          reason: `Overlaps existing booking ${b.label} (${toClock(b.start)}-${toClock(b.end)}).`,
        };
      }
    }

    return {
      status: "available",
      reason: `Free for ${duration} min (${toClock(start)}-${toClock(end)}).`,
    };
  }, [nowRaw, startRaw, endRaw, blocked]);

  const isAvailable = result.status === "available";
  const isUnavailable = result.status === "unavailable";
  const showResult = result.status !== "idle";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center px-4 py-8">
      <main className="w-full max-w-md">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-slate-700">
            <DoorClosed className="h-5 w-5" aria-hidden="true" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Smart Campus
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold leading-tight">
            Room A101 — Availability Checker
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Check only. This tool never creates or confirms a booking.
          </p>
        </header>

        <section
          aria-label="Check a time slot"
          className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div className="grid gap-4">
            <div>
              <label
                htmlFor="now-min"
                className="block text-sm font-medium text-slate-700"
              >
                Simulated "now" (minute, 0–1439)
              </label>
              <input
                id="now-min"
                type="number"
                inputMode="numeric"
                min={0}
                max={1439}
                step={1}
                value={nowRaw}
                onChange={(e) => setNowRaw(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Now is {toClock(Number(nowRaw) || 0)}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="start-min"
                  className="block text-sm font-medium text-slate-700"
                >
                  Start minute
                </label>
                <input
                  id="start-min"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={MIN_IN_DAY}
                  step={1}
                  value={startRaw}
                  onChange={(e) => setStartRaw(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label
                  htmlFor="end-min"
                  className="block text-sm font-medium text-slate-700"
                >
                  End minute
                </label>
                <input
                  id="end-min"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={MIN_IN_DAY}
                  step={1}
                  value={endRaw}
                  onChange={(e) => setEndRaw(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Minutes since midnight. End may be 1440 (midnight). Max duration 120 min.
            </p>

            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={blocked}
                onChange={(e) => setBlocked(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500"
              />
              <span>
                <span className="font-medium">Mark room as blocked</span>
                <span className="block text-xs text-slate-500">
                  Fictional override. Blocked always means unavailable.
                </span>
              </span>
            </label>
          </div>
        </section>

        <section
          aria-label="Availability result"
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 rounded-2xl p-4 ring-1 transition-colors"
          style={{
            background: isAvailable
              ? "#ecfdf5"
              : isUnavailable
                ? "#fef2f2"
                : "#ffffff",
            borderColor: "transparent",
          }}
        >
          <div
            className={
              "rounded-2xl p-4 ring-1 " +
              (isAvailable
                ? "bg-emerald-50 ring-emerald-200"
                : isUnavailable
                  ? "bg-rose-50 ring-rose-200"
                  : "bg-white ring-slate-200")
            }
          >
            {showResult ? (
              <div className="flex items-start gap-3">
                {isAvailable ? (
                  <CheckCircle2
                    className="h-6 w-6 flex-none text-emerald-600"
                    aria-hidden="true"
                  />
                ) : (
                  <XCircle
                    className="h-6 w-6 flex-none text-rose-600"
                    aria-hidden="true"
                  />
                )}
                <div>
                  <p
                    className={
                      "text-base font-semibold " +
                      (isAvailable ? "text-emerald-800" : "text-rose-800")
                    }
                  >
                    {isAvailable ? "Available" : "Unavailable"}
                  </p>
                  <p
                    className={
                      "mt-1 text-sm " +
                      (isAvailable ? "text-emerald-700" : "text-rose-700")
                    }
                  >
                    {result.reason}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Enter a start and end minute to check availability.
              </p>
            )}
          </div>
        </section>

        <section
          aria-label="Existing bookings (read-only)"
          className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <h2 className="text-sm font-semibold">Existing bookings</h2>
          </div>
          <ul className="mt-2 space-y-1">
            {EXISTING_BOOKINGS.map((b) => (
              <li
                key={`${b.start}-${b.end}`}
                className="flex items-center justify-between text-sm text-slate-700"
              >
                <span>{b.label}</span>
                <span className="tabular-nums text-slate-500">
                  {toClock(b.start)}–{toClock(b.end)} ({b.start}–{b.end})
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            This list is fixed and cannot be edited from this page.
          </p>
        </section>

        <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-2 text-slate-700">
            <Info className="h-4 w-4" aria-hidden="true" />
            <h2 className="text-sm font-semibold">How overlap is judged</h2>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            A slot is unavailable if it strictly overlaps an existing booking
            (start &lt; booked end and end &gt; booked start). Touching is
            allowed — for example 570–600 against 600–660 is available.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
