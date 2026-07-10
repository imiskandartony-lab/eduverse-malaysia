// EduVerse Malaysia — data store
// Adapter pattern: 'local' (localStorage, zero setup) or 'firebase' (Firestore).
// Both expose the same async API so views never care which backend runs.

import { CONFIG } from './config.js';
import { DAILY_MISSION_POOL } from './data/curriculum.js';

const LS_KEY = 'eduverse-state-v1';

function todayStr() { return new Date().toISOString().slice(0, 10); }

export function defaultProfile(name = 'Adventurer', role = 'student') {
  return {
    name, role, year: 5,
    xp: 0, coins: 100, gems: 0, level: 1,
    streak: 0, lastLogin: null,
    avatarBase: '🧒', equipped: {}, owned: [],
    completedLessons: [], unlockedWorlds: ['english-kingdom', 'maths-volcano', 'bm-village'],
    achievements: [],
    missions: [], missionsDate: null,
    stats: { correct: 0, wrong: 0, gamesPlayed: 0, minutes: 0, weakTopics: {} },
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
    return this;
  }
  _ref(uid) { return this.fs.doc(this.db, 'users', uid); }
  async getUser() {
    const u = this.authInst.currentUser;
    if (!u) return null;
    const snap = await this.fs.getDoc(this._ref(u.uid));
    return snap.exists() ? snap.data() : null;
  }
  async saveUser(user) {
    const u = this.authInst.currentUser;
    if (u) await this.fs.setDoc(this._ref(u.uid), user, { merge: true });
    return user;
  }
  async signIn(name, role) {
    const provider = new this.auth.GoogleAuthProvider();
    const cred = await this.auth.signInWithPopup(this.authInst, provider);
    let user = await this.getUser();
    if (!user) { user = defaultProfile(cred.user.displayName || name, role); await this.saveUser(user); }
    return user;
  }
  async signOut() { await this.auth.signOut(this.authInst); }
  async getLeaderboard() {
    const q = this.fs.query(this.fs.collection(this.db, 'users'),
      this.fs.orderBy('xp', 'desc'), this.fs.limit(20));
    const snap = await this.fs.getDocs(q);
    return snap.docs.map(d => ({ name: d.data().name, xp: d.data().xp }));
  }
}

export const store = CONFIG.backend === 'firebase'
  ? await new FirebaseStore().init()
  : new LocalStore();

// ---------- Daily missions ----------
export function ensureDailyMissions(user) {
  if (user.missionsDate !== todayStr()) {
    user.missionsDate = todayStr();
    user.missions = DAILY_MISSION_POOL.map(m => ({ ...m, progress: 0, done: false, claimed: false }));
  }
  return user;
}

// ---------- Streak ----------
export function touchStreak(user) {
  const today = todayStr();
  if (user.lastLogin === today) return { user, streakGrew: false };
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  user.streak = user.lastLogin === yesterday ? user.streak + 1 : 1;
  user.lastLogin = today;
  return { user, streakGrew: true };
}
