// EduVerse Malaysia — view renderers (SPA, hash-routed)

import { WORLDS, LESSONS, QUIZZES, BOSSES, MAP_STORY, MAP_FINALE } from './data/curriculum.js';
import { CATALOG, CATEGORIES, findPart, renderAvatar, migrateWardrobe, DEFAULT_EQUIP, fileToAvatarDataURL, equippedPetEffect } from './avatar.js';
import { store, ensureDailyMissions, touchStreak } from './store.js';
import { CONFIG } from './config.js';
import {
  grant, missionProgress, claimMission, recordAnswer, weakestTopics,
  recommendLesson, worldProgress, maybeUnlockNextWorld, levelFor, xpIntoLevel,
  achievementList, titleFor, canSpin, doSpin, canOpenChest, openChest, SPIN_PRIZES, grant as grantReward,
  maybeRestoreMapPiece, challengeProgress, claimChallenge, rollMysteryReward, claimMysteryReward, SHARDS_FOR_EPIC,
  logActivity, subjectBreakdown,
} from './gamification.js';
import { sfx, isMuted, setMuted } from './sounds.js';
import { getAiKey, setAiKey } from './ai.js';
import { toast, rewardModal, speak, esc, confetti, floatText, flashEdge, showCombo } from './ui.js';
import { gameForLesson } from './games.js';

let user = null;
export const getUser = () => user;
export const setUser = u => { user = u; };
export const isAdminUser = () =>
  user && (user.role === 'admin' || CONFIG.adminEmails.includes(store.email?.() || ''));
export const homeRoute = () =>
  !user ? '#/' : user.role === 'student' ? '#/dashboard' : `#/${user.role}`;

// Full sign-out: ends the Firebase session (so the Google account picker
// appears next time — see store.js signIn) and drops any leftover local state.
async function doLogout() {
  localStorage.removeItem('eduverse-pending-role');
  await store.signOut();
  user = null;
  go('#/');
}

// Daily login: streak, shields, comeback bonus, login mission, streak coins.
// Called on landing sign-in AND at boot (returning sessions skip the landing,
// which used to mean the streak never grew for installed-app users).
export async function applyDailyLogin() {
  if (!user || user.role !== 'student') return;
  ensureDailyMissions(user);
  const { streakGrew, shieldUsed, comeback, shieldEarned } = touchStreak(user);
  if (!streakGrew) return;
  if (shieldUsed) toast(`🛡️ Streak shield used — your ${user.streak}-day streak is safe!`, 4000);
  if (comeback) await rewardModal('⚡', 'Welcome back, hero!', 'We missed you! Everything you earn today is DOUBLE XP. Let\'s go!');
  if (shieldEarned) await rewardModal('🛡️', 'Streak Shield forged!', `A ${user.streak}-day streak earned you a shield — it protects your streak if you ever miss a day. (${user.shields}/3)`);
  await missionProgress(user, 'login');
  await grant(user, { coins: user.streak * CONFIG.streakBonusCoins, reason: `(day ${user.streak} streak!)` });
  await store.saveUser(user);
}

const go = route => { location.hash = route; };


function hud() {
  return `
  <div class="hud">
    <span class="pill"><span class="ico hud-hero">${user.photoURL ? `<img src="${user.photoURL}" class="hud-hero-photo" alt="">` : renderAvatar(user, 20)}</span>${esc(user.name)}</span>
    <span class="pill"><span class="ico">⭐</span>Lv ${levelFor(user.xp)}</span>
    <span class="pill pill-rank"><span class="ico">${titleFor(levelFor(user.xp)).emoji}</span>${titleFor(levelFor(user.xp)).name}</span>
    <span class="pill"><span class="ico">🪙</span>${user.coins}</span>
    <span class="pill"><span class="ico">💎</span>${user.gems}</span>
    <span class="pill"><span class="ico">🔥</span>${user.streak} day${user.streak === 1 ? '' : 's'}${user.shields ? ` 🛡️${user.shields}` : ''}</span>
    <span class="spacer"></span>
    <button class="btn btn-ghost btn-sm" data-route="#/settings">⚙️</button>
  </div>
  <div class="xpbar" role="progressbar" aria-label="XP progress" aria-valuenow="${xpIntoLevel(user.xp)}" aria-valuemax="${CONFIG.xpPerLevel}">
    <span style="width:${xpIntoLevel(user.xp)}%"></span>
  </div>`;
}

