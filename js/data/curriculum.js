// EduVerse Malaysia — KSSR Semakan sample curriculum (Year 5 & 6)
// Content authored by curriculum specialists; AI never generates primary content.

export const WORLDS = [
  { id: 'english-kingdom',  name: 'English Kingdom',    emoji: '🏰', subject: 'English', color: 'var(--ocean)',  desc: 'Grammar, vocabulary & reading quests' },
  { id: 'grammar-forest',   name: 'Grammar Forest',     emoji: '🌳', subject: 'English', color: 'var(--jungle)', desc: 'Tenses, articles & word classes' },
  { id: 'reading-castle',   name: 'Reading Castle',     emoji: '📖', subject: 'English', color: 'var(--ocean)',  desc: 'Comprehension adventures' },
  { id: 'maths-volcano',    name: 'Mathematics Volcano',emoji: '🌋', subject: 'Mathematics', color: 'var(--lava)', desc: 'Numbers & operations up to 1 000 000' },
  { id: 'fraction-island',  name: 'Fraction Island',    emoji: '🏝️', subject: 'Mathematics', color: 'var(--gold)', desc: 'Fractions, decimals & percentages' },
  { id: 'geometry-city',    name: 'Geometry City',      emoji: '📐', subject: 'Mathematics', color: 'var(--magic)', desc: 'Space, shapes & measurement' },
  { id: 'bm-village',       name: 'Kampung Bahasa',     emoji: '🛖', subject: 'Bahasa Melayu', color: 'var(--jungle)', desc: 'Kosa kata & pemahaman' },
  { id: 'tatabahasa-temple',name: 'Kuil Tatabahasa',    emoji: '⛩️', subject: 'Bahasa Melayu', color: 'var(--sunset)', desc: 'Imbuhan, kata & ayat' },
  { id: 'karangan-kingdom', name: 'Kerajaan Karangan',  emoji: '👑', subject: 'Bahasa Melayu', color: 'var(--gold)', desc: 'Penulisan kreatif' },
];

