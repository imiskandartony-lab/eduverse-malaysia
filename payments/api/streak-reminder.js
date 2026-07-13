// GET /api/streak-reminder — triggered once daily by Vercel Cron (see
// vercel.json). Finds students who logged in yesterday but not yet today
// (i.e. their streak breaks at midnight if they don't play) and sends a
// "don't lose your streak" push notification.
//
// Vercel automatically adds `Authorization: Bearer <CRON_SECRET>` to
// cron-triggered requests when CRON_SECRET is set as an env var — checked
// below so this endpoint can't be triggered by anyone who finds the URL.
import webpush from 'web-push';
import { getFirestore } from './_firebase.js';

function todayStr() { return new Date().toISOString().slice(0, 10); }
function yesterdayStr() { return new Date(Date.now() - 864e5).toISOString().slice(0, 10); }

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  webpush.setVapidDetails(
    'mailto:im.iskandartony@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );

  const yesterday = yesterdayStr();
  const today = todayStr();
  const db = getFirestore();

  // Single equality filter only (auto-indexed) — the rest is filtered in
  // memory below to avoid needing a manual composite index for a small
  // early-stage user base. Revisit with a composite index (streak > 0 AND
  // lastLogin == yesterday) if this collection grows large.
  const snap = await db.collection('users').where('role', '==', 'student').get();

  const atRisk = snap.docs.filter(d => {
    const u = d.data();
    return u.lastLogin === yesterday && u.lastLogin !== today && u.streak > 0 && u.pushSubscription;
  });

  const results = await Promise.allSettled(atRisk.map(async d => {
    const u = d.data();
    const payload = JSON.stringify({
      title: `🔥 Don't lose your ${u.streak}-day streak!`,
      body: 'Sang Kancil is waiting — one quick quest keeps it alive.',
    });
    try {
      await webpush.sendNotification(u.pushSubscription, payload);
    } catch (e) {
      // Subscription is dead (browser data cleared, notifications revoked,
      // etc.) — clean it up so future runs don't keep retrying it.
      if (e.statusCode === 404 || e.statusCode === 410) {
        await db.collection('users').doc(d.id).update({ pushSubscription: null });
      }
      throw e;
    }
  }));

  const sent = results.filter(r => r.status === 'fulfilled').length;
  return res.status(200).json({ ok: true, checked: snap.size, atRisk: atRisk.length, sent });
}
