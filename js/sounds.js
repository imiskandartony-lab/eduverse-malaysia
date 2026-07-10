// EduVerse Malaysia — audio engine (WebAudio, zero assets, mute toggle)

let ctx = null;
let muted = localStorage.getItem('eduverse-muted') === '1';

const ac = () => (ctx ||= new (window.AudioContext || window.webkitAudioContext)());

function tone(freq, dur = 0.12, type = 'sine', delay = 0, vol = 0.18) {
  if (muted) return;
  try {
    const a = ac(), o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, a.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + delay + dur);
    o.connect(g).connect(a.destination);
    o.start(a.currentTime + delay); o.stop(a.currentTime + delay + dur);
  } catch { /* audio unavailable */ }
}

export const sfx = {
  correct() { tone(660, .1, 'triangle'); tone(880, .14, 'triangle', .08); },
  wrong() { tone(220, .2, 'sawtooth', 0, .1); tone(180, .25, 'sawtooth', .1, .1); },
  coin() { tone(988, .08, 'square', 0, .1); tone(1319, .18, 'square', .06, .1); },
  levelUp() { [523, 659, 784, 1047].forEach((f, i) => tone(f, .18, 'triangle', i * .1)); },
  chest() { [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, .15, 'sine', i * .07)); },
  bossHit() { tone(140, .18, 'sawtooth', 0, .22); tone(90, .25, 'square', .05, .18); },
  spin() { for (let i = 0; i < 8; i++) tone(400 + i * 60, .05, 'square', i * .09, .06); },
  click() { tone(500, .05, 'sine', 0, .08); },
};

export const isMuted = () => muted;
export function setMuted(m) {
  muted = m;
  localStorage.setItem('eduverse-muted', m ? '1' : '0');
}
