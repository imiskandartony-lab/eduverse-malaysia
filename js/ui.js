// EduVerse Malaysia — shared UI helpers (toast, modal, confetti, speech)

export function toast(msg, ms = 2200) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), ms);
}

export function rewardModal(emoji, title, text) {
  return new Promise(resolve => {
    const root = document.getElementById('modal-root');
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="reward-burst">${emoji}</div>
        <h2>${title}</h2>
        <p style="margin:.6rem 0 1.2rem">${text}</p>
        <button class="btn btn-gold">Awesome!</button>
      </div>`;
    root.appendChild(wrap);
    confetti();
    const close = () => { wrap.remove(); resolve(); };
    wrap.querySelector('button').addEventListener('click', close);
    wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
    wrap.querySelector('button').focus();
  });
}

// Premium paywall — shown when a free-trial user tries to unlock a world
// beyond their starter set. Resolves 'checkout' | 'cancel'.
export function paywallModal(priceRM) {
  return new Promise(resolve => {
    const root = document.getElementById('modal-root');
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="Unlock Premium">
        <div class="reward-burst">💎</div>
        <h2>Unlock the Full Adventure!</h2>
        <p style="margin:.6rem 0 1.2rem">
          You've explored the free starter worlds — great job! Unlock all 13 worlds,
          every subject and mini-game, forever, for one small payment.
        </p>
        <p style="font-size:1.6rem;font-weight:800;margin-bottom:1rem">RM${priceRM.toFixed(2)} <span style="font-size:.85rem;font-weight:600;color:var(--ink-soft)">/ lifetime</span></p>
        <div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-gold" data-choice="checkout">Unlock Now 🚀</button>
          <button class="btn" data-choice="cancel">Maybe later</button>
        </div>
      </div>`;
    root.appendChild(wrap);
    const close = choice => { wrap.remove(); resolve(choice); };
    wrap.querySelectorAll('[data-choice]').forEach(b =>
      b.addEventListener('click', () => close(b.dataset.choice)));
    wrap.addEventListener('click', e => { if (e.target === wrap) close('cancel'); });
  });
}

// Shown once, right after a payment is confirmed (see payments.js
// maybeCelebratePremium). Same wording works for any role — the account
// that paid is the one that unlocks, whichever of student/parent/teacher it is.
export function premiumUnlockedModal() {
  return new Promise(resolve => {
    const root = document.getElementById('modal-root');
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="Premium Unlocked">
        <div class="reward-burst">🎉</div>
        <h2>Congratulations!</h2>
        <p style="margin:.6rem 0 1.2rem">
          Premium is unlocked on this account — forever! Every world, mission,
          avatar item, Practice Arena battle, Friend Duel, and the Trophy Room
          are all open now. Enjoy the full adventure!
        </p>
        <button class="btn btn-gold">Let's go! 🚀</button>
      </div>`;
    root.appendChild(wrap);
    confetti(40);
    const close = () => { wrap.remove(); resolve(); };
    wrap.querySelector('button').addEventListener('click', close);
    wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
  });
}

// Lightweight emoji confetti — no library needed, respects reduced motion.
export function confetti(count = 24) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pieces = ['⭐', '✨', '🎉', '🪙', '💎'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    Object.assign(p.style, {
      position: 'fixed', left: Math.random() * 100 + 'vw', top: '-30px',
      fontSize: 14 + Math.random() * 18 + 'px', zIndex: 70, pointerEvents: 'none',
      transition: `transform ${1.2 + Math.random()}s ease-in, opacity 1.6s`,
    });
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translateY(${window.innerHeight + 60}px) rotate(${Math.random() * 360}deg)`;
      p.style.opacity = '0';
    });
    setTimeout(() => p.remove(), 2400);
  }
}

// ---------- Game-feel juice ----------
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Floating reward text at the tap point ("+XP", "💥 -34", …).
export function floatText(x, y, text, color = 'var(--jungle-deep)') {
  if (reducedMotion()) return;
  const el = document.createElement('span');
  el.className = 'float-text';
  el.textContent = text;
  el.style.left = `${x}px`; el.style.top = `${y}px`; el.style.color = color;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('go'));
  setTimeout(() => el.remove(), 950);
}

// Soft colored glow around the screen edge (green = correct, red = wrong).
export function flashEdge(kind = 'good') {
  if (reducedMotion()) return;
  const el = document.createElement('div');
  el.className = `edge-flash ${kind === 'good' ? 'flash-good' : 'flash-bad'}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 500);
}

// Big combo badge that pops in the middle of the screen from ×2 up.
export function showCombo(n) {
  if (n < 2 || reducedMotion()) return;
  document.querySelector('.combo-badge')?.remove();
  const el = document.createElement('div');
  el.className = 'combo-badge';
  el.innerHTML = `×${n} <small>COMBO!</small>`;
  if (n >= 5) el.classList.add('combo-hot');
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// Text-to-speech narration (accessibility). BM voice when text looks Malay.
export function speak(text, lang) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, ''));
  u.lang = lang || (/[a-z]/i.test(text) && /\b(ialah|dengan|kata|ayat)\b/i.test(text) ? 'ms-MY' : 'en-GB');
  u.rate = 0.95;
  speechSynthesis.speak(u);
}

export const esc = s => String(s).replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
