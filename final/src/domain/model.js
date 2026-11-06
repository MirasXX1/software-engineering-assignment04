import { ROOMS, NOW } from "./rooms.js";
import { filterRooms, reconcileSelection } from "./filtering.js";
import { parseMinute, checkAvailability } from "./availability.js";
export function deriveView(state, rooms = ROOMS) {
  const matches = filterRooms(
    rooms,
    parseMinute(state.attendees),
    state.required,
  );
  const selectedId = reconcileSelection(state.selectedId, matches);
  const selected = matches.find((r) => r.id === selectedId);
  const result = selected
    ? checkAvailability(
        parseMinute(state.start),
        parseMinute(state.end),
        NOW,
        selected.blocked,
        selected.bookings,
      )
    : {
        status: "idle",
        reason: matches.length
          ? "Select a room to check availability."
          : "No rooms match. Reduce attendees or remove equipment requirements.",
      };
  return { matches, selectedId, selected, result };
}
