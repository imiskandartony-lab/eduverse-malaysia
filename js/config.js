// EduVerse Malaysia — configuration
// MVP runs 100% free: localStorage by default, Firebase free tier when configured.

// Bump on every content/feature release so parents/teachers can see what's
// current on the landing page footer. Follows semver: major.minor.patch.
export const APP_VERSION = '1.16.1';

export const CONFIG = {
  // Set to 'firebase' after filling in firebaseConfig below.
  backend: 'firebase',

  // Firebase free-tier project config (Console → Project settings → Web app).
  firebaseConfig: {
    apiKey: 'AIzaSyCCAdlYtX_RZadwAjBGIWOska5XZVXSBOo',
    authDomain: 'eduverse-155a0.firebaseapp.com',
    projectId: 'eduverse-155a0',
    storageBucket: 'eduverse-155a0.firebasestorage.app',
    messagingSenderId: '727852493060',
    appId: '1:727852493060:web:24e4d1d4eb0c46f9d7c851',
    // Empty until Google Analytics is enabled for this Firebase project
    // (Console → Project settings → Integrations → Google Analytics).
    // Analytics events silently no-op while this is blank — see js/analytics.js.
    measurementId: '',
  },

  // Google Gemini free-tier API key (https://aistudio.google.com/apikey).
  // Leave empty to use the built-in offline tutor (rule-based hints).
  // Never commit a real key here — the repo is public. Enter the key once
  // on each device via Settings → Sang Kancil AI; it's stored locally only.
  geminiApiKey: '',
  geminiModel: 'gemini-flash-latest',

  // Google accounts allowed to open the Admin panel (checked in
  // firestore.rules too — client check is convenience, rules are the lock).
  adminEmails: ['im.iskandartony@gmail.com'],

  // Gamification tuning
  xpPerLevel: 100,        // level = floor(xp / xpPerLevel) + 1
  streakBonusCoins: 5,    // extra coins per consecutive day
  bossDamagePerCorrect: 34,

  // Premium lifetime unlock (ToyyibPay on web; Google Play Billing later for
  // the Android build — see RELEASE_CHECKLIST.md). Currently pointed at the
  // ToyyibPay SANDBOX (dev.toyyibpay.com, set via payments/ env vars) — swap
  // TOYYIBPAY_BASE_URL/keys in Vercel to go live with real payments.
  premiumPriceRM: 9.90,
  // Parent-only upsell: unlocks premium for the parent's own account plus
  // every child currently linked to it (see js/views.js parent() and
  // payments/api/webhook.js).
  familyBundlePriceRM: 19.90,
  paymentsApiUrl: 'https://payments-gilt.vercel.app',

  // Web Push — public key only (safe to ship in client code, unlike the
  // matching private key which stays server-side in payments/ env vars).
  // See js/push.js and payments/api/streak-reminder.js.
  vapidPublicKey: 'BLdfFnBskAarpB_VLNecJLYO8gfK0FBTyyQgF6o9tpozjW-Nc0If4a1fVIgDIv6IeC5wsJLNLfGZZZ3rmD3POpQ',
};