// ---------------- Landing / auth: game title screen ----------------
export function landing(el) {
  const particles = ['🪙', '⭐', '✨', '🪙', '⭐'];
  const roleCards = [
    { role: 'student', emoji: '🧑‍🚀', label: "I'm a Student", featured: true, tag: '⭐ Start here' },
    { role: 'parent', emoji: '👨‍👩‍👧', label: "I'm a Parent" },
    { role: 'teacher', emoji: '🧑‍🏫', label: "I'm a Teacher" },
    { role: 'admin', emoji: '🛠️', label: 'Admin' },
  ];

  el.innerHTML = `
  <div class="landing">
    <span class="landing-bg-island" style="left:6%;top:6%;animation-delay:-1s">🏝️</span>
    <span class="landing-bg-island" style="right:8%;top:14%;font-size:2.6rem;animation-delay:-4s">🏔️</span>
    <span class="landing-bg-island" style="left:12%;top:58%;font-size:2.2rem;animation-delay:-6.5s">☁️</span>
    <div class="landing-particles">
      ${particles.map((p, i) => `<span style="left:${8 + i * 20}%;animation-duration:${9 + i * 2}s;animation-delay:${-i * 3}s">${p}</span>`).join('')}
    </div>

    <div class="title-logo">Edu<span class="word-my">Verse</span></div>
    <div class="title-sub">MALAYSIA</div>
    <p class="tagline">Where learning becomes an adventure — KSSR Year 5 &amp; 6</p>

    <p class="path-eyebrow">🗺️ 9 worlds waiting for you</p>
    <div class="world-ticker-wrap">
      <div class="world-ticker" id="world-ticker">
        ${[...WORLDS, ...WORLDS].map(w => `
          <button type="button" class="world-badge" data-world-name="${esc(w.name)}" data-world-desc="${esc(w.desc)}">
            <span class="wb-emoji">${w.emoji}</span>${esc(w.name)}
          </button>`).join('')}
      </div>
    </div>

    <p class="path-eyebrow">Choose your path</p>
    <div class="role-grid">
      ${roleCards.map(r => `
        <button class="role-card ${r.featured ? 'featured' : ''}" data-role="${r.role}">
          ${r.tag ? `<span class="r-tag">${r.tag}</span>` : ''}
          <span class="r-emoji-ring">${r.emoji}</span>${esc(r.label)}
        </button>`).join('')}
    </div>
    <form id="name-form" hidden style="margin-top:1.2rem;display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap">
      <input id="name-input" type="text" maxlength="20" placeholder="Your adventurer name"
        style="border:3px solid var(--line);border-radius:var(--r-pill);padding:.7rem 1.1rem;font-family:inherit;font-weight:700;background:var(--card);color:var(--ink)" />
      <button class="btn" type="submit">Begin Adventure! 🚀</button>
    </form>
    <p style="margin-top:1.5rem;color:var(--ink-soft);font-size:.85rem">
      ${CONFIG.backend === 'firebase' ? 'Signs in with Google via Firebase.' : 'Demo mode — progress saved on this device. Connect Firebase in js/config.js for accounts.'}
    </p>
  </div>`;

  // World ticker: tap a badge to peek at what it teaches.
  el.querySelectorAll('.world-badge').forEach(b => b.addEventListener('click', () => {
    toast(`${b.dataset.worldName} — ${b.dataset.worldDesc}`, 2600);
  }));

  const form = el.querySelector('#name-form');
  let signingIn = false;
  const setBusy = busy => el.querySelectorAll('.role-card').forEach(b => {
    b.disabled = busy; b.style.opacity = busy ? '.5' : '';
  });
  const begin = async (name, role) => {
    if (signingIn) return; // one tap, one popup — repeat taps caused login loops
    signingIn = true; setBusy(true);
    try {
      user = await store.signIn(name, role);
    } catch (e) {
      toast(e.message, 4500);
      return;
    } finally { signingIn = false; setBusy(false); }
    if (!user) return;
    await applyDailyLogin();
    // Route by what the account actually is, not the button that was tapped.
    if (role === 'admin') {
      if (isAdminUser()) { go('#/admin'); return; }
      toast('This Google account is not an admin.', 3500);
      go(homeRoute()); return;
    }
    if (user.role !== role) {
      if (isAdminUser()) { // admins may open any dashboard directly
        go(role === 'student' ? '#/dashboard' : `#/${role}`); return;
      }
      toast(`This Google account is registered as ${user.role} — opening that dashboard.`, 3500);
    }
    await store.saveUser(user);
    go(homeRoute());
  };
  el.querySelectorAll('.role-card').forEach(b => b.addEventListener('click', () => {
    const role = b.dataset.role;
    if (role === 'student') { form.hidden = false; el.querySelector('#name-input').focus(); }
    else begin(role[0].toUpperCase() + role.slice(1), role);
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    begin(el.querySelector('#name-input').value.trim() || 'Adventurer', 'student');
  });
}

// ---------------- Student dashboard ----------------
export function dashboard(el) {
  ensureDailyMissions(user);
  const rec = recommendLesson(user);
  const missionsDone = user.missions.filter(m => m.done).length;
  const world = WORLDS.find(w => w.id === (rec?.lesson.worldId)) || WORLDS[0];
  el.innerHTML = `
  ${hud()}
  <div class="card card-tint" style="margin-top:1rem;display:flex;gap:1rem;align-items:center">
    <div style="font-size:3rem">🦌</div>
    <div>
      <h2 style="font-size:var(--fs-h2)">Selamat kembali, ${esc(user.name)}!</h2>
      <p style="color:var(--ink-soft)">${rec ? esc(rec.why) : 'You have completed every quest — legend! 🏆'}</p>
    </div>
  </div>
  ${rec ? `
  <button class="card" style="width:100%;text-align:left;border:3px solid var(--gold);cursor:pointer" id="continue-btn">
    <div style="display:flex;align-items:center;gap:1rem">
      <span style="font-size:2.4rem">${world.emoji}</span>
      <div>
        <strong class="display" style="font-size:1.15rem">▶ Continue: ${esc(rec.lesson.title)}</strong>
        <div style="color:var(--ink-soft);font-size:.88rem">${esc(world.name)} · +${rec.lesson.xp} XP · +${rec.lesson.coins} 🪙</div>
      </div>
    </div>
  </button>` : ''}
  <div class="card" style="display:flex;gap:1rem;align-items:center;justify-content:space-around;flex-wrap:wrap">
    <div style="text-align:center">
      <button class="chest-btn" id="chest" ${canOpenChest(user) ? '' : 'disabled'} aria-label="Daily treasure chest">🧰</button>
      <div style="font-weight:800;font-size:.85rem">${canOpenChest(user) ? 'Daily Treasure!' : 'Come back tomorrow!'}</div>
    </div>
    <div style="text-align:center">
      <button class="chest-btn" id="go-spin" aria-label="Lucky spin">🎡</button>
      <div style="font-weight:800;font-size:.85rem">${canSpin(user) ? 'Lucky Spin ready!' : 'Spin used today'}</div>
    </div>
  </div>
  <div class="card challenge-card">
    <h3 class="display">🎯 Daily Challenge</h3>
    <p style="margin:.4rem 0">${esc(user.challenge.text)}</p>
    <div class="challenge-progress"><span style="width:${(user.challenge.progress / user.challenge.target) * 100}%"></span></div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:.4rem">
      <span style="color:var(--ink-soft);font-size:.85rem">${user.challenge.progress}/${user.challenge.target}</span>
      ${user.challenge.done && !user.challenge.claimed
        ? `<button class="btn btn-purple btn-sm" id="claim-challenge">Claim 💎${user.challenge.gems} +${user.challenge.coins}🪙</button>`
        : user.challenge.claimed ? '<span class="pill">🎉 Claimed</span>' : `<span class="pill">💎${user.challenge.gems} +${user.challenge.coins}🪙</span>`}
    </div>
  </div>
  <div class="card">
    <h3 class="display">⭐ Today's Missions <span style="color:var(--ink-soft);font-size:.85rem">(${missionsDone}/${user.missions.length})</span></h3>
    <div id="mission-list"></div>
  </div>
  <div style="display:flex;gap:.8rem;flex-wrap:wrap">
    <button class="card" style="flex:1;min-width:220px;text-align:left;cursor:pointer" id="arena-btn">
      <div style="display:flex;align-items:center;gap:1rem">
        <span style="font-size:2rem">🏋️</span>
        <div>
          <strong class="display" style="font-size:1.05rem">Practice Arena</strong>
          <div style="color:var(--ink-soft);font-size:.85rem">No stakes — just chase your best combo!</div>
        </div>
      </div>
    </button>
    <button class="card" style="flex:1;min-width:220px;text-align:left;cursor:pointer" id="duel-btn">
      <div style="display:flex;align-items:center;gap:1rem">
        <span style="font-size:2rem">⚔️</span>
        <div>
          <strong class="display" style="font-size:1.05rem">Friend Duel</strong>
          <div style="color:var(--ink-soft);font-size:.85rem">Pass the tablet — best of 5!${user.duelWins ? ` 🏆 ${user.duelWins} won` : ''}</div>
        </div>
      </div>
    </button>
  </div>
  <div class="card">
    <h3 class="display">🏅 Achievements</h3>
    <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.6rem">
      ${achievementList(user).map(a => `
        <span class="pill" title="${esc(a.name)}" style="${a.owned ? '' : 'opacity:.35;filter:grayscale(1)'}">
          ${a.emoji} ${esc(a.name)}</span>`).join('')}
    </div>
  </div>`;
  renderMissions(el.querySelector('#mission-list'));
  el.querySelector('#continue-btn')?.addEventListener('click', () => go(`#/lesson/${rec.lesson.id}`));
  el.querySelector('#arena-btn').addEventListener('click', () => go('#/arena'));
  el.querySelector('#duel-btn').addEventListener('click', () => go('#/duel'));
  el.querySelector('#claim-challenge')?.addEventListener('click', async () => {
    await claimChallenge(user); dashboard(el);
  });
  el.querySelector('#chest')?.addEventListener('click', async () => {
    const loot = await openChest(user);
    if (loot) { await rewardModal('🧰✨', 'Treasure!', `You found ${loot.coins} 🪙 and ${loot.xp} XP inside!`); dashboard(el); }
  });
  el.querySelector('#go-spin')?.addEventListener('click', () => go('#/spin'));
}

// ---------------- Lucky Spin ----------------
export function spin(el) {
  const n = SPIN_PRIZES.length, seg = 360 / n;
  el.innerHTML = `${hud()}
  <h2 class="display" style="margin:1rem 0;text-align:center">🎡 Lucky Spin</h2>
  <div class="card" style="text-align:center">
    <div class="spin-pointer">🔻</div>
    <div class="spin-wheel" id="wheel">
      ${SPIN_PRIZES.map((p, i) => `<span class="spin-label" style="transform:rotate(${i * seg + seg / 2 - 90}deg) translate(56px,-8px)">${p.label}</span>`).join('')}
    </div>
    <button class="btn btn-gold" id="spin-btn" style="margin-top:1.4rem" ${canSpin(user) ? '' : 'disabled'}>
      ${canSpin(user) ? 'SPIN! 🎉' : 'Come back tomorrow!'}
    </button>
    <p style="color:var(--ink-soft);font-size:.85rem;margin-top:.6rem">One free spin every day — earned by showing up!</p>
  </div>`;
  el.querySelector('#spin-btn').addEventListener('click', async e => {
    e.target.disabled = true;
    const result = await doSpinAnimated(el.querySelector('#wheel'));
    if (result) {
      await rewardModal('🎡', 'You won!', `${result.prize.label} — lucky you!`);
      spin(el);
    }
  });
  async function doSpinAnimated(wheel) {
    const result = await doSpin(user);
    if (!result) return null;
    const seg = 360 / SPIN_PRIZES.length;
    // land pointer (top) on the winning segment
    wheel.style.transform = `rotate(${5 * 360 - (result.idx * seg + seg / 2)}deg)`;
    await new Promise(r => setTimeout(r, 3300));
    return result;
  }
}

function renderMissions(box) {
  box.innerHTML = user.missions.map(m => `
    <div class="mission ${m.done ? 'done' : ''}">
      <span>${m.done ? '✅' : '⬜'}</span>
      <span class="m-text">${esc(m.text)} <small style="color:var(--ink-soft)">(${m.progress}/${m.target})</small></span>
      <span class="m-reward">
        ${m.done && !m.claimed
          ? `<button class="btn btn-gold btn-sm" data-claim="${m.id}">Claim +${m.xp}XP</button>`
          : m.claimed ? '🎁 Claimed' : `+${m.xp}XP +${m.coins}🪙`}
      </span>
    </div>`).join('');
  box.querySelectorAll('[data-claim]').forEach(b => b.addEventListener('click', async () => {
    await claimMission(user, b.dataset.claim);
    renderMissions(box);
  }));
}

// ---------------- World map ----------------
export function worlds(el) {
  const pieces = user.mapPieces || [];
  el.innerHTML = `
  ${hud()}
  <h2 class="display" style="margin:1rem 0 .2rem;font-size:var(--fs-h2)">🗺️ Adventure Map</h2>
  <p style="color:var(--ink-soft)">Complete every lesson in a world to unlock the next!</p>
  <button class="card map-strip" id="map-story-btn" style="width:100%;text-align:left;cursor:pointer">
    <div style="display:flex;align-items:center;gap:.8rem">
      <span style="font-size:1.6rem">${user.mapComplete ? '🗺️✨' : '📜'}</span>
      <div style="flex:1">
        <strong class="display" style="font-size:1rem">Sang Kancil's Torn Map</strong>
        <div style="color:var(--ink-soft);font-size:.82rem">${pieces.length}/${WORLDS.length} pieces restored — tap to read the tale</div>
      </div>
    </div>
    <div class="map-pieces">
      ${WORLDS.map(w => `<span class="map-piece ${pieces.includes(w.id) ? 'restored' : ''}" title="${esc(w.name)}">${pieces.includes(w.id) ? w.emoji : '❔'}</span>`).join('')}
    </div>
  </button>
  <div class="worldmap">
    <svg class="trail-svg" preserveAspectRatio="none" viewBox="0 0 100 100">
      <path d="M 20 4 C 80 12, 80 18, 30 26 C -10 33, 90 40, 70 48 C 50 56, 10 62, 30 70 C 60 78, 80 84, 50 96" vector-effect="non-scaling-stroke"/>
    </svg>
    ${WORLDS.map(w => {
      const unlocked = user.unlockedWorlds.includes(w.id);
      const { done, total } = worldProgress(user, w.id);
      const complete = total > 0 && done === total;
      const current = unlocked && !complete;
      return `
      <button class="world-node ${complete ? 'done' : ''} ${current ? 'current' : ''} ${unlocked ? '' : 'locked'}"
        data-world="${w.id}" ${unlocked ? '' : 'disabled'} aria-label="${esc(w.name)}${unlocked ? '' : ', locked'}">
        <span class="w-emoji">${w.emoji}</span>
        <span>
          <span class="w-title" style="color:${w.color}">${esc(w.name)}</span><br>
          <span class="w-sub">${esc(w.desc)}</span>
        </span>
        ${unlocked
          ? `<span class="w-progress">${total ? `${done}/${total}` : 'soon!'}</span>`
          : '<span class="w-lock">🔒</span>'}
      </button>`;
    }).join('')}
  </div>`;
  el.querySelectorAll('.world-node:not(.locked)').forEach(n =>
    n.addEventListener('click', () => go(`#/world/${n.dataset.world}`)));
  el.querySelector('#map-story-btn').addEventListener('click', () => showMapStory(el));
}

function showMapStory(el) {
  const pieces = user.mapPieces || [];
  const root = document.getElementById('modal-root');
  const wrap = document.createElement('div');
  wrap.className = 'modal-backdrop';
  const beats = WORLDS.filter(w => pieces.includes(w.id)).map(w => MAP_STORY[w.id]).filter(Boolean);
  wrap.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Sang Kancil's Tale" style="text-align:left;max-width:520px">
      <div style="text-align:center;font-size:2.6rem">📜</div>
      <h2 class="display" style="text-align:center">Sang Kancil's Tale</h2>
      <div style="max-height:50vh;overflow-y:auto;margin:1rem 0">
        ${beats.length ? beats.map(b => `
          <p style="margin-bottom:.9rem"><b class="display">${esc(b.title)}</b><br>${esc(b.text)}</p>`).join('')
          : '<p style="color:var(--ink-soft)">Complete your first world to begin the tale…</p>'}
        ${user.mapComplete ? `<p style="margin-top:.5rem"><b class="display">${esc(MAP_FINALE.title)}</b><br>${esc(MAP_FINALE.text)}</p>` : ''}
      </div>
      <button class="btn btn-gold" id="close-story">Close</button>
    </div>`;
  root.appendChild(wrap);
  const close = () => wrap.remove();
  wrap.querySelector('#close-story').addEventListener('click', close);
  wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
}

export function worldDetail(el, worldId) {
  const w = WORLDS.find(x => x.id === worldId);
  const ls = LESSONS.filter(l => l.worldId === worldId);
  el.innerHTML = `
  ${hud()}
  <button class="btn btn-ghost btn-sm" data-route="#/worlds" style="margin:1rem 0">← Map</button>
  <div class="card card-tint" style="text-align:center">
    <div style="font-size:3.4rem">${w.emoji}</div>
    <h2 class="display">${esc(w.name)}</h2>
    <p style="color:var(--ink-soft)">${esc(w.desc)} · ${esc(w.subject)}</p>
  </div>
  ${ls.length ? ls.map(l => {
    const done = user.completedLessons.includes(l.id);
    const locked = l.prerequisite && !user.completedLessons.includes(l.prerequisite);
    return `
    <button class="card" style="width:100%;text-align:left;cursor:${locked ? 'not-allowed' : 'pointer'};opacity:${locked ? .55 : 1}"
      data-lesson="${l.id}" ${locked ? 'disabled' : ''}>
      <div style="display:flex;align-items:center;gap:1rem">
        <span style="font-size:1.8rem">${done ? '✅' : locked ? '🔒' : '📜'}</span>
        <div style="flex:1">
          <strong class="display">${esc(l.title)}</strong>
          <div style="color:var(--ink-soft);font-size:.85rem">${esc(l.kssr)}</div>
        </div>
        <span class="pill">${'⭐'.repeat(l.difficulty)} · +${l.xp}XP</span>
      </div>
    </button>`;
  }).join('') : '<div class="card">🚧 Quests for this world are being built by our curriculum team — coming soon!</div>'}`;
  el.querySelectorAll('[data-lesson]:not([disabled])').forEach(b =>
    b.addEventListener('click', () => go(`#/lesson/${b.dataset.lesson}`)));
}

// Mystery Box: 3 face-down cards, pick one, reveal a variable reward.
// Shards accumulate toward a free epic wardrobe item (see gamification.js).
function showMysteryBox(user) {
  return new Promise(resolve => {
    const rolls = [rollMysteryReward(), rollMysteryReward(), rollMysteryReward()];
    const root = document.getElementById('modal-root');
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="Mystery Box">
        <div style="font-size:2.4rem">🎁</div>
        <h2 class="display">Mystery Box!</h2>
        <p style="color:var(--ink-soft);margin:.3rem 0 0">Pick one card…</p>
        <div class="mystery-grid">
          ${rolls.map((r, i) => `
            <button class="mystery-card" data-idx="${i}" aria-label="Mystery card ${i + 1}">
              <div class="mc-inner">
                <div class="mc-face mc-back">❔</div>
                <div class="mc-face mc-front"><span class="mc-emoji">${r.emoji}</span><span>${esc(r.label)}</span></div>
              </div>
            </button>`).join('')}
        </div>
        <p id="mystery-result" style="min-height:1.4em;font-weight:800"></p>
        <button class="btn btn-gold" id="mystery-continue" hidden>Continue</button>
      </div>`;
    root.appendChild(wrap);
    sfx.spin();
    wrap.querySelectorAll('.mystery-card').forEach(card => {
      card.addEventListener('click', async () => {
        wrap.querySelectorAll('.mystery-card').forEach(c => c.disabled = true);
        card.classList.add('flipped');
        const roll = rolls[Number(card.dataset.idx)];
        sfx.chest();
        const epicWon = await claimMysteryReward(user, roll, CATALOG);
        const result = wrap.querySelector('#mystery-result');
        if (epicWon) {
          confetti(50);
          result.textContent = `+1 shard → ${SHARDS_FOR_EPIC} shards traded for ${epicWon.name}! 🌟`;
        } else {
          result.textContent = `You won ${roll.label}!` + (roll.type === 'shard' ? ` (${user.shards}/${SHARDS_FOR_EPIC} shards)` : '');
        }
        wrap.querySelector('#mystery-continue').hidden = false;
      });
    });
    wrap.querySelector('#mystery-continue').addEventListener('click', () => { wrap.remove(); resolve(); });
  });
}

// Hornbill pet perk: cross out one wrong option before the student answers.
function hornbillEliminate(opts, q) {
  if (equippedPetEffect(user) !== 'eliminate') return;
  const wrongIdx = q.options.map((_, i) => i).filter(i => i !== q.answer);
  const pick = wrongIdx[Math.floor(Math.random() * wrongIdx.length)];
  const btn = opts.children[pick];
  if (!btn) return;
  btn.disabled = true;
  btn.classList.add('eliminated');
  btn.innerHTML += ' <span class="elim-tag">🦜</span>';
}

// ---------------- Lesson flow: intro → learn → practice → game → quiz → boss → reward ----------------
export function lessonFlow(el, lessonId) {
  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) { go('#/worlds'); return; }
  const quiz = QUIZZES[lessonId] || [];
  let stage = 0, stepIdx = 0, quizIdx = 0, quizCorrect = 0, bossHp = 100, gameScore = 0, combo = 0;
  let bossWrong = 0, combo5Fired = false;

  const frame = inner => {
    el.innerHTML = `${hud()}
      <button class="btn btn-ghost btn-sm" data-route="#/world/${lesson.worldId}" style="margin:1rem 0">← Quit quest</button>
      <div class="card">${inner}</div>`;
  };

  const stages = {
    intro() {
      frame(`
        <div style="text-align:center;font-size:3rem">🦌</div>
        <h2 class="display" style="text-align:center">${esc(lesson.title)}</h2>
        <p class="lesson-step" style="margin:1rem 0">${esc(lesson.intro)}</p>
        <div style="display:flex;gap:.6rem;justify-content:center">
          <button class="btn btn-ghost" id="narrate">🔊 Listen</button>
          <button class="btn" id="next">Start Quest ▶</button>
        </div>`);
      el.querySelector('#narrate').addEventListener('click', () => speak(lesson.intro));
      el.querySelector('#next').addEventListener('click', () => { stage++; render(); });
    },
    learn() {
      const step = lesson.steps[stepIdx];
      frame(`
        <p style="color:var(--ink-soft);font-weight:800">📖 Learn — part ${stepIdx + 1} of ${lesson.steps.length}</p>
        <p class="lesson-step" style="margin:1rem 0">${step}</p>
        <div style="display:flex;gap:.6rem">
          <button class="btn btn-ghost" id="narrate">🔊</button>
          <button class="btn" id="next">${stepIdx + 1 < lesson.steps.length ? 'Next ▶' : 'Practice! ✏️'}</button>
        </div>`);
      el.querySelector('#narrate').addEventListener('click', () => speak(step));
      el.querySelector('#next').addEventListener('click', () => {
        if (++stepIdx < lesson.steps.length) render();
        else { stage++; render(); }
      });
    },
    practice() {
      const p = lesson.practice;
      frame(`
        <p style="color:var(--ink-soft);font-weight:800">✏️ Guided practice</p>
        <p class="lesson-step" style="margin:1rem 0">${esc(p.q)}</p>
        <div id="opts"></div>
        <button class="btn btn-purple btn-sm" id="hint">💡 Hint from Sang Kancil</button>`);
      const opts = el.querySelector('#opts');
      p.options.forEach((o, i) => {
        const b = document.createElement('button');
        b.className = 'quiz-option'; b.textContent = o;
        b.addEventListener('click', ev => {
          if (i === p.answer) {
            b.classList.add('correct'); sfx.correct(); flashEdge('good');
            floatText(ev.clientX, ev.clientY, '✓ Correct!');
            setTimeout(() => { stage++; render(); }, 700);
          } else {
            b.classList.add('wrong'); sfx.wrong(); flashEdge('bad');
            floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)');
            toast('Try again — use the hint!');
          }
        });
        opts.appendChild(b);
      });
      el.querySelector('#hint').addEventListener('click', () => rewardModal('🦌', 'Hint!', esc(p.hint)));
    },
    game() {
      frame(`<div id="game-mount"></div>`);
      gameForLesson(lesson, quiz)(el.querySelector('#game-mount'), async score => {
        gameScore = score;
        user.stats.gamesPlayed++;
        await missionProgress(user, 'game');
        await challengeProgress(user, 'games');
        await rewardModal('🎮', 'Game Complete!', `You scored ${Math.round(score * 100)}%! On to the quiz…`);
        stage++; render();
      });
    },
    quiz() {
      if (quizIdx >= quiz.length) { stage++; render(); return; }
      const q = quiz[quizIdx];
      frame(`
        <p style="color:var(--ink-soft);font-weight:800">🧠 Quiz — ${quizIdx + 1}/${quiz.length}</p>
        <p class="lesson-step" style="margin:1rem 0">${esc(q.q)}</p>
        <div id="opts"></div>
        <button class="btn btn-purple btn-sm" id="hint">💡 Hint</button>`);
      const opts = el.querySelector('#opts');
      q.options.forEach((o, i) => {
        const b = document.createElement('button');
        b.className = 'quiz-option'; b.textContent = o;
        b.addEventListener('click', async ev => {
          opts.querySelectorAll('button').forEach(x => x.disabled = true);
          recordAnswer(user, lessonId, i === q.answer);
          if (i === q.answer) {
            b.classList.add('correct'); quizCorrect++; combo++;
            sfx.correct(combo); flashEdge('good'); showCombo(combo);
            floatText(ev.clientX, ev.clientY, combo >= 3 ? `+5 XP 🔥` : '✓ +1');
            if (combo >= 3) user.xp += 5;
            if (combo >= 5 && !combo5Fired) { combo5Fired = true; await challengeProgress(user, 'combo5'); }
            await missionProgress(user, 'correct');
          } else {
            combo = 0; sfx.wrong(); flashEdge('bad');
            floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)');
            b.classList.add('wrong');
            opts.children[q.answer].classList.add('correct');
            toast(q.explain, 3200);
          }
          setTimeout(() => { quizIdx++; render(); }, i === q.answer ? 600 : 2200);
        });
        opts.appendChild(b);
      });
      hornbillEliminate(opts, q);
      el.querySelector('#hint').addEventListener('click', () => rewardModal('🦌', 'Hint!', esc(q.hint)));
    },
    boss() {
      // Named world boss: intro taunt → battle (taunts on block, flinch on
      // hit) → defeat pose. Questions reuse the lesson quiz, shuffled.
      const boss = BOSSES[lesson.worldId] || {
        name: 'Shadow Beast', emoji: '🐉', title: 'Guardian of the Quest',
        intro: 'None shall pass without proving their knowledge!',
        blocks: ['Blocked!'], hits: ['Argh!'], defeat: 'You win... this time.',
      };
      const pool = [...quiz].sort(() => Math.random() - 0.5);
      let bi = 0, met = false;
      const pick = arr => arr[Math.floor(Math.random() * arr.length)];

      const bossHead = (state, line) => `
        <div style="text-align:center">
          <div class="boss-avatar ${state}">${boss.emoji}</div>
          <div class="boss-name">${esc(boss.name)}</div>
          <div class="boss-title">${esc(boss.title)}</div>
          ${line ? `<p class="boss-taunt">“${esc(line)}”</p>` : ''}
        </div>`;

      const drawIntro = () => {
        frame(`
          ${bossHead('menace', boss.intro)}
          <div style="text-align:center;margin-top:1rem">
            <button class="btn" id="fight">⚔️ Fight!</button>
          </div>`);
        el.querySelector('#fight').addEventListener('click', () => { met = true; drawBoss(); });
      };

      const drawDefeat = () => {
        confetti(24);
        if (bossWrong === 0) challengeProgress(user, 'no_miss_boss');
        frame(`
          ${bossHead('defeated', boss.defeat)}
          <div style="text-align:center;margin-top:1rem">
            <button class="btn btn-gold" id="claim">🏆 Claim victory!</button>
          </div>`);
        el.querySelector('#claim').addEventListener('click', () => { stage++; render(); });
      };

      const drawBoss = (line, state = 'menace') => {
        const q = pool[bi % pool.length];
        frame(`
          ${bossHead(state, line)}
          <div class="boss-hp" style="margin:.8rem 0" role="progressbar" aria-label="Boss health" aria-valuenow="${bossHp}" aria-valuemax="100"><span style="width:${bossHp}%"></span></div>
          <p class="lesson-step" style="margin:.6rem 0">${esc(q.q)}</p>
          <div id="opts"></div>`);
        const opts = el.querySelector('#opts');
        q.options.forEach((o, i) => {
          const b = document.createElement('button');
          b.className = 'quiz-option'; b.textContent = o;
          b.addEventListener('click', ev => {
            bi++;
            if (i === q.answer) {
              const dmg = CONFIG.bossDamagePerCorrect + (equippedPetEffect(user) === 'bossdmg' ? 10 : 0);
              bossHp = Math.max(0, bossHp - dmg);
              sfx.bossHit(); flashEdge('good');
              floatText(ev.clientX, ev.clientY, `💥 -${dmg}`, 'var(--sunset-deep)');
              recordAnswer(user, lessonId, true);
              if (bossHp <= 0) drawDefeat();
              else drawBoss(pick(boss.hits), 'hit');
            } else {
              bossWrong++;
              flashEdge('bad'); sfx.wrong();
              floatText(ev.clientX, ev.clientY, '🛡️', 'var(--lava)');
              toast(q.explain, 2800);
              recordAnswer(user, lessonId, false);
              drawBoss(pick(boss.blocks), 'block');
            }
          });
          opts.appendChild(b);
        });
        hornbillEliminate(opts, q);
      };
      met ? drawBoss() : drawIntro();
    },
    async reward() {
      const accuracy = quiz.length ? quizCorrect / quiz.length : 1;
      const bonus = Math.round(lesson.xp * 0.5 * accuracy + lesson.xp * 0.3 * gameScore);
      const firstTime = !user.completedLessons.includes(lesson.id);
      if (firstTime) user.completedLessons.push(lesson.id);
      await missionProgress(user, 'lesson');
      await grant(user, {
        xp: (firstTime ? lesson.xp : Math.round(lesson.xp / 4)) + bonus,
        coins: firstTime ? lesson.coins : 5,
        gems: accuracy === 1 ? 1 : 0,
        reason: '(quest complete!)',
      });
      await maybeUnlockNextWorld(user, lesson.worldId);
      await maybeRestoreMapPiece(user, lesson.worldId);
      logActivity(user, {
        lessonId: lesson.id, title: lesson.title, worldId: lesson.worldId,
        subject: WORLDS.find(w => w.id === lesson.worldId)?.subject,
        accuracy: Math.round(accuracy * 100),
      });
      if (accuracy === 1) await challengeProgress(user, 'perfect_quiz');
      await challengeProgress(user, 'lessons');
      confetti(40);
      await showMysteryBox(user);
      frame(`
        <div style="text-align:center">
          <div style="font-size:4rem">🏆</div>
          <h2 class="display">Quest Complete!</h2>
          <p class="lesson-step" style="margin:.8rem 0">
            Quiz accuracy: <b>${Math.round(accuracy * 100)}%</b> · Game: <b>${Math.round(gameScore * 100)}%</b><br>
            ${accuracy === 1 ? 'PERFECT! You earned a 💎 gem!' : 'Great effort, adventurer!'}
          </p>
          <p style="color:var(--ink-soft);margin-bottom:1rem"><b>Summary:</b> ${lesson.steps.map(s => s.replace(/<[^>]+>/g, '')).join(' ')}</p>
          <div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-green" data-route="#/world/${lesson.worldId}">Back to ${esc(WORLDS.find(w => w.id === lesson.worldId).name)}</button>
            <button class="btn" data-route="#/dashboard">Home 🏝️</button>
          </div>
        </div>`);
    },
  };

  const order = ['intro', 'learn', 'practice', 'game', 'quiz', 'boss', 'reward'];
  const render = () => stages[order[stage]]();
  render();
}

// ---------------- Practice Arena: no-stakes endless drilling ----------------
export function arenaHome(el) {
  const done = LESSONS.filter(l => user.completedLessons.includes(l.id));
  el.innerHTML = `${hud()}
  <h2 class="display" style="margin:1rem 0">🏋️ Practice Arena</h2>
  <p style="color:var(--ink-soft)">Pick any quest you've finished and drill it forever — no boss, no stakes, just your best combo.</p>
  ${done.length ? done.map(l => {
    const world = WORLDS.find(w => w.id === l.worldId);
    const best = (user.arenaBest || {})[l.id] || 0;
    return `
    <button class="card arena-pick" style="width:100%;text-align:left;cursor:pointer" data-lesson="${l.id}">
      <div style="display:flex;align-items:center;gap:1rem">
        <span style="font-size:1.8rem">${world.emoji}</span>
        <div style="flex:1">
          <strong class="display">${esc(l.title)}</strong>
          <div style="color:var(--ink-soft);font-size:.82rem">${esc(world.name)}</div>
        </div>
        <span class="pill">🔥 best ×${best}</span>
      </div>
    </button>`;
  }).join('') : '<div class="card">Finish your first quest to unlock practice drills here!</div>'}`;
  el.querySelectorAll('.arena-pick').forEach(b =>
    b.addEventListener('click', () => go(`#/arena/${b.dataset.lesson}`)));
}

export function arenaPlay(el, lessonId) {
  const lesson = LESSONS.find(l => l.id === lessonId);
  const pool = QUIZZES[lessonId] || [];
  if (!lesson || !pool.length) { go('#/arena'); return; }
  const best = (user.arenaBest || {})[lessonId] || 0;
  let combo = 0, sessionBest = 0, deck = [], qIdx = 0;

  const reshuffle = () => { deck = [...pool].sort(() => Math.random() - 0.5); qIdx = 0; };
  reshuffle();

  const render = () => {
    if (qIdx >= deck.length) reshuffle();
    const q = deck[qIdx];
    el.innerHTML = `${hud()}
      <div style="display:flex;align-items:center;gap:.6rem;margin:1rem 0">
        <button class="btn btn-ghost btn-sm" id="quit-arena">← Exit</button>
        <span class="pill">🔥 combo ×${combo}</span>
        <span class="pill">🏆 best ×${Math.max(best, sessionBest)}</span>
      </div>
      <div class="card">
        <p style="color:var(--ink-soft);font-weight:800">${esc(lesson.title)} — practice</p>
        <p class="lesson-step" style="margin:1rem 0">${esc(q.q)}</p>
        <div id="opts"></div>
      </div>`;
    el.querySelector('#quit-arena').addEventListener('click', async () => {
      if (sessionBest > best) {
        user.arenaBest[lessonId] = sessionBest;
        await store.saveUser(user);
      }
      go('#/arena');
    });
    const opts = el.querySelector('#opts');
    q.options.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'quiz-option'; b.textContent = o;
      b.addEventListener('click', async ev => {
        opts.querySelectorAll('button').forEach(x => x.disabled = true);
        if (i === q.answer) {
          combo++; sessionBest = Math.max(sessionBest, combo);
          sfx.correct(combo); flashEdge('good'); showCombo(combo);
          floatText(ev.clientX, ev.clientY, '✓ +1');
          if (combo > 0 && combo % 5 === 0) sfx.levelUp();
          if (sessionBest > best && sessionBest === combo) {
            floatText(ev.clientX, ev.clientY - 40, '🏆 New best!', 'var(--gold-deep)');
          }
        } else {
          b.classList.add('wrong'); opts.children[q.answer].classList.add('correct');
          sfx.wrong(); flashEdge('bad');
          floatText(ev.clientX, ev.clientY, '✗ combo lost', 'var(--lava)');
          toast(q.explain, 2400);
          combo = 0;
        }
        qIdx++;
        setTimeout(render, i === q.answer ? 500 : 1600);
      });
      opts.appendChild(b);
    });
  };
  render();
}

// ---------------- Friend Duel: same-device pass-and-play, best of 5 ----------------
// No second account is ever created — Player 2 is just a display name for
// this session. Nothing here touches coins/XP; it's pure bragging rights.
export function duelHome(el) {
  const done = LESSONS.filter(l => user.completedLessons.includes(l.id));
  const ROUNDS = 5;
  let lesson = null, deck = [], roundIdx = 0, scoreP1 = 0, scoreP2 = 0, p2name = 'Friend';
  let roundAnswered = { p1: null, p2: null };

  const frame = inner => { el.innerHTML = `${hud()}<div class="card">${inner}</div>`; };

  function renderLocalSetup() {
    el.innerHTML = `${hud()}
    <button class="btn btn-ghost btn-sm" id="back-to-mode" style="margin:1rem 0">← Back</button>
    <h2 class="display" style="margin:0 0 1rem">📱 Same Tablet — Pass &amp; Play</h2>
    <p style="color:var(--ink-soft)">Pick a topic you've mastered, then pass the tablet for a best-of-5 showdown. No accounts, no stakes — just bragging rights!</p>
    <div class="card">
      <label style="font-weight:800;display:block;margin-bottom:.4rem">Friend's name</label>
      <input id="p2-name" type="text" maxlength="16" placeholder="e.g. Aiman"
        style="width:100%;border:3px solid var(--line);border-radius:var(--r-pill);padding:.6rem 1rem;font-family:inherit;font-weight:700;background:var(--card);color:var(--ink);box-sizing:border-box" />
    </div>
    ${done.length ? done.map(l => {
      const world = WORLDS.find(w => w.id === l.worldId);
      return `
      <button class="card duel-pick" style="width:100%;text-align:left;cursor:pointer" data-lesson="${l.id}">
        <div style="display:flex;align-items:center;gap:1rem">
          <span style="font-size:1.8rem">${world.emoji}</span>
          <div style="flex:1"><strong class="display">${esc(l.title)}</strong>
            <div style="color:var(--ink-soft);font-size:.82rem">${esc(world.name)}</div></div>
          <span class="pill">Pick ▶</span>
        </div>
      </button>`;
    }).join('') : '<div class="card">Finish a quest first to unlock duel topics!</div>'}`;
    el.querySelector('#back-to-mode').addEventListener('click', renderModeChoice);
    el.querySelectorAll('.duel-pick').forEach(b => b.addEventListener('click', () => {
      lesson = LESSONS.find(l => l.id === b.dataset.lesson);
      const nameInput = el.querySelector('#p2-name').value.trim();
      p2name = nameInput || 'Friend';
      deck = [...(QUIZZES[lesson.id] || [])].sort(() => Math.random() - 0.5);
      roundIdx = 0; scoreP1 = 0; scoreP2 = 0;
      renderPassGate('p1');
    }));
  }

  function currentQuestion() {
    if (roundIdx > 0 && roundIdx % deck.length === 0) deck = [...deck].sort(() => Math.random() - 0.5);
    return deck[roundIdx % deck.length];
  }

  function renderPassGate(who) {
    const name = who === 'p1' ? user.name : p2name;
    const emoji = who === 'p1' ? '🧑‍🚀' : '🧒';
    frame(`
      <div style="text-align:center">
        <p style="color:var(--ink-soft);font-weight:800">Round ${roundIdx + 1} of ${ROUNDS}</p>
        <div style="font-size:3rem;margin:.6rem 0">${emoji}</div>
        <h3 class="display">Pass the tablet to<br>${esc(name)}!</h3>
        <p style="color:var(--ink-soft);margin:.6rem 0 1rem">No peeking, ${who === 'p1' ? esc(p2name) : esc(user.name)}! 🙈</p>
        <button class="btn btn-purple" id="reveal">I'm ${esc(name)} — Show my question! 👀</button>
      </div>`);
    el.querySelector('#reveal').addEventListener('click', () => renderQuestion(who));
  }

  function renderQuestion(who) {
    const q = currentQuestion();
    const name = who === 'p1' ? user.name : p2name;
    frame(`
      <p style="color:var(--ink-soft);font-weight:800">${esc(name)}'s turn — Round ${roundIdx + 1}/${ROUNDS}</p>
      <p class="lesson-step" style="margin:1rem 0">${esc(q.q)}</p>
      <div id="opts"></div>`);
    const opts = el.querySelector('#opts');
    q.options.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'quiz-option'; b.textContent = o;
      b.addEventListener('click', ev => {
        opts.querySelectorAll('button').forEach(x => x.disabled = true);
        const correct = i === q.answer;
        if (correct) { b.classList.add('correct'); sfx.correct(); flashEdge('good'); floatText(ev.clientX, ev.clientY, '✓'); }
        else { b.classList.add('wrong'); opts.children[q.answer].classList.add('correct'); sfx.wrong(); flashEdge('bad'); floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)'); }
        roundAnswered[who] = correct;
        setTimeout(() => {
          if (who === 'p1') renderPassGate('p2');
          else finishRound();
        }, 900);
      });
      opts.appendChild(b);
    });
  }

  function finishRound() {
    if (roundAnswered.p1) scoreP1++;
    if (roundAnswered.p2) scoreP2++;
    frame(`
      <div style="text-align:center">
        <h3 class="display">Round ${roundIdx + 1} result</h3>
        <div style="display:flex;justify-content:center;gap:2rem;margin:1rem 0">
          <div><div style="font-size:2rem">${roundAnswered.p1 ? '✅' : '❌'}</div><b>${esc(user.name)}</b></div>
          <div style="font-size:1.6rem;color:var(--ink-soft);align-self:center">vs</div>
          <div><div style="font-size:2rem">${roundAnswered.p2 ? '✅' : '❌'}</div><b>${esc(p2name)}</b></div>
        </div>
        <p class="pill" style="font-size:1rem">Score: ${scoreP1} – ${scoreP2}</p>
        <button class="btn" id="next-round" style="margin-top:1rem">${roundIdx + 1 < ROUNDS ? 'Next round ▶' : 'See final result 🏆'}</button>
      </div>`);
    el.querySelector('#next-round').addEventListener('click', async () => {
      roundIdx++; roundAnswered = { p1: null, p2: null };
      if (roundIdx < ROUNDS) renderPassGate('p1');
      else await renderResults();
    });
  }

  async function renderResults() {
    const winner = scoreP1 === scoreP2 ? null : (scoreP1 > scoreP2 ? user.name : p2name);
    if (scoreP1 > scoreP2) { user.duelWins = (user.duelWins || 0) + 1; await store.saveUser(user); }
    confetti(50); sfx.levelUp();
    frame(`
      <div style="text-align:center">
        <div style="font-size:4rem">${winner ? '🏆' : '🤝'}</div>
        <h2 class="display">${winner ? `${esc(winner)} wins!` : "It's a tie!"}</h2>
        <p class="lesson-step" style="margin:.8rem 0">Final score: <b>${esc(user.name)} ${scoreP1} – ${scoreP2} ${esc(p2name)}</b></p>
        <p style="color:var(--ink-soft)">${winner ? 'Great match — challenge them again anytime!' : 'An even match! Run it back?'}</p>
        <div style="display:flex;gap:.6rem;justify-content:center;margin-top:1rem;flex-wrap:wrap">
          <button class="btn btn-purple" id="rematch">⚔️ Rematch</button>
          <button class="btn" data-route="#/dashboard">Home 🏝️</button>
        </div>
      </div>`);
    el.querySelector('#rematch').addEventListener('click', renderLocalSetup);
  }

  // ---------------- Online mode: two devices, one shared Firestore room ----------------
  let duelUnsub = null;
  const stopWatching = () => { if (duelUnsub) { duelUnsub(); duelUnsub = null; } };

  function renderModeChoice() {
    stopWatching();
    el.innerHTML = `${hud()}
    <h2 class="display" style="margin:1rem 0">⚔️ Friend Duel</h2>
    <p style="color:var(--ink-soft)">No accounts, no stakes — just bragging rights! Pick how you want to play:</p>
    <button class="card" style="width:100%;text-align:left;cursor:pointer" id="mode-local">
      <div style="display:flex;align-items:center;gap:1rem">
        <span style="font-size:2rem">📱</span>
        <div><strong class="display">Same tablet</strong>
          <div style="color:var(--ink-soft);font-size:.85rem">Pass the tablet back and forth — works offline.</div></div>
      </div>
    </button>
    <button class="card" style="width:100%;text-align:left;cursor:pointer" id="mode-online" ${CONFIG.backend !== 'firebase' ? 'disabled' : ''}>
      <div style="display:flex;align-items:center;gap:1rem">
        <span style="font-size:2rem">🌐</span>
        <div><strong class="display">Online — different devices</strong>
          <div style="color:var(--ink-soft);font-size:.85rem">${CONFIG.backend === 'firebase' ? 'Invite a friend with a private 6-letter code.' : 'Needs Firebase — ask a grown-up to connect it.'}</div></div>
      </div>
    </button>`;
    el.querySelector('#mode-local').addEventListener('click', renderLocalSetup);
    el.querySelector('#mode-online')?.addEventListener('click', renderOnlineChoice);
  }

  function renderOnlineChoice() {
    el.innerHTML = `${hud()}
    <button class="btn btn-ghost btn-sm" id="back-to-mode" style="margin:1rem 0">← Back</button>
    <h2 class="display" style="margin:0 0 1rem">🌐 Online Duel</h2>
    <button class="card" style="width:100%;text-align:left;cursor:pointer" id="go-create">
      <div style="display:flex;align-items:center;gap:1rem"><span style="font-size:2rem">🎫</span>
        <div><strong class="display">Host a duel</strong><div style="color:var(--ink-soft);font-size:.85rem">Pick a topic, get a code, share it with your friend.</div></div></div>
    </button>
    <button class="card" style="width:100%;text-align:left;cursor:pointer" id="go-join">
      <div style="display:flex;align-items:center;gap:1rem"><span style="font-size:2rem">🔑</span>
        <div><strong class="display">Join with a code</strong><div style="color:var(--ink-soft);font-size:.85rem">Your friend sends you their 6-letter code.</div></div></div>
    </button>`;
    el.querySelector('#back-to-mode').addEventListener('click', renderModeChoice);
    el.querySelector('#go-create').addEventListener('click', renderCreateDuelSetup);
    el.querySelector('#go-join').addEventListener('click', renderJoinCodeEntry);
  }

  function renderCreateDuelSetup() {
    el.innerHTML = `${hud()}
    <button class="btn btn-ghost btn-sm" id="back-to-online" style="margin:1rem 0">← Back</button>
    <h2 class="display" style="margin:0 0 1rem">🎫 Host a Duel</h2>
    <p style="color:var(--ink-soft)">Pick a topic you've mastered — your friend will answer the same questions on their own device.</p>
    ${done.length ? done.map(l => {
      const world = WORLDS.find(w => w.id === l.worldId);
      return `
      <button class="card duel-pick" style="width:100%;text-align:left;cursor:pointer" data-lesson="${l.id}">
        <div style="display:flex;align-items:center;gap:1rem">
          <span style="font-size:1.8rem">${world.emoji}</span>
          <div style="flex:1"><strong class="display">${esc(l.title)}</strong>
            <div style="color:var(--ink-soft);font-size:.82rem">${esc(world.name)}</div></div>
          <span class="pill">Host ▶</span>
        </div>
      </button>`;
    }).join('') : '<div class="card">Finish a quest first to unlock duel topics!</div>'}`;
    el.querySelector('#back-to-online').addEventListener('click', renderOnlineChoice);
    el.querySelectorAll('.duel-pick').forEach(b => b.addEventListener('click', async () => {
      const l = LESSONS.find(x => x.id === b.dataset.lesson);
      const pool = QUIZZES[l.id] || [];
      const order = Array.from({ length: ROUNDS }, (_, i) => i % pool.length);
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      try {
        const code = await store.createDuel(user.name, l.id, order);
        renderOnlineWaiting(code, l);
      } catch (e) { toast(e.message, 4000); }
    }));
  }

  function renderJoinCodeEntry() {
    el.innerHTML = `${hud()}
    <button class="btn btn-ghost btn-sm" id="back-to-online" style="margin:1rem 0">← Back</button>
    <h2 class="display" style="margin:0 0 1rem">🔑 Join a Duel</h2>
    <div class="card">
      <label style="font-weight:800;display:block;margin-bottom:.4rem">Enter your friend's code</label>
      <form id="join-form" style="display:flex;gap:.5rem;flex-wrap:wrap">
        <input id="join-code" maxlength="6" placeholder="e.g. K7XM2P" autocapitalize="characters" autocomplete="off"
          style="border:3px solid var(--line);border-radius:var(--r-pill);padding:.6rem 1rem;font-family:var(--font-display);font-weight:800;letter-spacing:.2em;text-transform:uppercase;width:11ch;text-align:center;background:var(--card);color:var(--ink)" />
        <button class="btn btn-green" type="submit">Join ▶</button>
      </form>
      <p id="join-msg" style="color:var(--lava);font-weight:700;margin-top:.6rem"></p>
    </div>`;
    el.querySelector('#back-to-online').addEventListener('click', renderOnlineChoice);
    el.querySelector('#join-form').addEventListener('submit', async e => {
      e.preventDefault();
      const code = el.querySelector('#join-code').value.trim().toUpperCase();
      if (!code) return;
      try {
        await store.joinDuel(code, user.name);
        startOnlineSession(code, 'guest'); // lessonId/questions come from the synced doc
      } catch (e) { el.querySelector('#join-msg').textContent = e.message; }
    });
  }

  function renderOnlineWaiting(code, lesson) {
    frame(`
      <div style="text-align:center">
        <p style="color:var(--ink-soft);font-weight:800">Share this code with your friend</p>
        <div class="display" style="font-size:2.4rem;letter-spacing:.3em;font-weight:800;color:var(--magic-deep);margin:.6rem 0">${esc(code)}</div>
        <p style="color:var(--ink-soft)">Topic: <b>${esc(lesson.title)}</b></p>
        <div style="margin-top:1rem;font-size:1.4rem">⏳ Waiting for your friend to join…</div>
      </div>`);
    startOnlineSession(code, 'host');
  }

  // Reactive render: the UI is a pure function of the latest duel document,
  // so both devices re-render themselves whenever anything changes — no
  // manual state machine to keep in sync between two separate clients.
  function startOnlineSession(code, myRole) {
    stopWatching();
    const oppRole = myRole === 'host' ? 'guest' : 'host';
    let lastRound = -1;
    duelUnsub = store.watchDuel(code, data => {
      if (!data) { frame('<p>This duel could not be found — it may have ended.</p>'); return; }
      if (data.status === 'waiting') return; // host's own waiting screen already showing
      if (data.status === 'finished') { stopWatching(); renderOnlineResults(data, myRole, code); return; }
      if (data.currentRound !== lastRound) lastRound = data.currentRound;
      const roundAnswers = (data.answers && data.answers[data.currentRound]) || {};
      const meAnswered = !!roundAnswers[myRole];
      const oppAnswered = !!roundAnswers[oppRole];
      const oppName = myRole === 'host' ? data.guestName : data.hostName;
      if (meAnswered && oppAnswered) renderOnlineRoundResult(data, myRole, oppRole, code);
      else if (meAnswered) renderWaitingForOpponent(oppName, data, code);
      else renderOnlineQuestion(data, myRole, code);
    });
  }

  function renderOnlineQuestion(data, myRole, code) {
    const pool = QUIZZES[data.lessonId] || [];
    const q = pool[data.questionOrder[data.currentRound]];
    const oppName = myRole === 'host' ? data.guestName : data.hostName;
    frame(`
      <p style="color:var(--ink-soft);font-weight:800">Round ${data.currentRound + 1} of ${ROUNDS} — vs ${esc(oppName || '…')}</p>
      <p class="lesson-step" style="margin:1rem 0">${esc(q.q)}</p>
      <div id="opts"></div>`);
    const opts = el.querySelector('#opts');
    q.options.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'quiz-option'; b.textContent = o;
      b.addEventListener('click', async ev => {
        opts.querySelectorAll('button').forEach(x => x.disabled = true);
        const correct = i === q.answer;
        if (correct) { b.classList.add('correct'); sfx.correct(); flashEdge('good'); floatText(ev.clientX, ev.clientY, '✓'); }
        else { b.classList.add('wrong'); opts.children[q.answer].classList.add('correct'); sfx.wrong(); flashEdge('bad'); floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)'); }
        await store.submitDuelAnswer(code, myRole, data.currentRound, correct);
      });
      opts.appendChild(b);
    });
  }

  function renderWaitingForOpponent(oppName, data, code) {
    frame(`
      <div style="text-align:center">
        <p style="color:var(--ink-soft);font-weight:800">Round ${data.currentRound + 1} of ${ROUNDS}</p>
        <div style="font-size:2.4rem;margin:.6rem 0">⏳</div>
        <p>Answer locked in! Waiting for <b>${esc(oppName || 'your friend')}</b>…</p>
      </div>`);
  }

  function tallyScores(data) {
    let h = 0, g = 0;
    Object.values(data.answers || {}).forEach(r => { if (r.host?.correct) h++; if (r.guest?.correct) g++; });
    return { h, g };
  }

  function renderOnlineRoundResult(data, myRole, oppRole, code) {
    const { h, g } = tallyScores(data);
    const roundAnswers = data.answers[data.currentRound];
    const oppName = myRole === 'host' ? data.guestName : data.hostName;
    const isLast = data.currentRound + 1 >= ROUNDS;
    frame(`
      <div style="text-align:center">
        <h3 class="display">Round ${data.currentRound + 1} result</h3>
        <div style="display:flex;justify-content:center;gap:2rem;margin:1rem 0">
          <div><div style="font-size:2rem">${roundAnswers[myRole].correct ? '✅' : '❌'}</div><b>You</b></div>
          <div style="font-size:1.6rem;color:var(--ink-soft);align-self:center">vs</div>
          <div><div style="font-size:2rem">${roundAnswers[oppRole].correct ? '✅' : '❌'}</div><b>${esc(oppName)}</b></div>
        </div>
        <p class="pill" style="font-size:1rem">Score: ${myRole === 'host' ? `${h} – ${g}` : `${g} – ${h}`}</p>
        ${myRole === 'host'
          ? `<button class="btn" id="next-round" style="margin-top:1rem">${isLast ? 'See final result 🏆' : 'Next round ▶'}</button>`
          : `<p style="color:var(--ink-soft);margin-top:1rem">Waiting for ${esc(data.hostName)} to continue…</p>`}
      </div>`);
    el.querySelector('#next-round')?.addEventListener('click', async () => {
      if (isLast) await store.finishDuel(code);
      else await store.advanceDuelRound(code, data.currentRound + 1);
    });
  }

  async function renderOnlineResults(data, myRole, code) {
    const { h, g } = tallyScores(data);
    const myScore = myRole === 'host' ? h : g;
    const oppScore = myRole === 'host' ? g : h;
    const oppName = myRole === 'host' ? data.guestName : data.hostName;
    const iWon = myScore > oppScore, tie = myScore === oppScore;
    if (iWon) { user.duelWins = (user.duelWins || 0) + 1; await store.saveUser(user); }
    confetti(iWon ? 50 : 20); sfx.levelUp();
    frame(`
      <div style="text-align:center">
        <div style="font-size:4rem">${tie ? '🤝' : iWon ? '🏆' : '🎮'}</div>
        <h2 class="display">${tie ? "It's a tie!" : iWon ? 'You win!' : `${esc(oppName)} wins!`}</h2>
        <p class="lesson-step" style="margin:.8rem 0">Final score: <b>You ${myScore} – ${oppScore} ${esc(oppName)}</b></p>
        <p style="color:var(--ink-soft)">${iWon ? 'Great match — challenge them again anytime!' : tie ? 'An even match! Run it back?' : 'Good game — you\'ll get them next time!'}</p>
        <div style="display:flex;gap:.6rem;justify-content:center;margin-top:1rem;flex-wrap:wrap">
          <button class="btn" data-route="#/dashboard">Home 🏝️</button>
        </div>
      </div>`);
  }

  // Safety net: if the player navigates away (Home, back button, etc.)
  // while a Firestore listener is still live, drop it — otherwise a late
  // snapshot could overwrite whatever page they've moved on to.
  const onHashChange = () => {
    if (!location.hash.startsWith('#/duel')) { stopWatching(); window.removeEventListener('hashchange', onHashChange); }
  };
  window.addEventListener('hashchange', onHashChange);

  renderModeChoice();
}

