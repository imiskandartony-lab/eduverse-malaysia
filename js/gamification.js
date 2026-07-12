// EduVerse Malaysia — gamification engine
// Central place for XP, coins, levels, streaks, missions and achievements
// so every view rewards players consistently.

import { CONFIG } from './config.js';
import { store, ensureDailyMissions } from './store.js';
import { toast, rewardModal, confetti } from './ui.js';
import { sfx } from './sounds.js';
import { WORLDS, LESSONS, MAP_STORY, MAP_FINALE } from './data/curriculum.js';
import { equippedPetEffect } from './avatar.js';

export const levelFor = xp => Math.floor(xp / CONFIG.xpPerLevel) + 1;
export const xpIntoLevel = xp => xp % CONFIG.xpPerLevel;

// Rank titles — displayed in the HUD and on the leaderboard.
const TITLES = [
  [50, 'Education Legend', '🌟'],
  [30, 'Master Learner', '🧙'],
  [15, 'Scholar', '🎓'],
  [5, 'Adventurer', '⚔️'],
  [1, 'Explorer', '🧭'],
];
export function titleFor(level) {
  const [, name, emoji] = TITLES.find(([min]) => level >= min);
  return { name, emoji };
}

const ACHIEVEMENTS = [
  { id: 'first-steps', name: 'First Steps', emoji: '👣', test: u => u.completedLessons.length >= 1 },
  { id: 'scholar', name: 'Scholar', emoji: '🎓', test: u => u.completedLessons.length >= 3 },
  { id: 'sharp-shooter', name: 'Sharp Shooter', emoji: '🎯', test: u => u.stats.correct >= 10 },
  { id: 'streak-3', name: 'On Fire ×3', emoji: '🔥', test: u => u.streak >= 3 },
  { id: 'gamer', name: 'Game On', emoji: '🎮', test: u => u.stats.gamesPlayed >= 3 },
  { id: 'rich', name: 'Coin Collector', emoji: '💰', test: u => u.coins >= 300 },
  { id: 'level-5', name: 'Level 5 Hero', emoji: '🦸', test: u => levelFor(u.xp) >= 5 },
];

export async function grant(user, { xp = 0, coins = 0, gems = 0, reason = '' }) {
  // Comeback day: everything earned today is double XP (see store.touchStreak).
  if (xp && user.comebackDate === today()) { xp *= 2; reason += ' ⚡×2'; }
  // Pet perks: Kucing Oren bumps coins, Kucing Hitam bumps XP, both +5%.
  const petFx = equippedPetEffect(user);
  if (coins && petFx === 'coins5') { coins = Math.round(coins * 1.05); reason += ' 🐱'; }
  if (xp && petFx === 'xp5') { xp = Math.round(xp * 1.05); reason += ' 🐈‍⬛'; }
  const beforeLevel = levelFor(user.xp);
  user.xp += xp; user.coins += coins; user.gems += gems;
  user.level = levelFor(user.xp);
  if (xp || coins) { toast(`+${xp} XP  +${coins} 🪙 ${reason}`); sfx.coin(); }
  if (user.level > beforeLevel) {
    sfx.levelUp();
    const t = titleFor(user.level);
    await rewardModal('⬆️', `Level Up!`, `You reached Level ${user.level} — rank: ${t.emoji} ${t.name}! Sang Kancil is proud of you.`);
  }
  checkAchievements(user);
  await store.saveUser(user);
  return user;
}

export function checkAchievements(user) {
  for (const a of ACHIEVEMENTS) {
    if (!user.achievements.includes(a.id) && a.test(user)) {
      user.achievements.push(a.id);
      rewardModal(a.emoji, 'Achievement Unlocked!', a.name);
    }
  }
}

export function achievementList(user) {
  return ACHIEVEMENTS.map(a => ({ ...a, owned: user.achievements.includes(a.id) }));
}

// Record mission progress by kind: 'lesson' | 'correct' | 'game' | 'login'
export async function missionProgress(user, kind, amount = 1) {
  ensureDailyMissions(user);
  for (const m of user.missions) {
    if (m.kind === kind && !m.done) {
      m.progress = Math.min(m.target, m.progress + amount);
      if (m.progress >= m.target) m.done = true;
    }
  }
  await store.saveUser(user);
}

export async function claimMission(user, missionId) {
  const m = user.missions.find(x => x.id === missionId);
  if (!m || !m.done || m.claimed) return user;
  m.claimed = true;
  return grant(user, { xp: m.xp, coins: m.coins, reason: '(mission)' });
}

