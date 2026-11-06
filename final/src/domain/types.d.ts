export type Booking = Readonly<{ start: number; end: number; label: string }>;
export type Room = Readonly<{
  id: string;
  name: string;
  capacity: number;
  equipment: readonly string[];
  blocked: boolean;
  bookings: readonly Booking[];
}>;
export type Result = { status: string; reason: string };
export type State = {
  attendees: string;
  required: string[];
  selectedId: string | null;
  start: string;
  end: string;
};
