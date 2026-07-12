// EduVerse Malaysia — data store
// Adapter pattern: 'local' (localStorage, zero setup) or 'firebase' (Firestore).
// Both expose the same async API so views never care which backend runs.

import { CONFIG } from './config.js';
import { DAILY_MISSION_POOL, DAILY_CHALLENGE_POOL } from './data/curriculum.js';

// Days since epoch — used to rotate the daily challenge deterministically
// (same challenge for everyone on a given day, no randomness needed).
function dayIndex() { return Math.floor(Date.now() / 864e5); }

const LS_KEY = 'eduverse-state-v1';

function todayStr() { return new Date().toISOString().slice(0, 10); }

// Short human-typeable code (family link, duel invite) — no lookalike chars.
function makeShortCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
const makeFamilyCode = makeShortCode;

export function defaultProfile(name = 'Adventurer', role = 'student') {
  return {
    name, role, year: 5,
    xp: 0, coins: 100, gems: 0, level: 1,
    streak: 0, lastLogin: null,
    avatarBase: '🧒', equipped: {}, owned: [],
    shields: 0, comebackDate: null,
    familyCode: role === 'student' ? makeFamilyCode() : null,
    completedLessons: [], unlockedWorlds: ['english-kingdom', 'maths-volcano', 'bm-village'],
    achievements: [], mapPieces: [], mapComplete: false,
    missions: [], missionsDate: null,
    challenge: null, challengeDate: null, shards: 0, arenaBest: {}, duelWins: 0, photoURL: null,
    activityLog: [], bossesDefeated: [], perfectLessons: [], examBossYear: null,
    stats: { correct: 0, wrong: 0, gamesPlayed: 0, minutes: 0, weakTopics: {}, bySubject: {} },
  };
}

class LocalStore {
  constructor() {
    const raw = localStorage.getItem(LS_KEY);
    this.state = raw ? JSON.parse(raw) : { user: null };
  }
  _save() { localStorage.setItem(LS_KEY, JSON.stringify(this.state)); }
  async getUser() { return this.state.user; }
  async saveUser(user) { this.state.user = user; this._save(); return user; }
  async signIn(name, role) {
    if (!this.state.user || this.state.user.role !== role) this.state.user = defaultProfile(name, role);
    this.state.user.name = name;
    this._save();
    return this.state.user;
  }
  async signOut() { this.state.user = null; this._save(); }
  async getLeaderboard() {
    // Demo classmates + the player
    const bots = [
      { name: 'Aina', xp: 820 }, { name: 'Wei Jun', xp: 760 }, { name: 'Devi', xp: 700 },
      { name: 'Hafiz', xp: 640 }, { name: 'Mei Ling', xp: 520 }, { name: 'Arif', xp: 430 },
    ];
    const me = this.state.user ? [{ name: this.state.user.name, xp: this.state.user.xp, me: true }] : [];
    return [...bots, ...me].sort((a, b) => b.xp - a.xp);
  }
  // Demo mode: the "linked child" is whatever student plays on this device.
  async getChildren() {
    const u = this.state.user;
    return u && u.role === 'student' ? [u] : [];
  }
  async linkChild() { throw new Error('Linking needs Firebase — demo mode monitors this device only.'); }
  email() { return null; }
  async createDuel() { throw new Error('Online Duel needs Firebase — try the "Same tablet" mode instead.'); }
  async joinDuel() { throw new Error('Online Duel needs Firebase — try the "Same tablet" mode instead.'); }
  watchDuel() { return () => {}; }
  async submitDuelAnswer() {}
  async advanceDuelRound() {}
  async finishDuel() {}
}