export const LESSONS = [
  {
    id: 'ek-1', worldId: 'english-kingdom', title: 'Simple Present Tense', year: 5,
    kssr: 'KSSR English Y5 — Grammar 5.1: Use present simple correctly',
    xp: 50, coins: 20, difficulty: 1, prerequisite: null,
    intro: 'Welcome, adventurer! The King of English Kingdom needs your help. The castle clocks are stuck in the PRESENT — master the Simple Present Tense to fix them!',
    steps: [
      'We use the <b>simple present</b> for habits and facts: <i>"I brush my teeth every morning."</i>',
      'For <b>he / she / it</b>, add <b>-s</b> to the verb: <i>She read<b>s</b> books. The cat sleep<b>s</b>.</i>',
      'Verbs ending in -ch, -sh, -o, -x take <b>-es</b>: <i>He watch<b>es</b> TV. She go<b>es</b> to school.</i>',
    ],
    practice: { q: 'Choose the correct verb: "Aiman ____ football every evening."', options: ['play', 'plays', 'playing', 'played'], answer: 1, hint: 'Aiman = he, so the verb needs an extra letter!' },
  },
  {
    id: 'ek-2', worldId: 'english-kingdom', title: 'Nouns: Singular & Plural', year: 5,
    kssr: 'KSSR English Y5 — Grammar 5.1: Singular and plural nouns',
    xp: 50, coins: 20, difficulty: 1, prerequisite: 'ek-1',
    intro: 'The royal treasury is a mess — one crown here, three crowns there! Sort the singular from the plural to earn your reward.',
    steps: [
      'Most nouns add <b>-s</b>: cat → cat<b>s</b>, book → book<b>s</b>.',
      'Nouns ending in -s, -x, -ch, -sh add <b>-es</b>: box → box<b>es</b>, bus → bus<b>es</b>.',
      'Some are irregular: child → <b>children</b>, mouse → <b>mice</b>, foot → <b>feet</b>.',
    ],
    practice: { q: 'What is the plural of "child"?', options: ['childs', 'childes', 'children', 'childrens'], answer: 2, hint: 'It is an irregular noun — no -s at all!' },
  },
  {
    id: 'mv-1', worldId: 'maths-volcano', title: 'Numbers to 1 000 000', year: 5,
    kssr: 'KSSR Matematik T5 — 1.1: Nilai nombor hingga 1 000 000',
    xp: 60, coins: 25, difficulty: 2, prerequisite: null,
    intro: 'The volcano rumbles! Only a hero who can read numbers up to ONE MILLION can calm it. Ready?',
    steps: [
      'Place values from right: <b>sa, puluh, ratus, ribu, puluh ribu, ratus ribu</b>.',
      '456 789 = 400 000 + 50 000 + 6 000 + 700 + 80 + 9.',
      'To compare numbers, check the <b>largest place value first</b>.',
    ],
    practice: { q: 'What is the value of digit 7 in 372 415?', options: ['7', '7 000', '70 000', '700 000'], answer: 2, hint: 'Count the places from the right: sa, puluh, ratus, ribu, puluh ribu…' },
  },
  {
    id: 'fi-1', worldId: 'fraction-island', title: 'Equivalent Fractions', year: 5,
    kssr: 'KSSR Matematik T5 — 2.1: Pecahan setara',
    xp: 60, coins: 25, difficulty: 2, prerequisite: null,
    intro: 'Pirates split their treasure into equal parts — but which shares are really the same? Find the equivalent fractions!',
    steps: [
      'Fractions are <b>equivalent</b> when they show the same amount: 1/2 = 2/4 = 4/8.',
      'Multiply top and bottom by the <b>same number</b>: 1/3 × 2/2 = 2/6.',
      'Simplify by dividing both by the same number: 6/8 ÷ 2/2 = 3/4.',
    ],
    practice: { q: 'Which fraction is equivalent to 2/5?', options: ['4/10', '3/7', '2/10', '5/2'], answer: 0, hint: 'Multiply both the top and bottom of 2/5 by 2.' },
  },
  {
    id: 'bm-1', worldId: 'bm-village', title: 'Kata Nama Am & Khas', year: 5,
    kssr: 'KSSR BM T5 — Tatabahasa: Kata nama am dan kata nama khas',
    xp: 50, coins: 20, difficulty: 1, prerequisite: null,
    intro: 'Selamat datang ke Kampung Bahasa! Tok Ketua memerlukan bantuanmu mengasingkan kata nama am dan khas.',
    steps: [
      '<b>Kata nama am</b> ialah nama umum: budak, sekolah, sungai, kucing.',
      '<b>Kata nama khas</b> ialah nama khusus dan dieja dengan <b>huruf besar</b>: Ali, Kuala Lumpur, Sungai Pahang.',
      'Contoh ayat: <i>Ali (khas) bersekolah di sekolah (am) berhampiran Sungai Pahang (khas).</i>',
    ],
    practice: { q: 'Yang manakah kata nama khas?', options: ['bandar', 'Melaka', 'kereta', 'guru'], answer: 1, hint: 'Kata nama khas sentiasa bermula dengan huruf besar.' },
  },
  {
    id: 'tt-1', worldId: 'tatabahasa-temple', title: 'Imbuhan Awalan "meN-"', year: 6,
    kssr: 'KSSR BM T6 — Tatabahasa: Imbuhan awalan meN-',
    xp: 70, coins: 30, difficulty: 3, prerequisite: null,
    intro: 'Pintu Kuil Tatabahasa hanya terbuka kepada mereka yang menguasai imbuhan "meN-". Beranikah kamu?',
    steps: [
      'Awalan <b>meN-</b> berubah mengikut huruf pertama kata dasar: me-, mem-, men-, meng-, meny-.',
      '<b>mem-</b> untuk b, p (p gugur): baca → membaca, pukul → memukul.',
      '<b>meny-</b> untuk s (s gugur): sapu → menyapu. <b>meng-</b> untuk g, k (k gugur): goreng → menggoreng, kira → mengira.',
    ],
    practice: { q: 'Apakah bentuk "meN-" bagi kata dasar "tulis"?', options: ['metulis', 'mentulis', 'menulis', 'menyulis'], answer: 2, hint: 'Huruf "t" gugur dan digantikan dengan "n".' },
  },
];

