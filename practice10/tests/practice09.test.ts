import { describe, it, expect } from "vitest";
import { checkAvailability } from "../src/lib/availability";

const base = () => ({
  nowRaw: "540",
  startRaw: "660",
  endRaw: "720",
  blocked: false,
  bookings: [
    { start: 600, end: 660, label: "Calculus 101" },
    { start: 900, end: 930, label: "Later class" },
  ] as { start: number; end: number; label: string }[],
});

describe("Practice 09 — frozen fixtures", () => {
  it("P01 frozen fixture availability is unchanged", () => {
    const input = base();
    expect(checkAvailability(input)).toEqual({
      status: "available",
      reason: "Free for 60 min (11:00-12:00).",
    });
  });

  it("P02 frozen fixture overlap message is unchanged", () => {
    const input = { ...base(), startRaw: "630", endRaw: "650" };
    expect(checkAvailability(input)).toEqual({
      status: "unavailable",
      reason: "Overlaps existing booking Calculus 101 (10:00-11:00).",
    });
  });

  it("P03 bookings array and element references are preserved", () => {
    const input = base();
    const before = structuredClone(input.bookings);
    const refs = [...input.bookings];
    checkAvailability(input);
    checkAvailability({ ...input, startRaw: "630", endRaw: "650" });
    expect(input.bookings).toEqual(before);
    expect(input.bookings[0]).toBe(refs[0]);
    expect(input.bookings[1]).toBe(refs[1]);
  });

  it("P04 touching before first booking is allowed", () => {
    expect(checkAvailability({ ...base(), startRaw: "570", endRaw: "600" }).status).toBe("available");
  });

  it("P05 touching between two bookings is allowed", () => {
    expect(checkAvailability({ ...base(), startRaw: "780", endRaw: "900" }).status).toBe("available");
  });

  it("P06 touching after last booking is allowed", () => {
    expect(checkAvailability({ ...base(), startRaw: "930", endRaw: "960" }).status).toBe("available");
  });
});

describe("Practice 09 — deterministic first-conflict selection", () => {
  it("P07 returns the first conflicting booking when two overlap", () => {
    const bookings = [
      { start: 600, end: 700, label: "Earlier conflict" },
      { start: 650, end: 750, label: "Later conflict" },
    ];
    const input = { ...base(), startRaw: "610", endRaw: "720", bookings };
    expect(checkAvailability(input).reason).toBe(
      "Overlaps existing booking Earlier conflict (10:00-11:40).",
    );
  });

  it("P08 reports the only overlapping booking among non-conflicting neighbors", () => {
    const bookings = [
      { start: 500, end: 540, label: "Morning" },
      { start: 700, end: 760, label: "Afternoon" },
      { start: 900, end: 960, label: "Evening" },
    ];
    const input = { ...base(), startRaw: "720", endRaw: "730", bookings };
    expect(checkAvailability(input).reason).toBe(
      "Overlaps existing booking Afternoon (11:40-12:40).",
    );
  });

  it("P09 single-element overlap in a multi-booking list", () => {
    const bookings = [
      { start: 600, end: 660, label: "Calculus 101" },
      { start: 700, end: 760, label: "Physics 220" },
    ];
    const input = { ...base(), startRaw: "710", endRaw: "720", bookings };
    expect(checkAvailability(input).reason).toBe(
      "Overlaps existing booking Physics 220 (11:40-12:40).",
    );
  });

  it("P10 no overlap yields available with correct duration message", () => {
    const bookings = [
      { start: 600, end: 660, label: "Calculus 101" },
      { start: 900, end: 930, label: "Later class" },
    ];
    const input = { ...base(), startRaw: "660", endRaw: "720", bookings };
    expect(checkAvailability(input)).toEqual({
      status: "available",
      reason: "Free for 60 min (11:00-12:00).",
    });
  });
});