// ---------------- Missions page ----------------
export function missions(el) {
  ensureDailyMissions(user);
  el.innerHTML = `${hud()}
    <h2 class="display" style="margin:1rem 0">⭐ Daily Missions</h2>
    <div class="card"><div id="mission-list"></div></div>
    <div class="card card-tint">
      <h3 class="display">🔥 Streak: ${user.streak} day${user.streak === 1 ? '' : 's'}</h3>
      <p style="color:var(--ink-soft)">Come back every day to grow your streak and earn bonus coins (+${CONFIG.streakBonusCoins}/day)!</p>
    </div>`;
  renderMissions(el.querySelector('#mission-list'));
}

// ---------------- Character editor ----------------
function partPreview(p) {
  if (p.type === 'skin') return `<span class="swatch" style="background:${p.c}"></span>`;
  if (p.type === 'shirt' || p.type === 'pants') return `<span class="swatch" style="background:${p.c}"></span>`;
  if (p.type === 'hair') return `<span class="swatch" style="background:${p.c};border-radius:50% 50% 30% 30%"></span>`;
  if (p.type === 'pet') return `<span style="font-size:2rem">${p.emoji}</span>`;
  if (p.type === 'wings') return `<span style="font-size:1.8rem">🪽</span>`;
  const icons = { hat: { songkok: '🎩', cap: '🧢', crown: '👑', wizard: '🧙', tanjak: '👳' }, glasses: { shades: '🕶️', round: '👓' }, emote: { jump: '🤸', spin: '🌀', jelly: '🪼' } };
  return `<span style="font-size:1.8rem">${(icons[p.type] || {})[p.style || p.anim] || '✨'}</span>`;
}

