// EduVerse Malaysia — premium checkout (ToyyibPay via a small serverless
// backend in payments/). The web app never talks to ToyyibPay directly —
// the secret key must stay server-side. See payments/README.md for setup.

import { CONFIG } from './config.js';
import { toast } from './ui.js';

// Starts a ToyyibPay checkout for the signed-in user and redirects the
// browser to the hosted payment page. The payments backend's webhook marks
// users/{uid}.premium = true in Firestore once payment is confirmed; the
// app picks that up next time it reads the user doc (see store.js).
export async function startPremiumCheckout(user, uid) {
  if (!CONFIG.paymentsApiUrl) {
    toast('Payments aren\'t set up yet — check back soon!');
    return;
  }
  try {
    const res = await fetch(`${CONFIG.paymentsApiUrl}/api/create-bill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid, name: user.name || 'Adventurer',
        returnUrl: location.origin + location.pathname,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.paymentUrl) throw new Error(data.error || 'No payment URL returned');
    location.assign(data.paymentUrl);
  } catch (e) {
    toast('Could not start checkout — please try again.');
  }
}
