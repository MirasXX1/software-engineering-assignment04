# Software Engineering - Assignment #04
Name: Shokybay Miras
ID: 24B032118
Class: Thursday, 09:00-12:00
Date: 2026-11-03

## Contents
- initial/: untouched A3 React/TypeScript application, booking.py and its 27 original tests.
- final/: evolved React/TypeScript application, JavaScript domain, and Node tests.
- evidence/: actual terminal results, browser captures, original executed browser harness, pre-edit plan and source diff.
- A4_Shokybay_Miras_Report.pdf: analysis, diagrams, comparison, reflection and AI evidence appendix (provided separately).

## Requirements
Node.js 20.19+ or 22.12+ (tested: 24.22.1), npm; Python 3 for the archived baseline tests.

## Final version
cd final
npm ci
npm run dev -- --host 127.0.0.1
# Open the URL printed by Vite (normally http://127.0.0.1:5173).
npm test
npm run typecheck
npm run lint
npm run build
npm run preview -- --host 127.0.0.1

No account, environment file, API key or database is required. Existing package dependencies are retained from A3; the application makes no service requests.

## Original version
cd initial
npm ci
npm run dev -- --host 127.0.0.1
python3 -m unittest -v test_booking.py

## Actual results (2026-11-03)
Original Python suite: 27/27.
Final Node suite: 44/44 = 27 original fixtures ported into the browser's domain + 2 parser/format checks + 15 feature/workflow checks.
Browser harness: 15/15 observations = 1 baseline + 14 final, including switching, empty state and 320px overflow check.
TypeScript check, lint and production build: exit 0.
The suites differ: do not interpret 27 -> 44 as a percentage quality improvement or coverage measurement.

## Browser evidence reproduction
The executed harness is evidence/browser_harness_executed.mjs. It records the exact tool environment used for the submitted captures, including absolute runtime imports. Those paths are not portable. For independent manual reproduction, start initial on port 4173 and final on port 4174 and repeat the steps in browser_results.json. The portable, automated integration tests are tests/features.test.js, executed by npm test; they exercise deriveView, selection reconciliation and the availability engine together.

## Contract
Fixed current time 540 (09:00). Integer minutes only; start > now; 0 <= start < end <= 1440; duration <=120. Half-open overlaps: start < booked.end && end > booked.start. Checks never create bookings. Capacity is >= attendees; every required equipment item must be present. Blocked rooms remain visible when their capacity/equipment match but are always Unavailable. A selected room that stops matching is cleared; changing to another room immediately recomputes its own bookings.

## Review and disclosure
Implementation, test execution, evidence and draft reflection were prepared with ChatGPT/Codex. No student-performed review or tests are claimed. The student must read the code and reflection before submission. This package does not update or publish the older Bolt project.
