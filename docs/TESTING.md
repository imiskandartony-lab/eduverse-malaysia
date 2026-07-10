# Testing Strategy

## Manual smoke suite (run before every deploy)
1. **Auth:** land → choose Student → name prompt → dashboard shows HUD (level 1, 100 coins, streak 1).
2. **Missions:** "Log in today" auto-completes; claim → coins/XP increase, toast fires.
3. **Lesson flow:** Worlds → English Kingdom → Simple Present Tense → intro (🔊 narration speaks) → 3 learn steps → practice (wrong answer shakes, hint modal works) → mini-game completes → 3 quiz questions (wrong answer reveals correct + explanation) → boss battle HP reaches 0 → reward modal, XP/coins granted, confetti.
4. **Progression:** complete both English Kingdom lessons → "Grammar Forest unlocked" modal; locked worlds unclickable.
5. **Adaptive:** answer fraction questions wrong → dashboard recommendation switches to revision message; parent dashboard lists the weak topic.
6. **Avatar:** buy item with enough coins (balance decreases, item equips); buy button disabled when poor.
7. **Leaderboard:** player appears among demo classmates sorted by XP.
8. **Roles:** parent/teacher/admin dashboards render; teacher "assign" toast; parent report downloads.
9. **A11y:** settings toggles (dark, dyslexic, colour-blind, font size) apply instantly and persist after reload; full lesson flow with keyboard only; focus rings visible.
10. **PWA:** install prompt available; airplane mode → reload → app still works; localStorage progress intact.
11. **Tutor:** offline replies to "hint", "pecahan", "sad"; with Gemini key, free-form Q&A in BM and English.

## Automated (add when the project gains a package.json)
- **Unit (Vitest):** `gamification.js` — levelFor, grant math, streak logic (yesterday/gap/same-day), mission progress, recommendLesson prerequisite chain, weakestTopics ordering.
- **E2E (Playwright):** the smoke suite above scripted; run against `npx serve` in CI (GitHub Actions free tier).
- **Lighthouse CI:** budget assertions ≥95 all categories; fail PRs below budget.
- **Rules tests:** `@firebase/rules-unit-testing` — student cannot write another student's doc, cannot change own role, parent reads only linked child.

## Quality gates
- No console errors in the smoke suite.
- FCP < 1.5s on throttled Fast 3G (no framework payload; fonts are the main cost — swap-display is set).
