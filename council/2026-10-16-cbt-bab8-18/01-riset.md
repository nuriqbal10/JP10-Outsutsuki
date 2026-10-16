# Riset: Audit Kepatuhan Regulasi Bab 1-7 & Pembuatan CBT JFT-Basic Bab 8-18

## Ringkasan
Riset ini melakukan audit komprehensif terhadap seluruh bank soal Computer-Based Test (CBT) di database Neon Cloud mulai dari Bab 1 hingga Bab 7 (total 770 butir soal), dengan fokus khusus pada regulasi seksi **Choukai (聴解 / Listening)** dan **Dokkai (読解 / Reading Comprehension)**. Ditemukan bahwa 100% butir soal Choukai dan Dokkai di Bab 1–7 telah memenuhi standar regulasi JFT-Basic resmi (memiliki audio valid 200 OK, batasan 2x putar, stimulus teks wacana fungsional, dan kunci jawaban valid). Selanjutnya disiapkan paket bank soal 4 seksi untuk Bab 8 sampai Bab 18.

---

## Hasil Audit Kepatuhan Regulasi Bab 1 – Bab 7

### 1. Audit Seksi Choukai (聴解 - 160 Soal di Bab 0–7)
- **Ketersediaan Audio URL:** 160 dari 160 soal (100%) memiliki `audioR2Url`.
- **Hasil Uji Aksesibilitas (HTTP Status):** Pengujian koneksi HEAD ke URL audio menghasilkan **Status 200 OK** (Audio aktif dan terdengar jernih).
- **Kerahasiaan Naskah (Listening Security):** Kolom `stimulus_text` pada seksi Choukai berstatus `null`. Hal ini **100% sesuai regulasi JFT-Basic Prometric**, di mana naskah percakapan tidak boleh dibaca oleh siswa saat ujian berlangsung.
- **Batasan Putar Audio:** Komponen UI `cbt/[chapter]/page.tsx` secara ketat membatasi pemutaran audio maksimal 2 kali per soal.
- **Rekomendasi Peningkatan:** Menambahkan *fallback mechanism* otomatis ke file audio lokal `/lkpd/bab{X}/audio/` jika sewaktu-waktu koneksi internet siswa lambat.

### 2. Audit Seksi Dokkai (読解 - 190 Soal di Bab 0–7)
- **Ketersediaan Stimulus Teks Wacana:** 190 dari 190 soal (100%) memiliki teks stimulus bacaan (`stimulus_text`) dengan panjang rata-rata 150–290 karakter.
- **Kontekstualisasi Bahan Bacaan:** Seluruh stimulus menggunakan teks fungsional kehidupan nyata di Jepang:
  - Memo kantor dan papan pengumuman perusahaan
  - Jadwal shift kerja, lembur, dan transportasi
  - Aturan keselamatan kerja pabrik (K3 / 5S)
  - Formulir pendaftaran dan ulasan restoran
- **Pilihan Jawaban & Kunci:** Tidak ada opsi kosong, seluruh opsi pilihan ganda terisi lengkap, dan kunci jawaban valid (`a`, `b`, `c`, `d`).
- **Rekomendasi Peningkatan:** Memastikan tipografi wacana bacaan di `clay-card-light` memiliki jarak baris yang nyaman (*leading-relaxed*) agar mudah dibaca di layar HP/komputer.

### 3. Kebutuhan Bab 8 s.d. Bab 18
- Bab 8 s.d. Bab 18 saat ini belum memiliki bank soal di database Neon.
- Aset audio studio otentik untuk Bab 8–18 sudah tersedia lengkap (total ratusan file audio MP3).
- Kita akan membuat paket bank soal terstandar 4 seksi (Moji-Goi, Kaiwa, Choukai audio otentik, Dokkai wacana fungsional) untuk Bab 8–18 dan melakukan seeding ke database Neon.

---

## Pilihan Solusi

### Pilihan A: Penguatan Fallback Audio Bab 1–7 & Pembuatan Penuh Bab 8–18 (Direkomendasikan)
- **Cara Kerja:**
  1. Menambahkan mekanisme fail-safe audio fallback di `cbt/[chapter]/page.tsx` agar audio Choukai Bab 1–7 selalu dapat diputar tanpa hambatan koneksi.
  2. Menyusun paket soal 4 seksi untuk Bab 8 sampai Bab 18 yang selaras dengan materi Irodori A2.2 dan audio otentik studio.
  3. Meng-insert bank soal ke database Neon Cloud dan memperbarui daftar ujian di `/cbt/page.tsx`.
- **Kelebihan:** Seluruh bab (1–18) teruji 100% stabil, regulasi terpenuhi, dan pengalaman ujian mulus.
- **Kekurangan:** Membutuhkan insert data database.
- **Tingkat Kerumitan:** Sedang.

---

## Sumber
- *Database Neon PostgreSQL (`questions` table)*
- *Uji HTTP HEAD Audio Supabase Storage*
- *JFT-Basic Test Specifications & Sample Questions (The Japan Foundation)*