export function avatar(el, _m, activeTab = 'shirt') {
  const refund = migrateWardrobe(user);
  if (refund) { store.saveUser(user); toast(`Wardrobe upgraded! ${refund} 🪙 refunded for retired items`); }

  const render = () => {
    const parts = CATALOG.filter(p => p.type === activeTab && (!p.storyOnly || user.owned.includes(p.id)));
    el.innerHTML = `${hud()}
    <h2 class="display" style="margin:1rem 0">🎭 Hero Studio</h2>
    <div class="editor">
      <div class="stage">
        <div id="hero-holder">${user.photoURL ? `<img src="${user.photoURL}" class="hero-photo" alt="Your photo">` : renderAvatar(user)}</div>
        <div class="podium"></div>
        <div class="hero-name">${esc(user.name)}</div>
        ${user.photoURL
          ? `<button class="btn btn-ghost btn-sm" id="remove-photo" style="margin-top:.6rem">🎭 Back to cartoon hero</button>`
          : `<button class="btn btn-purple btn-sm" id="play-emote" style="margin-top:.6rem">🎉 Emote!</button>`}
        <div style="margin-top:.5rem">
          <button class="btn btn-ghost btn-sm" id="upload-photo">📷 ${user.photoURL ? 'Change' : 'Use my own'} photo</button>
          <input type="file" id="photo-input" accept="image/*" hidden />
        </div>
      </div>
      <div>
        <div class="cat-tabs" role="tablist" aria-label="Item categories">
          ${CATEGORIES.map(c => `
            <button class="cat-tab ${c.type === activeTab ? 'active' : ''}" data-tab="${c.type}" role="tab" aria-selected="${c.type === activeTab}">
              <span class="ct-icon">${c.icon}</span>${c.name}</button>`).join('')}
        </div>
        <p style="color:var(--ink-soft);font-size:.82rem;margin:0 0 .8rem">Every item is earned with 🪙 from learning — never real money.</p>
        <div class="part-grid">
          ${parts.map(p => {
            const owned = user.owned.includes(p.id);
            const equipped = user.equipped[p.type] === p.id;
            const removable = equipped && !(p.type in DEFAULT_EQUIP_LOCK);
            return `
            <div class="part-card r-${p.rarity} ${equipped ? 'equipped' : ''}">
              <div class="p-preview">${partPreview(p)}</div>
              <div class="p-name">${esc(p.name)}</div>
              <div class="p-rarity">${p.rarity}</div>
              ${p.effectDesc ? `<div class="p-effect">✨ ${esc(p.effectDesc)}</div>` : ''}
              <button class="btn btn-sm ${owned ? 'btn-green' : 'btn-gold'}" data-part="${p.id}" style="margin-top:.4rem"
                ${!owned && user.coins < p.price ? 'disabled' : ''}>
                ${equipped ? (removable ? 'Take off' : 'Wearing') : owned ? 'Wear' : p.price === 0 ? 'Free' : `${p.price} 🪙`}
              </button>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;

    el.querySelectorAll('[data-tab]').forEach(b =>
      b.addEventListener('click', () => { activeTab = b.dataset.tab; render(); }));

    el.querySelector('#play-emote')?.addEventListener('click', () => {
      const em = findPart(user.equipped.emote) || findPart('emote-jump');
      const svg = el.querySelector('.stage .hero-svg');
      svg.classList.remove('emote-jump', 'emote-spin', 'emote-jelly');
      void svg.getBoundingClientRect(); // restart animation
      svg.classList.add(`emote-${em.anim}`);
      sfx.levelUp();
    });
    el.querySelector('#remove-photo')?.addEventListener('click', async () => {
      user.photoURL = null;
      await store.saveUser(user);
      render();
    });
    el.querySelector('#upload-photo').addEventListener('click', () => el.querySelector('#photo-input').click());
    el.querySelector('#photo-input').addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const dataUrl = await fileToAvatarDataURL(file);
        user.photoURL = dataUrl;
        await store.saveUser(user);
        toast('📷 Photo updated!');
        render();
      } catch (err) { toast(err.message, 3500); }
    });

    el.querySelectorAll('[data-part]').forEach(b => b.addEventListener('click', async () => {
      const p = findPart(b.dataset.part);
      if (!user.owned.includes(p.id)) {
        if (user.coins < p.price) return;
        user.coins -= p.price; user.owned.push(p.id);
        user.equipped[p.type] = p.id;
        sfx.chest();
        await rewardModal(p.rarity === 'legendary' ? '🌟' : '🎁', 'Unlocked!', `${p.name} is yours — earned with pure brain power!`);
      } else if (user.equipped[p.type] === p.id) {
        // Core slots always keep something on; accessories can come off.
        if (p.type in DEFAULT_EQUIP_LOCK) { /* keep */ }
        else delete user.equipped[p.type];
      } else {
        user.equipped[p.type] = p.id;
        sfx.click();
      }
      await store.saveUser(user);
      render();
    }));
  };
  render();
}
// Slots that must never be empty (a hero always has skin, hair, clothes).
const DEFAULT_EQUIP_LOCK = { skin: 1, shirt: 1, pants: 1, hair: 1, emote: 1 };

