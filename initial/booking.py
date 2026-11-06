"""Pure availability predicate for fictional campus room schedules."""

def can_book(start, end, now, blocked, existing):
    """Return a bool; never change existing.

    start/end: plain integer minutes, not bools; invalid candidates return False.
    Preconditions: now is a valid integer in 0..1439; blocked is bool;
    existing is a reusable sequence of valid (start, end) integer intervals.
    Existing intervals may be unsorted. Endpoint contact is permitted.
    This checks availability only and does not reserve the room.
    """
    # AC1: bool inherits from int, so require the exact type.
    if type(start) is not int or type(end) is not int:
        return False
    if not (0 <= start < end <= 1440) or start <= now:
        return False
    # AC2: exactly 120 minutes remains valid.
    if end - start > 120:
        return False
    # AC3: a blocked room is never available.
    if blocked:
        return False
    # AC4: strict inequalities allow touching endpoints.
    for booked_start, booked_end in existing:
        if start < booked_end and end > booked_start:
            return False
    # AC5: a decision only; there are no writes to existing.
    return True
