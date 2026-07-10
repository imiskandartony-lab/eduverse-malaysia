// EduVerse Malaysia — configuration
// MVP runs 100% free: localStorage by default, Firebase free tier when configured.

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
  geminiApiKey: '',
  geminiModel: 'gemini-2.0-flash',

  // Gamification tuning
  xpPerLevel: 100,        // level = floor(xp / xpPerLevel) + 1
  streakBonusCoins: 5,    // extra coins per consecutive day
  bossDamagePerCorrect: 34,
};
