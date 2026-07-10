// EduVerse Malaysia — configuration
// MVP runs 100% free: localStorage by default, Firebase free tier when configured.

export const CONFIG = {
  // Set to 'firebase' after filling in firebaseConfig below.
  backend: 'local',

  // Firebase free-tier project config (Console → Project settings → Web app).
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
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
