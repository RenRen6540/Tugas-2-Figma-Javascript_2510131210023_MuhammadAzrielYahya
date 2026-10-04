'use strict';
/* Membuat data array object */
const HEWAN = [
  { id: 1, nama: 'Komodo', emoji: '🦎', fakta: 'Komodo adalah kadal terbesar di dunia dan hanya hidup di Nusa Tenggara Timur.' },
  { id: 2, nama: 'Orangutan', emoji: '🦧', fakta: 'Orangutan berarti "manusia hutan" dan hidup di Kalimantan dan Sumatra.' },
  { id: 3, nama: 'Gajah', emoji: '🐘', fakta: 'Gajah Sumatra kini berstatus sangat terancam punah.' },
  { id: 4, nama: 'Harimau', emoji: '🐅', fakta: 'Harimau Sumatra adalah satu-satunya harimau yang tersisa di Indonesia.' },
  { id: 5, nama: 'Cendrawasih', emoji: '🦜', fakta: 'Burung cendrawasih berasal dari Papua dan terkenal dengan bulunya yang indah.' },
  { id: 6, nama: 'Penyu', emoji: '🐢', fakta: 'Penyu hijau kembali ke pantai kelahirannya untuk bertelur.' },
  { id: 7, nama: 'Bekantan', emoji: '🐒', fakta: 'Bekantan berhidung panjang dan hanya ada di Kalimantan, dekat Banjarmasin.' },
  { id: 8, nama: 'Elang Jawa', emoji: '🦅', fakta: 'Elang Jawa adalah burung nasional Indonesia (Garuda).' },
  { id: 9, nama: 'Kupu-kupu', emoji: '🦋', fakta: 'Sulawesi punya banyak kupu-kupu endemik yang langka.' },
  { id: 10, nama: 'Pesut', emoji: '🐬', fakta: 'Pesut Mahakam adalah lumba-lumba air tawar dari Sungai Mahakam.' },
  { id: 11, nama: 'Ular Sanca', emoji: '🐍', fakta: 'Sanca kembang bisa mencapai panjang lebih dari 6 meter.' },
  { id: 12, nama: 'Badak Jawa', emoji: '🦏', fakta: 'Badak Jawa tinggal di Ujung Kulon dan sangat langka.' }
];
const LEVEL = {
  mudah: { label: 'Mudah', pasang: 6, kolom: 3, waktu: 60 },
  sedang: { label: 'Sedang', pasang: 8, kolom: 4, waktu: 90 },
  sulit: { label: 'Sulit', pasang: 12, kolom: 4, waktu: 120 }
};
const KUNCI_SKOR = 'cocok-fauna-skor';

/* Membuat state untuk menyimpan informasi tentang keadaan game saat ini */
const state = {
  level: 'mudah', nama: '', kartu: [], terbuka: [], terkunci: false,
  langkah: 0, ditemukan: [], skor: 0, kombo: 0, sisa: 0,
  bantuan: 2, jeda: false, timer: null
};
let papanSkor = [];       // Array object: { nama, skor, level, langkah }
let tabSkor = 'mudah';

/* Membuat helper untuk kumpulan fungsi pendukung */
const $ = (id) => document.getElementById(id);
const acak = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const tampilLayar = (nama) => {
  document.querySelectorAll('.layar').forEach((el) => el.classList.toggle('aktif', el.id === `layar-${nama}`));
  if (nama !== 'game') clearInterval(state.timer);
};

/* Membuat localstorage untuk menu dan papan skor */
const muatSkor = () => {
  try { papanSkor = JSON.parse(localStorage.getItem(KUNCI_SKOR)) || []; } catch { papanSkor = []; }
};
const simpanSkor = (entri) => {
  papanSkor.push(entri);
  try { localStorage.setItem(KUNCI_SKOR, JSON.stringify(papanSkor)); } catch { /* abaikan */ }
};
const renderSkor = () => {
  const ol = $('daftar-skor');
  const data = papanSkor.filter((s) => s.level === tabSkor).sort((a, b) => b.skor - a.skor).slice(0, 5);
  ol.innerHTML = '';
  if (data.length === 0) { ol.innerHTML = '<li>Belum ada skor. Jadilah yang pertama!</li>'; return; }
  data.forEach((s) => {   // perulangan untuk membuat elemen DOM
    const li = document.createElement('li');
    li.textContent = `${s.nama}: ${s.skor} poin (${s.langkah} langkah)`;
    ol.appendChild(li);
  });
};
const renderMenu = () => {
  const grup = $('level-grup'), tab = $('tab-skor');
  grup.innerHTML = ''; tab.innerHTML = '';
  Object.entries(LEVEL).forEach(([kode, l]) => {
    const b = document.createElement('button');
    b.innerHTML = `${l.label}<small>${l.pasang} pasang, ${l.waktu} dtk</small>`;
    b.setAttribute('aria-pressed', kode === state.level);
    b.addEventListener('click', () => { state.level = kode; renderMenu(); });
    grup.appendChild(b);
    const t = document.createElement('button');
    t.textContent = l.label;
    t.setAttribute('role', 'tab'); t.setAttribute('aria-selected', kode === tabSkor);
    t.addEventListener('click', () => { tabSkor = kode; renderMenu(); });
    tab.appendChild(t);
  });
  renderSkor();
};

