import test from "node:test";
import assert from "node:assert/strict";
import {
  checkAvailability,
  parseMinute,
  toClock,
} from "../src/domain/availability.js";
const cases = [
  ["touch_after", 660, 720, 540, false, [[600, 660]], true],
  ["overlap", 630, 690, 540, false, [[600, 660]], false],
  ["blocked", 660, 720, 540, true, [[600, 660]], false],
  ["exactly_120", 720, 840, 540, false, [[600, 660]], true],
  ["duration_121", 720, 841, 540, false, [[600, 660]], false],
  ["starts_now", 540, 570, 540, false, [[600, 660]], false],
  ["starts_before_now", 539, 570, 540, false, [], false],
  ["reversed", 720, 660, 540, false, [], false],
  ["zero_duration", 720, 720, 540, false, [], false],
  ["negative_start", -1, 60, 0, false, [], false],
  ["end_above_day", 1380, 1441, 540, false, [], false],
  ["end_of_day", 1320, 1440, 540, false, [], true],
  ["start_at_midnight", 0, 60, 0, false, [], false],
  ["one_minute_after_now", 541, 542, 540, false, [], true],
  ["touch_before", 570, 600, 540, false, [[600, 660]], true],
  ["contained", 615, 645, 540, false, [[600, 660]], false],
  ["contains_existing", 570, 690, 540, false, [[600, 660]], false],
  ["equal_existing", 600, 660, 540, false, [[600, 660]], false],
  [
    "multiple_second_overlap",
    720,
    780,
    540,
    false,
    [
      [600, 660],
      [750, 810],
    ],
    false,
  ],
  [
    "multiple_gap",
    660,
    720,
    540,
    false,
    [
      [600, 660],
      [720, 780],
    ],
    true,
  ],
  [
    "unsorted_existing",
    660,
    720,
    540,
    false,
    [
      [750, 810],
      [600, 660],
    ],
    true,
  ],
  ["empty_existing", 660, 720, 540, false, [], true],
  ["fractional_start", 660.5, 720, 540, false, [], false],
  ["fractional_end", 660, 720.5, 540, false, [], false],
  ["string_start", "660", 720, 540, false, [], false],
  ["bool_start", true, 60, 0, false, [], false],
  ["bool_end", 0, true, 0, false, [], false],
];
for (const [name, start, end, now, blocked, existing, expected] of cases) {
  test("AC1-AC5 / " + name, () => {
    const bookings = existing.map(([start, end]) => ({
      start,
      end,
      label: "fixture",
    }));
    const snapshot = structuredClone(bookings);
    const result = checkAvailability(start, end, now, blocked, bookings);
    assert.equal(result.status === "available", expected);
    assert.deepEqual(bookings, snapshot);
  });
}
test("Parser rejects decimals, blank, exponent and unsafe integer", () => {
  for (const s of ["1.5", "", "1e3", "9007199254740993"])
    assert.equal(parseMinute(s), null);
  assert.equal(parseMinute(" 660 "), 660);
});
test("End 1440 displays 24:00", () => assert.equal(toClock(1440), "24:00"));
