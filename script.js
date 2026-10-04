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