// ---------------- Leaderboard ----------------
export async function leaderboard(el) {
  el.innerHTML = `${hud()}<h2 class="display" style="margin:1rem 0">🏆 Leaderboard</h2><div class="card"><p>Loading…</p></div>`;
  let rows;
  try { rows = await store.getLeaderboard(); }
  catch (e) {
    el.lastElementChild.innerHTML = '<p>Could not load ranks — check your connection and try again.</p>';
    console.warn('leaderboard:', e);
    return;
  }
  if (!rows.length) {
    el.lastElementChild.innerHTML = '<p>No heroes on the board yet — complete a quest to claim the first spot! 🏅</p>';
    return;
  }
  const medals = ['🥇', '🥈', '🥉'];
  el.lastElementChild.innerHTML = rows.map((r, i) => `
    <div class="rank-row ${r.me ? 'me' : ''}">
      <span class="rank-num">${medals[i] || i + 1}</span>
      <span style="font-weight:800">${esc(r.name)}${r.me ? ' (you)' : ''}</span>
      <span class="rank-xp">${r.xp} XP</span>
    </div>`).join('');
}

// ---------------- Settings (accessibility) ----------------
export function settings(el) {
  const root = document.documentElement;
  el.innerHTML = `${hud()}
  <h2 class="display" style="margin:1rem 0">⚙️ Settings</h2>
  <div class="card">
    <h3 class="display">Accessibility</h3>
    <div style="display:flex;flex-direction:column;gap:.8rem;margin-top:.8rem">
      <label><input type="checkbox" id="opt-mute" ${isMuted() ? 'checked' : ''}/> 🔇 Mute sounds</label>
      <label><input type="checkbox" id="opt-dark" ${root.dataset.theme === 'dark' ? 'checked' : ''}/> 🌙 Night Quest (dark mode)</label>
      <label><input type="checkbox" id="opt-dys" ${root.dataset.font === 'dyslexic' ? 'checked' : ''}/> 📖 Dyslexia-friendly spacing</label>
      <label><input type="checkbox" id="opt-cb" ${root.dataset.colorblind === 'on' ? 'checked' : ''}/> 🎨 Colour-blind safe palette</label>
      <label>🔠 Font size:
        <select id="opt-size">
          <option value="">Normal</option>
          <option value="large" ${root.dataset.fontsize === 'large' ? 'selected' : ''}>Large</option>
          <option value="xlarge" ${root.dataset.fontsize === 'xlarge' ? 'selected' : ''}>Extra large</option>
        </select>
      </label>
    </div>
  </div>
  <div class="card">
    <h3 class="display">🦌 Sang Kancil AI</h3>
    <p style="color:var(--ink-soft);margin:.4rem 0 .8rem;font-size:.9rem">
      ${getAiKey() ? '✅ AI tutor is active on this device.' : 'Paste a Gemini API key (grown-ups: aistudio.google.com/apikey) to make Sang Kancil fully conversational. Stored on this device only.'}
    </p>
    <form id="ai-key-form" style="display:flex;gap:.5rem;flex-wrap:wrap">
      <input id="ai-key-input" type="password" placeholder="${getAiKey() ? '••••••• (key saved)' : 'Paste API key'}" autocomplete="off"
        style="flex:1;min-width:180px;border:2px solid var(--line);border-radius:var(--r-pill);padding:.5rem .9rem;font-family:inherit;background:var(--paper);color:var(--ink)" />
      <button class="btn btn-sm btn-purple" type="submit">Save</button>
    </form>
  </div>
  ${user.role === 'student' && user.familyCode ? `
  <div class="card card-tint" style="text-align:center">
    <h3 class="display">👨‍👩‍👧 Family Code</h3>
    <p style="color:var(--ink-soft);margin:.4rem 0">Show this to your parent so they can follow your adventure:</p>
    <div class="display" style="font-size:2rem;letter-spacing:.35em;font-weight:800;color:var(--magic-deep)">${esc(user.familyCode)}</div>
    ${CONFIG.backend !== 'firebase' ? '<p style="font-size:.8rem;color:var(--ink-soft);margin-top:.4rem">(Works once the app is connected to Firebase.)</p>' : ''}
  </div>` : ''}
  <div class="card">
    <button class="btn btn-ghost" id="logout">Log out</button>
  </div>`;
  const persist = () => localStorage.setItem('eduverse-a11y', JSON.stringify(root.dataset));
  el.querySelector('#opt-mute').addEventListener('change', e => setMuted(e.target.checked));
  el.querySelector('#ai-key-form').addEventListener('submit', e => {
    e.preventDefault();
    const v = el.querySelector('#ai-key-input').value.trim();
    if (v) { setAiKey(v); toast('🦌 AI tutor activated!'); settings(el); }
  });
  el.querySelector('#opt-dark').addEventListener('change', e => { root.dataset.theme = e.target.checked ? 'dark' : ''; persist(); });
  el.querySelector('#opt-dys').addEventListener('change', e => { root.dataset.font = e.target.checked ? 'dyslexic' : ''; persist(); });
  el.querySelector('#opt-cb').addEventListener('change', e => { root.dataset.colorblind = e.target.checked ? 'on' : ''; persist(); });
  el.querySelector('#opt-size').addEventListener('change', e => { root.dataset.fontsize = e.target.value; persist(); });
  el.querySelector('#logout').addEventListener('click', doLogout);
}

