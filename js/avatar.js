// EduVerse Malaysia — character system
// Renders a layered SVG "blocky-bean" hero (chunky head, capsule body) that
// equips catalog parts. One renderer, many layers — new items are data.

// ---------- Catalog ----------
// rarity: common | rare | epic | legendary
export const CATALOG = [
  // Skin tones (free)
  { id: 'skin-fair',  name: 'Fair',   type: 'skin', price: 0, rarity: 'common', c: '#F5CBA7' },
  { id: 'skin-tan',   name: 'Tan',    type: 'skin', price: 0, rarity: 'common', c: '#D9945F' },
  { id: 'skin-brown', name: 'Brown',  type: 'skin', price: 0, rarity: 'common', c: '#A16238' },
  { id: 'skin-deep',  name: 'Deep',   type: 'skin', price: 0, rarity: 'common', c: '#6E4226' },

  // Hair
  { id: 'hair-crop',   name: 'Crop',        type: 'hair', price: 0,   rarity: 'common',    style: 'crop',  c: '#2B2118' },
  { id: 'hair-spikes', name: 'Spikes',      type: 'hair', price: 60,  rarity: 'common',    style: 'spike', c: '#2B2118' },
  { id: 'hair-bob',    name: 'Bob',         type: 'hair', price: 60,  rarity: 'common',    style: 'bob',   c: '#4A2C13' },
  { id: 'hair-curls',  name: 'Curls',       type: 'hair', price: 90,  rarity: 'rare',      style: 'curls', c: '#1E1710' },
  { id: 'hair-flame',  name: 'Flame Punk',  type: 'hair', price: 220, rarity: 'epic',      style: 'spike', c: '#FF5D3A' },
  { id: 'hair-aqua',   name: 'Aqua Bob',    type: 'hair', price: 220, rarity: 'epic',      style: 'bob',   c: '#2FB9C9' },

  // Shirts
  { id: 'shirt-sun',    name: 'Sunset Tee',   type: 'shirt', price: 0,   rarity: 'common',    c: '#FF7A45' },
  { id: 'shirt-jungle', name: 'Jungle Tee',   type: 'shirt', price: 40,  rarity: 'common',    c: '#35C48D' },
  { id: 'shirt-ocean',  name: 'Ocean Tee',    type: 'shirt', price: 40,  rarity: 'common',    c: '#3AA6F0' },
  { id: 'shirt-batik',  name: 'Batik Shirt',  type: 'shirt', price: 150, rarity: 'rare',      c: '#8C6CF5', pattern: 'batik' },
  { id: 'shirt-kite',   name: 'Wau Jersey',   type: 'shirt', price: 150, rarity: 'rare',      c: '#FFC93C', pattern: 'kite' },
  { id: 'shirt-royal',  name: 'Royal Armour', type: 'shirt', price: 420, rarity: 'legendary', c: '#41496B', pattern: 'armour' },
  { id: 'shirt-melayu', name: 'Baju Melayu',  type: 'shirt', price: 280, rarity: 'epic',      c: '#1F8A70', pattern: 'melayu' },

  // Pants
  { id: 'pants-navy',  name: 'Navy Shorts',  type: 'pants', price: 0,   rarity: 'common', c: '#31427A' },
  { id: 'pants-khaki', name: 'Khaki Pants',  type: 'pants', price: 40,  rarity: 'common', c: '#8B7355' },
  { id: 'pants-track', name: 'Track Pants',  type: 'pants', price: 90,  rarity: 'rare',   c: '#C0392B' },
  { id: 'pants-gold',  name: 'Gold Greaves', type: 'pants', price: 320, rarity: 'epic',   c: '#D9A821' },

  // Hats
  { id: 'hat-songkok', name: 'Songkok',      type: 'hat', price: 80,  rarity: 'rare',      style: 'songkok' },
  { id: 'hat-cap',     name: 'Sport Cap',    type: 'hat', price: 80,  rarity: 'common',    style: 'cap' },
  { id: 'hat-crown',   name: 'Royal Crown',  type: 'hat', price: 450, rarity: 'legendary', style: 'crown' },
  { id: 'hat-wizard',  name: 'Wizard Hat',   type: 'hat', price: 260, rarity: 'epic',      style: 'wizard' },
  { id: 'hat-tanjak',  name: 'Tanjak',       type: 'hat', price: 300, rarity: 'epic',      style: 'tanjak' },

  // Glasses
  { id: 'glasses-cool',  name: 'Cool Shades',  type: 'glasses', price: 60,  rarity: 'common', style: 'shades' },
  { id: 'glasses-round', name: 'Smart Rounds', type: 'glasses', price: 60,  rarity: 'common', style: 'round' },

  // Wings
  { id: 'wings-leaf', name: 'Leaf Wings',   type: 'wings', price: 300, rarity: 'epic',      c: '#35C48D' },
  { id: 'wings-gold', name: 'Golden Wings', type: 'wings', price: 500, rarity: 'legendary', c: '#FFC93C' },
  { id: 'wings-kancil-legend', name: 'Kancil\'s Cloak', type: 'wings', price: 0, rarity: 'legendary', c: '#8C6CF5', storyOnly: true },

  // Pets (companions) — each equipped pet grants a small passive perk.
  { id: 'pet-cat',      name: 'Kucing Oren', type: 'pet', price: 150, rarity: 'rare',      emoji: '🐱',
    effect: 'coins5', effectDesc: '+5% bonus coins on every reward' },
  { id: 'pet-hornbill', name: 'Hornbill',    type: 'pet', price: 250, rarity: 'epic',      emoji: '🦜',
    effect: 'eliminate', effectDesc: 'Removes one wrong answer from quiz & boss questions' },
  { id: 'pet-tiger',    name: 'Harimau Cub', type: 'pet', price: 400, rarity: 'legendary', emoji: '🐯',
    effect: 'bossdmg', effectDesc: '+10 extra damage per boss hit' },
  { id: 'pet-kucing-hitam', name: 'Kucing Hitam', type: 'pet', price: 200, rarity: 'rare', emoji: '🐈‍⬛',
    effect: 'xp5', effectDesc: '+5% bonus XP on every reward' },

  // Emotes
  { id: 'emote-jump', name: 'Victory Jump', type: 'emote', price: 0,   rarity: 'common', anim: 'jump' },
  { id: 'emote-spin', name: 'Spin Dance',   type: 'emote', price: 120, rarity: 'rare',   anim: 'spin' },
  { id: 'emote-jelly', name: 'Jelly Wobble', type: 'emote', price: 200, rarity: 'epic',  anim: 'jelly' },
];

