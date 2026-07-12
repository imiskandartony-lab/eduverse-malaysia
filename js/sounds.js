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
  // Pitch climbs a semitone per combo step — rewards streaks audibly.
  correct(combo = 0) {
    const m = 2 ** (Math.min(combo, 8) / 12);
    tone(660 * m, .1, 'triangle'); tone(880 * m, .14, 'triangle', .08);
  },
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
  if (m) stopMusic();
  else if (currentMood) startMusic(currentMood);
}

// ---------- Background music: tiny generated loops, no audio files ----------
let musicMuted = localStorage.getItem('eduverse-music-muted') === '1';
let musicTimer = null;
let currentMood = null;

function musicNote(freq, dur, delay, vol = 0.045, type = 'sine') {
  if (muted || musicMuted) return;
  try {
    const a = ac(), o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, a.currentTime + delay);
    g.gain.linearRampToValueAtTime(vol, a.currentTime + delay + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + delay + dur);
    o.connect(g).connect(a.destination);
    o.start(a.currentTime + delay); o.stop(a.currentTime + delay + dur + 0.05);
  } catch { /* audio unavailable */ }
}

// One gentle looping phrase per mood — a slow, low-volume ostinato so it
// never competes with sfx or narration. Frequencies in Hz.
const MOOD_LOOPS = {
  english: { notes: [392, 440, 523, 440], step: 0.9, noteDur: 1.1, type: 'sine' },
  mathematics: { notes: [349, 415, 466, 415, 349, 311], step: 0.55, noteDur: 0.6, type: 'triangle' },
  'bahasa melayu': { notes: [349, 415, 466, 523, 466, 415], step: 0.75, noteDur: 0.85, type: 'sine' },
  boss: { notes: [175, 185, 175, 165], step: 0.4, noteDur: 0.42, type: 'sawtooth' },
};

function playLoop(mood) {
  const loop = MOOD_LOOPS[mood] || MOOD_LOOPS.english;
  loop.notes.forEach((f, i) => musicNote(f, loop.noteDur, i * loop.step, mood === 'boss' ? 0.03 : 0.045, loop.type));
  return loop.notes.length * loop.step * 1000;
}

export function startMusic(mood) {
  currentMood = mood;
  stopTimerOnly();
  if (muted || musicMuted) return;
  const scheduleNext = () => { const gap = playLoop(mood); musicTimer = setTimeout(scheduleNext, gap); };
  scheduleNext();
}
function stopTimerOnly() { if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; } }
export function stopMusic() { currentMood = null; stopTimerOnly(); }

export const isMusicMuted = () => musicMuted;
export function setMusicMuted(m) {
  musicMuted = m;
  localStorage.setItem('eduverse-music-muted', m ? '1' : '0');
  if (m) stopTimerOnly();
  else if (currentMood) startMusic(currentMood);
}
