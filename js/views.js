// EduVerse Malaysia — view renderers (SPA, hash-routed)

import { WORLDS, LESSONS, QUIZZES, SHOP_ITEMS, AVATAR_BASES } from './data/curriculum.js';
import { store, ensureDailyMissions, touchStreak } from './store.js';
import { CONFIG } from './config.js';
import {
  grant, missionProgress, claimMission, recordAnswer, weakestTopics,
  recommendLesson, worldProgress, maybeUnlockNextWorld, levelFor, xpIntoLevel,
  achievementList, titleFor, canSpin, doSpin, canOpenChest, openChest, SPIN_PRIZES, grant as grantReward,
} from './gamification.js';
import { sfx, isMuted, setMuted } from './sounds.js';
import { toast, rewardModal, speak, esc, confetti } from './ui.js';
import { gameForLesson } from './games.js';

let user = null;
export const getUser = () => user;
export const setUser = u => { user = u; };

const go = route => { location.hash = route; };

function avatarEmoji(u) {
  return `${u.equipped.wings ? '🪽' : ''}${u.avatarBase}${u.equipped.hat ? findItem(u.equipped.hat).emoji : ''}${u.equipped.pet ? findItem(u.equipped.pet).emoji : ''}`;
}
const findItem = id => SHOP_ITEMS.find(s => s.id === id);

function hud() {
  return `
  <div class="hud">
    <span class="pill"><span class="ico">${esc(user.avatarBase)}</span>${esc(user.name)}</span>
    <span class="pill"><span class="ico">⭐</span>Lv ${levelFor(user.xp)}</span>
    <span class="pill"><span class="ico">${titleFor(levelFor(user.xp)).emoji}</span>${titleFor(levelFor(user.xp)).name}</span>
    <span class="pill"><span class="ico">🪙</span>${user.coins}</span>
    <span class="pill"><span class="ico">💎</span>${user.gems}</span>
    <span class="pill"><span class="ico">🔥</span>${user.streak} day${user.streak === 1 ? '' : 's'}</span>
    <span class="spacer"></span>
    <button class="btn btn-ghost btn-sm" data-route="#/settings">⚙️</button>
  </div>
  <div class="xpbar" role="progressbar" aria-label="XP progress" aria-valuenow="${xpIntoLevel(user.xp)}" aria-valuemax="${CONFIG.xpPerLevel}">
    <span style="width:${xpIntoLevel(user.xp)}%"></span>
  </div>`;
}

