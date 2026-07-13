// POST /api/webhook — ToyyibPay's server-to-server payment callback.
// We do NOT trust the callback body's status field on its own (anyone could
// POST a fake "success"); instead we re-check the bill with ToyyibPay's own
// getBillTransactions API before granting premium. billExternalReferenceNo
// carries "{uid}|{plan}" as set in create-bill.js.
import { getFirestore, corsHeaders } from './_firebase.js';
import { parseFormFields } from './_parseBody.js';

const BASE_URL = process.env.TOYYIBPAY_BASE_URL || 'https://toyyibpay.com';

export default async function handler(req, res) {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  const fields = await parseFormFields(req);
  const billcode = fields.billcode || fields.billCode;
  if (!billcode) return res.status(400).end();

  try {
    const params = new URLSearchParams({
      billCode: billcode,
      userSecretKey: process.env.TOYYIBPAY_SECRET_KEY,
    });
    const r = await fetch(`${BASE_URL}/index.php/api/getBillTransactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    // ToyyibPay returns plain text ("No data found!") instead of JSON when
    // there are no transactions yet (e.g. bill created but not paid) —
    // treat anything that doesn't parse as an array the same as "not paid".
    const text = await r.text();
    let transactions;
    try { transactions = JSON.parse(text); } catch { transactions = null; }
    const paidTxn = Array.isArray(transactions) && transactions.find(t => t.billpaymentStatus === '1');
    if (!paidTxn) return res.status(200).json({ ok: true, granted: false });

    const ref = paidTxn.billExternalReferenceNo;
    if (!ref) return res.status(200).json({ ok: true, granted: false });
    const [uid, plan] = ref.split('|');
    if (!uid) return res.status(200).json({ ok: true, granted: false });

    const db = getFirestore();
    await db.collection('users').doc(uid).set({ premium: true }, { merge: true });

    // Family bundle: also grant every child currently linked to this
    // parent account (parents/{uid}.children — same list the "Link child"
    // flow writes to). Children linked *after* purchase are not retroactively
    // covered — that's a deliberate simplification, see growth-roadmap notes.
    if (plan === 'family') {
      const parentDoc = await db.collection('parents').doc(uid).get();
      const children = parentDoc.exists ? (parentDoc.data().children || []) : [];
      await Promise.all(children.map(childUid =>
        db.collection('users').doc(childUid).set({ premium: true }, { merge: true })));
    }

    return res.status(200).json({ ok: true, granted: true, plan: plan || 'individual' });
  } catch (e) {
    return res.status(500).json({ error: 'Verification failed' });
  }
}