// ---------- Daily Lucky Spin & Treasure Chest ----------
const today = () => new Date().toISOString().slice(0, 10);

export const SPIN_PRIZES = [
  { label: '20 🪙', coins: 20 }, { label: '15 XP', xp: 15 }, { label: '50 🪙', coins: 50 },
  { label: '1 💎', gems: 1 }, { label: '10 🪙', coins: 10 }, { label: '40 XP', xp: 40 },
  { label: '30 🪙', coins: 30 }, { label: '2 💎', gems: 2 },
];

export const canSpin = user => user.lastSpin !== today();
export async function doSpin(user) {
  if (!canSpin(user)) return null;
  user.lastSpin = today();
  const idx = Math.floor(Math.random() * SPIN_PRIZES.length);
  const prize = SPIN_PRIZES[idx];
  sfx.spin();
  await grant(user, { ...prize, reason: '(lucky spin!)' });
  return { idx, prize };
}

export const canOpenChest = user => user.lastChest !== today();
export async function openChest(user) {
  if (!canOpenChest(user)) return null;
  user.lastChest = today();
  const loot = { xp: 10 + Math.floor(Math.random() * 20), coins: 15 + Math.floor(Math.random() * 25) };
  sfx.chest();
  await grant(user, { ...loot, reason: '(daily treasure!)' });
  return loot;
}

// ---------- Daily Challenge ----------
export async function challengeProgress(user, kind, amount = 1) {
  const c = user.challenge;
  if (!c || c.kind !== kind || c.done) return;
  c.progress = Math.min(c.target, c.progress + amount);
  if (c.progress >= c.target) c.done = true;
  await store.saveUser(user);
}

export async function claimChallenge(user) {
  const c = user.challenge;
  if (!c || !c.done || c.claimed) return user;
  c.claimed = true;
  return grant(user, { xp: 0, coins: c.coins, gems: c.gems, reason: '(daily challenge!)' });
}

// ---------- Mystery Box ----------
// Weighted pool: shards are the rare pull, coins/xp the common ones.
const MYSTERY_POOL = [
  { type: 'coins', min: 10, max: 25, emoji: '🪙' },
  { type: 'coins', min: 15, max: 35, emoji: '💰' },
  { type: 'xp', min: 10, max: 25, emoji: '⭐' },
  { type: 'xp', min: 15, max: 30, emoji: '✨' },
  { type: 'gems', amount: 1, emoji: '💎' },
  { type: 'shard', amount: 1, emoji: '🔷' },
];
export function rollMysteryReward() {
  const pick = MYSTERY_POOL[Math.floor(Math.random() * MYSTERY_POOL.length)];
  if (pick.type === 'shard') return { ...pick, label: '1 Mystery Shard' };
  if (pick.type === 'gems') return { ...pick, label: '1 Gem' };
  const amount = pick.min + Math.floor(Math.random() * (pick.max - pick.min + 1));
  return { ...pick, amount, label: `${amount} ${pick.type === 'coins' ? 'Coins' : 'XP'}` };
}

export const SHARDS_FOR_EPIC = 10;
// Applies a rolled reward; every 10 shards auto-redeems a random unowned
// epic wardrobe item (import kept local to avoid a hard avatar<->game coupling).
export async function claimMysteryReward(user, reward, CATALOG) {
  if (reward.type === 'coins') await grant(user, { coins: reward.amount, reason: '(mystery box!)' });
  else if (reward.type === 'xp') await grant(user, { xp: reward.amount, reason: '(mystery box!)' });
  else if (reward.type === 'gems') await grant(user, { gems: reward.amount, reason: '(mystery box!)' });
  else if (reward.type === 'shard') {
    user.shards = (user.shards || 0) + 1;
    let epicWon = null;
    if (user.shards >= SHARDS_FOR_EPIC) {
      const pool = CATALOG.filter(p => p.rarity === 'epic' && !p.storyOnly && !user.owned.includes(p.id));
      if (pool.length) {
        epicWon = pool[Math.floor(Math.random() * pool.length)];
        user.shards -= SHARDS_FOR_EPIC;
        user.owned.push(epicWon.id);
      }
    }
    await store.saveUser(user);
    return epicWon;
  }
  return null;
}

