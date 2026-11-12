# Practice 10 — Smart Campus risk review

One fictional room (A101); local simulated bookings only. No login, database, API keys, environment variables or production connection is needed. AI assistant: ChatGPT.

## Setup and checks

Tested with Node.js 24.22.1 and npm 11.9.0. In this folder:

```sh
npm ci --ignore-scripts
npm test
npm run typecheck
npm run lint
npm run build
npm run dev -- --host 127.0.0.1
```

Open the local URL printed by Vite. Existing dependencies and package-lock.json are retained.

## Structure and acceptance contract

- `src/App.tsx`: responsive form and local state.
- `src/lib/availability.ts`: pure validation, formatting and overlap rules.
- `tests/`: Vitest acceptance and regression suites.
- `scripts/challenges.mjs`: temporary mutation checks.
- `AGENTS.md`: scope, commands, safety and review gates; read it explicitly.
- `bug-detector/`: existing diagnostic instructions.

Integer minutes only; 0 <= start < end <= 1440; start > simulated now. Duration 120 minutes is accepted, 121 rejected. Blocked rooms and strict overlaps are rejected; touching intervals are allowed. Availability checks never mutate bookings. Exact result messages and validation order are retained.

## Practice 10 changes and actual results

Two focused fixes: invalid simulated-now values now receive honest helper text; the BUG-B mutation anchor tolerates indentation after the Practice 09 extraction. Nine regressions were added; original four test files and the core decision function are unchanged. After owner approval, the prepared safety section was appended to AGENTS.md. This README supplies the missing setup document.

Actual local results on 2026-11-12: 54 tests pass; source typecheck, lint and build exit 0. In an isolated copy, `npm run challenge:08` exits 0: injected BUG-A causes 3 expected failures and BUG-B 1 expected failure, then source is restored and all 54 tests pass. Mutation commands temporarily edit source: never run them concurrently or on a shared checkout.

The source typecheck covers src, not tests. Dependency advisory/history scans, cross-browser and real-device accessibility verification were not performed. No CI gate is claimed. Release recommendation: CONDITIONAL for fictional classroom demonstration; production deployment is outside scope. A separate owner approval is required before merging or deploying. Source upload for this requested submission is explicitly authorized; application deployment is not.
