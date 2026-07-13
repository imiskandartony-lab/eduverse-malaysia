// EduVerse Malaysia — lightweight funnel tracking (Firebase Analytics / GA4).
// Every call is fire-and-forget and never throws — analytics must never be
// able to break the app, even if the SDK fails to load or measurementId
// isn't configured yet (see js/config.js).

import { CONFIG } from './config.js';

let analyticsMod = null;
let analyticsInst = null;
let initPromise = null;

async function ensureInit() {
  if (!CONFIG.firebaseConfig.measurementId) return false;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const appMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
      analyticsMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js');
      // store.js may have already called initializeApp() with the same
      // config — reuse that instance instead of throwing a duplicate-app error.
      const app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(CONFIG.firebaseConfig);
      analyticsInst = analyticsMod.getAnalytics(app);
      return true;
    } catch {
      return false;
    }
  })();
  return initPromise;
}

// Funnel events used across the app: sign_up, paywall_shown, begin_checkout,
// purchase. Add more as needed — GA4 auto-creates any event name you send.
export async function track(eventName, params = {}) {
  try {
    if (!(await ensureInit())) return;
    analyticsMod.logEvent(analyticsInst, eventName, params);
  } catch {
    /* analytics must never break the app */
  }
}
