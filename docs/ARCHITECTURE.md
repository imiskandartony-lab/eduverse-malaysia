# Architecture

## System overview

```
┌────────────────────────────────────────────────────────────┐
│  Client (PWA — GitHub Pages / Cloudflare Pages, static)    │
│                                                            │
│  index.html ── js/app.js (hash router)                     │
│       │             │                                      │
│       │        js/views.js  ← all screens                  │
│       │             │                                      │
│  css/tokens.css  js/gamification.js   js/games.js          │
│  css/app.css     (XP/levels/missions/ (mini-game           │
│                   achievements/        components)         │
│                   adaptive engine)                         │
│       │             │                                      │
│       │        js/store.js ←── data adapter interface      │
│       │        ┌─────┴──────┐                              │
│       │   LocalStore    FirebaseStore                      │
│       │  (localStorage) (Auth + Firestore, free tier)      │
│       │                                                    │
│  js/ai.js ── Sang Kancil tutor                             │
│        ├── offline rule-based fallback (RM0, no key)       │
│        └── Gemini API free tier (config key / proxy)       │
│                                                            │
│  sw.js — offline-first cache (stale-while-revalidate)      │
└────────────────────────────────────────────────────────────┘
```

## Key decisions (ADR summary)

1. **No framework, ES modules only.** Ages fastest paths to Lighthouse ≥95 (zero JS framework payload), zero build step, deployable to any static host. Views are plain render functions; a framework can be introduced later per-module.
2. **Adapter-pattern data layer.** `store.js` exposes one async interface (`getUser/saveUser/signIn/signOut/getLeaderboard`). `LocalStore` makes the whole app work offline at RM0 with zero setup; `FirebaseStore` is a drop-in swap via one config flag. All game/reward logic is backend-agnostic.
3. **Content as data, not code.** Worlds, lessons, quizzes, shop items and missions are declarative objects. New subjects (Science, Sejarah…) are added by appending data — the map, prerequisite chain, mini-games and boss battles are generated from it. This is the modular-expansion story.
4. **AI is assistive only.** Curriculum content is human-authored. Gemini is used for hints/explanations/motivation with a strict system prompt; a rule-based offline tutor guarantees function without a key or network.
5. **Gamification engine is centralized** (`gamification.js`) so every surface (lessons, games, missions) grants rewards through one audited path — required for the anti-pay-to-win guarantee and future server-side validation.
6. **Hash routing** keeps deep links working on static hosts (GitHub Pages has no rewrite rules).

## Module map for future expansion

| Future feature | Extension point |
|---|---|
| New subject/world | Append to `WORLDS`/`LESSONS`/`QUIZZES` (or Firestore collections) |
| New mini-game | Add a `(mount, cfg, onDone)` function in `games.js`; register in `gameForLesson` |
| Multiplayer / events | New Firestore collections + a view; reward via `grant()` |
| Native apps | Wrap with Capacitor — the PWA is already offline-first |
| Server-side reward validation | Move `grant()` mutations into Cloud Functions; rules already restrict client writes |
