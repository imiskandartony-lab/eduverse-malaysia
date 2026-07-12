// EduVerse Malaysia — app bootstrap + hash router

import { store, ensureDailyMissions } from './store.js';
import * as V from './views.js';
import { initKancilWidget } from './ai.js';
import { stopMusic } from './sounds.js';

const view = document.getElementById('view');
const nav = document.getElementById('bottom-nav');
const kancil = initKancilWidget(V.getUser);

// Restore accessibility preferences
try {
  const a11y = JSON.parse(localStorage.getItem('eduverse-a11y') || '{}');
  Object.assign(document.documentElement.dataset, a11y);
} catch { /* fresh start */ }

// Ambient drifting clouds (game-world atmosphere)
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  ['☁️', '☁️', '⛅'].forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'cloud';
    s.textContent = c;
    s.style.top = 8 + i * 16 + '%';
    s.style.fontSize = 2.2 + i * .8 + 'rem';
    s.style.animationDuration = 55 + i * 25 + 's';
    s.style.animationDelay = -i * 22 + 's';
    document.body.appendChild(s);
  });
}

const routes = [
  { re: /^#?\/?$/, render: el => V.landing(el), public: true },
  { re: /^#\/dashboard$/, render: el => V.dashboard(el), role: 'student' },
  { re: /^#\/worlds$/, render: el => V.worlds(el), role: 'student' },
  { re: /^#\/world\/([\w-]+)$/, render: (el, m) => V.worldDetail(el, m[1]), role: 'student' },
  { re: /^#\/lesson\/([\w-]+)$/, render: (el, m) => V.lessonFlow(el, m[1]), role: 'student' },
  { re: /^#\/missions$/, render: el => V.missions(el), role: 'student' },
  { re: /^#\/arena$/, render: el => V.arenaHome(el), role: 'student' },
  { re: /^#\/arena\/([\w-]+)$/, render: (el, m) => V.arenaPlay(el, m[1]), role: 'student' },
  { re: /^#\/duel$/, render: el => V.duelHome(el), role: 'student' },
  { re: /^#\/trophies$/, render: el => V.trophyRoom(el), role: 'student' },
  { re: /^#\/examboss$/, render: el => V.examBoss(el), role: 'student' },
  { re: /^#\/spin$/, render: el => V.spin(el), role: 'student' },
  { re: /^#\/avatar$/, render: el => V.avatar(el), role: 'student' },
  { re: /^#\/leaderboard$/, render: el => V.leaderboard(el), role: 'student' },
  { re: /^#\/settings$/, render: el => V.settings(el) },
  { re: /^#\/parent$/, render: el => V.parent(el), role: 'parent' },
  { re: /^#\/teacher$/, render: el => V.teacher(el), role: 'teacher' },
  { re: /^#\/admin$/, render: el => V.admin(el), role: 'admin' },
];

async function route() {
  const hash = location.hash || '#/';
  const match = routes.find(r => r.re.test(hash));
  const user = V.getUser();

  if (!match || (!match.public && !user)) { location.hash = '#/'; if (hash === '#/' || !user) V.landing(view); return; }

  // Role guard: admin routes need admin rights; others need a matching role.
  if (match.role === 'admin' && !V.isAdminUser()) { location.hash = V.homeRoute(); return; }
  if (match.role && match.role !== 'admin' && user.role !== match.role && !V.isAdminUser()) {
    location.hash = V.homeRoute(); return;
  }

  const isStudent = user?.role === 'student';
  nav.hidden = !isStudent || hash === '#/';
  if (isStudent) kancil.show(); else kancil.hide();

  view.scrollTop = 0; window.scrollTo(0, 0);
  // Background music only plays inside a world/lesson; every other route
  // stops it here so it never keeps looping after the player navigates away.
  stopMusic();
  await match.render(view, hash.match(match.re));
  highlightNav(hash);
}

function highlightNav(hash) {
  nav.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.route === hash));
}

// Global delegated navigation for any [data-route] element
document.addEventListener('click', e => {
  const t = e.target.closest('[data-route]');
  if (t) location.hash = t.dataset.route;
});

window.addEventListener('hashchange', route);

// Boot: restore session if one exists
(async () => {
  const u = await store.getUser();
  if (u) {
    V.setUser(ensureDailyMissions(u));
    await V.applyDailyLogin(); // streak/shields also count when the landing is skipped
    if (!location.hash || location.hash === '#/') {
      location.hash = u.role === 'student' ? '#/dashboard' : `#/${u.role}`;
    }
  }
  route();
})();
