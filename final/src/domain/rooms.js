// Fictional, immutable fixtures. Minutes since midnight, half-open intervals.
export const NOW = 540;
const fixtures = [
  {
    id: "A101",
    name: "Seminar Room",
    capacity: 20,
    equipment: ["Projector", "Whiteboard"],
    blocked: false,
    bookings: [{ start: 600, end: 660, label: "Calculus 101" }],
  },
  {
    id: "B202",
    name: "Computer Lab",
    capacity: 30,
    equipment: ["Projector", "Computers", "Whiteboard"],
    blocked: false,
    bookings: [{ start: 720, end: 780, label: "Programming Lab" }],
  },
  {
    id: "C303",
    name: "Meeting Room",
    capacity: 8,
    equipment: ["Whiteboard"],
    blocked: false,
    bookings: [],
  },
  {
    id: "D404",
    name: "Lecture Hall",
    capacity: 80,
    equipment: ["Projector", "Microphone"],
    blocked: true,
    bookings: [{ start: 900, end: 960, label: "Maintenance briefing" }],
  },
];
export const ROOMS = Object.freeze(
  fixtures.map((r) =>
    Object.freeze({
      ...r,
      equipment: Object.freeze(r.equipment),
      bookings: Object.freeze(r.bookings.map(Object.freeze)),
    }),
  ),
);
export const EQUIPMENT = Object.freeze(
  [...new Set(ROOMS.flatMap((r) => r.equipment))].sort(),
);