export const CATEGORIES = [
  { type: 'skin',    name: 'Skin',    icon: '🖐️' },
  { type: 'hair',    name: 'Hair',    icon: '💇' },
  { type: 'shirt',   name: 'Shirts',  icon: '👕' },
  { type: 'pants',   name: 'Pants',   icon: '🩳' },
  { type: 'hat',     name: 'Hats',    icon: '🧢' },
  { type: 'glasses', name: 'Glasses', icon: '👓' },
  { type: 'wings',   name: 'Wings',   icon: '🪽' },
  { type: 'pet',     name: 'Pets',    icon: '🐾' },
  { type: 'emote',   name: 'Emotes',  icon: '🎉' },
];

export const findPart = id => CATALOG.find(p => p.id === id);

// The equipped pet's passive effect id ('coins5' | 'xp5' | 'eliminate' | 'bossdmg' | null).
export function equippedPetEffect(user) {
  const pet = user.equipped?.pet && findPart(user.equipped.pet);
  return pet?.effect || null;
}

// Free starter parts every hero owns.
export const STARTERS = ['skin-tan', 'hair-crop', 'shirt-sun', 'pants-navy', 'emote-jump'];
export const DEFAULT_EQUIP = { skin: 'skin-tan', hair: 'hair-crop', shirt: 'shirt-sun', pants: 'pants-navy', emote: 'emote-jump' };

// Refund items bought from the old emoji shop (pre-character era).
const OLD_PRICES = { 'glasses-cool': 60, 'hat-songkok': 80, 'hat-crown': 300, 'pet-cat': 150, 'pet-hornbill': 250, 'pet-tiger': 400, 'wings-gold': 500, 'emote-tada': 40, 'backpack-jet': 350 };
export function migrateWardrobe(user) {
  let refund = 0;
  user.owned = user.owned || [];
  // Old ids that don't exist in the new catalog (or existed with other art) —
  // refund anything owned that the catalog can't render.
  user.owned = user.owned.filter(id => {
    if (findPart(id)) return true;
    refund += OLD_PRICES[id] || 0;
    return false;
  });
  for (const [slot, id] of Object.entries(user.equipped || {})) {
    if (!findPart(id)) delete user.equipped[slot];
  }
  for (const s of STARTERS) if (!user.owned.includes(s)) user.owned.push(s);
  user.equipped = { ...DEFAULT_EQUIP, ...user.equipped };
  if (refund) user.coins += refund;
  return refund;
}

