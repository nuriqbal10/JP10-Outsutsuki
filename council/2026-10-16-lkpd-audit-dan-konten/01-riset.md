# Riset: Audit Regulasi & Pembuatan LKPD Terstandarisasi Irodori A2.2 (Bab 1 - 18)

## Ringkasan
Riset ini menganalisis kesesuaian modul Lembar Kerja Peserta Didik (LKPD) yang saat ini ada di portal LMS dengan regulasi kurikulum resmi Irodori 初級2, standar pengujian JFT-Basic A2 (Japan Foundation), dan ketentuan ketuntasan belajar LPK (KKM 85 pt). Ditemukan bahwa LKPD yang ada saat ini baru mencakup Bab 1 sampai Bab 12 (Bab 13–18 belum tersedia), nilai KKM di panduan masih mencantumkan standar lama (70/75 pt), serta terdapat inkonsistensi struktur antara LKPD web statis dengan integrasi penilaian portal rapor.

---

## Kondisi Proyek Saat Ini

### 1. Struktur File LKPD yang Ada
- **Direktori Web Statis:** `web/public/lkpd/`
  - Telah tersedia: `bab1` sampai `bab12` (masing-masing memiliki `index.html`, `script.js`, `style.css`, `data-soal.js`, dan folder `audio/`).
  - **Belum tersedia:** `bab13`, `bab14`, `bab15`, `bab16`, `bab17`, `bab18`. Padahal buku Irodori Shokyu 2 resmi terdiri dari total **18 Bab**.
- **Komponen Penampil LMS:** `web/src/components/lms/LkpdWorksheet.tsx`
  - Hanya mendefinisikan metadata `AUTHENTIC_LKPD_TITLES` untuk Bab 1 s.d. 12 (`hasAuthenticLkpd = chapter >= 1 && chapter <= 12`). Bab 13–18 menampilkan teks *"Materi LKPD interaktif sedang dalam proses sinkronisasi"*.
- **Database & API Submisi:** `web/src/app/api/lkpd/route.ts` & tabel `lkpdSubmissions`
  - Telah mendukung penyimpanan skor, feedback Sensei, jawaban JSON, dan tanggal pengumpulan.

### 2. Audit Kepatuhan Regulasi & Standar Pedagogis LKPD
Mengacu pada **Panduan Penyusunan LKPD Kemendikbudristek/BSNP** dan **Standar JF Standard for Japanese-Language Education (CEFR A2)**:

| Komponen Regulasi LKPD Resmi | Kondisi LKPD Bab 1–12 Saat Ini | Status Evaluasi | Rekomendasi Regulasi |
| :--- | :--- | :--- | :--- |
| **1. Identitas LKPD** | Tersedia: Nama, Kelas, Tanggal di input form. | ⚠️ Perlu Pembenahan | Belum memuat nama Satuan Pendidikan/LPK resmi, Alokasi Waktu (menit), dan Capaian Pembelajaran baku di kop header formulir cetak. |
| **2. Standar Can-do CEFR A2** | Ada di tab "Panduan" (Can-do Statement). | ✅ Sesuai | Telah memuat Can-do Irodori A2. Perlu dipertahankan dan ditambahkan rubrik self-assessment (*Jiko Hyouka*). |
| **3. Petunjuk Belajar & Alur** | Ada petunjuk login siswa/guru dan putar audio. | ⚠️ Perlu Pembenahan | Masih mencantumkan teks *"Audio diputar menggunakan teks-ke-suara browser"* padahal aset audio otentik MP3 studio sudah tersedia lengkap di folder `Aset Audio & Gambar`. |
| **4. Keselarasan KKM** | Panduan menuliskan: Nilai Akhir Bab $\ge 75$, Mini JFT-like $\ge 70$. | ❌ **Tidak Sesuai Regulasi LPK** | Harus disinkronkan dengan ambang batas KKM resmi LPK yang telah ditetapkan yaitu **85 pt** (Grade A = Tuntas KKM $\ge 85$, Remedial jika $< 85$). |
| **5. Struktur Asesmen 4 Seksi** | Ada 4 seksi (Moji-Goi, Kaiwa, Choukai, Dokkai) + Suplemen (Kanji, Kotoba, Terjemahan). | ✅ Sesuai | Struktur seksi sudah selaras dengan *Master Blueprint Universal JFT-Basic A2*. |
| **6. Ketersediaan Bab 13–18** | Bab 13–18 kosong (tidak ada modul LKPD). | ❌ **Belum Lengkap** | Wajib dibuatkan LKPD Bab 13 s.d. 18 secara lengkap beserta isi materi, soal, bank audio otentik, dan kunci jawaban. |
| **7. Rubrik Refleksi Diri (Jiko Hyouka)** | Ada 6 pertanyaan esai refleksi di tab akhir. | ⚠️ Perlu Peningkatan | Perlu ditambahkan skala likert Can-do (1-Bintang s/d 5-Bintang) agar dapat diukur secara kuantitatif dalam rapor diagnostik. |

