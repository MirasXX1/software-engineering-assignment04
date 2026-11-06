import type { Room, Result } from "../domain/types";
import { toClock } from "../domain/availability.js";
export function AvailabilityPanel({
  room,
  result,
}: {
  room: Room | undefined;
  result: Result;
}) {
  return (
    <section aria-label="Availability result">
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={"result " + result.status}
      >
        <h2 data-testid="status">
          {result.status === "idle"
            ? "Choose a room"
            : result.status === "available"
              ? "Available"
              : "Unavailable"}
          {room ? " · " + room.id : ""}
        </h2>
        <p data-testid="reason">{result.reason}</p>
      </div>
      {room && (
        <>
          <h3>Existing bookings - read only</h3>
          {room.bookings.length ? (
            <ul>
              {room.bookings.map((b) => (
                <li key={b.start}>
                  {b.label}: {toClock(b.start)}-{toClock(b.end)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No existing bookings.</p>
          )}
        </>
      )}
    </section>
  );
}
