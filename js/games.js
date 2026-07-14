// EduVerse Malaysia — mini-game components
// Each game receives a mount element + config and calls onDone(score 0..1).
// Games share reward plumbing via gamification.js so new games plug in easily.

import { esc, floatText } from './ui.js';
import { sfx } from './sounds.js';

// ---------- Memory Match: pair terms with meanings ----------
export function memoryMatch(mount, pairs, onDone) {
  // pairs: [[a, b], ...] max 4 pairs → 8 cards
  const cards = pairs.slice(0, 4).flatMap(([a, b], i) => [
    { id: i, label: a }, { id: i, label: b },
  ]).sort(() => Math.random() - 0.5);

  let flipped = [], matched = 0, moves = 0;
  mount.innerHTML = `
    <h3 class="display">🃏 Memory Match</h3>
    <p style="margin:.4rem 0 1rem">Match each pair. Fewer flips = more stars!</p>
    <div class="memory-grid"></div>`;
  const grid = mount.querySelector('.memory-grid');

  cards.forEach((c, idx) => {
    const btn = document.createElement('button');
    btn.className = 'memory-card';
    btn.dataset.idx = idx;
    btn.textContent = '❓';
    btn.setAttribute('aria-label', 'Hidden card');
    btn.addEventListener('click', () => {
      if (btn.classList.contains('flipped') || btn.classList.contains('matched') || flipped.length === 2) return;
      btn.classList.add('flipped');
      btn.textContent = c.label;
      flipped.push({ btn, c });
      if (flipped.length === 2) {
        moves++;
        const [x, y] = flipped;
        if (x.c.id === y.c.id) {
          x.btn.classList.add('matched'); y.btn.classList.add('matched');
          matched++; flipped = [];
          sfx.correct(matched);
          const r = y.btn.getBoundingClientRect();
          floatText(r.left + r.width / 2, r.top, '🃏 Match!');
          if (matched === Math.min(4, pairs.length)) {
            const score = Math.max(.4, Math.min(1, (pairs.length * 1.6) / moves));
            setTimeout(() => onDone(score), 500);
          }
        } else {
          setTimeout(() => {
            x.btn.classList.remove('flipped'); y.btn.classList.remove('flipped');
            x.btn.textContent = '❓'; y.btn.textContent = '❓';
            flipped = [];
          }, 700);
        }
      }
    });
    grid.appendChild(btn);
  });
}

// ---------- Balloon Pop: pop only correct answers ----------
export function balloonPop(mount, { question, correct, wrong }, onDone) {
  let popped = 0, mistakes = 0, spawned = 0, done = false;
  const need = correct.length;
  // A confident student already knows the answer and shouldn't have to wait
  // for that specific balloon to spawn and float by — a static row of
  // answer chips lets them confirm it immediately instead.
  const uniqueItems = [...new Map([...correct.map(t => [t, true]), ...wrong.map(t => [t, false])]).entries()]
    .sort(() => Math.random() - 0.5);
  mount.innerHTML = `
    <h3 class="display">🎈 Balloon Pop</h3>
    <p style="margin:.4rem 0 1rem">${esc(question)} — pop the <b>correct</b> balloons!</p>
    <div class="balloon-field" aria-label="Balloon game area"></div>
    <p class="game-status" style="margin-top:.6rem;font-weight:800"></p>
    <p style="margin:.8rem 0 .4rem;font-weight:800;color:var(--ink-soft)">⚡ Already sure? Tap it:</p>
    <div class="chip-row"></div>`;
  const field = mount.querySelector('.balloon-field');
  const status = mount.querySelector('.game-status');
  const chipRow = mount.querySelector('.chip-row');
  const colors = ['var(--lava)', 'var(--ocean)', 'var(--jungle)', 'var(--magic)', 'var(--sunset)'];
  const items = [...correct.map(t => ({ t, ok: true })), ...wrong.map(t => ({ t, ok: false }))]
    .sort(() => Math.random() - 0.5);

  const finish = () => {
    if (done) return;
    done = true;
    clearInterval(timer);
    onDone(Math.max(0, (popped - mistakes * 0.5) / need));
  };

  const resolve = (ok, x, y) => {
    if (ok) {
      popped++; sfx.correct(popped); floatText(x, y, '🎈 +1');
      status.textContent = `✅ ${popped}/${need} popped!`;
      if (popped >= need) finish();
    } else {
      mistakes++; sfx.wrong(); floatText(x, y, '✗', 'var(--lava)');
      status.textContent = '❌ Oops, that one was wrong!';
    }
  };

  uniqueItems.forEach(([text, ok]) => {
    const chip = document.createElement('button');
    chip.className = 'answer-chip'; chip.textContent = text;
    chip.addEventListener('click', ev => {
      chip.disabled = true; chip.classList.add(ok ? 'chip-correct' : 'chip-wrong');
      const r = chip.getBoundingClientRect();
      resolve(ok, r.left + r.width / 2, r.top);
    });
    chipRow.appendChild(chip);
  });

  const timer = setInterval(() => {
    // Keep spawning (recycled from the same pool) for as long as the round
    // lasts — a slow answer used to permanently stop new balloons once a
    // fixed spawn cap was hit, leaving the field empty until the 45s timeout.
    if (popped >= need || done) { if (popped >= need) finish(); return; }
    const item = items[spawned % items.length]; spawned++;
    const b = document.createElement('button');
    b.className = 'balloon';
    b.textContent = item.t;
    b.style.left = Math.random() * 80 + 5 + '%';
    b.style.background = colors[spawned % colors.length];
    b.style.animationDuration = 4 + Math.random() * 2 + 's';
    b.addEventListener('click', ev => { b.remove(); resolve(item.ok, ev.clientX, ev.clientY); });
    b.addEventListener('animationend', () => b.remove());
    field.appendChild(b);
  }, 900);

  // Safety stop after 45s
  setTimeout(() => { if (popped < need) finish(); }, 45000);
}

// ---------- Speed Quiz: answer fast for bonus ----------
export function speedQuiz(mount, questions, onDone) {
  let i = 0, score = 0;
  const render = () => {
    if (i >= questions.length) { onDone(score / questions.length); return; }
    const q = questions[i];
    const start = Date.now();
    mount.innerHTML = `
      <h3 class="display">⚡ Speed Quiz — ${i + 1}/${questions.length}</h3>
      <p class="lesson-step" style="margin:.6rem 0 1rem">${esc(q.q)}</p>
      <div></div>`;
    const box = mount.lastElementChild;
    q.options.forEach((opt, idx) => {
      const b = document.createElement('button');
      b.className = 'quiz-option';
      b.textContent = opt;
      b.addEventListener('click', ev => {
        const fast = (Date.now() - start) < 6000;
        if (idx === q.answer) {
          score += fast ? 1 : 0.7; b.classList.add('correct');
          sfx.correct(i); floatText(ev.clientX, ev.clientY, fast ? '⚡ FAST!' : '✓');
        } else { b.classList.add('wrong'); sfx.wrong(); floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)'); }
        setTimeout(() => { i++; render(); }, 600);
      });
      box.appendChild(b);
    });
  };
  render();
}