// ---------------- Parent dashboard ----------------
export async function parent(el, _m, selectedIdx = 0) {
  let children = [];
  try { children = await store.getChildren(); } catch { /* fall through to link form */ }
  if (user.role === 'parent' && !children.length && CONFIG.backend !== 'firebase') children = [demoChildData()];

  if (!children.length) {
    el.innerHTML = `
    <div class="hud"><span class="pill">👨‍👩‍👧 Parent Dashboard</span><span class="spacer"></span>
      <button class="btn btn-ghost btn-sm" id="logout">Log out</button></div>
    <div class="card card-tint" style="text-align:center">
      <div style="font-size:3rem">🔗</div>
      <h2 class="display">Link your child</h2>
      <p style="color:var(--ink-soft);margin:.6rem 0 1rem">On your child's tablet, open <b>⚙️ Settings</b> — you'll see a 6-letter <b>Family Code</b>. Type it here:</p>
      <form id="link-form" style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap">
        <input id="link-code" maxlength="6" placeholder="e.g. K7XM2P" autocapitalize="characters"
          style="border:3px solid var(--line);border-radius:var(--r-pill);padding:.7rem 1.1rem;font-family:var(--font-display);font-weight:800;letter-spacing:.2em;text-transform:uppercase;width:11ch;text-align:center;background:var(--card);color:var(--ink)" />
        <button class="btn btn-green" type="submit">Link 🔗</button>
      </form>
      <p id="link-msg" style="color:var(--lava);font-weight:700;margin-top:.8rem"></p>
    </div>`;
    el.querySelector('#logout').addEventListener('click', doLogout);
    el.querySelector('#link-form').addEventListener('submit', async e => {
      e.preventDefault();
      try {
        await store.linkChild(el.querySelector('#link-code').value);
        toast('Linked! 🎉');
        parent(el);
      } catch (err) { el.querySelector('#link-msg').textContent = err.message; }
    });
    return;
  }

  const child = children[Math.min(selectedIdx, children.length - 1)];
  el.innerHTML = `
  <div class="hud"><span class="pill">👨‍👩‍👧 Parent Dashboard</span><span class="spacer"></span>
    <button class="btn btn-ghost btn-sm" id="logout">Log out</button></div>
  <div class="card card-tint">
    <h2 class="display">📊 ${esc(child.name)}'s Progress</h2>
    ${children.length > 1 ? `<div style="display:flex;gap:.5rem;margin-top:.6rem;flex-wrap:wrap">${
      children.map((c, i) => `<button class="btn btn-sm ${i === selectedIdx ? 'btn-gold' : 'btn-ghost'}" data-child="${i}">${esc(c.name)}</button>`).join('')
    }</div>` : ''}
    ${CONFIG.backend === 'firebase' ? `
    <button class="btn btn-ghost btn-sm" id="add-child" style="margin-top:.6rem">➕ Link another child</button>
    <form id="add-child-form" hidden style="gap:.5rem;margin-top:.6rem;flex-wrap:wrap">
      <input id="add-child-code" maxlength="6" placeholder="Family Code" autocapitalize="characters" autocomplete="off"
        style="border:3px solid var(--line);border-radius:var(--r-pill);padding:.55rem 1rem;font-family:var(--font-display);font-weight:800;letter-spacing:.2em;text-transform:uppercase;width:11ch;text-align:center;background:var(--card);color:var(--ink)" />
      <button class="btn btn-green btn-sm" type="submit">Link 🔗</button>
      <span id="add-child-msg" style="color:var(--lava);font-weight:700;flex-basis:100%"></span>
    </form>` : ''}
  </div>
  <div class="stat-grid">
    <div class="stat"><div class="s-num">${child.completedLessons.length}</div><div class="s-label">Lessons completed</div></div>
    <div class="stat"><div class="s-num">${child.stats.correct}</div><div class="s-label">Correct answers</div></div>
    <div class="stat"><div class="s-num">${accuracy(child)}%</div><div class="s-label">Overall accuracy</div></div>
    <div class="stat"><div class="s-num">${child.streak}🔥</div><div class="s-label">Day streak</div></div>
  </div>
  <div class="card card-tint">
    <h3 class="display">🎯 Where to focus next</h3>
    ${focusSuggestion(child)}
  </div>
  <div class="card">
    <h3 class="display">📚 Accuracy by subject</h3>
    ${subjectCards(child)}
  </div>
  <div class="card">
    <h3 class="display">🗺️ Adventure map progress</h3>
    <p style="color:var(--ink-soft);font-size:.85rem;margin-bottom:.2rem">Lessons completed per world (green ring = world finished)</p>
    ${worldMapStrip(child)}
  </div>
  <div class="card">
    <h3 class="display">🔍 Topics needing attention</h3>
    ${weakList(child)}
  </div>
  <div class="card">
    <h3 class="display">📅 Recent activity</h3>
    ${activityTimeline(child)}
  </div>
  <div class="card">
    <h3 class="display">🎮 Engagement snapshot</h3>
    ${engagementSnapshot(child)}
  </div>
  <div class="card">
    <h3 class="display">🏅 Recent achievements</h3>
    <p>${child.achievements.length ? achievementList(child).filter(a => a.owned).map(a => `${a.emoji} ${a.name}`).join(' · ') : 'None yet — encourage the first quest!'}</p>
  </div>
  <div class="card"><button class="btn btn-green" id="report">⬇️ Download report</button></div>`;
  el.querySelector('#logout').addEventListener('click', doLogout);
  el.querySelector('#report').addEventListener('click', () => downloadReport(child));
  el.querySelectorAll('[data-child]').forEach(b =>
    b.addEventListener('click', () => parent(el, null, Number(b.dataset.child))));
  // Inline form instead of window.prompt(), which installed PWAs and some
  // mobile browsers silently block ("nothing happens" on tap).
  el.querySelector('#add-child')?.addEventListener('click', () => {
    const form = el.querySelector('#add-child-form');
    form.hidden = !form.hidden;
    form.style.display = form.hidden ? '' : 'flex';
    if (!form.hidden) el.querySelector('#add-child-code').focus();
  });
  el.querySelector('#add-child-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const code = el.querySelector('#add-child-code').value.trim();
    if (!code) return;
    try { await store.linkChild(code); toast('Linked! 🎉'); parent(el); }
    catch (err) { el.querySelector('#add-child-msg').textContent = err.message; }
  });
}

