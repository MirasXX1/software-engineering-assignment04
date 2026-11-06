import { useState } from "react";
import { EQUIPMENT } from "./domain/rooms.js";
import { deriveView } from "./domain/model.js";
import type { State } from "./domain/types";
import { RoomList } from "./components/RoomList";
import { AvailabilityPanel } from "./components/AvailabilityPanel";
export default function App() {
  const [state, setState] = useState<State>({
    attendees: "1",
    required: [],
    selectedId: "A101",
    start: "660",
    end: "720",
  });
  const view = deriveView(state);
  function update(patch: Partial<State>) {
    setState((old) => {
      const next = { ...old, ...patch };
      return { ...next, selectedId: deriveView(next).selectedId };
    });
  }
  return (
    <main>
      <header>
        <p className="eyebrow">SMART CAMPUS / FICTIONAL DEMO</p>
        <h1>Find a room that fits</h1>
        <p>
          Choose capacity, equipment and a time. Check only - no reservation is
          created.
        </p>
      </header>
      <div className="layout">
        <div>
          <section>
            <h2>Your requirements</h2>
            <label htmlFor="attendees">Attendees</label>
            <input
              id="attendees"
              type="number"
              min="1"
              step="1"
              value={state.attendees}
              onChange={(e) => update({ attendees: e.target.value })}
            />
            {(!/^\d+$/.test(state.attendees) ||
              Number(state.attendees) < 1) && (
              <p>Enter a positive whole number of attendees.</p>
            )}
            <fieldset>
              <legend>Required equipment (all selected items)</legend>
              {EQUIPMENT.map((item) => (
                <label className="check" key={item}>
                  <input
                    type="checkbox"
                    checked={state.required.includes(item)}
                    onChange={(e) =>
                      update({
                        required: e.target.checked
                          ? [...state.required, item]
                          : state.required.filter((x) => x !== item),
                      })
                    }
                  />
                  {item}
                </label>
              ))}
            </fieldset>
          </section>
          <section>
            <h2>Time slot</h2>
            <p>Fixed now: 09:00 (540). Maximum 120 minutes.</p>
            <div className="times">
              <label>
                Start minute
                <input
                  id="start"
                  type="number"
                  step="1"
                  value={state.start}
                  onChange={(e) => update({ start: e.target.value })}
                />
              </label>
              <label>
                End minute
                <input
                  id="end"
                  type="number"
                  step="1"
                  value={state.end}
                  onChange={(e) => update({ end: e.target.value })}
                />
              </label>
            </div>
            <p>
              Minutes since midnight; end 1440 means 24:00. Touching bookings is
              allowed.
            </p>
          </section>
        </div>
        <div>
          <RoomList
            rooms={view.matches}
            selectedId={view.selectedId}
            onSelect={(id) => update({ selectedId: id })}
          />
          <AvailabilityPanel room={view.selected} result={view.result} />
        </div>
      </div>
      <footer>
        Fictional schedules · No login, database or live API · Read-only
        availability
      </footer>
    </main>
  );
}