// ---------- Word Builder: arrange shuffled letters into the answer ----------
export function wordBuilder(mount, { question, word }, onDone) {
  const letters = word.toUpperCase().split('').sort(() => Math.random() - 0.5);
  let built = '', mistakes = 0;
  const render = () => {
    mount.innerHTML = `
      <h3 class="display">🔤 Word Builder</h3>
      <p style="margin:.4rem 0 1rem">${esc(question)}</p>
      <div class="word-slots" aria-label="Your word so far">${
        word.split('').map((_, i) => `<span class="word-slot">${esc(built[i] || '')}</span>`).join('')
      }</div>
      <div class="letter-tray"></div>`;
    const tray = mount.querySelector('.letter-tray');
    letters.forEach((ch, i) => {
      if (ch === null) return;
      const b = document.createElement('button');
      b.className = 'letter-tile'; b.textContent = ch;
      b.addEventListener('click', () => {
        if (ch === word.toUpperCase()[built.length]) {
          built += ch; letters[i] = null; sfx.correct();
          if (built.length === word.length) { setTimeout(() => onDone(Math.max(.4, 1 - mistakes * .15)), 400); return; }
        } else { mistakes++; sfx.wrong(); b.classList.add('tile-wrong'); setTimeout(() => b.classList.remove('tile-wrong'), 350); return; }
        render();
      });
      tray.appendChild(b);
    });
  };
  render();
}

// ---------- Catch the Answer: click the correct falling answer ----------
export function catchAnswer(mount, { question, correct, wrong }, onDone) {
  let caught = 0, misses = 0;
  const need = 3;
  mount.innerHTML = `
    <h3 class="display">🧺 Catch the Answer</h3>
    <p style="margin:.4rem 0 1rem">${esc(question)} — catch <b>${esc(correct)}</b> ${need} times!</p>
    <div class="balloon-field" aria-label="Falling answers area"></div>
    <p class="game-status" style="margin-top:.6rem;font-weight:800"></p>`;
  const field = mount.querySelector('.balloon-field');
  const status = mount.querySelector('.game-status');
  const pool = [correct, correct, ...wrong];
  const finish = () => { clearInterval(timer); onDone(Math.max(0, (caught - misses * .5) / need)); };
  const timer = setInterval(() => {
    const t = pool[Math.floor(Math.random() * pool.length)];
    const d = document.createElement('button');
    d.className = 'faller'; d.textContent = t;
    d.style.left = Math.random() * 75 + 5 + '%';
    d.style.animationDuration = 3.2 + Math.random() * 1.6 + 's';
    d.addEventListener('click', ev => {
      d.remove();
      if (t === correct) {
        caught++; sfx.correct(caught); floatText(ev.clientX, ev.clientY, '🧺 +1');
        status.textContent = `✅ ${caught}/${need} caught!`;
        if (caught >= need) finish();
      } else {
        misses++; sfx.wrong(); floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)');
        status.textContent = '❌ Not that one!';
      }
    });
    d.addEventListener('animationend', () => d.remove());
    field.appendChild(d);
  }, 850);
  setTimeout(() => { if (caught < need) finish(); }, 40000);
}

// ---------- Sort It!: tap each option into the Correct or Wrong bin ----------
export function sortBins(mount, { question, correct, wrong }, onDone) {
  const items = [...correct.map(t => ({ t, ok: true })), ...wrong.map(t => ({ t, ok: false }))]
    .sort(() => Math.random() - 0.5);
  let sorted = 0, mistakes = 0;
  mount.innerHTML = `
    <h3 class="display">🗂️ Sort It!</h3>
    <p style="margin:.4rem 0 1rem">${esc(question)} — tap each into the right bin.</p>
    <div class="sort-tray"></div>
    <div class="sort-bins">
      <div class="sort-bin sort-bin-correct">✅ Correct</div>
      <div class="sort-bin sort-bin-wrong">❌ Wrong</div>
    </div>
    <p class="game-status" style="margin-top:.6rem;font-weight:800"></p>`;
  const tray = mount.querySelector('.sort-tray');
  const status = mount.querySelector('.game-status');
  const binCorrect = mount.querySelector('.sort-bin-correct');
  const binWrong = mount.querySelector('.sort-bin-wrong');
  let selected = null;
  items.forEach((item, idx) => {
    const chip = document.createElement('button');
    chip.className = 'sort-chip';
    chip.textContent = item.t;
    chip.dataset.idx = idx;
    tray.appendChild(chip);
  });
  // Tap a chip to select it, then tap a bin to place it — reliable across mouse and touch.
  tray.addEventListener('click', ev => {
    const chip = ev.target.closest('.sort-chip');
    if (!chip || chip.disabled) return;
    tray.querySelectorAll('.sort-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    selected = chip;
  });
  const pick = isCorrectBin => ev => {
    if (!selected || selected.disabled) return;
    const chip = selected;
    const item = items[Number(chip.dataset.idx)];
    chip.disabled = true;
    const hit = isCorrectBin === item.ok;
    if (hit) {
      sorted++; sfx.correct(sorted); floatText(ev.clientX, ev.clientY, '🗂️ +1');
      chip.classList.add('correct');
    } else {
      mistakes++; sfx.wrong(); floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)');
      chip.classList.add('wrong');
    }
    status.textContent = `${sorted + mistakes}/${items.length} sorted`;
    chip.remove();
    selected = null;
    if (sorted + mistakes >= items.length) {
      setTimeout(() => onDone(Math.max(.2, sorted / items.length)), 400);
    }
  };
  binCorrect.addEventListener('click', pick(true));
  binWrong.addEventListener('click', pick(false));
}

// ---------- True/False Blitz: rapid-fire judge each statement ----------
export function trueFalseBlitz(mount, quiz, onDone) {
  // Build a mixed set of true statements (correct answer) and false ones
  // (a wrong option swapped in), so the game works for any subject's MCQ quiz.
  const rounds = quiz.slice(0, 5).map(q => {
    const useTrue = Math.random() < 0.5;
    const opt = useTrue ? q.options[q.answer] : q.options.filter((_, i) => i !== q.answer)[0];
    return { q: q.q, opt, isTrue: useTrue };
  });
  let i = 0, score = 0;
  const render = () => {
    if (i >= rounds.length) { onDone(score / rounds.length); return; }
    const r = rounds[i];
    mount.innerHTML = `
      <h3 class="display">⏱️ True or False Blitz — ${i + 1}/${rounds.length}</h3>
      <p class="lesson-step" style="margin:.6rem 0 1rem">${esc(r.q)}</p>
      <p style="font-weight:800;font-size:1.1rem;margin-bottom:1rem">"${esc(r.opt)}"</p>
      <div class="tf-buttons">
        <button class="btn" data-val="true">✅ True</button>
        <button class="btn" data-val="false">❌ False</button>
      </div>`;
    mount.querySelectorAll('[data-val]').forEach(b => {
      b.addEventListener('click', ev => {
        const guess = b.dataset.val === 'true';
        if (guess === r.isTrue) {
          score++; sfx.correct(i); floatText(ev.clientX, ev.clientY, '✓');
        } else { sfx.wrong(); floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)'); }
        setTimeout(() => { i++; render(); }, 500);
      });
    });
  };
  render();
}

