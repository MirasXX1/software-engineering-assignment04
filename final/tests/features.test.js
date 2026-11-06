import test from "node:test";
import assert from "node:assert/strict";
import { ROOMS } from "../src/domain/rooms.js";
import { filterRooms, reconcileSelection } from "../src/domain/filtering.js";
import { deriveView } from "../src/domain/model.js";
const base = {
  attendees: "1",
  required: [],
  selectedId: "A101",
  start: "600",
  end: "630",
};
test("Catalog has four complete immutable room records", () => {
  assert.equal(ROOMS.length, 4);
  assert.equal(new Set(ROOMS.map((r) => r.id)).size, 4);
  for (const r of ROOMS) {
    assert.ok(
      r.name &&
        Number.isInteger(r.capacity) &&
        Array.isArray(r.equipment) &&
        typeof r.blocked === "boolean" &&
        Array.isArray(r.bookings),
    );
    assert.ok(Object.isFrozen(r) && Object.isFrozen(r.bookings));
  }
});
test("F1 exact capacity 20 includes A101", () =>
  assert.ok(filterRooms(ROOMS, 20, []).some((r) => r.id === "A101")));
test("F1 capacity 21 excludes A101", () =>
  assert.ok(!filterRooms(ROOMS, 21, []).some((r) => r.id === "A101")));
test("F1 zero, fractional and invalid attendees return no matches", () => {
  for (const n of [0, -1, 1.5, null, NaN])
    assert.deepEqual(filterRooms(ROOMS, n, []), []);
});
test("F2 equipment uses ALL: computers plus whiteboard only B202", () =>
  assert.deepEqual(
    filterRooms(ROOMS, 1, ["Computers", "Whiteboard"]).map((r) => r.id),
    ["B202"],
  ));
test("F2 combined capacity and equipment", () =>
  assert.deepEqual(filterRooms(ROOMS, 31, ["Whiteboard"]), []));
test("F2 no required items retains capacity matches", () =>
  assert.equal(filterRooms(ROOMS, 1, []).length, 4));
test("F3 blocked D404 never available even for free time", () => {
  const v = deriveView({ ...base, selectedId: "D404" });
  assert.equal(v.result.status, "unavailable");
  assert.match(v.result.reason, /blocked/);
});
test("F4 empty state and stale selection cleared", () => {
  const v = deriveView({ ...base, attendees: "81" });
  assert.equal(v.matches.length, 0);
  assert.equal(v.selectedId, null);
  assert.equal(v.result.status, "idle");
  assert.match(v.result.reason, /No rooms match/);
});
test("F5 integration room switch uses selected bookings", () => {
  const a = deriveView(base);
  const b = deriveView({ ...base, selectedId: "B202" });
  assert.equal(a.result.status, "unavailable");
  assert.equal(b.result.status, "available");
  assert.equal(b.selected.id, "B202");
});
test("F5 switch back recomputes previous conflict", () =>
  assert.equal(
    deriveView({ ...base, selectedId: "A101" }).result.status,
    "unavailable",
  ));
test("F5 filter invalidates hidden room without auto-selection", () => {
  const v = deriveView({ ...base, required: ["Computers"] });
  assert.equal(v.matches.length, 1);
  assert.equal(v.selectedId, null);
  assert.equal(v.result.status, "idle");
});
test("F5 matching selection is retained", () =>
  assert.equal(
    reconcileSelection("A101", filterRooms(ROOMS, 20, ["Whiteboard"])),
    "A101",
  ));
test("AC5 full workflow never mutates room catalog", () => {
  const before = JSON.stringify(ROOMS);
  for (const r of ROOMS) deriveView({ ...base, selectedId: r.id });
  assert.equal(JSON.stringify(ROOMS), before);
});
test("Unknown room ID cannot produce availability", () =>
  assert.equal(
    deriveView({ ...base, selectedId: "X999" }).result.status,
    "idle",
  ));
