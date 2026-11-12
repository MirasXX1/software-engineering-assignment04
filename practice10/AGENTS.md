# Project
Smart Campus room availability checker; one fictional room A101.

## Structure
src/App.tsx: responsive UI and local state.
src/lib/availability.ts: pure rules, types, parsing and formatting.
tests/: existing Vitest acceptance and regression tests.

## Constraints
Preserve AC1-AC6, exact messages, validation order and fixture values.
Use integer minutes 0 <= start < end <= 1440, start > simulated now.
Allow exactly 120 minutes, reject 121. Reject blocked rooms and strict overlaps; touching is allowed.
Never mutate bookings. Preserve desktop/mobile feedback and toClock(1440)=24:00.
No backend, login, database, live API, extra rooms or booking creation.

## Engineering rules
Prefer pure functions and minimal changes. At most two justified patterns; none is acceptable.
One consistent booking format and one policy do not justify Adapter or Strategy.
Do not weaken/delete existing assertions. Explain every edited file.

## Commands
npm test
npm run typecheck
npm run lint
npm run build

## Verification
Run existing tests and add focused regression tests for changes.
Report actual pass/fail output separately from inspection.
Do not claim this file is automatically loaded; explicitly read and summarize it.

## Safety boundaries and review gates
Use fictional data only. Never add personal information, credentials, tokens or secrets.
Do not deploy, publish, connect production services, or access unrelated files/accounts.
Work on an isolated copy or branch. Limit edits to the agreed files and task.
For read-only audits, do not edit project files. Draft instruction changes and wait for owner approval before applying them.
Do not run challenge:07 or challenge:08 on a shared checkout: they temporarily mutate source files.
Use npm ci --ignore-scripts for a clean locked install. Do not run automatic dependency upgrades, destructive git commands or remote writes.
Run npm test, npm run typecheck, npm run lint and npm run build before proposing acceptance.
Review the diff and provide actual command outputs, changed files, limitations and a review note.
Merging and deployment require separate owner approval; failed or unrun checks must be stated.
