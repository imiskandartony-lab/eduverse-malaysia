// EduVerse Malaysia — configuration
// MVP runs 100% free: localStorage by default, Firebase free tier when configured.

// Bump on every content/feature release so parents/teachers can see what's
// current on the landing page footer. Follows semver: major.minor.patch.
export const APP_VERSION = '1.3.0';

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
};
