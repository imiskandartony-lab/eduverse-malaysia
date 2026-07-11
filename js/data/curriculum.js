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
    id: 'mv-2', worldId: 'maths-volcano', title: 'Darab (Multiplication)', year: 5,
    kssr: 'KSSR Matematik T5 — 1.4: Darab hingga 100 000',
    xp: 60, coins: 25, difficulty: 2, prerequisite: 'mv-1',
    intro: 'Gunung berapi menggandakan kekuatannya! Hanya wira yang mahir DARAB dapat menandingi kuasanya. Sedia?',
    steps: [
      'Darab ialah <b>penambahan berulang</b>: 4 × 3 = 4 + 4 + 4 = 12.',
      'Darab dengan 10, 100, 1000: tambah sifar di belakang! 25 × 10 = 250, 25 × 100 = 2 500.',
      'Untuk nombor besar, darab <b>mengikut nilai tempat</b>: 123 × 4 = (100 × 4) + (20 × 4) + (3 × 4) = 400 + 80 + 12 = 492.',
    ],
    practice: { q: 'Berapakah 15 × 100?', options: ['150', '1 500', '15 000', '105'], answer: 1, hint: 'Darab dengan 100 — tambah DUA sifar di belakang 15.' },
  },
  {
    id: 'mv-3', worldId: 'maths-volcano', title: 'Bahagi (Division)', year: 5,
    kssr: 'KSSR Matematik T5 — 1.5: Bahagi hingga 100 000',
    xp: 60, coins: 25, difficulty: 2, prerequisite: 'mv-2',
    intro: 'Harta karun gunung berapi mesti DIBAHAGIKAN sama rata antara para wira. Silap kira, semua hangus!',
    steps: [
      'Bahagi ialah <b>pengagihan sama rata</b>: 12 ÷ 3 = 4 (12 gula-gula untuk 3 orang, setiap orang dapat 4).',
      'Bahagi ialah <b>songsangan darab</b>: jika 6 × 4 = 24, maka 24 ÷ 4 = 6 dan 24 ÷ 6 = 4.',
      'Bahagi dengan 10, 100, 1000: buang sifar di belakang! 3 500 ÷ 100 = 35. Ada <b>baki</b> jika tidak habis dibahagi: 13 ÷ 4 = 3 baki 1.',
    ],
    practice: { q: 'Berapakah 24 ÷ 6?', options: ['3', '4', '6', '8'], answer: 1, hint: 'Fikir songsangan: 6 × ? = 24.' },
  },
  {
    id: 'mv-4', worldId: 'maths-volcano', title: 'Wang (Money)', year: 5,
    kssr: 'KSSR Matematik T5 — 4.1: Wang hingga RM1 000 000',
    xp: 60, coins: 30, difficulty: 2, prerequisite: 'mv-3',
    intro: 'Pedagang gunung berapi membuka kedai! Kira WANG dengan tepat — tersilap kira, harta karunmu lebur dalam lava!',
    steps: [
      'Wang Malaysia: <b>sen</b> dan <b>ringgit (RM)</b>. 100 sen = RM1. Tulis dengan dua tempat perpuluhan: RM5.60, RM12.05.',
      '<b>Tambah dan tolak wang</b> seperti nombor perpuluhan — jajarkan titik: RM12.50 + RM3.80 = RM16.30. Baki = wang dibayar − harga: bayar RM50 untuk barang RM34.20, baki RM15.80.',
      '<b>Masalah harian:</b> 4 buku berharga RM6.50 sebuah → 4 × RM6.50 = RM26.00. Kongsi RM90 antara 3 orang → RM90 ÷ 3 = RM30 seorang.',
    ],
    practice: { q: 'Amir membayar RM20 untuk sebuah buku berharga RM13.40. Berapakah bakinya?', options: ['RM6.60', 'RM7.60', 'RM6.40', 'RM7.40'], answer: 0, hint: 'RM20.00 − RM13.40. Kira sen dahulu: 100 − 40.' },
  },
  {
    id: 'mv-5', worldId: 'maths-volcano', title: 'Masa (Time)', year: 5,
    kssr: 'KSSR Matematik T5 — 5.1: Masa dan waktu',
    xp: 60, coins: 30, difficulty: 2, prerequisite: 'mv-4',
    intro: 'Jam gergasi gunung berapi telah rosak! Betulkan MASA sebelum letusan seterusnya — setiap saat sangat berharga!',
    steps: [
      'Unit masa: 60 saat = 1 minit, 60 minit = 1 jam, 24 jam = 1 hari, 7 hari = 1 minggu, 12 bulan = 1 tahun.',
      '<b>Sistem 12 jam dan 24 jam:</b> 3:00 petang = 1500, 7:30 pagi = 0730, 11:45 malam = 2345. Selepas 1259, terus ke 1300!',
      '<b>Tempoh masa:</b> dari 8:30 pagi hingga 11:00 pagi = 2 jam 30 minit. Kira jam dahulu, kemudian minit.',
    ],
    practice: { q: 'Pukul 4:15 petang dalam sistem 24 jam ialah…', options: ['0415', '1215', '1615', '1815'], answer: 2, hint: 'Petang: tambah 12 kepada jam. 4 + 12 = ?' },
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
    id: 'bm-2', worldId: 'bm-village', title: 'Kata Hubung', year: 5,
    kssr: 'KSSR BM T5 — Tatabahasa: Kata hubung',
    xp: 55, coins: 22, difficulty: 2, prerequisite: 'bm-1',
    intro: 'Jambatan Kampung Bahasa telah runtuh! Gunakan KATA HUBUNG untuk menyambungkan semula papan-papan jambatan — dan ayat-ayat yang terputus.',
    steps: [
      '<b>Kata hubung</b> menyambungkan perkataan, frasa atau ayat: <i>dan, atau, tetapi, kerana, sambil, lalu, jika, walaupun</i>.',
      '<b>dan</b> — menambah: <i>Ali <b>dan</b> Abu bermain bola.</i> <b>tetapi</b> — berlawanan: <i>Dia rajin <b>tetapi</b> adiknya malas.</i>',
      '<b>kerana</b> — sebab: <i>Saya tidak hadir <b>kerana</b> demam.</i> <b>jika</b> — syarat: <i>Kita berkelah <b>jika</b> cuaca baik.</i> <b>sambil</b> — serentak: <i>Dia menyanyi <b>sambil</b> menari.</i>',
    ],
    practice: { q: 'Emak memasak ____ berbual dengan jiran.', options: ['kerana', 'sambil', 'tetapi', 'jika'], answer: 1, hint: 'Dua perbuatan dilakukan SERENTAK.' },
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
  'mv-2': [
    { q: '7 × 8 = ?', options: ['54', '56', '63', '48'], answer: 1, explain: '7 × 8 = 56 — sifir 7 dan 8!', hint: 'Ingat sifir: 7×8 sama dengan 8×7.', difficulty: 1 },
    { q: '36 × 10 = ?', options: ['360', '3 600', '36', '306'], answer: 0, explain: 'Darab 10 → tambah satu sifar: 360.', hint: 'Berapa sifar untuk × 10?', difficulty: 1 },
    { q: '123 × 4 = ?', options: ['482', '492', '412', '462'], answer: 1, explain: '(100×4) + (20×4) + (3×4) = 400+80+12 = 492.', hint: 'Darab ikut nilai tempat, kemudian tambah.', difficulty: 2 },
    { q: 'Sebuah kotak ada 25 biji epal. Berapa biji epal dalam 40 kotak?', options: ['650', '1 000', '900', '100'], answer: 1, explain: '25 × 40 = 25 × 4 × 10 = 1 000.', hint: 'Kira 25 × 4 dahulu, kemudian × 10.', difficulty: 3 },
  ],
  'mv-3': [
    { q: '45 ÷ 9 = ?', options: ['4', '5', '6', '9'], answer: 1, explain: '9 × 5 = 45, jadi 45 ÷ 9 = 5.', hint: '9 × ? = 45.', difficulty: 1 },
    { q: '4 700 ÷ 100 = ?', options: ['4.7', '47', '470', '4 700'], answer: 1, explain: 'Bahagi 100 → buang dua sifar: 47.', hint: 'Buang berapa sifar untuk ÷ 100?', difficulty: 1 },
    { q: '17 ÷ 5 = ? (dengan baki)', options: ['3 baki 2', '3 baki 1', '2 baki 7', '4 baki 3'], answer: 0, explain: '5 × 3 = 15, baki 17 − 15 = 2.', hint: 'Cari darab 5 terbesar yang tidak melebihi 17.', difficulty: 2 },
    { q: '96 biji kuih dibahagikan sama rata kepada 8 orang murid. Berapa biji seorang?', options: ['10', '11', '12', '14'], answer: 2, explain: '96 ÷ 8 = 12 biji seorang.', hint: '8 × ? = 96. Cuba 8 × 12.', difficulty: 3 },
  ],
  'bm-2': [
    { q: 'Adik menangis ____ lapar.', options: ['dan', 'kerana', 'atau', 'sambil'], answer: 1, explain: '"Kerana" menunjukkan sebab adik menangis.', hint: 'Mengapa adik menangis? Itu SEBAB.', difficulty: 1 },
    { q: 'Kamu mahu teh ____ kopi?', options: ['atau', 'tetapi', 'kerana', 'lalu'], answer: 0, explain: '"Atau" digunakan untuk pilihan.', hint: 'Pilih satu daripada dua.', difficulty: 1 },
    { q: 'Badannya kecil ____ tenaganya kuat.', options: ['dan', 'jika', 'tetapi', 'sambil'], answer: 2, explain: '"Tetapi" menunjukkan pertentangan: kecil lawan kuat.', hint: 'Dua keadaan yang BERLAWANAN.', difficulty: 2 },
    { q: 'Kita akan bertolak awal pagi ____ jalan raya sesak.', options: ['walaupun', 'sambil', 'atau', 'lalu'], answer: 0, explain: '"Walaupun" menunjukkan keadaan yang bertentangan dengan tindakan.', hint: 'Tetap bertolak MESKIPUN ada halangan.', difficulty: 3 },
  ],
  'mv-4': [
    { q: 'RM7.25 + RM2.50 = ?', options: ['RM9.75', 'RM9.25', 'RM10.75', 'RM8.75'], answer: 0, explain: 'Jajarkan titik: 7.25 + 2.50 = 9.75.', hint: 'Tambah sen dahulu: 25 + 50.', difficulty: 1 },
    { q: 'Berapa keping duit RM10 dalam RM100?', options: ['5', '10', '20', '100'], answer: 1, explain: 'RM100 ÷ RM10 = 10 keping.', hint: '10 × ? = 100.', difficulty: 1 },
    { q: 'Sebatang pensel berharga RM1.20. Berapakah harga 5 batang?', options: ['RM5.20', 'RM6.00', 'RM6.20', 'RM5.00'], answer: 1, explain: '5 × RM1.20 = RM6.00.', hint: '5 × 120 sen = 600 sen.', difficulty: 2 },
    { q: 'Puan Siti membayar RM50 untuk barang berharga RM37.65. Berapakah bakinya?', options: ['RM12.35', 'RM13.35', 'RM12.65', 'RM13.45'], answer: 0, explain: 'RM50.00 − RM37.65 = RM12.35.', hint: 'Kira sen dahulu: 100 − 65 = 35 sen.', difficulty: 3 },
  ],
  'mv-5': [
    { q: 'Berapa minit dalam 2 jam?', options: ['60', '100', '120', '200'], answer: 2, explain: '2 × 60 minit = 120 minit.', hint: '1 jam = 60 minit.', difficulty: 1 },
    { q: '9:00 malam dalam sistem 24 jam ialah…', options: ['0900', '1900', '2100', '2300'], answer: 2, explain: 'Malam: 9 + 12 = 21 → 2100.', hint: 'Selepas tengah hari, tambah 12.', difficulty: 1 },
    { q: 'Kelas bermula pukul 7:30 pagi dan tamat pukul 10:00 pagi. Berapakah tempohnya?', options: ['2 jam', '2 jam 30 minit', '3 jam', '3 jam 30 minit'], answer: 1, explain: '7:30 → 10:00 ialah 2 jam 30 minit.', hint: '7:30 → 9:30 (2 jam), 9:30 → 10:00 (30 minit).', difficulty: 2 },
    { q: 'Sebuah bas bertolak pukul 1445 dan tiba pukul 1620. Berapa lamakah perjalanan itu?', options: ['1 jam 25 minit', '1 jam 35 minit', '2 jam 25 minit', '1 jam 45 minit'], answer: 1, explain: '1445 → 1600 ialah 1 jam 15 minit, tambah 20 minit = 1 jam 35 minit.', hint: '1445 → 1545 (1 jam), 1545 → 1620 (35 minit).', difficulty: 3 },
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