// ---------------- Teacher dashboard ----------------
export function teacher(el) {
  const students = demoClass();
  el.innerHTML = `
  <div class="hud"><span class="pill">🧑‍🏫 Teacher Dashboard — Kelas 5 Bestari</span><span class="spacer"></span>
    <button class="btn btn-ghost btn-sm" id="logout">Log out</button></div>
  <div class="stat-grid">
    <div class="stat"><div class="s-num">${students.length}</div><div class="s-label">Students</div></div>
    <div class="stat"><div class="s-num">${Math.round(students.reduce((s, x) => s + x.acc, 0) / students.length)}%</div><div class="s-label">Class avg accuracy</div></div>
    <div class="stat"><div class="s-num">${students.reduce((s, x) => s + x.lessons, 0)}</div><div class="s-label">Lessons this week</div></div>
  </div>
  <div class="card">
    <h3 class="display">📋 Class performance</h3>
    <div style="overflow-x:auto"><table class="report">
      <thead><tr><th>Student</th><th>Lessons</th><th>Accuracy</th><th>Streak</th><th>Weak area</th></tr></thead>
      <tbody>${students.map(s => `
        <tr><td>${esc(s.name)}</td><td>${s.lessons}</td>
        <td style="color:${s.acc >= 70 ? 'var(--jungle-deep)' : 'var(--lava)'};font-weight:800">${s.acc}%</td>
        <td>${s.streak}🔥</td><td>${esc(s.weak)}</td></tr>`).join('')}
      </tbody></table></div>
  </div>
  <div class="card">
    <h3 class="display">📚 Assign homework</h3>
    <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.6rem">
      <select id="hw-lesson">${LESSONS.map(l => `<option value="${l.id}">${esc(l.title)}</option>`).join('')}</select>
      <button class="btn btn-sm" id="hw-assign">Assign to class</button>
    </div>
  </div>`;
  el.querySelector('#logout').addEventListener('click', doLogout);
  el.querySelector('#hw-assign').addEventListener('click', () =>
    toast('📨 Homework assigned! (Connect Firebase to notify students)'));
}