// ---------------- Landing / auth ----------------
export function landing(el) {
  el.innerHTML = `
  <div class="landing">
    <div style="font-size:4rem">🦌🗺️</div>
    <h1>EduVerse <span style="color:var(--sunset)">Malaysia</span></h1>
    <p class="tagline">Where learning becomes an adventure — KSSR Year 5 & 6</p>
    <div class="role-grid">
      <button class="role-card" data-role="student"><span class="r-emoji">🧑‍🚀</span>I'm a Student</button>
      <button class="role-card" data-role="parent"><span class="r-emoji">👨‍👩‍👧</span>I'm a Parent</button>
      <button class="role-card" data-role="teacher"><span class="r-emoji">🧑‍🏫</span>I'm a Teacher</button>
      <button class="role-card" data-role="admin"><span class="r-emoji">🛠️</span>Admin</button>
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
  const form = el.querySelector('#name-form');
  const begin = async (name, role) => {
    user = await store.signIn(name, role);
    ensureDailyMissions(user);
    const { streakGrew } = touchStreak(user);
    if (streakGrew && role === 'student') {
      await missionProgress(user, 'login');
      await grant(user, { coins: user.streak * CONFIG.streakBonusCoins, reason: `(day ${user.streak} streak!)` });
    }
    await store.saveUser(user);
    go(role === 'student' ? '#/dashboard' : `#/${role}`);
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
  <div class="card">
    <h3 class="display">⭐ Today's Missions <span style="color:var(--ink-soft);font-size:.85rem">(${missionsDone}/${user.missions.length})</span></h3>
    <div id="mission-list"></div>
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
  el.innerHTML = `
  ${hud()}
  <h2 class="display" style="margin:1rem 0 .2rem;font-size:var(--fs-h2)">🗺️ Adventure Map</h2>
  <p style="color:var(--ink-soft)">Complete every lesson in a world to unlock the next!</p>
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

// ---------------- Lesson flow: intro → learn → practice → game → quiz → boss → reward ----------------
export function lessonFlow(el, lessonId) {
  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) { go('#/worlds'); return; }
  const quiz = QUIZZES[lessonId] || [];
  let stage = 0, stepIdx = 0, quizIdx = 0, quizCorrect = 0, bossHp = 100, gameScore = 0, combo = 0;

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
        b.addEventListener('click', () => {
          if (i === p.answer) { b.classList.add('correct'); toast('Correct! 🎉'); setTimeout(() => { stage++; render(); }, 700); }
          else { b.classList.add('wrong'); toast('Try again — use the hint!'); }
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
        b.addEventListener('click', async () => {
          opts.querySelectorAll('button').forEach(x => x.disabled = true);
          recordAnswer(user, lessonId, i === q.answer);
          if (i === q.answer) {
            b.classList.add('correct'); quizCorrect++; combo++; sfx.correct();
            if (combo >= 3) { toast(`🔥 COMBO ×${combo}! Bonus +5 XP`); user.xp += 5; }
            await missionProgress(user, 'correct');
          } else {
            combo = 0; sfx.wrong();
            b.classList.add('wrong');
            opts.children[q.answer].classList.add('correct');
            toast(q.explain, 3200);
          }
          setTimeout(() => { quizIdx++; render(); }, i === q.answer ? 600 : 2200);
        });
        opts.appendChild(b);
      });
      el.querySelector('#hint').addEventListener('click', () => rewardModal('🦌', 'Hint!', esc(q.hint)));
    },
    boss() {
      // Boss battle: reuse quiz questions shuffled; each correct hit damages the boss.
      const pool = [...quiz].sort(() => Math.random() - 0.5);
      let bi = 0;
      const drawBoss = () => {
        const q = pool[bi % pool.length];
        frame(`
          <div style="text-align:center">
            <div style="font-size:3.4rem">${bossHp > 60 ? '🐉' : bossHp > 30 ? '😰' : '🥵'}</div>
            <h2 class="display">Boss Battle!</h2>
            <div class="boss-hp" style="margin:.8rem 0" role="progressbar" aria-label="Boss health" aria-valuenow="${bossHp}" aria-valuemax="100"><span style="width:${bossHp}%"></span></div>
          </div>
          <p class="lesson-step" style="margin:.6rem 0">${esc(q.q)}</p>
          <div id="opts"></div>`);
        const opts = el.querySelector('#opts');
        q.options.forEach((o, i) => {
          const b = document.createElement('button');
          b.className = 'quiz-option'; b.textContent = o;
          b.addEventListener('click', () => {
            if (i === q.answer) {
              bossHp = Math.max(0, bossHp - CONFIG.bossDamagePerCorrect);
              sfx.bossHit();
              toast('💥 Direct hit!');
              recordAnswer(user, lessonId, true);
            } else {
              toast('🛡️ The boss blocked it! ' + q.explain, 2800);
              recordAnswer(user, lessonId, false);
            }
            bi++;
            if (bossHp <= 0) { stage++; render(); } else drawBoss();
          });
          opts.appendChild(b);
        });
      };
      drawBoss();
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
      confetti(40);
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

// ---------------- Avatar & shop ----------------
export function avatar(el) {
  const render = () => {
    el.innerHTML = `${hud()}
    <h2 class="display" style="margin:1rem 0">🎒 Your Avatar</h2>
    <div class="card" style="text-align:center">
      <div class="avatar-stage" aria-label="Your avatar">${avatarEmoji(user)}</div>
      <div style="display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap">
        ${AVATAR_BASES.map(b => `<button class="btn btn-ghost btn-sm ${b === user.avatarBase ? 'btn-gold' : ''}" data-base="${b}" style="font-size:1.3rem">${b}</button>`).join('')}
      </div>
    </div>
    <div class="card">
      <h3 class="display">🛍️ Reward Shop <span class="pill" style="float:right">🪙 ${user.coins}</span></h3>
      <p style="color:var(--ink-soft);margin:.3rem 0 1rem">Everything is earned by learning — never with real money.</p>
      <div class="shop-grid">
        ${SHOP_ITEMS.map(it => {
          const owned = user.owned.includes(it.id);
          const equipped = user.equipped[it.type] === it.id;
          return `
          <div class="shop-item ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}">
            <div class="s-emoji">${it.emoji}</div>
            <div style="font-weight:800;font-size:.85rem">${esc(it.name)}</div>
            <button class="btn btn-sm ${owned ? 'btn-green' : 'btn-gold'}" data-item="${it.id}" style="margin-top:.4rem" ${!owned && user.coins < it.price ? 'disabled' : ''}>
              ${equipped ? 'Remove' : owned ? 'Equip' : `${it.price} 🪙`}
            </button>
          </div>`;
        }).join('')}
      </div>
    </div>`;
    el.querySelectorAll('[data-base]').forEach(b => b.addEventListener('click', async () => {
      user.avatarBase = b.dataset.base; await store.saveUser(user); render();
    }));
    el.querySelectorAll('[data-item]').forEach(b => b.addEventListener('click', async () => {
      const it = findItem(b.dataset.item);
      if (!user.owned.includes(it.id)) {
        if (user.coins < it.price) return;
        user.coins -= it.price; user.owned.push(it.id);
        await rewardModal(it.emoji, 'Unlocked!', `${it.name} is yours — earned with pure brain power!`);
      } else if (user.equipped[it.type] === it.id) delete user.equipped[it.type];
      else user.equipped[it.type] = it.id;
      await store.saveUser(user); render();
    }));
  };
  render();
}

// ---------------- Leaderboard ----------------
export async function leaderboard(el) {
  el.innerHTML = `${hud()}<h2 class="display" style="margin:1rem 0">🏆 Leaderboard</h2><div class="card"><p>Loading…</p></div>`;
  const rows = await store.getLeaderboard();
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
    <button class="btn btn-ghost" id="logout">Log out</button>
  </div>`;
  const persist = () => localStorage.setItem('eduverse-a11y', JSON.stringify(root.dataset));
  el.querySelector('#opt-mute').addEventListener('change', e => setMuted(e.target.checked));
  el.querySelector('#opt-dark').addEventListener('change', e => { root.dataset.theme = e.target.checked ? 'dark' : ''; persist(); });
  el.querySelector('#opt-dys').addEventListener('change', e => { root.dataset.font = e.target.checked ? 'dyslexic' : ''; persist(); });
  el.querySelector('#opt-cb').addEventListener('change', e => { root.dataset.colorblind = e.target.checked ? 'on' : ''; persist(); });
  el.querySelector('#opt-size').addEventListener('change', e => { root.dataset.fontsize = e.target.value; persist(); });
  el.querySelector('#logout').addEventListener('click', async () => { await store.signOut(); user = null; go('#/'); });
}

