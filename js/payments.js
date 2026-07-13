// EduVerse Malaysia — premium checkout (ToyyibPay via a small serverless
// backend in payments/). The web app never talks to ToyyibPay directly —
// the secret key must stay server-side. See payments/README.md for setup.

import { CONFIG } from './config.js';
import { store } from './store.js';
import { toast, premiumUnlockedModal } from './ui.js';

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
        // The ?premium_check=1 marker tells the app (on reload after
        // ToyyibPay redirects back) to poll for the premium flag and show
        // the celebration modal — see maybeCelebratePremium() below.
        returnUrl: location.origin + location.pathname + '?premium_check=1',
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.paymentUrl) throw new Error(data.error || 'No payment URL returned');
    location.assign(data.paymentUrl);
  } catch (e) {
    toast('Could not start checkout — please try again.');
  }
}

// Called once at boot. If the user just came back from ToyyibPay
// (?premium_check=1 in the URL), poll the Firestore user doc for a bit —
// the webhook usually flips premium=true within a few seconds of payment,
// but it's a separate server-to-server call so it isn't guaranteed to have
// landed the instant the browser redirects back.
export async function maybeCelebratePremium(onFreshUser) {
  const params = new URLSearchParams(location.search);
  if (params.get('premium_check') !== '1') return;
  history.replaceState(null, '', location.pathname + location.hash);

  for (let attempt = 0; attempt < 10; attempt++) {
    const fresh = await store.getUser();
    if (fresh?.premium) {
      onFreshUser(fresh);
      await premiumUnlockedModal();
      return;
    }
    await new Promise(r => setTimeout(r, 2500));
  }
  toast('Still verifying your payment — refresh in a moment if premium doesn\'t unlock.', 5000);
}