// ---------------- Admin panel ----------------
export function admin(el) {
  el.innerHTML = `
  <div class="hud"><span class="pill">🛠️ Admin Panel</span><span class="spacer"></span>
    <button class="btn btn-ghost btn-sm" id="logout">Log out</button></div>
  <div class="stat-grid">
    <div class="stat"><div class="s-num">${LESSONS.length}</div><div class="s-label">Lessons</div></div>
    <div class="stat"><div class="s-num">${Object.values(QUIZZES).flat().length}</div><div class="s-label">Quiz questions</div></div>
    <div class="stat"><div class="s-num">${WORLDS.length}</div><div class="s-label">Worlds</div></div>
    <div class="stat"><div class="s-num">${CATALOG.length}</div><div class="s-label">Wardrobe items</div></div>
  </div>
  <div class="card">
    <h3 class="display">📚 Curriculum content</h3>
    <div style="overflow-x:auto"><table class="report">
      <thead><tr><th>Lesson</th><th>World</th><th>Year</th><th>KSSR mapping</th><th>Quiz Qs</th></tr></thead>
      <tbody>${LESSONS.map(l => `
        <tr><td>${esc(l.title)}</td><td>${esc(WORLDS.find(w => w.id === l.worldId).name)}</td>
        <td>${l.year}</td><td style="font-size:.8rem">${esc(l.kssr)}</td><td>${(QUIZZES[l.id] || []).length}</td></tr>`).join('')}
      </tbody></table></div>
    <p style="color:var(--ink-soft);margin-top:.8rem;font-size:.85rem">
      Content lives in <code>js/data/curriculum.js</code> (or Firestore <code>lessons</code>/<code>quizzes</code> collections when Firebase is connected).</p>
  </div>`;
  el.querySelector('#logout').addEventListener('click', doLogout);
}

// ---------------- Helpers ----------------
const accuracy = u => {
  const total = u.stats.correct + u.stats.wrong;
  return total ? Math.round(u.stats.correct / total * 100) : 0;
};
const weakList = u => {
  const w = weakestTopics(u);
  return w.length
    ? `<ul style="margin:.5rem 0 0 1.2rem">${w.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`
    : '<p style="color:var(--ink-soft)">No weak topics detected — great work!</p>';
};
const SUBJECT_EMOJI = { English: '🔤', Mathematics: '🔢', 'Bahasa Melayu': '🗣️' };
const accColor = pct => pct >= 80 ? 'var(--jungle-deep)' : pct >= 60 ? 'var(--gold-deep)' : 'var(--lava)';

function subjectCards(child) {
  const rows = subjectBreakdown(child);
  if (!rows.length) return '<p style="color:var(--ink-soft)">No quiz answers recorded yet — subject breakdown appears after the first few lessons.</p>';
  return `<div class="stat-grid">${rows.map(s => `
    <div class="stat">
      <div class="s-num" style="color:${accColor(s.accuracy)}">${s.accuracy}%</div>
      <div class="s-label">${SUBJECT_EMOJI[s.subject] || '📘'} ${esc(s.subject)}</div>
      <div style="color:var(--ink-soft);font-size:.78rem;margin-top:.2rem">${s.correct} right · ${s.wrong} wrong</div>
    </div>`).join('')}</div>`;
}

function focusSuggestion(child) {
  const subjects = subjectBreakdown(child);
  const weakest = subjects[0];
  if (!weakest || weakest.accuracy >= 80) {
    return `<p style="color:var(--ink-soft)">🎉 No subject is currently below 80% — ${esc(child.name)} is doing well across the board!</p>`;
  }
  const topic = weakestTopics(child, 1)[0];
  return `
    <p style="margin-bottom:.4rem"><b>${SUBJECT_EMOJI[weakest.subject] || '📘'} ${esc(weakest.subject)}</b> is the subject needing the most help right now,
    at <b style="color:${accColor(weakest.accuracy)}">${weakest.accuracy}%</b> accuracy (${weakest.correct}/${weakest.correct + weakest.wrong} correct).</p>
    ${topic ? `<p style="color:var(--ink-soft)">The specific topic tripping them up most: <b>${esc(topic)}</b>. Sitting with them to redo that quest together — or asking Sang Kancil for a hint together — usually helps it click.</p>` : ''}`;
}

function worldMapStrip(child) {
  return `<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.6rem">
    ${WORLDS.map(w => {
      const ls = LESSONS.filter(l => l.worldId === w.id);
      const done = ls.filter(l => child.completedLessons.includes(l.id)).length;
      const complete = ls.length > 0 && done === ls.length;
      return `<span class="pill" style="${complete ? `border:2px solid var(--jungle);` : ''}" title="${esc(w.name)}">
        ${w.emoji} ${done}/${ls.length || '—'}</span>`;
    }).join('')}
  </div>`;
}

function activityTimeline(child) {
  const log = child.activityLog || [];
  if (!log.length) return '<p style="color:var(--ink-soft)">No completed quests logged yet.</p>';
  return `<div style="display:flex;flex-direction:column;gap:.4rem">
    ${log.slice(0, 8).map(a => {
      const world = WORLDS.find(w => w.id === a.worldId);
      const date = new Date(a.at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' });
      return `<div style="display:flex;align-items:center;gap:.6rem;padding:.35rem 0;border-bottom:1px solid var(--line)">
        <span style="color:var(--ink-soft);font-size:.78rem;width:4.2em;flex-shrink:0">${date}</span>
        <span>${world?.emoji || '📘'}</span>
        <span style="flex:1">${esc(a.title)}</span>
        <b style="color:${accColor(a.accuracy)}">${a.accuracy}%</b>
      </div>`;
    }).join('')}
  </div>`;
}

function engagementSnapshot(child) {
  return `<div class="stat-grid">
    <div class="stat"><div class="s-num">🔥${child.streak || 0}</div><div class="s-label">Day streak</div></div>
    <div class="stat"><div class="s-num">🛡️${child.shields || 0}</div><div class="s-label">Streak shields</div></div>
    <div class="stat"><div class="s-num">⚔️${child.duelWins || 0}</div><div class="s-label">Duels won</div></div>
    <div class="stat"><div class="s-num">🗺️${(child.mapPieces || []).length}/9</div><div class="s-label">Story pieces</div></div>
  </div>`;
}
function demoChildData() {
  const d = JSON.parse(localStorage.getItem('eduverse-state-v1') || '{}').user;
  return d && d.role === 'student' ? d : {
    name: 'Demo Child', completedLessons: ['ek-1', 'mv-1'], streak: 2, shields: 0, duelWins: 1, mapPieces: ['english-kingdom'],
    achievements: ['first-steps'],
    stats: {
      correct: 8, wrong: 3, gamesPlayed: 2, minutes: 45,
      weakTopics: { 'Equivalent Fractions': 2 },
      bySubject: { English: { correct: 5, wrong: 1 }, Mathematics: { correct: 3, wrong: 2 } },
    },
    activityLog: [
      { title: 'Numbers to 1 000 000', worldId: 'maths-volcano', accuracy: 60, at: new Date(Date.now() - 864e5).toISOString() },
      { title: 'Simple Present Tense', worldId: 'english-kingdom', accuracy: 100, at: new Date(Date.now() - 2 * 864e5).toISOString() },
    ],
  };
}
const demoClass = () => [
  { name: 'Aina Sofea', lessons: 5, acc: 88, streak: 6, weak: '—' },
  { name: 'Wei Jun', lessons: 4, acc: 74, streak: 3, weak: 'Imbuhan meN-' },
  { name: 'Devi Priya', lessons: 6, acc: 91, streak: 7, weak: '—' },
  { name: 'Hafiz Iman', lessons: 2, acc: 55, streak: 1, weak: 'Equivalent Fractions' },
  { name: 'Mei Ling', lessons: 3, acc: 68, streak: 2, weak: 'Simple Present Tense' },
];
function downloadReport(child) {
  const subjects = subjectBreakdown(child);
  const log = (child.activityLog || []).slice(0, 10);
  const lines = [
    `EduVerse Malaysia — Progress Report (${new Date().toLocaleDateString('ms-MY')})`,
    `Student: ${child.name}`,
    `Lessons completed: ${child.completedLessons.length}`,
    `Overall accuracy: ${accuracy(child)}%`,
    `Streak: ${child.streak} days · Shields: ${child.shields || 0} · Duel wins: ${child.duelWins || 0} · Story pieces: ${(child.mapPieces || []).length}/9`,
    '',
    'Accuracy by subject:',
    ...(subjects.length ? subjects.map(s => `  - ${s.subject}: ${s.accuracy}% (${s.correct}/${s.correct + s.wrong})`) : ['  (no quiz data yet)']),
    '',
    `Weak topics: ${weakestTopics(child).join(', ') || 'none'}`,
    '',
    'Recent activity:',
    ...(log.length ? log.map(a => `  - ${new Date(a.at).toLocaleDateString('en-MY')}: ${a.title} — ${a.accuracy}%`) : ['  (none logged yet)']),
  ];
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
  a.download = 'eduverse-report.txt';
  a.click();
}
