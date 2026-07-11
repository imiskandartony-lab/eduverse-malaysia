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
    id: 'ek-3', worldId: 'english-kingdom', title: 'Synonyms & Antonyms', year: 5,
    kssr: 'KSSR English Y5 — Vocabulary: Synonyms and antonyms',
    xp: 55, coins: 22, difficulty: 2, prerequisite: 'ek-2',
    intro: 'The royal librarian has twin books: the Book of Same and the Book of Opposite. Sort the words correctly, or the library stays locked forever!',
    steps: [
      '<b>Synonyms</b> are words with the SAME meaning: happy = glad = joyful. big = large = huge.',
      '<b>Antonyms</b> are OPPOSITES: hot ↔ cold, fast ↔ slow, brave ↔ cowardly, generous ↔ stingy.',
      'Strong words make writing exciting: instead of "very big", say <b>enormous</b>. Instead of "very tired", say <b>exhausted</b>.',
    ],
    practice: { q: 'Which word is a synonym of "quick"?', options: ['slow', 'rapid', 'lazy', 'heavy'], answer: 1, hint: 'Which word also means fast?' },
  },
  {
    id: 'ek-4', worldId: 'english-kingdom', title: 'Reading: Find the Clues', year: 5,
    kssr: 'KSSR English Y5 — Reading: Comprehension',
    xp: 60, coins: 25, difficulty: 3, prerequisite: 'ek-3',
    intro: 'A mysterious letter arrived at the castle! Only a sharp-eyed detective can read between the lines. Grab your magnifying glass!',
    steps: [
      'Good readers hunt for clues: <b>WHO</b> is in the story, <b>WHERE</b> are they, <b>WHEN</b> does it happen, <b>WHAT</b> happens, and <b>WHY</b>.',
      'Read this: <i>"Mei Ling grabbed her umbrella and raced out the door. Dark clouds were gathering over the school field where her team was waiting."</i>',
      'Clue hunting: Why the umbrella? <b>Dark clouds → rain is coming.</b> Where is she going? <b>The school field.</b> Why race? <b>Her team is waiting.</b> That is called <b>inference</b> — the clues tell you what the text does not say directly!',
    ],
    practice: { q: 'From the story: what is Mei Ling probably going to do?', options: ['Sleep at home', 'Play a match at the school field', 'Go shopping', 'Visit the library'], answer: 1, hint: 'Her TEAM is waiting at the FIELD…' },
  },
  {
    id: 'gf-1', worldId: 'grammar-forest', title: 'Simple Past Tense', year: 5,
    kssr: 'KSSR English Y5 — Grammar 5.1: Simple past tense',
    xp: 60, coins: 25, difficulty: 2, prerequisite: null,
    intro: 'Welcome to Grammar Forest, traveller! The Memory Tree only shows things that ALREADY happened. Speak in the past tense, and its branches will open a path.',
    steps: [
      'The <b>simple past</b> tells what already happened. Regular verbs add <b>-ed</b>: walk → walk<b>ed</b>, play → play<b>ed</b>, jump → jump<b>ed</b>.',
      'Watch the spelling: stop → sto<b>pped</b>, study → stud<b>ied</b>, dance → danc<b>ed</b>.',
      'Irregular verbs transform completely: go → <b>went</b>, eat → <b>ate</b>, see → <b>saw</b>, run → <b>ran</b>, have → <b>had</b>, is/am → <b>was</b>.',
    ],
    practice: { q: 'Yesterday, Farid ____ to the market with his mother.', options: ['go', 'goes', 'went', 'going'], answer: 2, hint: '"Go" is irregular — it does not use -ed!' },
  },
  {
    id: 'gf-2', worldId: 'grammar-forest', title: 'Articles: a, an, the', year: 5,
    kssr: 'KSSR English Y5 — Grammar 5.1: Articles',
    xp: 55, coins: 22, difficulty: 2, prerequisite: 'gf-1',
    intro: 'Three tiny forest sprites — A, An and The — guard the bridge out of the forest. Each only lets the right words cross!',
    steps: [
      'Use <b>a</b> before consonant sounds: <b>a</b> cat, <b>a</b> house, <b>a</b> uniform (sounds like "yu"!).',
      'Use <b>an</b> before vowel sounds: <b>an</b> apple, <b>an</b> egg, <b>an</b> hour (the "h" is silent!).',
      'Use <b>the</b> for something specific or already known: I saw a cat. <b>The</b> cat was orange. Also: <b>the</b> sun, <b>the</b> moon.',
    ],
    practice: { q: 'Aina ate ____ orange and ____ banana.', options: ['a / an', 'an / a', 'the / an', 'an / the'], answer: 1, hint: 'Listen to the FIRST SOUND: O-range, B-anana.' },
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
    id: 'fi-2', worldId: 'fraction-island', title: 'Add & Subtract Fractions', year: 5,
    kssr: 'KSSR Matematik T5 — 2.2: Tambah dan tolak pecahan',
    xp: 60, coins: 25, difficulty: 2, prerequisite: 'fi-1',
    intro: 'Two pirate crews want to combine their treasure shares — but fractions only join when their pieces match! Help them add up.',
    steps: [
      'Same denominator? Just add the tops: 2/7 + 3/7 = <b>5/7</b>. Subtract the same way: 5/8 − 2/8 = 3/8.',
      'Different denominators? Make them match first: 1/2 + 1/4 → 2/4 + 1/4 = <b>3/4</b>.',
      'Always <b>simplify</b> your answer: 2/6 + 2/6 = 4/6 = <b>2/3</b>.',
    ],
    practice: { q: '1/3 + 1/6 = ?', options: ['2/9', '1/2', '2/6', '1/9'], answer: 1, hint: 'Change 1/3 into sixths first: 1/3 = 2/6.' },
  },
  {
    id: 'fi-3', worldId: 'fraction-island', title: 'Decimals & Percentages', year: 5,
    kssr: 'KSSR Matematik T5 — 3.1: Perpuluhan dan peratus',
    xp: 65, coins: 28, difficulty: 3, prerequisite: 'fi-2',
    intro: 'The island lighthouse speaks three languages: fractions, decimals and percentages. Learn to translate, and its beam will guide you to the hidden vault!',
    steps: [
      'Fractions ↔ decimals: 1/2 = <b>0.5</b>, 1/4 = <b>0.25</b>, 3/10 = <b>0.3</b>, 7/100 = <b>0.07</b>.',
      'Decimals ↔ percentages: move two places! 0.5 = <b>50%</b>, 0.25 = <b>25%</b>, 0.07 = <b>7%</b>.',
      'Percent of a number: 50% of 80 = <b>40</b> (half), 10% of 250 = <b>25</b> (divide by 10), 25% of 60 = <b>15</b> (quarter).',
    ],
    practice: { q: 'What is 3/4 as a percentage?', options: ['34%', '43%', '75%', '25%'], answer: 2, hint: '3/4 = 0.75 — now move the decimal two places.' },
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
    id: 'bm-3', worldId: 'bm-village', title: 'Penjodoh Bilangan', year: 5,
    kssr: 'KSSR BM T5 — Tatabahasa: Penjodoh bilangan',
    xp: 55, coins: 22, difficulty: 2, prerequisite: 'bm-2',
    intro: 'Pasar Kampung Bahasa sedang sibuk! Peniaga keliru — sebiji ayam? Seekor kelapa? Bantu mereka menggunakan PENJODOH BILANGAN yang betul!',
    steps: [
      '<b>Penjodoh bilangan</b> digunakan sebelum kata nama: se<b>orang</b> guru, se<b>ekor</b> kucing, se<b>buah</b> rumah.',
      '<b>orang</b> — manusia. <b>ekor</b> — haiwan. <b>buah</b> — benda besar (rumah, kereta, negara). <b>biji</b> — benda kecil bulat (telur, guli, buah-buahan).',
      '<b>batang</b> — benda panjang (pensel, sungai). <b>helai</b> — benda nipis (kertas, baju, daun). <b>keping</b> — benda pipih (roti, gambar). <b>kuntum</b> — bunga.',
    ],
    practice: { q: 'Ibu membeli tiga ____ baju di pasar raya.', options: ['buah', 'biji', 'helai', 'batang'], answer: 2, hint: 'Baju ialah benda yang nipis.' },
  },
  {
    id: 'bm-4', worldId: 'bm-village', title: 'Simpulan Bahasa', year: 5,
    kssr: 'KSSR BM T5 — Peribahasa: Simpulan bahasa',
    xp: 60, coins: 25, difficulty: 3, prerequisite: 'bm-3',
    intro: 'Tok Dalang bercakap dalam teka-teki! "Jangan jadi kaki bangku," katanya sambil ketawa. Pelajari SIMPULAN BAHASA untuk memahami kata-kata orang tua-tua.',
    steps: [
      '<b>Simpulan bahasa</b> ialah ungkapan dua patah kata dengan maksud tersirat: <b>kaki bangku</b> = tidak pandai bermain bola/sukan.',
      '<b>ringan tulang</b> = rajin bekerja. <b>berat tulang</b> = malas. <b>murah hati</b> = pemurah. <b>besar kepala</b> = sombong, degil.',
      '<b>kaki ayam</b> = tidak berkasut. <b>buah tangan</b> = hadiah/ole-ole. <b>anak emas</b> = orang yang paling disayangi. <b>otak cerdas</b>? Tidak — yang betul <b>cerdik seperti kancil</b>! 🦌',
    ],
    practice: { q: '"Ali sangat ____ kerana selalu membantu ibunya di dapur." Pilih simpulan bahasa yang sesuai.', options: ['besar kepala', 'ringan tulang', 'kaki bangku', 'kaki ayam'], answer: 1, hint: 'Ali RAJIN membantu — tulangnya "ringan" untuk bekerja.' },
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
  'ek-3': [
    { q: 'Which word is a synonym of "happy"?', options: ['angry', 'glad', 'sad', 'tired'], answer: 1, explain: 'Glad means the same as happy.', hint: 'Same meaning, different word.', difficulty: 1 },
    { q: 'What is the antonym of "brave"?', options: ['strong', 'bold', 'cowardly', 'clever'], answer: 2, explain: 'Cowardly is the opposite of brave.', hint: 'Think of someone afraid of everything.', difficulty: 1 },
    { q: 'Choose the STRONGER word for "very big".', options: ['large-ish', 'enormous', 'biggish', 'okay'], answer: 1, explain: 'Enormous means extremely big.', hint: 'Which one sounds the most impressive?', difficulty: 2 },
    { q: 'Which pair are antonyms?', options: ['quick / rapid', 'huge / large', 'generous / stingy', 'glad / joyful'], answer: 2, explain: 'Generous (gives freely) ↔ stingy (hates giving).', hint: 'Three pairs mean the same — find the opposites.', difficulty: 3 },
  ],
  'ek-4': [
    { q: '"Amir put on his boots, took his rod and net, and walked to the river." What is Amir going to do?', options: ['Swim', 'Fish', 'Wash clothes', 'Build a boat'], answer: 1, explain: 'Rod + net + river = fishing!', hint: 'What do you use a rod and net for?', difficulty: 1 },
    { q: '"Siti yawned and rubbed her eyes as the clock struck midnight." How does Siti feel?', options: ['excited', 'hungry', 'sleepy', 'angry'], answer: 2, explain: 'Yawning + rubbing eyes + midnight = sleepy.', hint: 'What do you do when you yawn?', difficulty: 1 },
    { q: '"The field was covered in puddles and everyone\'s shoes were muddy." What happened before?', options: ['It rained', 'It was sunny', 'It snowed', 'There was a drought'], answer: 0, explain: 'Puddles and mud are clues that it rained.', hint: 'What makes puddles appear?', difficulty: 2 },
    { q: '"Kumar counted his coins twice, sighed, and put the toy back on the shelf." Why did Kumar put the toy back?', options: ['He disliked the toy', 'The shop was closing', 'He did not have enough money', 'His mother called him'], answer: 2, explain: 'Counting coins and sighing tells us he could not afford it.', hint: 'Why would he count his coins and sigh?', difficulty: 3 },
  ],
  'gf-1': [
    { q: 'Last night, we ____ dinner at my grandmother\'s house.', options: ['eat', 'ate', 'eats', 'eating'], answer: 1, explain: '"Eat" is irregular: eat → ate.', hint: 'No -ed for this verb!', difficulty: 1 },
    { q: 'The children ____ football until it got dark.', options: ['played', 'plays', 'play', 'playing'], answer: 0, explain: 'Regular verb: play + -ed = played.', hint: 'Just add -ed.', difficulty: 1 },
    { q: 'She ____ a beautiful rainbow after the storm.', options: ['sees', 'seen', 'saw', 'seeing'], answer: 2, explain: 'Irregular: see → saw.', hint: 'It rhymes with "paw".', difficulty: 2 },
    { q: 'Which sentence is CORRECT?', options: ['I goed to school yesterday.', 'I went to school yesterday.', 'I gone to school yesterday.', 'I going to school yesterday.'], answer: 1, explain: 'Go → went. "Goed" is not a word!', hint: 'Go is irregular.', difficulty: 3 },
  ],
  'gf-2': [
    { q: 'I saw ____ elephant at Zoo Negara.', options: ['a', 'an', 'the', 'no article'], answer: 1, explain: 'Elephant starts with a vowel sound → an.', hint: 'E-lephant — listen to the first sound.', difficulty: 1 },
    { q: 'My father bought ____ new car.', options: ['an', 'a', 'two', 'the an'], answer: 1, explain: '"Car" starts with a consonant sound → a.', hint: 'C is a consonant.', difficulty: 1 },
    { q: 'We waited for ____ hour at the clinic.', options: ['a', 'an', 'the', 'no article'], answer: 1, explain: 'The "h" in hour is silent — it sounds like "our" → an.', hint: 'Say "hour" out loud. Do you hear the h?', difficulty: 2 },
    { q: 'I saw a kitten in the drain. ____ kitten looked hungry.', options: ['A', 'An', 'The', 'Some'], answer: 2, explain: 'Second mention — we already know WHICH kitten → the.', hint: 'We are talking about that SPECIFIC kitten now.', difficulty: 3 },
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
  'fi-2': [
    { q: '3/9 + 4/9 = ?', options: ['7/18', '7/9', '12/9', '1/9'], answer: 1, explain: 'Same denominator — add the tops: 3+4 = 7 → 7/9.', hint: 'The bottom number stays the same.', difficulty: 1 },
    { q: '7/10 − 3/10 = ?', options: ['4/10', '10/10', '4/20', '3/10'], answer: 0, explain: '7−3 = 4 → 4/10 (= 2/5 simplified).', hint: 'Subtract only the top numbers.', difficulty: 1 },
    { q: '1/2 + 1/4 = ?', options: ['2/6', '1/6', '3/4', '2/4'], answer: 2, explain: '1/2 = 2/4, so 2/4 + 1/4 = 3/4.', hint: 'Turn 1/2 into quarters first.', difficulty: 2 },
    { q: '5/6 − 1/3 = ?', options: ['4/3', '1/2', '4/6', '1/3'], answer: 1, explain: '1/3 = 2/6, so 5/6 − 2/6 = 3/6 = 1/2.', hint: 'Change 1/3 into sixths, then simplify.', difficulty: 3 },
  ],
  'fi-3': [
    { q: '1/4 as a decimal is…', options: ['0.14', '0.4', '0.25', '0.75'], answer: 2, explain: '1 ÷ 4 = 0.25.', hint: 'A quarter of 1.00.', difficulty: 1 },
    { q: '0.6 as a percentage is…', options: ['6%', '60%', '0.6%', '600%'], answer: 1, explain: 'Move two places: 0.6 → 60%.', hint: 'Two hops of the decimal point.', difficulty: 1 },
    { q: '10% of 250 = ?', options: ['10', '25', '50', '2.5'], answer: 1, explain: '10% = divide by 10 → 25.', hint: 'Just knock one zero off... carefully!', difficulty: 2 },
    { q: 'A RM80 shirt has a 25% discount. What is the new price?', options: ['RM20', 'RM55', 'RM60', 'RM75'], answer: 2, explain: '25% of 80 = 20, so 80 − 20 = RM60.', hint: 'Find a quarter of RM80 first, then subtract it.', difficulty: 3 },
  ],
  'bm-1': [
    { q: 'Pilih kata nama am.', options: ['Proton', 'Ali', 'sekolah', 'Ipoh'], answer: 2, explain: '"Sekolah" ialah nama umum.', hint: 'Cari perkataan yang tidak perlu huruf besar.', difficulty: 1 },
    { q: '"____ ialah ibu negara Malaysia." Pilih kata nama khas yang betul.', options: ['bandar', 'Kuala Lumpur', 'negeri', 'jalan'], answer: 1, explain: 'Kuala Lumpur ialah kata nama khas.', hint: 'Nama tempat khusus.', difficulty: 1 },
    { q: 'Ayat manakah yang menggunakan kata nama khas dengan betul?', options: ['saya tinggal di melaka.', 'Adik membaca Buku.', 'Kami melawat Zoo Negara.', 'ali suka Durian.'], answer: 2, explain: '"Zoo Negara" dieja betul dengan huruf besar.', hint: 'Semak penggunaan huruf besar.', difficulty: 3 },
  ],
  'bm-3': [
    { q: 'Datuk memelihara lima ____ lembu.', options: ['orang', 'ekor', 'buah', 'biji'], answer: 1, explain: 'Lembu ialah haiwan → ekor.', hint: 'Penjodoh bilangan untuk haiwan.', difficulty: 1 },
    { q: 'Kami melawat dua ____ muzium.', options: ['buah', 'keping', 'batang', 'helai'], answer: 0, explain: 'Muzium ialah bangunan besar → buah.', hint: 'Benda besar seperti rumah dan kereta.', difficulty: 1 },
    { q: 'Adik memetik se____ bunga raya.', options: ['biji', 'helai', 'kuntum', 'keping'], answer: 2, explain: 'Bunga → kuntum.', hint: 'Penjodoh bilangan khas untuk bunga.', difficulty: 2 },
    { q: 'Ayat manakah yang BETUL?', options: ['Saya makan sekeping telur.', 'Saya makan sebiji telur.', 'Saya makan sebatang telur.', 'Saya makan sehelai telur.'], answer: 1, explain: 'Telur ialah benda kecil bulat → biji.', hint: 'Telur berbentuk bulat.', difficulty: 3 },
  ],
  'bm-4': [
    { q: '"Kaki bangku" bermaksud…', options: ['kaki yang sakit', 'tidak pandai bermain sukan', 'suka duduk', 'pembuat kerusi'], answer: 1, explain: 'Kaki bangku = tidak pandai bermain bola atau sukan.', hint: 'Kakinya kaku seperti kaki bangku!', difficulty: 1 },
    { q: 'Orang yang sombong dikatakan…', options: ['besar kepala', 'kaki ayam', 'ringan tulang', 'buah tangan'], answer: 0, explain: 'Besar kepala = sombong, tidak mahu mendengar nasihat.', hint: 'Kepalanya "membesar" kerana bangga diri.', difficulty: 1 },
    { q: 'Mak Cik Minah membawa ____ dari Kelantan untuk jiran-jirannya.', options: ['anak emas', 'buah tangan', 'kaki bangku', 'berat tulang'], answer: 1, explain: 'Buah tangan = hadiah atau ole-ole.', hint: 'Hadiah yang dibawa "di tangan" selepas melancong.', difficulty: 2 },
    { q: 'Ayat manakah menggunakan simpulan bahasa dengan BETUL?', options: ['Adik kaki ayam kerana pandai menyanyi.', 'Abang ringan tulang kerana selalu tidur.', 'Cikgu murah hati kerana selalu menderma.', 'Ali anak emas kerana selalu dimarahi.'], answer: 2, explain: 'Murah hati = pemurah, suka menderma. Yang lain tidak sepadan maksudnya.', hint: 'Padankan maksud tersirat dengan keterangan ayat.', difficulty: 3 },
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