// ---------- Maze: reach the treasure; a locked door needs a correct answer ----------
export function maze(mount, question, onDone) {
  // 0 floor · 1 wall · D door · T treasure · S start
  const LAYOUTS = [
    ['S01000100', '000110110', '110100000', '000001101', '011101001', '0100001D0', '000111010', '110000010', '00101000T'],
    ['S00010000', '110010110', '000010000', '011011011', '000000010', '01011D010', '010010000', '000011110', '11000000T'],
  ];
  const grid = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)].map(r => r.split(''));
  const H = grid.length, W = grid[0].length;
  let px = 0, py = 0, doorOpen = false, steps = 0, wrongTries = 0, finished = false;
  grid.forEach((row, y) => row.forEach((c, x) => { if (c === 'S') { px = x; py = y; } }));

  mount.innerHTML = `
    <h3 class="display">🗿 Secret Cave Maze</h3>
    <p style="margin:.4rem 0 1rem">Find the treasure! The 🚪 door only opens if you answer correctly.</p>
    <div class="maze-grid" role="application" aria-label="Maze, use arrow keys or buttons to move" tabindex="0"></div>
    <div class="dpad">
      <span></span><button data-d="0,-1" aria-label="Up">⬆️</button><span></span>
      <button data-d="-1,0" aria-label="Left">⬅️</button><button data-d="0,1" aria-label="Down">⬇️</button><button data-d="1,0" aria-label="Right">➡️</button>
    </div>
    <div class="maze-question" hidden></div>`;
  const gridEl = mount.querySelector('.maze-grid');
  gridEl.style.gridTemplateColumns = `repeat(${W}, 1fr)`;
  const qBox = mount.querySelector('.maze-question');

  const draw = () => {
    gridEl.innerHTML = grid.map((row, y) => row.map((c, x) => {
      const cls = c === '1' ? 'wall' : 'floor';
      let icon = '';
      if (x === px && y === py) icon = '🧑‍🚀';
      else if (c === 'T') icon = '🏆';
      else if (c === 'D' && !doorOpen) icon = '🚪';
      return `<span class="maze-cell ${cls}">${icon}</span>`;
    }).join('')).join('');
  };

  const askDoor = () => {
    qBox.hidden = false;
    qBox.innerHTML = `<p style="font-weight:800;margin:.8rem 0 .4rem">🚪 The door asks: ${esc(question.q)}</p><div></div>`;
    const box = qBox.lastElementChild;
    question.options.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'quiz-option'; b.textContent = o;
      b.addEventListener('click', () => {
        if (i === question.answer) { doorOpen = true; sfx.correct(); qBox.hidden = true; draw(); }
        else { wrongTries++; sfx.wrong(); b.classList.add('wrong'); }
      });
      box.appendChild(b);
    });
  };

  const move = (dx, dy) => {
    if (finished || !qBox.hidden) return;
    const nx = px + dx, ny = py + dy;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H || grid[ny][nx] === '1') return;
    if (grid[ny][nx] === 'D' && !doorOpen) { askDoor(); return; }
    px = nx; py = ny; steps++;
    if (grid[ny][nx] === 'T') {
      finished = true; sfx.chest(); draw();
      setTimeout(() => onDone(Math.max(.4, 1 - wrongTries * .2 - Math.max(0, steps - 30) * .01)), 500);
      return;
    }
    draw();
  };

  mount.querySelectorAll('.dpad button').forEach(b => b.addEventListener('click', () => {
    const [dx, dy] = b.dataset.d.split(',').map(Number); move(dx, dy);
  }));
  gridEl.addEventListener('keydown', e => {
    const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
    if (d) { e.preventDefault(); move(d[0], d[1]); }
  });
  draw();
  gridEl.focus();
}

// ---------- Crossword: two quiz answers crossing at a shared letter ----------
// Returns null (caller falls back) when no crossing pair exists.
export function buildCrossword(quiz) {
  const words = quiz
    .map(q => ({ w: q.options[q.answer].toUpperCase(), clue: q.q }))
    .filter(x => /^[A-Z]{3,10}$/.test(x.w));
  for (let a = 0; a < words.length; a++) {
    for (let b = 0; b < words.length; b++) {
      if (a === b) continue;
      for (let i = 0; i < words[a].w.length; i++) {
        const j = words[b].w.indexOf(words[a].w[i]);
        if (j !== -1) return { across: words[a], down: words[b], ai: i, dj: j };
      }
    }
  }
  return null;
}

export function crossword(mount, layout, onDone) {
  const { across, down, ai, dj } = layout;
  // Across at row dj (so the shared letter lines up), down at column ai.
  const H = down.w.length, W = across.w.length;
  const cells = {}; // "x,y" -> answer letter
  for (let x = 0; x < W; x++) cells[`${x},${dj}`] = across.w[x];
  for (let y = 0; y < H; y++) cells[`${ai},${y}`] = down.w[y];

  mount.innerHTML = `
    <h3 class="display">✏️ Mini Crossword</h3>
    <p style="margin:.4rem 0"><b>Across:</b> ${esc(across.clue)}</p>
    <p style="margin:0 0 1rem"><b>Down:</b> ${esc(down.clue)}</p>
    <div class="cw-grid" style="grid-template-columns:repeat(${W},1fr)"></div>
    <button class="btn btn-green" style="margin-top:1rem" id="cw-check">Check ✔</button>`;
  const gridEl = mount.querySelector('.cw-grid');
  const inputs = {};
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const key = `${x},${y}`;
      if (cells[key]) {
        const inp = document.createElement('input');
        inp.className = 'cw-cell'; inp.maxLength = 1;
        inp.setAttribute('aria-label', `Row ${y + 1} column ${x + 1}`);
        inp.addEventListener('input', () => { inp.value = inp.value.toUpperCase(); });
        inputs[key] = inp;
        gridEl.appendChild(inp);
      } else {
        const s = document.createElement('span');
        s.className = 'cw-block';
        gridEl.appendChild(s);
      }
    }
  }
  let checks = 0;
  mount.querySelector('#cw-check').addEventListener('click', () => {
    checks++;
    let right = 0, total = 0;
    for (const [key, letter] of Object.entries(cells)) {
      total++;
      const ok = inputs[key].value === letter;
      inputs[key].classList.toggle('cw-right', ok);
      inputs[key].classList.toggle('cw-wrong', !ok);
      if (ok) right++;
    }
    if (right === total) { sfx.chest(); setTimeout(() => onDone(Math.max(.5, 1.1 - checks * .1)), 500); }
    else sfx.wrong();
  });
}

