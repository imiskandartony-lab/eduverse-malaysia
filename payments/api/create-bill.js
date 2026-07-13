// POST /api/create-bill  { uid, name, returnUrl, plan }
// Creates a ToyyibPay bill for the lifetime unlock (individual or family
// bundle) and returns the hosted payment page URL. Called from
// js/payments.js — never expose TOYYIBPAY_SECRET_KEY to the browser, so
// this call must happen server-side.
import { corsHeaders } from './_firebase.js';

const BASE_URL = process.env.TOYYIBPAY_BASE_URL || 'https://toyyibpay.com';
// Keep these in sync with js/config.js premiumPriceRM / familyBundlePriceRM.
const PRICES = { individual: 990, family: 1990 }; // cents

export default async function handler(req, res) {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { uid, name, returnUrl, plan: rawPlan } = req.body || {};
  if (!uid) return res.status(400).json({ error: 'Missing uid' });
  const plan = rawPlan === 'family' ? 'family' : 'individual';

  const params = new URLSearchParams({
    userSecretKey: process.env.TOYYIBPAY_SECRET_KEY,
    categoryCode: process.env.TOYYIBPAY_CATEGORY_CODE,
    // ToyyibPay caps billName at 30 chars.
    billName: plan === 'family' ? 'EduVerse Family Bundle' : 'EduVerse Lifetime Unlock',
    billDescription: plan === 'family'
      ? 'Unlock all 13 worlds for your account + every linked child, forever'
      : 'Unlock all 13 worlds & mini-games, forever',
    billPriceSetting: '1',
    billPayorInfo: '1',
    billAmount: String(PRICES[plan]),
    billReturnUrl: returnUrl || 'https://imiskandartony-lab.github.io/eduverse-malaysia/',
    billCallbackUrl: `${process.env.PUBLIC_BASE_URL}/api/webhook`,
    // Plan travels through ToyyibPay and back via this field — parsed again
    // in webhook.js to decide who to grant premium to.
    billExternalReferenceNo: `${uid}|${plan}`,
    billTo: name || 'Adventurer',
    billEmail: 'no-reply@eduverse-malaysia.app',
    billPhone: '0000000000',
    billSplitPayment: '0',
    billPaymentChannel: '2', // FPX + card
    billContentEmail: 'Thanks for unlocking EduVerse Malaysia!',
    billChargeToCustomer: '1',
  });

  try {
    const r = await fetch(`${BASE_URL}/index.php/api/createBill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const data = await r.json();
    const billCode = Array.isArray(data) && data[0]?.BillCode;
    if (!billCode) return res.status(502).json({ error: 'ToyyibPay did not return a bill code', raw: data });
    return res.status(200).json({ paymentUrl: `${BASE_URL}/${billCode}` });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to reach ToyyibPay' });
  }
}
