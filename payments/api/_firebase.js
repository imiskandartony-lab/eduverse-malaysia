// Shared Firebase Admin init for both serverless functions.
// FIREBASE_SERVICE_ACCOUNT must hold the *base64-encoded* JSON of a Firebase
// service account key (Project settings → Service accounts → Generate new
// private key). Base64 avoids newline/quoting issues in Vercel's env editor:
//   base64 -i serviceAccountKey.json | pbcopy   (or certutil on Windows)
import admin from 'firebase-admin';

let app;
export function getFirestore() {
  if (!app) {
    const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8');
    const credentials = JSON.parse(json);
    app = admin.initializeApp({ credential: admin.credential.cert(credentials) });
  }
  return admin.firestore();
}

export function corsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