// ---------- Escape Room: answer to unlock each of 3 doors before energy runs out ----------
export function escapeRoom(mount, questions, onDone) {
  const rooms = questions.slice(0, 3);
  let roomIdx = 0, energy = 3;
  const SCENES = ['🕯️ The Dusty Library', '⚗️ The Potion Lab', '🗝️ The Final Vault'];
  const render = () => {
    if (roomIdx >= rooms.length) { sfx.chest(); onDone(energy / 3); return; }
    if (energy <= 0) { onDone(0.2); return; }
    const q = rooms[roomIdx];
    mount.innerHTML = `
      <h3 class="display">🔐 Escape Room — Room ${roomIdx + 1}/${rooms.length}</h3>
      <div class="escape-scene">${SCENES[roomIdx]}</div>
      <p style="font-weight:800;margin:.6rem 0">Energy: ${'❤️'.repeat(energy)}${'🖤'.repeat(3 - energy)}</p>
      <p class="lesson-step" style="margin:.4rem 0 1rem">The lock whispers: <i>${esc(q.q)}</i></p>
      <div></div>`;
    const box = mount.lastElementChild;
    q.options.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'quiz-option'; b.textContent = o;
      b.addEventListener('click', () => {
        if (i === q.answer) {
          sfx.correct(); b.classList.add('correct');
          setTimeout(() => { roomIdx++; render(); }, 600);
        } else {
          energy--; sfx.wrong(); b.classList.add('wrong');
          setTimeout(render, 700);
        }
      });
      box.appendChild(b);
    });
  };
  render();
}

// ---------- Sentence Builder: tap words in order to rebuild the answer ----------
// Works for any correct answer that is a short multi-word phrase.
export function sentenceBuilder(mount, { question, phrase }, onDone) {
  const words = phrase.split(' ');
  const bank = words.map((w, i) => ({ w, i })).sort(() => Math.random() - 0.5);
  let built = [], mistakes = 0;
  const render = () => {
    mount.innerHTML = `
      <h3 class="display">📝 Sentence Builder</h3>
      <p style="margin:.4rem 0 1rem">${esc(question)}</p>
      <div class="word-slots sentence-slots">${
        words.map((_, i) => `<span class="word-slot sentence-slot">${built[i] ? esc(built[i]) : ''}</span>`).join('')
      }</div>
      <div class="letter-tray"></div>`;
    const tray = mount.querySelector('.letter-tray');
    bank.forEach(item => {
      if (item.used) return;
      const b = document.createElement('button');
      b.className = 'letter-tile sentence-tile'; b.textContent = item.w;
      b.addEventListener('click', ev => {
        if (item.w === words[built.length]) {
          built.push(item.w); item.used = true; sfx.correct(built.length);
          floatText(ev.clientX, ev.clientY, '✓');
          if (built.length === words.length) { setTimeout(() => onDone(Math.max(.4, 1 - mistakes * .15)), 400); return; }
        } else {
          mistakes++; sfx.wrong(); b.classList.add('tile-wrong');
          setTimeout(() => b.classList.remove('tile-wrong'), 350); return;
        }
        render();
      });
      tray.appendChild(b);
    });
  };
  render();
}

// A quiz answer usable as a Sentence Builder phrase: 2-6 words, letters only.
function phraseCandidate(quiz) {
  for (const q of quiz) {
    const ans = q.options[q.answer];
    const words = ans.trim().split(/\s+/);
    if (words.length >= 2 && words.length <= 6 && /^[A-Za-z\s]+$/.test(ans)) return { q, phrase: ans.trim() };
  }
  return null;
}

// ---------- Math Ninja: slice the correct falling answer, misses cost energy ----------
export function mathNinja(mount, { question, correct, wrong }, onDone) {
  let hits = 0, energy = 3, spawned = 0;
  const need = 3;
  mount.innerHTML = `
    <h3 class="display">🥷 Math Ninja</h3>
    <p style="margin:.4rem 0 1rem">${esc(question)} — slice the correct answer, dodge the rest!</p>
    <p style="font-weight:800" id="ninja-energy"></p>
    <div class="balloon-field ninja-field" aria-label="Math Ninja game area"></div>
    <p class="game-status" style="margin-top:.6rem;font-weight:800"></p>`;
  const field = mount.querySelector('.ninja-field');
  const status = mount.querySelector('.game-status');
  const energyEl = mount.querySelector('#ninja-energy');
  const drawEnergy = () => { energyEl.textContent = '❤️'.repeat(energy) + '🖤'.repeat(3 - energy); };
  drawEnergy();
  const pool = [...Array(3).fill(correct), ...wrong].sort(() => Math.random() - 0.5);
  let finished = false;
  const finish = score => { if (finished) return; finished = true; clearInterval(timer); onDone(score); };

  const timer = setInterval(() => {
    if (finished) return;
    const label = pool[spawned % pool.length]; spawned++;
    const s = document.createElement('button');
    s.className = 'ninja-shuriken'; s.textContent = label;
    s.style.left = Math.random() * 75 + 5 + '%';
    s.style.animationDuration = 2.6 + Math.random() * 1.4 + 's';
    s.addEventListener('click', ev => {
      s.classList.add('sliced');
      if (label === correct) {
        hits++; sfx.correct(hits); floatText(ev.clientX, ev.clientY, '⚔️ Hit!');
        status.textContent = `${hits}/${need} sliced!`;
        if (hits >= need) setTimeout(() => finish(Math.max(.5, 1 - (3 - energy) * .15)), 300);
      } else {
        energy--; drawEnergy(); sfx.wrong(); floatText(ev.clientX, ev.clientY, '✗ Oops!', 'var(--lava)');
        status.textContent = 'That was a decoy!';
        if (energy <= 0) setTimeout(() => finish(.2), 300);
      }
      setTimeout(() => s.remove(), 180);
    });
    s.addEventListener('animationend', () => s.remove());
    field.appendChild(s);
  }, 950);
  setTimeout(() => finish(hits >= need ? 1 : .3), 45000);
}