// ---------- Renderer ----------
const darken = (hex, f = .72) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = s => Math.round(((n >> s) & 255) * f).toString(16).padStart(2, '0');
  return `#${ch(16)}${ch(8)}${ch(0)}`;
};
const lighten = (hex, f = .4) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = s => { const v = (n >> s) & 255; return Math.round(v + (255 - v) * f).toString(16).padStart(2, '0'); };
  return `#${ch(16)}${ch(8)}${ch(0)}`;
};
let heroIdSeq = 0; // unique gradient IDs so multiple avatars can render on one page

function hairSvg(part) {
  if (!part) return '';
  const c = part.c, d = darken(c);
  switch (part.style) {
    case 'crop': return `<path d="M55 62 Q55 26 100 26 Q145 26 145 62 L145 52 Q100 38 55 52 Z" fill="${c}"/>`;
    case 'spike': return `
      <path d="M58 58 L66 30 L76 52 L88 22 L100 48 L112 22 L124 52 L134 30 L142 58 Q100 40 58 58 Z" fill="${c}"/>
      <path d="M58 58 Q100 44 142 58 L142 52 Q100 40 58 52 Z" fill="${d}"/>`;
    case 'bob': return `
      <path d="M52 90 Q48 24 100 24 Q152 24 148 90 L138 90 Q140 44 100 42 Q60 44 62 90 Z" fill="${c}"/>
      <path d="M52 90 Q54 98 62 96 L62 74 Q56 78 52 90 Z M148 90 Q146 98 138 96 L138 74 Q144 78 148 90 Z" fill="${d}"/>`;
    case 'curls': return `
      <circle cx="70" cy="40" r="16" fill="${c}"/><circle cx="100" cy="32" r="18" fill="${c}"/>
      <circle cx="130" cy="40" r="16" fill="${c}"/><circle cx="55" cy="58" r="12" fill="${d}"/>
      <circle cx="145" cy="58" r="12" fill="${d}"/>`;
    default: return '';
  }
}

function hatSvg(part) {
  if (!part) return '';
  switch (part.style) {
    case 'songkok': return `<path d="M60 44 L64 16 Q100 8 136 16 L140 44 Q100 32 60 44 Z" fill="#151A2E"/><path d="M60 44 Q100 32 140 44 L140 38 Q100 27 60 38 Z" fill="#2A3354"/>`;
    case 'cap': return `<path d="M58 42 Q58 12 100 12 Q142 12 142 42 Q100 30 58 42 Z" fill="#E74C3C"/><path d="M132 36 Q168 34 172 44 Q140 48 130 44 Z" fill="#C0392B"/><circle cx="100" cy="12" r="5" fill="#C0392B"/>`;
    case 'crown': return `<path d="M64 40 L60 10 L82 26 L100 4 L118 26 L140 10 L136 40 Q100 28 64 40 Z" fill="#FFC93C" stroke="#D9A821" stroke-width="3"/><circle cx="100" cy="24" r="5" fill="#FF5D73"/><circle cx="74" cy="28" r="4" fill="#3AA6F0"/><circle cx="126" cy="28" r="4" fill="#35C48D"/>`;
    case 'tanjak': return `
      <path d="M60 44 L64 22 Q100 12 136 22 L140 44 Q100 32 60 44 Z" fill="#1F8A70"/>
      <path d="M116 24 L146 -4 L138 26 Z" fill="#1F8A70"/>
      <path d="M120 24 L142 4 L136 25 Z" fill="#156353"/>
      <path d="M62 38 Q100 27 138 38 L138 44 Q100 32 62 44 Z" fill="#C9A227"/>`;
    case 'wizard': return `<path d="M100 -14 L134 44 Q100 32 66 44 Z" fill="#5B3FA8"/><path d="M58 46 Q100 32 142 46 L142 54 Q100 40 58 54 Z" fill="#7A5BD0"/><circle cx="104" cy="12" r="5" fill="#FFC93C"/>`;
    default: return '';
  }
}

function glassesSvg(part) {
  if (!part) return '';
  if (part.style === 'shades') return `<rect x="62" y="70" width="32" height="18" rx="7" fill="#1E2A4A"/><rect x="106" y="70" width="32" height="18" rx="7" fill="#1E2A4A"/><rect x="92" y="76" width="16" height="5" fill="#1E2A4A"/>`;
  return `<circle cx="79" cy="80" r="14" fill="none" stroke="#1E2A4A" stroke-width="4"/><circle cx="121" cy="80" r="14" fill="none" stroke="#1E2A4A" stroke-width="4"/><rect x="92" y="77" width="16" height="4" fill="#1E2A4A"/>`;
}

