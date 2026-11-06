import type { Room } from "../domain/types";
export function RoomList({
  rooms,
  selectedId,
  onSelect,
}: {
  rooms: readonly Room[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section aria-label="Matching rooms">
      <h2>Matching rooms ({rooms.length})</h2>
      {!rooms.length ? (
        <p data-testid="empty">
          No rooms match. Reduce attendees or remove equipment requirements.
        </p>
      ) : (
        <div className="rooms">
          {rooms.map((r) => (
            <button
              type="button"
              key={r.id}
              className={"room " + (selectedId === r.id ? "selected" : "")}
              aria-pressed={selectedId === r.id}
              onClick={() => onSelect(r.id)}
              data-testid={"room-" + r.id}
            >
              <strong>
                {r.id} · {r.name}
              </strong>
              <span>
                {r.capacity} seats · {r.blocked ? "Blocked" : "Open"}
              </span>
              <span>{r.equipment.join(", ")}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