/* Membuat logika untuk game dan HUD */
const mulaiGame = () => {
  const nama = $('input-nama').value.trim();
  if (!nama) { $('pesan-menu').textContent = 'Isi nama pemain dulu.'; $('input-nama').focus(); return; }
  $('pesan-menu').textContent = '';
  const cfg = LEVEL[state.level];
  const pilihan = acak(HEWAN).slice(0, cfg.pasang);
  // gandakan tiap hewan menjadi sepasang kartu, lalu acak
  state.kartu = acak(pilihan.flatMap((h) => [{ ...h, uid: `${h.id}a` }, { ...h, uid: `${h.id}b` }]));
  Object.assign(state, { nama, terbuka: [], terkunci: false, langkah: 0, ditemukan: [], skor: 0, kombo: 0, sisa: cfg.waktu, bantuan: 2, jeda: false });
  $('papan').style.setProperty('--kolom', cfg.kolom);
  $('fakta').textContent = 'Balik dua kartu untuk mulai.';
  $('btn-jeda').textContent = 'Jeda';
  renderPapan(); updateHUD(); tampilLayar('game');
  clearInterval(state.timer);
  state.timer = setInterval(tick, 1000);
};
const renderPapan = () => {
  const papan = $('papan');
  papan.innerHTML = '';
  state.kartu.forEach((k) => {
    const btn = document.createElement('button');
    btn.className = 'kartu'; btn.dataset.uid = k.uid;
    btn.setAttribute('aria-label', 'Kartu tertutup');
    btn.innerHTML = `<div class="kartu-dalam"><div class="sisi belakang"></div><div class="sisi depan"><span>${k.emoji}</span><small>${k.nama}</small></div></div>`;
    btn.addEventListener('click', () => balikKartu(btn, k));
    papan.appendChild(btn);
  });
};
const balikKartu = (el, k) => {
  if (state.terkunci || state.jeda) return;
  if (el.classList.contains('terbuka') || el.classList.contains('cocok')) return;
  el.classList.add('terbuka');
  el.setAttribute('aria-label', `Kartu ${k.nama}`);
  state.terbuka.push({ el, k });
  if (state.terbuka.length === 2) { state.langkah++; cekPasangan(); }
  updateHUD();
};
const cekPasangan = () => {
  const [a, b] = state.terbuka;
  state.terkunci = true;
  if (a.k.id === b.k.id) {                       // percabangan: cocok
    state.kombo++;
    state.skor += 100 + (state.kombo - 1) * 50;  // bonus kombo
    state.ditemukan.push(a.k);
    [a, b].forEach((x) => { x.el.classList.remove('terbuka'); x.el.classList.add('cocok'); x.el.disabled = true; });
    $('fakta').textContent = `${a.k.emoji} ${a.k.nama}: ${a.k.fakta}`;
    state.terbuka = []; state.terkunci = false;
    if (state.ditemukan.length === LEVEL[state.level].pasang) selesai(true);
  } else {                                       // tidak cocok
    state.kombo = 0;
    state.skor = Math.max(0, state.skor - 10);
    setTimeout(() => {
      [a, b].forEach((x) => { x.el.classList.remove('terbuka'); x.el.setAttribute('aria-label', 'Kartu tertutup'); });
      state.terbuka = []; state.terkunci = false; updateHUD();
    }, 800);
  }
};
const tick = () => {
  if (state.jeda) return;
  state.sisa--;
  updateHUD();
  if (state.sisa <= 0) selesai(false);
};
const updateHUD = () => {
  $('hud-waktu').textContent = state.sisa;
  $('hud-langkah').textContent = state.langkah;
  $('hud-skor').textContent = state.skor;
  $('hud-kombo').textContent = `x${state.kombo}`;
  $('hud-waktu').parentElement.classList.toggle('urgent', state.sisa <= 10);
  $('btn-bantuan').textContent = `Intip kartu (${state.bantuan})`;
  $('btn-bantuan').disabled = state.bantuan === 0;
};

/* Untuk fitur intip dan jeda */
const intip = () => {
  if (state.bantuan === 0 || state.terkunci || state.jeda) return;
  state.bantuan--; state.skor = Math.max(0, state.skor - 30); state.terkunci = true;
  const semua = document.querySelectorAll('.kartu:not(.cocok)');
  semua.forEach((el) => el.classList.add('intip'));
  setTimeout(() => { semua.forEach((el) => el.classList.remove('intip')); state.terkunci = false; }, 1200);
  updateHUD();
};
const toggleJeda = () => {
  state.jeda = !state.jeda;
  $('btn-jeda').textContent = state.jeda ? 'Lanjut' : 'Jeda';
  $('papan').style.visibility = state.jeda ? 'hidden' : 'visible';  // Untuk mencegah curang saat jeda
};