function shirtPattern(part) {
  if (!part.pattern) return '';
  if (part.pattern === 'batik') return `<circle cx="82" cy="168" r="7" fill="#B49CFF"/><circle cx="112" cy="182" r="6" fill="#B49CFF"/><circle cx="120" cy="160" r="4" fill="#D9CBFF"/><circle cx="92" cy="190" r="4" fill="#D9CBFF"/>`;
  if (part.pattern === 'kite') return `<path d="M100 156 L114 172 L100 192 L86 172 Z" fill="#E85F2C"/><path d="M100 162 L108 172 L100 184 L92 172 Z" fill="#FFF2CC"/>`;
  if (part.pattern === 'melayu') return `
    <rect x="96" y="146" width="8" height="34" rx="3" fill="${darken(part.c, .8)}"/>
    <circle cx="100" cy="152" r="2.2" fill="#FFC93C"/><circle cx="100" cy="161" r="2.2" fill="#FFC93C"/><circle cx="100" cy="170" r="2.2" fill="#FFC93C"/>
    <path d="M64 192 L136 192 L136 214 Q136 220 122 220 L78 220 Q64 220 64 214 Z" fill="#C9A227"/>
    <path d="M64 192 L136 192 L136 197 L64 197 Z" fill="#8F6E12"/>
    <circle cx="82" cy="207" r="2.5" fill="#8F6E12"/><circle cx="100" cy="211" r="2.5" fill="#8F6E12"/><circle cx="118" cy="207" r="2.5" fill="#8F6E12"/>`;
  if (part.pattern === 'armour') return `<path d="M68 152 Q100 142 132 152 L132 162 Q100 152 68 162 Z" fill="#8E99C4"/><circle cx="100" cy="176" r="9" fill="#FFC93C"/><path d="M96 172 l4 -6 4 6 -4 8 Z" fill="#E85F2C"/>`;
  return '';
}

