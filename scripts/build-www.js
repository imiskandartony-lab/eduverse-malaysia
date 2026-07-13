// Copies the static site into www/ for Capacitor (no bundler — plain file copy).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dest = path.join(root, 'www');

const INCLUDE = [
  'index.html', 'manifest.json', 'sw.js',
  'css', 'js', 'assets', 'vendor',
];

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

function copy(name) {
  const src = path.join(root, name);
  const out = path.join(dest, name);
  if (!fs.existsSync(src)) return;
  fs.cpSync(src, out, { recursive: true });
}

INCLUDE.forEach(copy);
console.log('www/ built from:', INCLUDE.join(', '));