### 3. Ketersediaan Aset Sumber Materi Proyek
- File Markdown silabus & materi mentah: `Modul & Kurikulum/File MD Modul 初級2/` (`Bab 1.md` s.d. `Bab 18.md` lengkap).
- File PDF modul resmi: `Modul & Kurikulum/Modul 初級2/` (`Bab 1.pdf` s.d. `Bab 18.pdf` lengkap).
- Master Blueprint Soal: `Modul & Kurikulum/MASTER_BLUEPRINT_UNIVERSAL_JFT_A2.md`.
- Aset Audio Otentik MP3: `Aset Audio & Gambar/Audio 初級2/` (Tersedia ribuan file audio otentik dari `Z_[01-01]` s.d. `Z_[18-xx]`).

---

## Pilihan Solusi

### Pilihan A: Pembaruan Menyeluruh (Full Standardization & Generation Bab 13–18)
- **Cara Kerja:**
  1. Mengoreksi dan menyelaraskan seluruh LKPD `bab1` s.d. `bab12` yang sudah ada: update KKM ke 85 pt, perbarui teks panduan, rapikan rubrik refleksi Can-do, dan pastikan seluruh audio merujuk ke audio otentik studio.
  2. Men-generate modul LKPD baru untuk `bab13`, `bab14`, `bab15`, `bab16`, `bab17`, dan `bab18` dengan struktur lengkap (Panduan KKM 85, Materi & Pola Tata Bahasa dari Markdown modul, 30 Soal Mini JFT-like 4 Seksi, 10 Soal Kanji, 10 Soal Kosakata, 5 Soal Terjemahan, Bank Audio Otentik Bab 13–18, Hasil & Refleksi).
  3. Memperbarui `LkpdWorksheet.tsx` dan `chapterModules.ts` agar mendukung navigasi penuh Bab 1–18.
- **Kelebihan:** Kurikulum dan portal LKPD menjadi 100% lengkap dari Bab 1 hingga Bab 18, memenuhi seluruh regulasi KKM 85, dan siap dipakai untuk seluruh tingkatan Irodori 初級2.
- **Kekurangan:** Volume data dan pembuatan file cukup besar (6 bab baru dengan total ratusan soal dan integrasi audio).
- **Tingkat Kerumitan:** Sedang - Tinggi.

### Pilihan B: Perbaikan Regulasi Bab 1–12 Terlebih Dahulu, Lalu Bertahap Bab 13–18
- **Cara Kerja:**
  1. Fokus membetulkan regulasi Bab 1–12 terlebih dahulu (KKM 85, audio, dan rubrik).
  2. Membuat draft struktur Bab 13–18 tanpa audio bank penuh.
- **Kelebihan:** Cepat selesai pada tahap awal.
- **Kekurangan:** Siswa bab 13–18 masih belum memiliki LKPD lengkap dan harus menunggu tahap berikutnya.
- **Tingkat Kerumitan:** Sedang.

### Pilihan C: Refaktor Komponen LKPD Menjadi Dynamic React/Next.js Component (Tanpa Iframe HTML)
- **Cara Kerja:** Memindahkan seluruh file statis `index.html` dan `data-soal.js` ke dalam database Neon PostgreSQL / JSON Next.js native.
- **Kelebihan:** Desain lebih menyatu dengan Tailwind/Claymorphism tanpa iframe.
- **Kekurangan:** Mengubah arsitektur yang sudah berjalan, berisiko merusak sistem penilaian offline/print yang saat ini sudah stabil di HTML publik.
- **Tingkat Kerumitan:** Sangat Tinggi.

---

## Sumber
1. *Buku Pedoman Penggunaan Irodori Tingkat Dasar 2 (The Japan Foundation)*
2. *MASTER_BLUEPRINT_UNIVERSAL_JFT_A2.md* (Dokumen internal proyek)
3. *File MD Modul 初級2 (Bab 1 s.d. Bab 18)*
4. *Aset Audio Otentik Irodori 初級2 (`Aset Audio & Gambar/Audio 初級2`)*
5. *Standar Mutu & Regulasi Penilaian LPK / JFT-Basic A2 (KKM Minimum 85 pt)*
