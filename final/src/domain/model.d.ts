import type { State, Room, Result } from "./types";
export function deriveView(
  state: State,
  rooms?: readonly Room[],
): {
  matches: readonly Room[];
  selectedId: string | null;
  selected: Room | undefined;
  result: Result;
};
