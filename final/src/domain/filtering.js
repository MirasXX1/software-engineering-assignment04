export function filterRooms(rooms, attendees, required) {
  if (!Number.isSafeInteger(attendees) || attendees < 1) return [];
  return rooms.filter(
    (r) =>
      r.capacity >= attendees &&
      required.every((item) => r.equipment.includes(item)),
  );
}
// Preserve a visible selection, otherwise require the user to choose again.
export function reconcileSelection(selectedId, matchingRooms) {
  return matchingRooms.some((r) => r.id === selectedId) ? selectedId : null;
}
