// EduVerse Malaysia — streak-reminder push notifications.
// The subscription itself is written straight to the student's own
// Firestore doc (store.saveUser) — no separate backend endpoint needed,
// since firestore.rules already lets a signed-in user update their own
// document. payments/api/streak-reminder.js (a daily Vercel Cron job)
// reads it and sends the actual push.

import { CONFIG } from './config.js';
import { store } from './store.js';
import { toast } from './ui.js';

export function pushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && !!CONFIG.vapidPublicKey;
}

// atob-based VAPID key decode — avoids pulling in a base64 helper library
// for one conversion (PushManager wants a Uint8Array, not the raw string).
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export async function enableStreakReminders(user) {
  if (!pushSupported()) {
    toast('Push notifications aren\'t supported on this browser/device.');
    return false;
  }
  if (Notification.permission === 'denied') {
    toast('Notifications are blocked for this site — enable them in your browser settings first.');
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.vapidPublicKey),
    });
    user.pushSubscription = sub.toJSON();
    await store.saveUser(user);
    toast('🔔 Streak reminders on!');
    return true;
  } catch (e) {
    toast('Could not enable notifications — please try again.');
    return false;
  }
}

export async function disableStreakReminders(user) {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
  } catch { /* best effort — still clear the stored subscription below */ }
  user.pushSubscription = null;
  await store.saveUser(user);
  toast('Streak reminders off.');
}
