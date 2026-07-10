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