// ---------- Speak It!: Web Speech API pronunciation practice ----------
export function speakChallenge(mount, { question, word, lang }, onDone) {
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const maxAttempts = 3;
  let attempts = 0, finished = false;
  const finish = score => { if (finished) return; finished = true; try { recognizer?.stop(); } catch { /* already stopped */ } onDone(score); };

  mount.innerHTML = `
    <h3 class="display">🎤 Speak It!</h3>
    <p style="margin:.4rem 0 1rem">${esc(question)}</p>
    <div style="text-align:center">
      <div class="speak-word">${esc(word)}</div>
      <button class="btn btn-purple" id="mic-btn">🎤 Tap and say the word</button>
      <p id="speak-status" style="margin-top:.8rem;font-weight:800;min-height:1.4em"></p>
      <button class="btn btn-ghost btn-sm" id="speak-skip" style="margin-top:.4rem">Having trouble? Skip</button>
    </div>`;
  const status = mount.querySelector('#speak-status');
  const micBtn = mount.querySelector('#mic-btn');
  mount.querySelector('#speak-skip').addEventListener('click', () => finish(0.5));

  if (!Rec) { status.textContent = "This device can't listen — tap Skip to continue."; micBtn.disabled = true; return; }

  const recognizer = new Rec();
  recognizer.lang = lang || 'en-US';
  recognizer.maxAlternatives = 3;
  let gotResult = false, watchdog = null;
  micBtn.addEventListener('click', () => {
    if (attempts >= maxAttempts) return;
    micBtn.disabled = true; status.textContent = '🎙️ Listening...'; gotResult = false;
    try { recognizer.start(); } catch { micBtn.disabled = false; return; }
    // Some devices/browsers never fire onresult or onerror (silent stall) —
    // this watchdog guarantees the mic button always recovers.
    clearTimeout(watchdog);
    watchdog = setTimeout(() => {
      if (!gotResult && !finished) {
        try { recognizer.stop(); } catch { /* already stopped */ }
        micBtn.disabled = false;
        status.textContent = "Didn't catch that — tap the mic to try again, or Skip.";
      }
    }, 7000);
  });
  recognizer.onresult = e => {
    gotResult = true; clearTimeout(watchdog);
    attempts++;
    const heard = [...e.results[0]].map(r => r.transcript.toLowerCase().trim());
    const target = word.toLowerCase();
    const correct = heard.some(s => s === target || s.includes(target));
    micBtn.disabled = false;
    if (correct) {
      sfx.correct(); status.textContent = '✅ Great pronunciation!';
      setTimeout(() => finish(Math.max(.5, 1 - (attempts - 1) * .15)), 700);
    } else if (attempts >= maxAttempts) {
      sfx.wrong(); status.textContent = `Heard: "${heard[0]}" — nice try!`;
      setTimeout(() => finish(.3), 900);
    } else {
      sfx.wrong(); status.textContent = `Heard: "${heard[0]}" — try again! (${maxAttempts - attempts} left)`;
    }
  };
  recognizer.onerror = () => {
    gotResult = true; clearTimeout(watchdog);
    micBtn.disabled = false; status.textContent = 'Microphone issue — tap the mic to try again, or Skip.';
  };
  // Belt-and-suspenders: if recognition ends with no result and no error
  // event at all (observed on some Android WebViews), still recover.
  recognizer.onend = () => {
    if (!gotResult) { clearTimeout(watchdog); micBtn.disabled = false; }
  };
}

// ---------- Imbuhan Machine (BM): attach the right affix to the kata dasar ----------
// Self-contained KSSR content — imbuhan is the most-tested BM grammar topic.
const IMBUHAN_ROUNDS = [
  { dasar: 'main',  ayat: 'Adik suka ___ bola di padang.',        pilihan: ['bermain', 'memain', 'termain'],     jawapan: 0 },
  { dasar: 'baca',  ayat: 'Aina ___ buku cerita setiap malam.',   pilihan: ['membaca', 'berbaca', 'pembaca'],    jawapan: 0 },
  { dasar: 'tulis', ayat: 'Cikgu meminta kami ___ karangan.',     pilihan: ['menulis', 'bertulis', 'tertulis'],  jawapan: 0 },
  { dasar: 'ajar',  ayat: 'Puan Lim ialah seorang ___.',          pilihan: ['pengajar', 'mengajar', 'belajar'],  jawapan: 0 },
  { dasar: 'lari',  ayat: 'Kucing itu ___ apabila terkejut.',     pilihan: ['berlari', 'melari', 'terlari'],     jawapan: 0 },
  { dasar: 'masak', ayat: 'Ibu sedang ___ nasi lemak di dapur.',  pilihan: ['memasak', 'bermasak', 'termasak'],  jawapan: 0 },
  { dasar: 'tolong',ayat: 'Kami mesti ___ jiran yang susah.',     pilihan: ['menolong', 'bertolong', 'penolong'],jawapan: 0 },
  { dasar: 'jual',  ayat: 'Pak Samad ___ sayur di pasar tani.',   pilihan: ['menjual', 'berjual', 'terjual'],    jawapan: 0 },
  { dasar: 'lukis', ayat: 'Hafiz suka ___ pemandangan kampung.',  pilihan: ['melukis', 'berlukis', 'pelukis'],   jawapan: 0 },
  { dasar: 'tidur', ayat: 'Bayi itu ___ dengan nyenyak.',         pilihan: ['tertidur', 'menidur', 'petidur'],   jawapan: 0 },
];

export function imbuhanMachine(mount, onDone) {
  const rounds = [...IMBUHAN_ROUNDS].sort(() => Math.random() - 0.5).slice(0, 5)
    // Shuffle options per round so the answer isn't always the first tile.
    .map(r => {
      const opts = r.pilihan.map((p, i) => ({ p, ok: i === r.jawapan })).sort(() => Math.random() - 0.5);
      return { ...r, opts };
    });
  let i = 0, score = 0;
  const render = () => {
    if (i >= rounds.length) { onDone(score / rounds.length); return; }
    const r = rounds[i];
    mount.innerHTML = `
      <h3 class="display">🧩 Mesin Imbuhan — ${i + 1}/${rounds.length}</h3>
      <p style="margin:.4rem 0 .6rem">Pilih perkataan berimbuhan yang betul!</p>
      <div class="imbuhan-dasar">Kata dasar: <b>${esc(r.dasar)}</b></div>
      <p class="lesson-step" style="margin:.6rem 0 1rem">${esc(r.ayat)}</p>
      <div class="chip-row"></div>`;
    const row = mount.querySelector('.chip-row');
    r.opts.forEach(({ p, ok }) => {
      const b = document.createElement('button');
      b.className = 'answer-chip'; b.textContent = p;
      b.addEventListener('click', ev => {
        b.classList.add(ok ? 'chip-correct' : 'chip-wrong');
        if (ok) { score++; sfx.correct(i); floatText(ev.clientX, ev.clientY, '🧩 Betul!'); }
        else { sfx.wrong(); floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)'); }
        row.querySelectorAll('button').forEach(x => x.disabled = true);
        setTimeout(() => { i++; render(); }, 700);
      });
      row.appendChild(b);
    });
  };
  render();
}

