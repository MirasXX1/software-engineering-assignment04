---
name: bug-detector
description: Diagnose bugs in existing code using acceptance criteria and failing tests. Use when reviewing the Smart Campus booking application or investigating its room availability failures.
---
# Bug Detector

## Procedure
1. Read the acceptance criteria, relevant code, and observed failure before proposing changes.
2. Reproduce the failure with the smallest deterministic input. Fix the clock and use fresh booking fixtures. If no terminal is available, label the example as reasoned rather than executed.
3. Identify the likely root cause and the relevant code expression or lines.
4. Separate defects supported by the supplied evidence from hypotheses that need another check.
5. Suggest a minimal fix, but do not edit code yet. Preserve unrelated behavior and never weaken a correct expected result to fit buggy code.
6. Propose an executable regression test with its expected result. Check exact availability decisions and unchanged booking values and order when relevant.
7. Return a compact table with columns defect | evidence | root cause | fix | test. State any unexecuted checks and remaining uncertainty.