export const QUIZZES = {
  'ek-1': [
    { q: 'She ____ to school by bus.', options: ['go', 'goes', 'going', 'gone'], answer: 1, explain: '"She" needs -es on "go" → goes.', hint: 'She is third person singular.', difficulty: 1 },
    { q: 'They ____ badminton on Saturdays.', options: ['plays', 'playing', 'play', 'played'], answer: 2, explain: '"They" is plural, so no -s on the verb.', hint: 'Plural subjects use the base verb.', difficulty: 1 },
    { q: 'My cat ____ milk every day.', options: ['drink', 'drinks', 'drinking', 'drank'], answer: 1, explain: '"Cat" = it → drinks.', hint: 'One cat = he/she/it.', difficulty: 2 },
  ],
  'ek-2': [
    { q: 'Plural of "box"?', options: ['boxs', 'boxes', 'boxies', 'box'], answer: 1, explain: 'Words ending in -x take -es.', hint: '-x needs more than just -s.', difficulty: 1 },
    { q: 'Plural of "mouse"?', options: ['mouses', 'mice', 'mousees', 'mouse'], answer: 1, explain: '"Mouse" is irregular → mice.', hint: 'It is irregular, like child → children.', difficulty: 2 },
    { q: 'Which is already plural?', options: ['foot', 'tooth', 'feet', 'goose'], answer: 2, explain: 'Feet is the plural of foot.', hint: 'Think of body parts you have two of.', difficulty: 2 },
  ],
  'mv-1': [
    { q: 'Which number is "lima ratus tiga puluh ribu"?', options: ['53 000', '503 000', '530 000', '5 030 000'], answer: 2, explain: '530 thousand = 530 000.', hint: 'Ratus ribu = hundreds of thousands.', difficulty: 2 },
    { q: '499 999 + 1 = ?', options: ['500 000', '499 100', '400 000', '499 998'], answer: 0, explain: 'Adding 1 rolls over to 500 000.', hint: 'All the 9s become 0s.', difficulty: 1 },
    { q: 'Which is the largest?', options: ['98 750', '105 002', '99 999', '100 010'], answer: 1, explain: '105 002 has the biggest value in the highest place.', hint: 'Compare the number of digits first.', difficulty: 2 },
  ],
  'fi-1': [
    { q: '1/2 = ?/8', options: ['2', '3', '4', '6'], answer: 2, explain: 'Multiply top and bottom by 4: 4/8.', hint: '2 × ? = 8, apply the same to the top.', difficulty: 2 },
    { q: 'Simplify 6/9.', options: ['1/3', '2/3', '3/6', '6/9'], answer: 1, explain: 'Divide both by 3 → 2/3.', hint: 'Both 6 and 9 divide by 3.', difficulty: 2 },
    { q: 'Which is NOT equivalent to 1/4?', options: ['2/8', '3/12', '4/16', '2/6'], answer: 3, explain: '2/6 = 1/3, not 1/4.', hint: 'Check each by simplifying.', difficulty: 3 },
  ],
  'bm-1': [
    { q: 'Pilih kata nama am.', options: ['Proton', 'Ali', 'sekolah', 'Ipoh'], answer: 2, explain: '"Sekolah" ialah nama umum.', hint: 'Cari perkataan yang tidak perlu huruf besar.', difficulty: 1 },
    { q: '"____ ialah ibu negara Malaysia." Pilih kata nama khas yang betul.', options: ['bandar', 'Kuala Lumpur', 'negeri', 'jalan'], answer: 1, explain: 'Kuala Lumpur ialah kata nama khas.', hint: 'Nama tempat khusus.', difficulty: 1 },
    { q: 'Ayat manakah yang menggunakan kata nama khas dengan betul?', options: ['saya tinggal di melaka.', 'Adik membaca Buku.', 'Kami melawat Zoo Negara.', 'ali suka Durian.'], answer: 2, explain: '"Zoo Negara" dieja betul dengan huruf besar.', hint: 'Semak penggunaan huruf besar.', difficulty: 3 },
  ],
  'tt-1': [
    { q: '"sapu" + meN- = ?', options: ['mensapu', 'menyapu', 'memapu', 'mengsapu'], answer: 1, explain: 'Huruf "s" gugur → menyapu.', hint: 'Huruf s digantikan "ny".', difficulty: 2 },
    { q: '"kira" + meN- = ?', options: ['mengira', 'menkira', 'memira', 'mengkira'], answer: 0, explain: 'Huruf "k" gugur → mengira.', hint: 'K gugur selepas meng-.', difficulty: 2 },
    { q: '"pandang" + meN- = ?', options: ['menpandang', 'memandang', 'mempandang', 'menyandang'], answer: 1, explain: 'Huruf "p" gugur → memandang.', hint: 'P gugur selepas mem-.', difficulty: 3 },
  ],
};

export const SHOP_ITEMS = [
  { id: 'hat-songkok', name: 'Songkok', emoji: '🎩', type: 'hat', price: 80 },
  { id: 'hat-crown', name: 'Royal Crown', emoji: '👑', type: 'hat', price: 300 },
  { id: 'glasses-cool', name: 'Cool Shades', emoji: '🕶️', type: 'glasses', price: 60 },
  { id: 'pet-cat', name: 'Kucing Oren', emoji: '🐱', type: 'pet', price: 150 },
  { id: 'pet-hornbill', name: 'Hornbill', emoji: '🦜', type: 'pet', price: 250 },
  { id: 'pet-tiger', name: 'Harimau Cub', emoji: '🐯', type: 'pet', price: 400 },
  { id: 'wings-gold', name: 'Golden Wings', emoji: '🪽', type: 'wings', price: 500 },
  { id: 'emote-tada', name: 'Tada!', emoji: '🎉', type: 'emote', price: 40 },
  { id: 'backpack-jet', name: 'Jet Backpack', emoji: '🚀', type: 'backpack', price: 350 },
];

export const AVATAR_BASES = ['🧒', '👧', '👦', '🧕', '👳'];

export const DAILY_MISSION_POOL = [
  { id: 'm-lesson', text: 'Complete 1 lesson', target: 1, kind: 'lesson', xp: 30, coins: 15 },
  { id: 'm-quiz3', text: 'Answer 3 quiz questions correctly', target: 3, kind: 'correct', xp: 25, coins: 10 },
  { id: 'm-game', text: 'Play 1 mini game', target: 1, kind: 'game', xp: 20, coins: 10 },
  { id: 'm-streak', text: 'Log in today (streak!)', target: 1, kind: 'login', xp: 10, coins: 5 },
];