// Compress a chosen photo down to a small square JPEG data URL so it can be
// stored directly on the profile document — no Storage bucket, no upload
// step, works identically offline (localStorage) and online (Firestore).
export function fileToAvatarDataURL(file, size = 220, quality = 0.78) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) { reject(new Error('Please choose an image file.')); return; }
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      img.onerror = () => reject(new Error('Could not read that image.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        // Cover-crop to a square so portrait/landscape photos both fill the frame.
        const s = Math.min(img.width, img.height);
        const sx = (img.width - s) / 2, sy = (img.height - s) / 2;
        ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// The hero: chunky head, capsule body — layered back-to-front.
export function renderAvatar(user, size = 220) {
  ensureCheekGradient();
  const eq = { ...DEFAULT_EQUIP, ...(user.equipped || {}) };
  const skin = findPart(eq.skin) || findPart('skin-tan');
  const shirt = findPart(eq.shirt) || findPart('shirt-sun');
  const pants = findPart(eq.pants) || findPart('pants-navy');
  const hair = findPart(eq.hair);
  const hat = findPart(eq.hat);
  const glasses = findPart(eq.glasses);
  const wings = findPart(eq.wings);
  const pet = findPart(eq.pet);
  const sc = skin.c, sd = darken(sc, .8);
  const cc = shirt.c, cd = darken(cc, .78);
  const pc = pants.c;
  const uid = `h${heroIdSeq++}`;

  return `
  <svg class="hero-svg" viewBox="0 0 200 290" width="${size}" height="${size * 1.32}" role="img" aria-label="Your hero character">
    <defs>
      <radialGradient id="${uid}s" cx="38%" cy="24%" r="90%">
        <stop offset="0%" stop-color="${lighten(sc, .5)}"/>
        <stop offset="55%" stop-color="${sc}"/>
        <stop offset="100%" stop-color="${darken(sc, .86)}"/>
      </radialGradient>
      <linearGradient id="${uid}c" x1="15%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%" stop-color="${lighten(cc, .3)}"/>
        <stop offset="55%" stop-color="${cc}"/>
        <stop offset="100%" stop-color="${darken(cc, .82)}"/>
      </linearGradient>
      <linearGradient id="${uid}p" x1="0%" y1="0%" x2="10%" y2="100%">
        <stop offset="0%" stop-color="${lighten(pc, .22)}"/>
        <stop offset="100%" stop-color="${darken(pc, .82)}"/>
      </linearGradient>
    </defs>
    ${wings ? `
      <g class="hero-wings">
        <path d="M60 150 Q10 110 18 66 Q52 92 66 128 Z" fill="${wings.c}" opacity=".92"/>
        <path d="M140 150 Q190 110 182 66 Q148 92 134 128 Z" fill="${wings.c}" opacity=".92"/>
        <path d="M60 150 Q28 122 26 92 Q52 108 62 134 Z" fill="${darken(wings.c)}"/>
        <path d="M140 150 Q172 122 174 92 Q148 108 138 134 Z" fill="${darken(wings.c)}"/>
      </g>` : ''}
    <!-- soft grounded shadow -->
    <ellipse cx="100" cy="262" rx="48" ry="9" fill="#1E2A4A" opacity=".06"/>
    <ellipse cx="100" cy="262" rx="36" ry="7" fill="#1E2A4A" opacity=".07"/>
    <ellipse cx="100" cy="262" rx="24" ry="5" fill="#1E2A4A" opacity=".08"/>
    <g class="hero-body-group">
      <!-- legs -->
      <rect x="72" y="208" width="24" height="46" rx="10" fill="url(#${uid}p)"/>
      <rect x="104" y="208" width="24" height="46" rx="10" fill="url(#${uid}p)"/>
      <path d="M68 248 h32 v12 a6 6 0 0 1 -6 6 h-20 a6 6 0 0 1 -6 -6 Z" fill="#2B2118"/>
      <path d="M100 248 h32 v12 a6 6 0 0 1 -6 6 h-20 a6 6 0 0 1 -6 -6 Z" fill="#2B2118"/>
      <path d="M68 251 h32" stroke="#4A3826" stroke-width="1.5" opacity=".5"/>
      <path d="M100 251 h32" stroke="#4A3826" stroke-width="1.5" opacity=".5"/>
      <!-- arms -->
      <rect x="44" y="150" width="22" height="52" rx="11" fill="${cd}"/>
      <rect x="134" y="150" width="22" height="52" rx="11" fill="${cd}"/>
      <circle cx="55" cy="200" r="10" fill="url(#${uid}s)"/>
      <circle cx="145" cy="200" r="10" fill="url(#${uid}s)"/>
      <!-- torso -->
      <path d="M64 146 Q100 136 136 146 L136 206 Q136 220 122 220 L78 220 Q64 220 64 206 Z" fill="url(#${uid}c)"/>
      <path d="M70 148 Q78 144 86 147 L82 172 Q74 170 70 165 Z" fill="#fff" opacity=".16"/>
      ${shirtPattern(shirt)}
      <!-- head -->
      <rect x="55" y="34" width="90" height="82" rx="26" fill="url(#${uid}s)"/>
      <rect x="55" y="96" width="90" height="20" rx="10" fill="${sd}" opacity=".3"/>
      <!-- glossy highlight for that toy-shine look -->
      <ellipse cx="76" cy="48" rx="16" ry="10" fill="#fff" opacity=".28" transform="rotate(-18 76 48)"/>
      <!-- face -->
      <circle cx="79" cy="78" r="7" fill="#1E2A4A"/>
      <circle cx="121" cy="78" r="7" fill="#1E2A4A"/>
      <circle cx="82" cy="74.5" r="2.6" fill="#fff"/>
      <circle cx="124" cy="74.5" r="2.6" fill="#fff"/>
      <circle cx="77" cy="80" r="1" fill="#fff" opacity=".7"/>
      <circle cx="119" cy="80" r="1" fill="#fff" opacity=".7"/>
      <path d="M87 95 Q100 108 113 95" stroke="#1E2A4A" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <circle cx="67" cy="92" r="7" fill="url(#cheekGrad)" opacity=".65"/>
      <circle cx="133" cy="92" r="7" fill="url(#cheekGrad)" opacity=".65"/>
      ${hairSvg(hair)}
      ${glassesSvg(glasses)}
      ${hatSvg(hat)}
    </g>
    ${pet ? `<text x="166" y="252" font-size="34" class="hero-pet">${pet.emoji}</text>` : ''}
  </svg>`;
}

// Shared cheek-blush gradient definition, injected once into the page so
// every hero (HUD mini-icon, Hero Studio stage, etc.) can reference it.
let cheekGradInjected = false;
function ensureCheekGradient() {
  if (cheekGradInjected || typeof document === 'undefined') return;
  cheekGradInjected = true;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = `<defs><radialGradient id="cheekGrad"><stop offset="0%" stop-color="#FF9B85" stop-opacity=".9"/><stop offset="100%" stop-color="#FF9B85" stop-opacity="0"/></radialGradient></defs>`;
  document.body?.appendChild(svg) || document.documentElement.appendChild(svg);
}