// ---------- Pasar Malam Cashier (Maths): give the right change with RM notes ----------
export function pasarMalamCashier(mount, onDone) {
  const STALL = [
    { item: 'Satay (10 cucuk)', emoji: '🍢' }, { item: 'Air tebu', emoji: '🥤' },
    { item: 'Apam balik', emoji: '🥞' }, { item: 'Nasi lemak', emoji: '🍚' },
    { item: 'Cendol', emoji: '🍧' }, { item: 'Keropok lekor', emoji: '🍤' },
  ];
  const NOTES = [50, 20, 10, 5, 1]; // RM denominations the till holds
  const need = 3;
  let served = 0, mistakes = 0;

  const newOrder = () => {
    const price = Math.floor(Math.random() * 37) + 3; // RM3–RM39
    const pay = price < 19 ? 20 : 50; // always pays with one note, change ≥ RM1
    return { ...STALL[Math.floor(Math.random() * STALL.length)], price, pay, change: pay - price };
  };

  const render = () => {
    if (served >= need) { onDone(Math.max(.3, 1 - mistakes * .15)); return; }
    const o = newOrder();
    let given = 0;
    mount.innerHTML = `
      <h3 class="display">🛒 Pasar Malam Cashier — ${served + 1}/${need}</h3>
      <p style="margin:.4rem 0 .6rem">${o.emoji} Customer buys <b>${esc(o.item)}</b> for <b>RM${o.price}</b> and pays <b>RM${o.pay}</b>.</p>
      <p style="font-weight:800;margin:0 0 .6rem">Tap notes to give the correct change:</p>
      <div class="cash-tray"></div>
      <p class="cash-given" style="font-weight:800;margin:.6rem 0">Change given: RM0</p>
      <button class="btn btn-green" id="cash-done">Give change ✔</button>
      <p class="game-status" style="margin-top:.6rem;font-weight:800"></p>`;
    const tray = mount.querySelector('.cash-tray');
    const givenEl = mount.querySelector('.cash-given');
    const status = mount.querySelector('.game-status');
    NOTES.forEach(n => {
      const b = document.createElement('button');
      b.className = 'cash-note'; b.textContent = `RM${n}`;
      b.addEventListener('click', ev => {
        given += n; sfx.click?.();
        floatText(ev.clientX, ev.clientY, `+RM${n}`);
        givenEl.textContent = `Change given: RM${given}`;
      });
      tray.appendChild(b);
    });
    mount.querySelector('#cash-done').addEventListener('click', ev => {
      if (given === o.change) {
        served++; sfx.correct(served); floatText(ev.clientX, ev.clientY, '💰 Betul!');
        setTimeout(render, 600);
      } else {
        mistakes++; sfx.wrong(); floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)');
        status.textContent = given > o.change
          ? `❌ Too much! The customer needs RM${o.change} back. Try again.`
          : `❌ Not enough! The customer needs RM${o.change} back. Try again.`;
        given = 0; givenEl.textContent = 'Change given: RM0';
      }
    });
  };
  render();
}

// ---------- Roti Canai Slicer (Fractions): serve the ordered fraction of a roti ----------
export function rotiCanaiSlicer(mount, onDone) {
  // Each order shows the target as fraction, percent, or decimal — equivalence practice.
  const ORDERS = [
    { num: 1, den: 2 }, { num: 1, den: 4 }, { num: 3, den: 4 },
    { num: 2, den: 5 }, { num: 3, den: 8 }, { num: 5, den: 8 },
    { num: 2, den: 3 }, { num: 7, den: 10 },
  ];
  const need = 3;
  let served = 0, mistakes = 0;

  const label = o => {
    const forms = [`${o.num}/${o.den}`];
    const pct = (o.num / o.den) * 100;
    // Only offer % and decimal forms when they're clean KSSR-style values.
    if (Number.isInteger(pct)) forms.push(`${pct}%`, String(o.num / o.den));
    return forms[Math.floor(Math.random() * forms.length)];
  };

  const render = () => {
    if (served >= need) { onDone(Math.max(.3, 1 - mistakes * .15)); return; }
    const o = ORDERS[Math.floor(Math.random() * ORDERS.length)];
    const shown = label(o);
    const picked = new Set();
    mount.innerHTML = `
      <h3 class="display">🍕 Roti Canai Slicer — ${served + 1}/${need}</h3>
      <p style="margin:.4rem 0 .6rem">The roti is cut into <b>${o.den}</b> equal pieces. Serve <b>${esc(shown)}</b> of it — tap the slices!</p>
      <svg class="roti-svg" viewBox="-105 -105 210 210" aria-label="Roti canai divided into ${o.den} slices"></svg>
      <p class="game-status" style="font-weight:800;margin:.6rem 0">Served: 0/${o.den}</p>
      <button class="btn btn-green" id="roti-done">Serve it! 🍽️</button>`;
    const svg = mount.querySelector('.roti-svg');
    const status = mount.querySelector('.game-status');
    for (let i = 0; i < o.den; i++) {
      const a0 = (i / o.den) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((i + 1) / o.den) * 2 * Math.PI - Math.PI / 2;
      const big = (a1 - a0) > Math.PI ? 1 : 0;
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', `M0 0 L${Math.cos(a0) * 100} ${Math.sin(a0) * 100} A100 100 0 ${big} 1 ${Math.cos(a1) * 100} ${Math.sin(a1) * 100} Z`);
      p.setAttribute('class', 'roti-slice');
      p.addEventListener('click', () => {
        picked.has(i) ? picked.delete(i) : picked.add(i);
        p.classList.toggle('roti-picked', picked.has(i));
        sfx.click?.();
        status.textContent = `Served: ${picked.size}/${o.den}`;
      });
      svg.appendChild(p);
    }
    mount.querySelector('#roti-done').addEventListener('click', ev => {
      if (picked.size === o.num) {
        served++; sfx.correct(served); floatText(ev.clientX, ev.clientY, '🍽️ Sedap!');
        setTimeout(render, 600);
      } else {
        mistakes++; sfx.wrong(); floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)');
        status.textContent = `❌ ${esc(shown)} of ${o.den} slices is ${o.num} slices — try again!`;
      }
    });
  };
  render();
}

// ---------- Tense Time Machine (English): rewrite the verb for the era ----------
// Self-contained KSSR content — simple past/present/future tense drill.
const TENSE_BANK = [
  { subj: 'Ali',        rest: 'nasi lemak for breakfast', present: 'eats',    past: 'ate',     future: 'will eat' },
  { subj: 'The pupils', rest: 'football after school',    present: 'play',    past: 'played',  future: 'will play' },
  { subj: 'Mei Ling',   rest: 'a letter to her cousin',   present: 'writes',  past: 'wrote',   future: 'will write' },
  { subj: 'My father',  rest: 'to work by bus',           present: 'goes',    past: 'went',    future: 'will go' },
  { subj: 'The cat',    rest: 'under the rambutan tree',  present: 'sleeps',  past: 'slept',   future: 'will sleep' },
  { subj: 'Siti',       rest: 'a beautiful song',         present: 'sings',   past: 'sang',    future: 'will sing' },
  { subj: 'We',         rest: 'our grandparents in Ipoh', present: 'visit',   past: 'visited', future: 'will visit' },
  { subj: 'The farmer', rest: 'paddy in the field',       present: 'plants',  past: 'planted', future: 'will plant' },
];
const ERAS = [
  { key: 'past',    label: 'Yesterday ⏪', hint: 'yesterday' },
  { key: 'present', label: 'Now ⏺️',      hint: 'every day' },
  { key: 'future',  label: 'Tomorrow ⏩', hint: 'tomorrow' },
];

