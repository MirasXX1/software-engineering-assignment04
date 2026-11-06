# AI-use record
Tool: ChatGPT / Codex coding assistant. Exact underlying model version is not exposed to this session.
Date: 2026-11-03 (Asia/Almaty).

## Actual user request
"вот теперь надо делать этот assignment"
Attachments: Lesson #08 Software Engineering Assignment #04, Lecture and Practice PDFs.
The user supplied previous A3 context and student identity. No additional student-authored technical prompts are claimed.

## Structured context assembled by the assistant
Repository: initial/src/App.tsx, booking.py, test_booking.py; React/TypeScript/Vite; single room A101. Preserve AC1-AC6, fixed now=540 and read-only behavior. Add >=4 rooms, capacity >= attendees, ALL equipment, blocked denial, empty state, selection refresh. Separate fixtures/rules/filtering/UI. No new skill or backend. This is an assistant-authored working brief, not a fabricated user quote or a separate AI session.

## Selected actual assistant output
"План: вынести данные и правила, добавить фильтры, затем подключить интерфейс и проверить границы. При смене фильтров скрытая комната будет сбрасываться — иначе на экране может остаться результат для комнаты, которой уже нет в списке."
Used: pre-edit plan, src/domain/*, RoomList.tsx, AvailabilityPanel.tsx and tests.

## Decision and modification
Design alternative modified: preserving a room that no longer matches was rejected. reconcileSelection returns null in that case; deriveView returns idle with a selection/empty-state message. This alternative was considered during design; it is not claimed as a separately captured response from another model.

## Problems and verification
Baseline: duplicate availability implementations in Python and App.tsx; monolithic view; nested result containers. Final: one runtime rules module. Evidence: original source, App.diff, regression.test.js and features.test.js, actual final_tests.txt, browser_results.json, screenshots and build/typecheck/lint logs. Local browser setup initially failed; a packaged headless Chromium was used. This environment problem was not an application defect.

No invented external chat, prompt screenshots or student verification claims are included. Human review remains pending.
