# Pre-edit analysis - 2026-11-03
Context: existing A3 React/TypeScript Vite prototype plus booking.py and 27 Python tests.
Preserve AC1-AC6; add F1-F5; fixed now=540; no services or writes.
Risks: App.tsx combines fixtures, pure rules and presentation; Python can_book and App useMemo duplicate AC1-AC5; nested result panels duplicate visual containers.
Priority: 1 freeze baseline/run tests; 2 extract shared JS domain and port existing cases; 3 add catalog/filter/state reconciliation; 4 replace UI composition; 5 integration/build/mobile checks.
AI proposal modified: keep the previous room selected even when filtered out. Rejected during design because it would display a stale result for an invisible room. Clear selection when it no longer matches, preserve it otherwise. This is a design alternative, not an observed defect in A3.
Two languages were considered; final scope uses one JS domain consumed by TypeScript React and Node tests, while original Python remains archived. No claim that a human independently authored or verified this plan.