export function tenseTimeMachine(mount, onDone) {
  const rounds = [...TENSE_BANK].sort(() => Math.random() - 0.5).slice(0, 5)
    .map(r => ({ ...r, era: ERAS[Math.floor(Math.random() * ERAS.length)] }));
  let i = 0, score = 0;
  const render = () => {
    if (i >= rounds.length) { onDone(score / rounds.length); return; }
    const r = rounds[i];
    const opts = ERAS.map(e => ({ v: r[e.key], ok: e.key === r.era.key })).sort(() => Math.random() - 0.5);
    mount.innerHTML = `
      <h3 class="display">⏰ Tense Time Machine — ${i + 1}/${rounds.length}</h3>
      <p style="margin:.4rem 0 .6rem">The time portal lands on: <b>${esc(r.era.label)}</b></p>
      <p class="lesson-step" style="margin:.6rem 0 1rem">${esc(r.subj)} ___ ${esc(r.rest)} <i>(${esc(r.era.hint)})</i>.</p>
      <div class="chip-row"></div>`;
    const row = mount.querySelector('.chip-row');
    opts.forEach(({ v, ok }) => {
      const b = document.createElement('button');
      b.className = 'answer-chip'; b.textContent = v;
      b.addEventListener('click', ev => {
        b.classList.add(ok ? 'chip-correct' : 'chip-wrong');
        if (ok) { score++; sfx.correct(i); floatText(ev.clientX, ev.clientY, '⏰ Correct!'); }
        else { sfx.wrong(); floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)'); }
        row.querySelectorAll('button').forEach(x => x.disabled = true);
        setTimeout(() => { i++; render(); }, 700);
      });
      row.appendChild(b);
    });
  };
  render();
}

// ---------- Peta Pin Drop (Geografi): tap the right state on a stylised map ----------
// Approximate pin positions on a simplified Malaysia map (not to scale — a
// kid-friendly schematic, same spirit as textbook activity maps).
const MAP_PINS = [
  { id: 'perlis',     name: 'Perlis',          x: 72,  y: 22,  capital: 'Kangar' },
  { id: 'kedah',      name: 'Kedah',           x: 68,  y: 45,  capital: 'Alor Setar' },
  { id: 'penang',     name: 'Pulau Pinang',    x: 50,  y: 66,  capital: 'George Town' },
  { id: 'kelantan',   name: 'Kelantan',        x: 108, y: 42,  capital: 'Kota Bharu' },
  { id: 'terengganu', name: 'Terengganu',      x: 128, y: 70,  capital: 'Kuala Terengganu' },
  { id: 'perak',      name: 'Perak',           x: 76,  y: 88,  capital: 'Ipoh' },
  { id: 'pahang',     name: 'Pahang',          x: 112, y: 112, capital: 'Kuantan' },
  { id: 'selangor',   name: 'Selangor',        x: 72,  y: 128, capital: 'Shah Alam' },
  { id: 'n9',         name: 'Negeri Sembilan', x: 88,  y: 152, capital: 'Seremban' },
  { id: 'melaka',     name: 'Melaka',          x: 84,  y: 172, capital: 'Bandar Melaka' },
  { id: 'johor',      name: 'Johor',           x: 108, y: 188, capital: 'Johor Bahru' },
  { id: 'sarawak',    name: 'Sarawak',         x: 262, y: 158, capital: 'Kuching' },
  { id: 'sabah',      name: 'Sabah',           x: 348, y: 92,  capital: 'Kota Kinabalu' },
];

export function petaPinDrop(mount, onDone) {
  const rounds = [...MAP_PINS].sort(() => Math.random() - 0.5).slice(0, 5)
    // Mix "find the state" and "which state's capital is X" prompts.
    .map(p => ({ p, byCapital: Math.random() < 0.4 }));
  let i = 0, score = 0;
  mount.innerHTML = `
    <h3 class="display">📍 Peta Pin Drop</h3>
    <p class="pin-prompt" style="margin:.4rem 0 .6rem;font-weight:800"></p>
    <svg class="peta-svg" viewBox="0 0 400 220" aria-label="Peta Malaysia (skematik)">
      <path class="peta-land" d="M60 14 Q100 8 118 36 Q140 52 138 90 Q134 130 118 165 Q108 195 100 202 Q88 206 78 188 Q58 150 56 108 Q50 60 60 14 Z"/>
      <path class="peta-land" d="M228 190 Q210 172 228 148 Q248 120 286 108 Q316 80 344 70 Q372 66 376 92 Q378 112 352 118 Q322 132 300 152 Q272 178 248 194 Q234 198 228 190 Z"/>
    </svg>
    <p class="game-status" style="margin-top:.4rem;font-weight:800"></p>`;
  const svg = mount.querySelector('.peta-svg');
  const prompt = mount.querySelector('.pin-prompt');
  const status = mount.querySelector('.game-status');
  MAP_PINS.forEach(p => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    g.setAttribute('cx', p.x); g.setAttribute('cy', p.y); g.setAttribute('r', 9);
    g.setAttribute('class', 'peta-pin'); g.dataset.id = p.id;
    g.addEventListener('click', ev => pick(p, g, ev));
    svg.appendChild(g);
  });
  const ask = () => {
    if (i >= rounds.length) { onDone(score / rounds.length); return; }
    const r = rounds[i];
    prompt.textContent = r.byCapital
      ? `🏛️ Ibu negerinya ialah ${r.p.capital} — tap negeri itu!`
      : `📍 Tap pin untuk negeri ${r.p.name}!`;
    status.textContent = `Soalan ${i + 1}/${rounds.length}`;
    svg.querySelectorAll('.peta-pin').forEach(c => c.classList.remove('pin-right', 'pin-wrong'));
  };
  let locked = false;
  const pick = (p, el, ev) => {
    if (locked || i >= rounds.length) return;
    locked = true;
    const target = rounds[i].p;
    if (p.id === target.id) {
      score++; sfx.correct(i); el.classList.add('pin-right');
      floatText(ev.clientX, ev.clientY, '📍 Betul!');
    } else {
      sfx.wrong(); el.classList.add('pin-wrong');
      svg.querySelector(`[data-id="${target.id}"]`).classList.add('pin-right');
      floatText(ev.clientX, ev.clientY, '✗', 'var(--lava)');
      status.textContent = `❌ Itu ${p.name}. ${target.name} yang bertanda hijau.`;
    }
    setTimeout(() => { i++; locked = false; ask(); }, p.id === target.id ? 700 : 1600);
  };
  ask();
}

// ---------- Irama Repeat (Music): echo the traditional-instrument rhythm ----------
const INSTRUMENTS = [
  { name: 'Kompang',  emoji: '🥁', freq: 196, type: 'square' },
  { name: 'Gong',     emoji: '🔔', freq: 110, type: 'sine' },
  { name: 'Angklung', emoji: '🎐', freq: 523, type: 'triangle' },
  { name: 'Seruling', emoji: '🎶', freq: 784, type: 'sine' },
];

