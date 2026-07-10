# Security & Privacy

## Role-based access control
Enforced server-side in `firestore.rules`:
- Students read/write only their own profile; `role` field is immutable by the owner (no self-promotion to admin).
- Profile creation validates starting economy (`xp == 0`, `coins <= 100`) to block seeded cheating.
- Parents read only linked children (`parents/{uid}.children`).
- Teachers read student profiles and write assignments; only admin writes curriculum/rewards/leaderboards.
- Default deny (`match /{document=**} allow read, write: if false`).

## Student data (privacy-first)
- Demo mode stores everything on-device only.
- Firebase mode stores the minimum: display name, progress, no address/phone/photos.
- Complies with Malaysia PDPA principles: purpose-limited, minimal, parental visibility built in.
- AI tutor prompt forbids off-topic/unsafe content and never receives personal data beyond first name.

## API keys
- Firebase web config is public by design; security lives in the rules above.
- Gemini key must NOT ship in production client code — use the Cloudflare Worker proxy (docs/DEPLOYMENT.md §5) with the key in a Worker secret, plus per-IP rate limiting (Workers free tier includes basic rate limiting via Durable Objects or the `cf` cache; at MVP scale a simple in-memory counter suffices).

## Client hardening
- All user/content strings pass through `esc()` (js/ui.js) before touching innerHTML — XSS-safe even when content later comes from Firestore. Lesson `steps` are trusted (admin-authored) HTML.
- Quiz answers are validated in code paths that also record analytics; when abuse matters, move `grant()` into Cloud Functions so XP/coins are server-authoritative.
- Service worker never caches API responses.

## Threat checklist
| Threat | Mitigation |
|---|---|
| Self-granted XP/coins via console (demo) | Acceptable in demo; Firebase mode → move grants to Functions |
| Role escalation | Rules make `role` immutable by owner |
| Reading other students' data | Rules: owner/parent/teacher/admin only |
| Prompt injection to tutor | System prompt scoping + 200-token cap + no personal data in context |
| Quota exhaustion (free tier) | Local caching of curriculum, batched analytics, one-doc leaderboards |