// ---------------- Parent dashboard ----------------
export function parent(el) {
  const child = user.role === 'parent' ? demoChildData() : user;
  el.innerHTML = `
  <div class="hud"><span class="pill">👨‍👩‍👧 Parent Dashboard</span><span class="spacer"></span>
    <button class="btn btn-ghost btn-sm" id="logout">Log out</button></div>
  <div class="card card-tint"><h2 class="display">📊 ${esc(child.name)}'s Progress</h2></div>
  <div class="stat-grid">
    <div class="stat"><div class="s-num">${child.completedLessons.length}</div><div class="s-label">Lessons completed</div></div>
    <div class="stat"><div class="s-num">${child.stats.correct}</div><div class="s-label">Correct answers</div></div>
    <div class="stat"><div class="s-num">${accuracy(child)}%</div><div class="s-label">Quiz accuracy</div></div>
    <div class="stat"><div class="s-num">${child.streak}🔥</div><div class="s-label">Day streak</div></div>
  </div>
  <div class="card">
    <h3 class="display">🎯 Topics needing attention</h3>
    ${weakList(child)}
  </div>
  <div class="card">
    <h3 class="display">🏅 Recent achievements</h3>
    <p>${child.achievements.length ? achievementList(child).filter(a => a.owned).map(a => `${a.emoji} ${a.name}`).join(' · ') : 'None yet — encourage the first quest!'}</p>
  </div>
  <div class="card"><button class="btn btn-green" id="report">⬇️ Download report</button></div>`;
  el.querySelector('#logout').addEventListener('click', async () => { await store.signOut(); user = null; go('#/'); });
  el.querySelector('#report').addEventListener('click', () => downloadReport(child));
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
  el.querySelector('#logout').addEventListener('click', async () => { await store.signOut(); user = null; go('#/'); });
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
    <div class="stat"><div class="s-num">${SHOP_ITEMS.length}</div><div class="s-label">Shop items</div></div>
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
  el.querySelector('#logout').addEventListener('click', async () => { await store.signOut(); user = null; go('#/'); });
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
function demoChildData() {
  const d = JSON.parse(localStorage.getItem('eduverse-state-v1') || '{}').user;
  return d && d.role === 'student' ? d : {
    name: 'Demo Child', completedLessons: ['ek-1'], streak: 2, achievements: ['first-steps'],
    stats: { correct: 8, wrong: 3, gamesPlayed: 2, minutes: 45, weakTopics: { 'Equivalent Fractions': 2 } },
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
  const lines = [
    `EduVerse Malaysia — Progress Report (${new Date().toLocaleDateString('ms-MY')})`,
    `Student: ${child.name}`,
    `Lessons completed: ${child.completedLessons.length}`,
    `Quiz accuracy: ${accuracy(child)}%`,
    `Streak: ${child.streak} days`,
    `Weak topics: ${weakestTopics(child).join(', ') || 'none'}`,
  ];
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
  a.download = 'eduverse-report.txt';
  a.click();
}