// Adaptive learning: track wrong answers per topic AND per subject, so both
// "which lesson" and "which subject" views are available to recommend
// revision and to give parents a subject-level read on where help is needed.
export function recordAnswer(user, lessonId, correct) {
  const lesson = LESSONS.find(l => l.id === lessonId);
  const topic = lesson ? lesson.title : lessonId;
  const subject = lesson ? WORLDS.find(w => w.id === lesson.worldId)?.subject : null;
  if (correct) user.stats.correct++;
  else {
    user.stats.wrong++;
    user.stats.weakTopics[topic] = (user.stats.weakTopics[topic] || 0) + 1;
  }
  if (subject) {
    user.stats.bySubject = user.stats.bySubject || {};
    const s = user.stats.bySubject[subject] || { correct: 0, wrong: 0 };
    correct ? s.correct++ : s.wrong++;
    user.stats.bySubject[subject] = s;
  }
}

export function weakestTopics(user, n = 3) {
  return Object.entries(user.stats.weakTopics)
    .sort((a, b) => b[1] - a[1]).slice(0, n).map(([t]) => t);
}

// Subject accuracy list, sorted weakest-first — the parent dashboard's
// headline view of "which subject needs the most help right now".
export function subjectBreakdown(user) {
  const by = user.stats.bySubject || {};
  return Object.entries(by)
    .map(([subject, s]) => {
      const total = s.correct + s.wrong;
      return { subject, correct: s.correct, wrong: s.wrong, total, accuracy: total ? Math.round(s.correct / total * 100) : null };
    })
    .filter(s => s.total > 0)
    .sort((a, b) => a.accuracy - b.accuracy);
}

// Bounded recent-activity log (most recent first) for the parent timeline.
const ACTIVITY_LOG_MAX = 20;
export function logActivity(user, entry) {
  user.activityLog = user.activityLog || [];
  user.activityLog.unshift({ ...entry, at: new Date().toISOString() });
  if (user.activityLog.length > ACTIVITY_LOG_MAX) user.activityLog.length = ACTIVITY_LOG_MAX;
}

// Recommend the next lesson: first uncompleted lesson whose prerequisite is met,
// preferring worlds where the student struggles least (confidence building)
// unless a weak topic needs revision.
export function recommendLesson(user) {
  const weak = weakestTopics(user, 1)[0];
  if (weak) {
    const revisit = LESSONS.find(l => l.title === weak);
    if (revisit) return { lesson: revisit, why: `Sang Kancil suggests revising "${weak}" — you missed a few questions there.` };
  }
  const next = LESSONS.find(l =>
    !user.completedLessons.includes(l.id) &&
    (!l.prerequisite || user.completedLessons.includes(l.prerequisite)));
  return next ? { lesson: next, why: 'Your next quest awaits!' } : null;
}

// World completion: all lessons in world done → unlock next world in sequence.
export function worldProgress(user, worldId) {
  const ls = LESSONS.filter(l => l.worldId === worldId);
  const done = ls.filter(l => user.completedLessons.includes(l.id)).length;
  return { done, total: ls.length };
}

export async function maybeUnlockNextWorld(user, worldId) {
  const { done, total } = worldProgress(user, worldId);
  if (total > 0 && done === total) {
    const idx = WORLDS.findIndex(w => w.id === worldId);
    const next = WORLDS[idx + 1];
    if (next && !user.unlockedWorlds.includes(next.id)) {
      user.unlockedWorlds.push(next.id);
      await rewardModal(next.emoji, 'New World Unlocked!', `${next.name} is now open for adventure!`);
      await store.saveUser(user);
    }
  }
}

// Story mode: finishing every lesson in a world restores one torn map
// piece and reveals a lore beat. Restoring all 9 unlocks the legendary
// finale reward (a wardrobe item flagged storyOnly in avatar.js CATALOG).
export async function maybeRestoreMapPiece(user, worldId) {
  user.mapPieces = user.mapPieces || [];
  const beat = MAP_STORY[worldId];
  if (!beat || user.mapPieces.includes(worldId)) return;
  const { done, total } = worldProgress(user, worldId);
  if (total === 0 || done < total) return;
  user.mapPieces.push(worldId);
  await rewardModal('📜', beat.title, beat.text);
  if (user.mapPieces.length >= Object.keys(MAP_STORY).length && !user.mapComplete) {
    user.mapComplete = true;
    user.owned.push(MAP_FINALE.itemId);
    user.equipped.wings = MAP_FINALE.itemId;
    confetti(60);
    await rewardModal(MAP_FINALE.emoji, MAP_FINALE.title, MAP_FINALE.text);
  }
  await store.saveUser(user);
}
