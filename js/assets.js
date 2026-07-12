// EduVerse Malaysia — admin-customizable icons
// Worlds, bosses, pets and achievements each ship with a default emoji;
// an admin may override any of them from the Admin Panel. Overrides are
// stored once (Firestore doc / localStorage) and cached in memory here —
// every view reads through these helpers instead of the raw `.emoji`
// field, so a change shows up everywhere that icon appears.

import { store } from './store.js';

let cache = {};

export async function loadAssetOverrides() {
  try { cache = (await store.getAssetOverrides()) || {}; }
  catch { cache = {}; }
}

export const getOverrides = () => cache;

export const worldIcon = world => cache.worlds?.[world.id] || world.emoji;
export const bossIcon = (worldId, boss) => cache.bosses?.[worldId] || boss.emoji;
export const petIcon = part => cache.pets?.[part.id] || part.emoji;
export const achievementIcon = a => cache.achievements?.[a.id] || a.emoji;
export const appIconUrl = () => cache.appIcon || 'assets/icons/icon.svg';

// section: 'worlds' | 'bosses' | 'pets' | 'achievements'
export async function setIconOverride(section, key, value) {
  cache[section] = cache[section] || {};
  if (value) cache[section][key] = value;
  else delete cache[section][key];
  await store.saveAssetOverrides(cache);
}

export async function setAppIconOverride(dataUrl) {
  if (dataUrl) cache.appIcon = dataUrl;
  else delete cache.appIcon;
  await store.saveAssetOverrides(cache);
}
