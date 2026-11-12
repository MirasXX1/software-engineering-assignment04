import { describe, it, expect } from "vitest";
import { checkAvailability, simulatedNowLabel } from "../src/lib/availability";

const INVALID_NOW_LABEL = "Enter a whole minute from 0 to 1439.";
const INVALID_NOW_REASON = "Simulated 'now' must be a whole minute from 0 to 1439.";

const freshInput = (nowRaw: string) => ({
  nowRaw,
  startRaw: "660",
  endRaw: "720",
  blocked: false,
  bookings: [{ start: 600, end: 660, label: "Calculus 101" }],
});

describe("Practice 10 — simulated now label", () => {
  it.each(["", "540.5", "-1", "1440", "abc", "Infinity"])(
    "P10-invalid rejects nowRaw %j with the helper message and unchanged reason",
    (nowRaw) => {
      const input = freshInput(nowRaw);
      expect(input.startRaw).toBe("660");
      expect(input.endRaw).toBe("720");
      expect(input.blocked).toBe(false);
      expect(input.bookings).toEqual([{ start: 600, end: 660, label: "Calculus 101" }]);

      expect(simulatedNowLabel(nowRaw)).toBe(INVALID_NOW_LABEL);
      expect(checkAvailability(input)).toEqual({ status: "unavailable", reason: INVALID_NOW_REASON });
    },
  );

  it.each([
    ["0", "Now is 00:00."],
    ["540", "Now is 09:00."],
    ["1439", "Now is 23:59."],
  ])("P10-valid formats nowRaw %j as %j", (nowRaw, expected) => {
    expect(simulatedNowLabel(nowRaw)).toBe(expected);
  });
});