class FirebaseStore {
  // Thin Firestore adapter — same interface as LocalStore.
  // Uses the modular v10 SDK loaded from gstatic (cached by the service worker).
  async init() {
    const appMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const authMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    const fsMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    this.fs = fsMod; this.auth = authMod;
    this.app = appMod.initializeApp(CONFIG.firebaseConfig);
    this.db = fsMod.getFirestore(this.app);
    this.authInst = authMod.getAuth(this.app);
    // Wait for the session to restore before the router asks for the user.
    await new Promise(res => {
      const off = authMod.onAuthStateChanged(this.authInst, () => { off(); res(); });
    });
    return this;
  }
  _ref(uid) { return this.fs.doc(this.db, 'users', uid); }
  async getUser() {
    const u = this.authInst.currentUser;
    if (!u) return null;
    const snap = await this.fs.getDoc(this._ref(u.uid));
    if (snap.exists()) return snap.data();
    // First visit after a redirect sign-in: finish creating the profile.
    const pending = localStorage.getItem('eduverse-pending-role');
    if (pending) {
      const { name, role } = JSON.parse(pending);
      return this._createProfile(u, name, role);
    }
    return null;
  }
  async _createProfile(authUser, name, role) {
    localStorage.removeItem('eduverse-pending-role');
    // Rules forbid self-registering as admin — admin access is granted by
    // email (CONFIG.adminEmails + firestore.rules), not by profile role.
    if (role === 'admin') role = 'parent';
    const user = defaultProfile(authUser.displayName || name, role);
    await this.saveUser(user);
    if (user.familyCode) {
      await this.fs.setDoc(this.fs.doc(this.db, 'codes', user.familyCode), { uid: authUser.uid });
    }
    return user;
  }
  async saveUser(user) {
    const u = this.authInst.currentUser;
    if (u) {
      await this.fs.setDoc(this._ref(u.uid), user, { merge: true });
      // Public scoreboard entry (name + xp only) — students cannot list the
      // users collection, so ranks are served from this slim mirror instead.
      if (user.role === 'student') {
        this.fs.setDoc(this.fs.doc(this.db, 'leaderboard', u.uid),
          { name: user.name, xp: user.xp }).catch(() => {});
      }
    }
    return user;
  }
  email() { return this.authInst.currentUser?.email || null; }
  async signIn(name, role) {
    // Already signed into Google on this device? Reuse the session —
    // no popup, no repeated login prompts.
    if (this.authInst.currentUser) {
      const snap = await this.fs.getDoc(this._ref(this.authInst.currentUser.uid));
      if (snap.exists()) return snap.data();
      return this._createProfile(this.authInst.currentUser, name, role);
    }
    const provider = new this.auth.GoogleAuthProvider();
    // Always show Google's account chooser — without this, Google silently
    // re-signs-in with whichever account the browser/device remembers, so
    // logging out would never actually offer a different email.
    provider.setCustomParameters({ prompt: 'select_account' });
    // Remember intent so the profile can be created even if the tab reloads
    // mid sign-in (getUser() finishes the job on return).
    localStorage.setItem('eduverse-pending-role', JSON.stringify({ name, role }));
    let cred;
    try {
      cred = await this.auth.signInWithPopup(this.authInst, provider);
    } catch (e) {
      // NOTE: no signInWithRedirect fallback — redirect sign-in silently fails
      // on modern browsers when authDomain (firebaseapp.com) differs from the
      // site origin (github.io), which caused an endless login loop.
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in window was closed. Tap the button once and finish signing in.');
      }
      if (e.code === 'auth/popup-blocked') {
        throw new Error('Your browser blocked the sign-in window. Allow pop-ups for this site, then try again.');
      }
      throw e;
    }
    const snap = await this.fs.getDoc(this._ref(cred.user.uid));
    if (snap.exists()) { localStorage.removeItem('eduverse-pending-role'); return snap.data(); }
    return this._createProfile(cred.user, name, role);
  }
  async signOut() { await this.auth.signOut(this.authInst); }
  async linkChild(code) {
    const snap = await this.fs.getDoc(this.fs.doc(this.db, 'codes', code.trim().toUpperCase()));
    if (!snap.exists()) throw new Error('Code not found — check the 6 letters on your child\'s Settings page.');
    const childUid = snap.data().uid;
    const pRef = this.fs.doc(this.db, 'parents', this.authInst.currentUser.uid);
    await this.fs.setDoc(pRef, { children: this.fs.arrayUnion(childUid) }, { merge: true });
    return childUid;
  }
  async getChildren() {
    const uid = this.authInst.currentUser?.uid;
    if (!uid) return [];
    const pSnap = await this.fs.getDoc(this.fs.doc(this.db, 'parents', uid));
    if (!pSnap.exists()) return [];
    const kids = [];
    for (const childUid of pSnap.data().children || []) {
      const s = await this.fs.getDoc(this.fs.doc(this.db, 'users', childUid));
      if (s.exists()) kids.push(s.data());
    }
    return kids;
  }
  async getLeaderboard() {
    const q = this.fs.query(this.fs.collection(this.db, 'leaderboard'),
      this.fs.orderBy('xp', 'desc'), this.fs.limit(20));
    const snap = await this.fs.getDocs(q);
    const me = this.authInst.currentUser?.uid;
    return snap.docs.map(d => ({ name: d.data().name, xp: d.data().xp, me: d.id === me }));
  }

  // ---------- Online Friend Duel: two devices, one shared room doc ----------
  async createDuel(hostName, lessonId, questionOrder) {
    const uid = this.authInst.currentUser.uid;
    const code = makeShortCode();
    await this.fs.setDoc(this.fs.doc(this.db, 'duels', code), {
      hostUid: uid, hostName, guestUid: null, guestName: null,
      lessonId, questionOrder, currentRound: 0, status: 'waiting',
      answers: {}, createdAt: Date.now(),
    });
    return code;
  }
  async joinDuel(code, guestName) {
    const ref = this.fs.doc(this.db, 'duels', code.trim().toUpperCase());
    const snap = await this.fs.getDoc(ref);
    if (!snap.exists()) throw new Error('Duel code not found — check the 6 letters and try again.');
    const data = snap.data();
    const uid = this.authInst.currentUser.uid;
    if (data.guestUid && data.guestUid !== uid) throw new Error('This duel already has two players.');
    await this.fs.updateDoc(ref, { guestUid: uid, guestName, status: 'active' });
    return code.trim().toUpperCase();
  }
  watchDuel(code, cb) {
    return this.fs.onSnapshot(this.fs.doc(this.db, 'duels', code), snap => cb(snap.exists() ? snap.data() : null));
  }
  async submitDuelAnswer(code, role, roundIdx, correct) {
    await this.fs.updateDoc(this.fs.doc(this.db, 'duels', code), { [`answers.${roundIdx}.${role}`]: { correct } });
  }
  async advanceDuelRound(code, nextRound) {
    await this.fs.updateDoc(this.fs.doc(this.db, 'duels', code), { currentRound: nextRound });
  }
  async finishDuel(code) {
    await this.fs.updateDoc(this.fs.doc(this.db, 'duels', code), { status: 'finished' });
  }
}

