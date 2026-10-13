# 🍱 LKPD Interaktif Bahasa Jepang - Irodori Dasar 2 (A2.2) Bab 4

[![CEFR Level](https://img.shields.io/badge/CEFR-A2.2%20(Irodori%20Dasar%202)-blue.svg)](https://www.irodori.jpf.go.jp/)
[![Topic](https://img.shields.io/badge/Topik-しょうゆをつけないで食べてください-orange.svg)](#)
[![Audio Tracks](https://img.shields.io/badge/Audio-30%20Tracks%20JF%20Resmi-success.svg)](#)
[![Questions](https://img.shields.io/badge/Evaluasi-55%20Butir%20Soal-purple.svg)](#)
[![Claymorphism UI](https://img.shields.io/badge/UI-Apple%20Claymorphism%20v3-teal.svg)](#)

> **Lembar Kerja Peserta Didik (LKPD) Interaktif** berbasis standar JF Standard for Japanese-Language Education / Irodori Nihongo Seikatsu Dasar 2 (A2.2) Bab 4: **「しょうゆをつけないで食べてください」** (Tolong Santap Tanpa Memakai Kecap Asin).

---

## 🎯 Capaian Pembelajaran & Can-do Objectives

| Can-do | Kompetensi Komunikatif | Penjelasan & Contoh Praktis |
| :---: | :--- | :--- |
| **Can-do 14** | Merekomendasikan tempat makan yang disukai | *ラーメンなら、「いちばん」がいいですよ。安くておいしいです。* (Menawarkan pilihan restoran berdasar preferensi lawan bicara). |
| **Can-do 15** | Memahami penjelasan sederhana cara menyantap makanan | Memahami instruksi urutan dan cara makan: *たれにつけて食べてください* / *しょうゆをかけないで食べてください*. |
| **Can-do 16** | Bertanya dan menjelaskan cara makan suatu hidangan | *これはどうやって食べるんですか？* -> *そのままでどうぞ* / *塩をつけて食べます*. |
| **Can-do 17** | Menjelaskan secara ringkas cara memasak / resep praktis | Urutan persiapan: *肉を切ってから、いためます* (Memotong daging terlebih dahulu baru menumis). |
| **Can-do 18** | Membaca ulasan dan komentar tentang restoran | Menangkap informasi menu andalan, harga, suasana, dan kepuasan pengunjung di website review kuliner. |

---

## 🍱 Struktur Materi & Tata Bahasa Utama

1. **`N なら、～` (Kondisional Rekomendasi/Topik Khusus):**
   - *ラーメンなら、「いちばん」がいいですよ。* (Kalau ramen, restoran 'Ichiban' sangat bagus/rekomendasi).
2. **`V-て / V-ないで、～` (Menjelaskan Cara / Kondisi Aksi):**
   - *たれにつけて食べてください。* (Silakan celupkan ke dalam bumbu saus baru dimakan).
   - *しょうゆをつけないで食べてください。* (Tolong makan tanpa mencelupkannya ke kecap asin).
3. **`V-ちゃだめです / V-てはいけません` (Larangan Lembut):**
   - *そのまま飲んじゃだめですよ。スープで割ってください。* (Jangan langsung diminum begitu saja; encerkan dengan sup).
4. **`V-てから、～` (Urutan Kronologis Waktu):**
   - *野菜をよく洗ってから、切ってください。* (Setelah sayuran dicuci bersih, barulah dipotong).
5. **`S1 が、S2` (Hubungan Kontras/Kualifikasi):**
   - *おいしいですが、ちょっと量が多いです。* (Enak sih, tapi porsinya agak terlalu banyak).

---

## 📚 12 Tab Navigasi Modul Interaktif

1. **Panduan (ガイド):** Petunjuk pengerjaan, regulasi durasi belajar, dan etika penilaian mandiri.
2. **Materi (学習内容):** Rangkuman teori tata bahasa, rumus partikel, dan contoh kalimat situasi nyata.
3. **Moji-Goi (文字・語彙):** Pengenalan bumbu dapur (*塩, 砂糖, こしょう, スパイス, ソース, たれ, 油, ポン酢, ごまだれ*) dan kata kerja masak (*切る, 焼く, 煮る, ゆでる, 蒸す, いためる, 揚げる*).
4. **Kaiwa (会話):** Latihan dialog situasi restoran dan percakapan rekomendasi kuliner.
5. **Choukai (聴解):** Latihan pemahaman simakan menggunakan 30 trek audio resmi Japan Foundation.
6. **Dokkai (読解):** Analisis teks bacaan ulasan online rumah makan *「いろどり食堂」* dan deskripsi menu.
7. **Kanji (漢字):** Pembelajaran 8 kanji esensial Bab 4: **塩, 油, 量, 食べ方, 満足, 切る, 焼く, 入れる**.
8. **Kosakata (単語帳):** Glosarium istilah rasa, porsi, bumbu, dan budaya kuliner Jepang.
9. **Terjemahan (翻訳):** Latihan alih bahasa Jepang - Indonesia dan Indonesia - Jepang kontekstual.
10. **Bank Audio (音声バンク):** Pemutar audio interaktif seluruh trek `Z_[04-01]` hingga `Z_[04-30]` dengan scrubber playback & lirik audio transcript.
11. **Hasil & Nilai (成績・スコア):** Rekapitulasi nilai otomatis (Skor 0-100), rincian benar/salah, Teacher Mode (PIN `sensei123`), dan cetak sertifikat LKPD (PDF).
12. **Refleksi (振り返り):** Lembar evaluasi diri siswa (*Can-do self check*) dan feedback pembelajaran.

---

## 🛠️ Arsitektur & Teknologi

- **Frontend:** Pure HTML5, Modern CSS3 (Apple Claymorphism Design System, Neumorphic Depth, CSS Grid & Flexbox), Vanilla JavaScript (ES6+).
- **Audio Engine:** HTML5 Audio API dengan playlist terindeks, buffering otomatis, dan fallback controller.
- **Keamanan:** SHA-256 Hashing dengan unique salt (`lkpd_bab4::v1::`) untuk autentikasi Teacher PIN (`sensei123`).
- **Data Sync:** Terintegrasi langsung dengan Webhook Google Apps Script (`LPKb1-7x9q-2026z`) untuk sinkronisasi nilai ke spreadsheet rekapitulasi nilai kelas.
- **Standalone:** Dapat dijalankan langsung dari browser lokal (`file:///`) tanpa memerlukan instalasi node.js server backend.

---

## 📂 Struktur Berkas

```
LKPD-Irodori-A2.2-Bab-4/
├── index.html          # Entry point utama antarmuka pengguna (12 tab)
├── style.css           # Claymorphism & Neumorphism design styling
├── script.js           # Engine navigasi, scoring, audio player, & webhook sync
├── data-soal.js        # Dataset 55 butir soal evaluasi, materi, & 30 metadata audio
├── audio/              # Direktori 30 berkas audio resmi Japan Foundation
│   ├── Z_[04-01].mp3
│   ├── ...
│   └── Z_[04-30].mp3
└── README.md           # Dokumentasi teknis dan panduan penggunaan
```

---

## 👨‍🏫 Mode Guru (Teacher Mode)

Guru dan pengajar dapat membuka kunci analisis dan kunci jawaban dengan:
1. Buka Tab **Hasil & Nilai**.
2. Masukkan PIN Guru: `sensei123`.
3. Klik **Buka Kunci Guru** untuk melihat lembar jawaban lengkap, analisis butir soal, dan override nilai manual.

---

*Dikembangkan untuk Kelas Bahasa Jepang Tingkat Lanjut JP10 (Outsutsuki Kurasu) - Standardisasi Kurikulum Irodori Nihongo Seikatsu Japan Foundation.*
