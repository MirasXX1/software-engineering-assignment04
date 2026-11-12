import {it,expect} from 'vitest';
import {checkAvailability} from '../src/lib/availability';
it('allows touching endpoints, rejects overlaps, and preserves bookings', () => {
  const bookings = [{ start: 900, end: 930, label: 'Later class' },{ start: 600, end: 660, label: 'Calculus 101' }];
  const before = structuredClone(bookings), refs = [...bookings];
  const input = { nowRaw: '540', blocked: false, bookings };
  for (let i = 0; i < 3; i++) {
    expect(checkAvailability({...input, startRaw: '660', endRaw: '720'})).toEqual({status: 'available',reason: 'Free for 60 min (11:00-12:00).'});
    expect(checkAvailability({...input, startRaw: '570', endRaw: '600'})).toEqual({status: 'available',reason: 'Free for 30 min (09:30-10:00).'});
    expect(checkAvailability({...input, startRaw: '630', endRaw: '650'})).toEqual({status: 'unavailable',reason: 'Overlaps existing booking Calculus 101 (10:00-11:00).'});
  }
  expect(input.bookings).toBe(bookings);expect(bookings).toEqual(before);expect(bookings[0]).toBe(refs[0]);expect(bookings[1]).toBe(refs[1]);
});
