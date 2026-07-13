# EduVerse Payments — ToyyibPay bridge

A tiny serverless backend so the (static, GitHub Pages-hosted) web app can
sell the RM9.90 lifetime unlock through ToyyibPay without ever exposing a
secret key or Firebase service account in the browser.

This is a **separate deployment** from the main app — it lives in this
folder and deploys to Vercel's free tier independently of GitHub Pages.

## What it does

- `POST /api/create-bill` — the app calls this when a student taps "Unlock
  Now". It creates a ToyyibPay bill server-side and returns the hosted
  payment page URL to redirect to.
- `POST /api/webhook` — ToyyibPay calls this itself once payment finishes.
  It re-verifies the payment with ToyyibPay's own API (never trusts the
  callback body blindly) and, if genuinely paid, sets
  `users/{uid}.premium = true` in Firestore via the Admin SDK (which bypasses
  the client-side rule that blocks users from setting this field themselves).
  For the family plan, also grants premium to every uid in `parents/{uid}.children`.
- `GET /api/streak-reminder` — a **daily Vercel Cron job** (see `vercel.json`,
  runs 11:00 UTC / 7pm MYT). Finds students whose streak breaks at midnight
  if they don't play, and sends each a Web Push notification via the
  `web-push` library. Rejects any request without Vercel's auto-injected
  `Authorization: Bearer $CRON_SECRET` header, so it can't be triggered by
  anyone who finds the URL.

## One-time setup

### 1. ToyyibPay account
1. Register at https://toyyibpay.com (or https://dev.toyyibpay.com for a
   sandbox account to test with first — recommended).
2. Create a **Category** (e.g. "EduVerse Malaysia") — copy its **Category
   Code**.
3. Copy your account's **Secret Key** (Settings → Profile).

### 2. Firebase service account
1. Firebase Console → Project settings → Service accounts → **Generate new
   private key** → downloads a JSON file. Treat this like a password — it
   has full admin access to your Firestore data.
2. Base64-encode it (so it survives Vercel's env var editor as one line):
   - Windows (PowerShell): `[Convert]::ToBase64String([IO.File]::ReadAllBytes("serviceAccountKey.json")) | Set-Clipboard`
   - Mac/Linux: `base64 -i serviceAccountKey.json | pbcopy`

### 3. Deploy to Vercel
1. `npm i -g vercel` (once), then from this `payments/` folder: `vercel`
   (first deploy) or `vercel --prod` (production deploy).
2. In the Vercel project's dashboard → Settings → Environment Variables, add:
   - `FIREBASE_SERVICE_ACCOUNT` — the base64 string from step 2
   - `TOYYIBPAY_SECRET_KEY` — from ToyyibPay
   - `TOYYIBPAY_CATEGORY_CODE` — from ToyyibPay
   - `TOYYIBPAY_BASE_URL` — `https://dev.toyyibpay.com` while testing,
     `https://toyyibpay.com` once you go live
   - `PUBLIC_BASE_URL` — this Vercel project's own URL, e.g.
     `https://eduverse-payments.vercel.app` (needed so create-bill.js can
     tell ToyyibPay where to send its webhook)
   - `ALLOWED_ORIGIN` — your app's origin, e.g.
     `https://imiskandartony-lab.github.io` (or `*` while testing)
   - `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` — generate once with
     `npx web-push generate-vapid-keys`. The public key also goes into
     `js/config.js`'s `vapidPublicKey` (safe to ship in client code); the
     private key stays here only.
   - `CRON_SECRET` — any random string (e.g. `openssl rand -hex 24`). Vercel
     automatically sends it as `Authorization: Bearer <value>` on cron
     requests once this env var exists — that's what `streak-reminder.js`
     checks against.
3. Redeploy after adding env vars (Vercel doesn't hot-reload them).

### 4. Wire it into the app
Set `paymentsApiUrl` in `js/config.js` to your Vercel URL (no trailing
slash), e.g.:
```js
paymentsApiUrl: 'https://eduverse-payments.vercel.app',
```
Bump `APP_VERSION` / `sw.js` CACHE and redeploy the main site as usual.

## Testing

1. Use the ToyyibPay **sandbox** (`dev.toyyibpay.com`) first — sandbox
   payments use fake card/FPX flows, no real money moves.
2. In the app, reach the paywall (finish all lessons in one of the 3 free
   starter worlds — English Kingdom, Mathematics Volcano, Kampung Bahasa —
   to trigger the next-world unlock check) and tap "Unlock Now".
3. Complete the sandbox payment, confirm `users/{uid}.premium` flips to
   `true` in the Firestore console, and that the app then lets the world
   unlock.
4. Switch `TOYYIBPAY_BASE_URL` to production and go live.

## Notes

- This unlocks premium for the **web app** only. The Android build (once
  Play Console registration happens) should use Google Play Billing instead
  — Play policy requires it for unlocking digital content inside an app
  distributed on Play. See `RELEASE_CHECKLIST.md` in the repo root.
- Nothing here touches the main static site's deploy — GitHub Pages keeps
  serving `index.html`/`js/*` exactly as before; this is purely an
  additional API the client calls.
