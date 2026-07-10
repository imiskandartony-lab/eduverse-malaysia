// EduVerse Malaysia — Sang Kancil AI tutor
// Gemini free tier when a key is configured; otherwise a friendly offline
// rule-based tutor so the app works fully at RM0 with zero setup.
// AI is used ONLY for tutoring/hints/motivation — never as curriculum source.

import { CONFIG } from './config.js';
import { weakestTopics } from './gamification.js';

const SYSTEM = `You are Sang Kancil, a clever and kind mousedeer tutor for Malaysian
Year 5-6 students (ages 11-12) using the KSSR Semakan curriculum (Bahasa Melayu,
English, Mathematics). Reply in the language the student uses (BM or English).
Keep answers under 80 words, simple, warm and encouraging. Give hints and guiding
questions instead of direct answers to homework. Never discuss unsafe topics;
redirect gently to learning.`;

export async function askKancil(user, question, context = '') {
  if (CONFIG.geminiApiKey) {
    try { return await askGemini(question, context); }
    catch (e) { console.warn('Gemini unavailable, falling back offline:', e); }
  }
  return offlineTutor(user, question);
}

async function askGemini(question, context) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.geminiModel}:generateContent?key=${CONFIG.geminiApiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: context ? `Lesson context: ${context}\n\nStudent: ${question}` : question }] }],
      generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    || 'Hmm, my clever brain slipped! Try asking again. 🦌';
}

// Offline tutor: keyword-matched encouragement + study guidance.
function offlineTutor(user, q) {
  const t = q.toLowerCase();
  const weak = weakestTopics(user, 1)[0];
  if (/hint|petunjuk|clue|tolong|help/.test(t))
    return 'Here is my trick: read the question twice, cross out answers you KNOW are wrong, then choose from what is left. You can do it! 🦌✨';
  if (/fraction|pecahan/.test(t))
    return 'Fractions are like sharing kuih! 1/2 means one piece out of two equal pieces. Equivalent fractions are the same amount cut differently: 1/2 = 2/4. Try drawing it!';
  if (/tense|present/.test(t))
    return 'Simple present tip: if the subject is he, she or it — the verb gets an -s! "She reads." For I, you, we, they — no -s. "They read."';
  if (/imbuhan|men-|awalan/.test(t))
    return 'Ingat formula meN-: b/p → mem- (p gugur), s → meny- (s gugur), k/g → meng- (k gugur), t/d → men- (t gugur). Contoh: tulis → menulis!';
  if (/sedih|sad|susah|hard|give up|penat/.test(t))
    return 'Every hero finds some quests hard — that is how you grow stronger! Take a deep breath, try one small step. I believe in you! 💪🦌';
  if (/what.*(learn|study)|apa.*(belajar|ulang)/.test(t))
    return weak
      ? `Good question! I noticed "${weak}" gave you trouble — let us revise that world first, then push forward. Small steps win big adventures!`
      : 'You are doing great everywhere! Pick the next unlocked lesson on your map and keep your streak alive. 🔥';
  return 'Interesting question! Break it into small pieces and try the practice questions — I will cheer you on. (Psst: add a Gemini API key in js/config.js and I become even smarter!) 🦌';
}

// Wire up the floating chat widget.
export function initKancilWidget(getUser) {
  const box = document.getElementById('kancil');
  const panel = document.getElementById('kancil-panel');
  const log = document.getElementById('kancil-log');
  const form = document.getElementById('kancil-form');
  const input = document.getElementById('kancil-input');

  const add = (text, who) => {
    const el = document.createElement('div');
    el.className = `msg ${who}`;
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  };

  document.getElementById('kancil-toggle').addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden && !log.childElementCount)
      add('Apa khabar! I am Sang Kancil, your study buddy. Ask me for hints, explanations, or what to learn next! 🦌', 'bot');
  });
  document.getElementById('kancil-close').addEventListener('click', () => { panel.hidden = true; });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    add(q, 'user');
    add('…', 'bot');
    const thinking = log.lastElementChild;
    thinking.textContent = await askKancil(getUser(), q);
  });

  return { show: () => { box.hidden = false; }, hide: () => { box.hidden = true; } };
}
