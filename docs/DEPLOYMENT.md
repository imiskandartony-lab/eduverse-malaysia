# Deployment Guide (RM0)

## 1. Local preview
```bash
npx serve .          # or python -m http.server 8080
```

## 2. GitHub Pages
```bash
git init && git add -A && git commit -m "EduVerse MVP"
gh repo create eduverse-malaysia --public --source . --push
```
Repo → Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
Done: `https://<user>.github.io/eduverse-malaysia/` (hash routing needs no rewrites).

## 3. Cloudflare Pages (alternative)
Dashboard → Pages → Connect to Git → pick repo → Framework preset: *None*, build command: *(empty)*, output dir: `/`. Free tier includes unlimited bandwidth + custom domain.

## 4. Firebase (accounts + sync)
1. console.firebase.google.com → Add project (disable paid features).
2. Build → Authentication → enable **Google** and **Email/Password**.
3. Build → Firestore → create database (production mode).
4. Project settings → Add web app → copy config into `js/config.js`, set `backend: 'firebase'`.
5. `npm i -g firebase-tools && firebase login && firebase init firestore` then
   `firebase deploy --only firestore:rules` (uses `firestore.rules`).

## 5. Gemini AI
- Get a free key: https://aistudio.google.com/apikey → `geminiApiKey` in `js/config.js`.
- **Production:** don't ship the key in client JS. Deploy the tiny proxy below as a free Cloudflare Worker and point `js/ai.js` at it:

```js
// worker.js — keeps the Gemini key server-side + rate limits by IP
export default {
  async fetch(req, env) {
    if (req.method !== 'POST') return new Response('POST only', { status: 405 });
    const body = await req.text();
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    return new Response(r.body, { status: r.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
};
```

## 6. Icons
`assets/icons/icon.svg` ships with the repo. Generate the PNG sizes once:
any converter (e.g. `npx svg2png-many`) → `icon-192.png`, `icon-512.png` in the same folder.

## 7. Verify
- Lighthouse (Chrome DevTools): PWA installable, Performance/Accessibility/Best-Practices/SEO ≥95.
- Airplane-mode test: reload the app offline — worlds, lessons and games must still work.
