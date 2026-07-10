# 🦌 EduVerse Malaysia

*"Where Learning Becomes an Adventure"* — a gamified PWA for Malaysian **KSSR Semakan** Year 5 & 6 students covering **Bahasa Melayu, English and Mathematics**, built to run entirely on **free-tier services (RM0)**.

## Quick start

No build step. Serve the folder with any static server:

```bash
npx serve .        # or: python -m http.server 8080
```

Open the URL, pick **I'm a Student**, and play. Progress persists in localStorage (demo mode). Parent / Teacher / Admin roles have their own dashboards.

## What's inside

| Area | Where |
|---|---|
| Design tokens & theme (light/dark/a11y) | [css/tokens.css](css/tokens.css) |
| App styles | [css/app.css](css/app.css) |
| SPA bootstrap + hash router | [js/app.js](js/app.js) |
| All views (student, parent, teacher, admin) | [js/views.js](js/views.js) |
| Gamification engine (XP, levels, streaks, missions, achievements, adaptive recommendations) | [js/gamification.js](js/gamification.js) |
| Mini-games (Memory Match, Balloon Pop, Speed Quiz) | [js/games.js](js/games.js) |
| Sang Kancil AI tutor (Gemini + offline fallback) | [js/ai.js](js/ai.js) |
| Data adapter (localStorage ⇄ Firestore) | [js/store.js](js/store.js) |
| KSSR sample curriculum & quizzes | [js/data/curriculum.js](js/data/curriculum.js) |
| PWA | [manifest.json](manifest.json), [sw.js](sw.js) |
| Firestore security rules (RBAC) | [firestore.rules](firestore.rules) |
| Architecture, database schema, deployment, testing | [docs/](docs) |

## Core experience

- **9 Learning Worlds** on an adventure map (English Kingdom → … → Kerajaan Karangan); completing all lessons in a world unlocks the next.
- **Lesson flow:** animated intro → narrated learn steps (text-to-speech) → guided practice → mini-game → quiz → **boss battle** → reward & summary.
- **Economy:** XP → levels, coins → cosmetic-only avatar shop, gems for perfect scores. No real-money purchases, ever.
- **Daily missions, streaks, achievements, leaderboard.**
- **Sang Kancil**, the mousedeer AI tutor: hints, explanations, motivation, weak-topic revision suggestions. Works offline; add a free Gemini key in [js/config.js](js/config.js) for full AI.
- **Adaptive learning:** wrong answers are tracked per topic; the recommender surfaces revision before new content.
- **Accessibility:** dark mode, dyslexia-friendly spacing, colour-blind palette, font scaling, TTS narration, keyboard focus styles, reduced-motion support.

## Going live (still RM0)

1. **Firebase:** create a free project, paste the web config into [js/config.js](js/config.js), set `backend: 'firebase'`, deploy [firestore.rules](firestore.rules) (`firebase deploy --only firestore:rules`).
2. **Gemini:** grab a free key at aistudio.google.com/apikey → `geminiApiKey` in config. For production, proxy the key behind a Cloudflare Worker (see docs/SECURITY.md).
3. **Hosting:** push to GitHub → enable GitHub Pages, or connect the repo to Cloudflare Pages. Nothing to build.

Full guides: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) · [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/DATABASE.md](docs/DATABASE.md) · [docs/TESTING.md](docs/TESTING.md) · [docs/SECURITY.md](docs/SECURITY.md)

## Adding content

Lessons, quizzes, worlds and shop items are plain data in [js/data/curriculum.js](js/data/curriculum.js) — add an object, and the map, prerequisites, games and boss battles pick it up automatically. In Firebase mode the same shapes live in Firestore collections so admins edit without redeploying.
