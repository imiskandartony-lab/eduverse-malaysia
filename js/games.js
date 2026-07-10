// EduVerse Malaysia — mini-game components
// Each game receives a mount element + config and calls onDone(score 0..1).
// Games share reward plumbing via gamification.js so new games plug in easily.

import { esc } from './ui.js';
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
  let popped = 0, mistakes = 0, spawned = 0;
  const need = correct.length;
  mount.innerHTML = `
    <h3 class="display">🎈 Balloon Pop</h3>
    <p style="margin:.4rem 0 1rem">${esc(question)} — pop the <b>correct</b> balloons!</p>
    <div class="balloon-field" aria-label="Balloon game area"></div>
    <p class="game-status" style="margin-top:.6rem;font-weight:800"></p>`;
  const field = mount.querySelector('.balloon-field');
  const status = mount.querySelector('.game-status');
  const colors = ['var(--lava)', 'var(--ocean)', 'var(--jungle)', 'var(--magic)', 'var(--sunset)'];
  const items = [...correct.map(t => ({ t, ok: true })), ...wrong.map(t => ({ t, ok: false }))]
    .sort(() => Math.random() - 0.5);

  const finish = () => {
    clearInterval(timer);
    onDone(Math.max(0, (popped - mistakes * 0.5) / need));
  };

  const timer = setInterval(() => {
    if (spawned >= items.length * 2 || popped >= need) { if (popped >= need) finish(); return; }
    const item = items[spawned % items.length]; spawned++;
    const b = document.createElement('button');
    b.className = 'balloon';
    b.textContent = item.t;
    b.style.left = Math.random() * 80 + 5 + '%';
    b.style.background = colors[spawned % colors.length];
    b.style.animationDuration = 4 + Math.random() * 2 + 's';
    b.addEventListener('click', () => {
      b.remove();
      if (item.ok) { popped++; status.textContent = `✅ ${popped}/${need} popped!`; if (popped >= need) finish(); }
      else { mistakes++; status.textContent = '❌ Oops, that one was wrong!'; }
    });
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
      b.addEventListener('click', () => {
        const fast = (Date.now() - start) < 6000;
        if (idx === q.answer) { score += fast ? 1 : 0.7; b.classList.add('correct'); }
        else b.classList.add('wrong');
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
    d.addEventListener('click', () => {
      d.remove();
      if (t === correct) { caught++; sfx.correct(); status.textContent = `✅ ${caught}/${need} caught!`; if (caught >= need) finish(); }
      else { misses++; sfx.wrong(); status.textContent = '❌ Not that one!'; }
    });
    d.addEventListener('animationend', () => d.remove());
    field.appendChild(d);
  }, 850);
  setTimeout(() => { if (caught < need) finish(); }, 40000);
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

// Pick a game suited to the lesson and return a runner.
export function gameForLesson(lesson, quiz) {
  const kinds = ['memory', 'balloon', 'speed', 'catch', 'maze', 'escape'];
  // Word Builder only when the correct answer is one clean word (3-10 letters).
  const q0 = quiz[0];
  const w = q0 && q0.options[q0.answer];
  if (w && /^[A-Za-z]{3,10}$/.test(w)) kinds.push('word');
  // Crossword only when two answers can cross at a shared letter.
  const cw = buildCrossword(quiz);
  if (cw) kinds.push('crossword');
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  if (kind === 'word') return (mount, onDone) => wordBuilder(mount, { question: q0.q, word: w }, onDone);
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