export const store = CONFIG.backend === 'firebase'
  ? await new FirebaseStore().init()
  : new LocalStore();

// ---------- Daily missions ----------
export function ensureDailyMissions(user) {
  // Backfill fields added after this profile was created (story mode, shields).
  if (user.mapPieces === undefined) user.mapPieces = [];
  if (user.mapComplete === undefined) user.mapComplete = false;
  if (user.shields === undefined) user.shields = 0;
  if (user.comebackDate === undefined) user.comebackDate = null;
  if (user.shards === undefined) user.shards = 0;
  if (user.challenge === undefined) { user.challenge = null; user.challengeDate = null; }
  if (user.arenaBest === undefined) user.arenaBest = {};
  if (user.duelWins === undefined) user.duelWins = 0;
  if (user.photoURL === undefined) user.photoURL = null;
  if (user.activityLog === undefined) user.activityLog = [];
  if (user.bossesDefeated === undefined) user.bossesDefeated = [];
  if (user.perfectLessons === undefined) user.perfectLessons = [];
  if (user.examBossYear === undefined) user.examBossYear = null;
  if (user.stats.bySubject === undefined) user.stats.bySubject = {};
  if (user.missionsDate !== todayStr()) {
    user.missionsDate = todayStr();
    user.missions = DAILY_MISSION_POOL.map(m => ({ ...m, progress: 0, done: false, claimed: false }));
  }
  if (user.challengeDate !== todayStr()) {
    user.challengeDate = todayStr();
    const pick = DAILY_CHALLENGE_POOL[dayIndex() % DAILY_CHALLENGE_POOL.length];
    user.challenge = { ...pick, progress: 0, done: false, claimed: false };
  }
  return user;
}

// ---------- Streak (with shields & comeback) ----------
// - consecutive days grow the streak; every 7th day forges a 🛡️ shield (max 3)
// - a missed day consumes a shield instead of breaking the streak
// - a truly broken streak triggers a "comeback day": double XP instead of guilt
export function touchStreak(user) {
  const today = todayStr();
  user.shields = user.shields || 0;
  const none = { user, streakGrew: false, shieldUsed: false, comeback: false, shieldEarned: false };
  if (user.lastLogin === today) return none;

  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  let shieldUsed = false, comeback = false, shieldEarned = false;

  if (user.lastLogin === yesterday) {
    user.streak += 1;
  } else if (user.lastLogin === null) {
    user.streak = 1; // first ever login
  } else if (user.shields > 0) {
    user.shields -= 1; shieldUsed = true;
    user.streak += 1; // the shield bridges the gap
  } else {
    user.streak = 1; comeback = true;
    user.comebackDate = today; // double XP all day (see gamification.grant)
  }

  if (user.streak > 0 && user.streak % 7 === 0 && user.shields < 3) {
    user.shields += 1; shieldEarned = true;
  }
  user.lastLogin = today;
  return { user, streakGrew: true, shieldUsed, comeback, shieldEarned };
}