export function iramaRepeat(mount, onDone) {
  const levels = [3, 4, 5]; // pattern length per level
  let level = 0, cleared = 0, mistakes = 0;
  mount.innerHTML = `
    <h3 class="display">🥁 Irama Repeat</h3>
    <p style="margin:.4rem 0 .6rem">Dengar irama alat muzik tradisional, kemudian ulang semula!</p>
    <p class="game-status" style="font-weight:800;margin:.4rem 0"></p>
    <div class="irama-pads"></div>
    <button class="btn btn-purple" id="irama-play" style="margin-top:.8rem">▶️ Play the rhythm</button>`;
  const pads = mount.querySelector('.irama-pads');
  const status = mount.querySelector('.game-status');
  const playBtn = mount.querySelector('#irama-play');
  const padEls = INSTRUMENTS.map((ins, idx) => {
    const b = document.createElement('button');
    b.className = 'irama-pad';
    b.innerHTML = `${ins.emoji}<span>${esc(ins.name)}</span>`;
    b.addEventListener('click', () => tapPad(idx));
    pads.appendChild(b);
    return b;
  });
  let pattern = [], inputPos = -1; // -1 = not accepting input
  const flash = idx => {
    sfx.note(INSTRUMENTS[idx].freq, .3, INSTRUMENTS[idx].type);
    padEls[idx].classList.add('pad-lit');
    setTimeout(() => padEls[idx].classList.remove('pad-lit'), 320);
  };
  const playPattern = () => {
    inputPos = -1; playBtn.disabled = true;
    status.textContent = `🎵 Level ${level + 1}/${levels.length} — listen...`;
    pattern.forEach((idx, n) => setTimeout(() => flash(idx), 550 * n));
    setTimeout(() => {
      inputPos = 0; playBtn.disabled = false;
      status.textContent = '👆 Your turn — repeat the rhythm!';
    }, 550 * pattern.length + 200);
  };
  const startLevel = () => {
    pattern = Array.from({ length: levels[level] }, () => Math.floor(Math.random() * INSTRUMENTS.length));
    playPattern();
  };
  const tapPad = idx => {
    if (inputPos < 0) { flash(idx); return; } // free play while listening is off
    flash(idx);
    if (idx === pattern[inputPos]) {
      inputPos++;
      if (inputPos >= pattern.length) {
        cleared++; level++; inputPos = -1;
        sfx.correct(level);
        if (level >= levels.length) {
          status.textContent = '🏆 Hebat! Perfect rhythm!';
          setTimeout(() => onDone(Math.max(.3, cleared / levels.length - mistakes * .1)), 700);
        } else {
          status.textContent = '✅ Betul! Next level...';
          setTimeout(startLevel, 900);
        }
      }
    } else {
      mistakes++; inputPos = -1; sfx.wrong();
      status.textContent = '❌ Tersilap — tap ▶️ to hear it again.';
    }
  };
  playBtn.addEventListener('click', playPattern);
  startLevel();
}

// Subject-specific signature games, keyed by world. When a lesson's world has
// one, it's picked ~half the time so students still see the generic variety.
const SUBJECT_GAMES = {
  'bm-village':        imbuhanMachine,
  'tatabahasa-temple': imbuhanMachine,
  'karangan-kingdom':  imbuhanMachine,
  'maths-volcano':     pasarMalamCashier,
  'fraction-island':   rotiCanaiSlicer,
  'english-kingdom':   tenseTimeMachine,
  'grammar-forest':    tenseTimeMachine,
  'geo-world':         petaPinDrop,
  'music-studio':      iramaRepeat,
};

// Pick a game suited to the lesson and return a runner.
export function gameForLesson(lesson, quiz) {
  // Subject worlds get their signature KSSR game about half the time,
  // so the skill-specific practice shows up often without killing variety.
  const subjectGame = SUBJECT_GAMES[lesson.worldId];
  if (subjectGame && Math.random() < 0.5) {
    return (mount, onDone) => subjectGame(mount, onDone);
  }
  const kinds = ['memory', 'balloon', 'speed', 'catch', 'maze', 'escape', 'ninja', 'sort', 'truefalse'];
  // Word Builder only when the correct answer is one clean word (3-10 letters).
  const q0 = quiz[0];
  const w = q0 && q0.options[q0.answer];
  if (w && /^[A-Za-z]{3,10}$/.test(w)) kinds.push('word');
  // Crossword only when two answers can cross at a shared letter.
  const cw = buildCrossword(quiz);
  if (cw) kinds.push('crossword');
  // Sentence Builder only when some answer is a short multi-word phrase.
  const phraseHit = phraseCandidate(quiz);
  if (phraseHit) kinds.push('sentence');
  // Speak It! only when the browser supports speech recognition and the
  // answer is a single clean word to pronounce.
  const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  if (speechSupported && w) kinds.push('speak');
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  if (kind === 'word') return (mount, onDone) => wordBuilder(mount, { question: q0.q, word: w }, onDone);
  if (kind === 'speak') {
    const bmWorlds = ['bm-village', 'tatabahasa-temple', 'karangan-kingdom', 'science-lab', 'rbt-workshop', 'geo-world', 'music-studio'];
    const lang = bmWorlds.includes(lesson.worldId) ? 'ms-MY' : 'en-US';
    return (mount, onDone) => speakChallenge(mount, { question: q0.q, word: w, lang }, onDone);
  }
  if (kind === 'sentence') return (mount, onDone) => sentenceBuilder(mount, { question: phraseHit.q.q, phrase: phraseHit.phrase }, onDone);
  if (kind === 'sort') {
    const q = quiz[Math.floor(Math.random() * quiz.length)];
    return (mount, onDone) => sortBins(mount, {
      question: q.q, correct: [q.options[q.answer]],
      wrong: q.options.filter((_, i) => i !== q.answer),
    }, onDone);
  }
  if (kind === 'truefalse') return (mount, onDone) => trueFalseBlitz(mount, [...quiz].sort(() => Math.random() - 0.5), onDone);
  if (kind === 'ninja') {
    const q = quiz[Math.floor(Math.random() * quiz.length)];
    return (mount, onDone) => mathNinja(mount, {
      question: q.q, correct: q.options[q.answer],
      wrong: q.options.filter((_, i) => i !== q.answer),
    }, onDone);
  }
  if (kind === 'maze') {
    const q = quiz[Math.floor(Math.random() * quiz.length)];
    return (mount, onDone) => maze(mount, q, onDone);
  }
  if (kind === 'escape') return (mount, onDone) => escapeRoom(mount, [...quiz].sort(() => Math.random() - 0.5), onDone);
  if (kind === 'crossword') return (mount, onDone) => crossword(mount, cw, onDone);
  if (kind === 'catch') {
    const q = quiz[Math.floor(Math.random() * quiz.length)];
    return (mount, onDone) => catchAnswer(mount, {
      question: q.q, correct: q.options[q.answer],
      wrong: q.options.filter((_, i) => i !== q.answer),
    }, onDone);
  }
  if (kind === 'memory') {
    const pairs = quiz.slice(0, 4).map(q => [q.options[q.answer], q.q.slice(0, 18) + '…']);
    return (mount, onDone) => memoryMatch(mount, pairs, onDone);
  }
  if (kind === 'balloon') {
    const q = quiz[0];
    return (mount, onDone) => balloonPop(mount, {
      question: q.q,
      correct: [q.options[q.answer]],
      wrong: q.options.filter((_, i) => i !== q.answer),
    }, onDone);
  }
  return (mount, onDone) => speedQuiz(mount, quiz.slice(0, 3), onDone);
}
