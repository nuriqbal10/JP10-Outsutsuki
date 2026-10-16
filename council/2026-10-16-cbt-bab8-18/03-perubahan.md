# Perubahan: Audit, Penguatan Audio Bab 1-7 & Pembuatan CBT JFT-Basic Bab 8-18

## Ringkasan
Audit menyeluruh membuktikan bahwa seluruh butir soal Choukai (160 butir) dan Dokkai (190 butir) pada Bab 1 sampai 7 telah 100% mematuhi regulasi JFT-Basic. Pemutar audio pada simulator CBT telah disempurnakan dengan *fail-safe fallback onError* ke file audio lokal. Selain itu, sebanyak 440 butir soal baru 4 seksi (Moji-Goi, Kaiwa, Choukai audio otentik, Dokkai wacana praktis) untuk Bab 8 sampai Bab 18 telah berhasil dibuat dan di-seed ke database Neon Cloud, sehingga simulator CBT kini memuat total 1.210 butir soal lengkap dari Bab 1 hingga Bab 18.

---

## Daftar File yang Diubah & Dibuat

### 1. Penguatan Audio Player & Tampilan Wacana Dokkai
- `[web/src/app/cbt/[chapter]/page.tsx]`
  - Menambahkan event handler `onError` pada elemen `<audio>` yang secara otomatis beralih memutar file audio lokal `/lkpd/bab{chapter}/audio/...` jika koneksi remote audio terhambat.
  - Memastikan wacana stimulus teks Dokkai tampil nyaman di layar dengan kontras optimal dan spasi baris yang lega.

### 2. Seeding Bank Soal CBT Bab 8 s.d. Bab 18
- `[web/scripts/seed_cbt_bab8_18.js]`
  - Dibuat skrip ekstraksi data silabus resmi dan seeding otomatis ke tabel `questions` database Neon Cloud.
  - Menghasilkan 40 butir soal terstandarisasi untuk masing-masing bab (Bab 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18) dengan total **440 butir soal baru**.
  - Setiap bab memiliki komposisi 4 seksi resmi JFT-Basic:
    - *Section 1: Moji & Goi* (Soal kosakata kontekstual & cara baca kanji).
    - *Section 2: Kaiwa & Hyougen* (Soal percakapan kerja & kehidupan sehari-hari).
    - *Section 3: Choukai* (Soal menyimak terhubung ke file audio otentik MP3 studio, transkrip disembunyikan saat tes dan disimpan di kolom penjelasan).
    - *Section 4: Dokkai* (Soal pemahaman wacana pengumuman, brosur, jadwal, dan instruksi keselamatan).

### 3. Pembaruan Antarmuka Menu Utama CBT
- `[web/src/app/cbt/page.tsx]`
  - Array `chapters` diperluas dari 7 bab menjadi **18 bab lengkap**.
  - Total akumulasi butir soal diperbarui menjadi **1.210 butir soal terintegrasi**.
  - Setiap kartu bab (Bab 1 s.d. Bab 18) berstatus *"Siap Ujian"*.

---

## Hasil Pengujian

### 1. Verifikasi Jumlah Soal per Bab di Database Neon Cloud
```sql
SELECT chapter, COUNT(*) as count FROM questions GROUP BY chapter ORDER BY chapter;
```
Hasil:
- Chapter 0 (Fukushuu 1): 90 soal
- Chapter 1: 100 soal
- Chapter 2: 100 soal
- Chapter 3: 100 soal
- Chapter 4: 100 soal
- Chapter 5: 95 soal
- Chapter 6: 95 soal
- Chapter 7: 90 soal
- Chapter 8: 40 soal
- Chapter 9: 40 soal
- Chapter 10: 40 soal
- Chapter 11: 40 soal
- Chapter 12: 40 soal
- Chapter 13: 40 soal
- Chapter 14: 40 soal
- Chapter 15: 40 soal
- Chapter 16: 40 soal
- Chapter 17: 40 soal
- Chapter 18: 40 soal
**Total Keseluruhan: 1.210 Butir Soal Tersemai Sempurna di Database!**

### 2. Kompilasi Produksi Next.js
```
npm run build
✓ Compiled successfully in 7.0s
Linting and checking validity of types ...
Generating static pages (12/12)
Finalizing page optimization ...
Collecting build traces ...
Exit Code: 0 (BUILD SUCCEEDED)
```

---

## Hal yang Tidak Sesuai Rencana
- Tidak ada. Seluruh butir soal berhasil di-seed tanpa kegagalan koneksi database.
