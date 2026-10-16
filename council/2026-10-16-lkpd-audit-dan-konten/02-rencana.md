# Rencana: Audit Regulasi & Pembuatan LKPD Terstandarisasi Irodori A2.2 (Bab 1 - 18)

## Ringkasan
Kita akan mengoreksi LKPD Bab 1 sampai Bab 12 agar sesuai dengan regulasi KKM 85 pt dan panduan LKPD resmi LPK, kemudian membuat modul LKPD interaktif baru untuk Bab 13 sampai Bab 18 lengkap dengan materi, soal latihan mini JFT-Basic (4 seksi), kanji, kosakata, terjemahan, dan bank audio otentik.

---

## Solusi yang Dipilih dan Alasannya
**Dipilih: Pilihan A (Pembaruan Menyeluruh & Standarisasi Penuh Bab 1 - 18)**

**Alasan Sederhana:**
1. **Regulasi KKM harus seragam:** Panduan LKPD yang lama masih menyebut KKM 70/75 pt. Hal ini membingungkan siswa dan guru karena sistem rapor yang baru sudah menerapkan standar kelulusan KKM 85 pt.
2. **Kelengkapan Kurikulum:** Irodori 初級2 memiliki 18 bab. Jika Bab 13–18 tidak dibuat sekarang, peserta didik di bab lanjutan tidak akan bisa mengerjakan LKPD melalui LMS.
3. **Aset Sudah Lengkap:** Kita sudah memiliki bahan baku lengkap: modul markdown Bab 1–18, file PDF, blueprint soal universal, dan rekaman audio MP3 otentik di direktori proyek. Kita hanya perlu mengemasnya ke dalam format LKPD terstandar.

---

## Langkah Kerja

### Tahap 1: Sinkronisasi Regulasi LKPD Bab 1 – Bab 12
1. `[web/public/lkpd/bab1/data-soal.js s.d. bab12/data-soal.js]`
   - Perbarui bagian tab "Panduan" pada tabel **Standar Kelulusan Internal LPK**:
     - Nilai Akhir Bab: $\ge 85$ (Tuntas KKM)
     - Nilai Ujian Mini JFT-like: $\ge 85$
     - Nilai Kanji: $\ge 80$
     - Nilai Kosakata: $\ge 80$
     - Nilai Terjemahan: $\ge 75$
     - Minimum per section JFT-like: $\ge 70\%$
   - Koreksi teks petunjuk audio: hapus kalimat "teks-ke-suara browser" dan tegaskan bahwa audio menggunakan rekaman otentik penutur asli Jepang (*Native Speaker Studio Quality*).
   - Pastikan kop formulir identitas memuat: LPK / Satuan Pendidikan, Program Irodori A2.2, Alokasi Waktu (90 menit), dan batas KKM 85 pt.

### Tahap 2: Pembuatan Modul LKPD Lengkap Bab 13 – Bab 18
2. `[web/public/lkpd/bab13/ s.d. bab18/]`
   - Buat folder `bab13`, `bab14`, `bab15`, `bab16`, `bab17`, `bab18` di dalam `web/public/lkpd/`.
   - Salin dan sesuaikan template runtime (`index.html`, `script.js`, `style.css`) dari bab yang sudah teruji stabil (bab 12).
   - Hubungkan aset audio otentik dari `Aset Audio & Gambar/Audio 初級2/` ke folder `audio/` masing-masing bab (`Z_[13-xx]` s.d. `Z_[18-xx]`).
   - Ekstrak materi pokok, kosakata, tata bahasa, dan Can-do dari `Modul & Kurikulum/File MD Modul 初級2/Bab 13.md` s.d. `Bab 18.md` ke dalam `data-soal.js` masing-masing bab.
   - Buat butir soal terstandarisasi untuk tiap bab:
     - 10 Soal Moji-Goi (文字・語彙)
     - 8 Soal Kaiwa Hyougen (会話表現)
     - 6 Soal Choukai (聴解) dengan referensi audio otentik
     - 6 Soal Dokkai (読解) dengan teks bacaan fungsional
     - 10 Soal Kanji dasar bab bersangkutan
     - 10 Soal Kosakata kunci bab bersangkutan
     - 5 Soal Terjemahan kalimat kontekstual
     - 1 Bank Audio Otentik lengkap
     - 1 Lembar Refleksi Diri (Jiko Hyouka)

### Tahap 3: Integrasi Antarmuka LMS Portal
3. `[web/src/components/lms/LkpdWorksheet.tsx]`
   - Daftarkan metadata `AUTHENTIC_LKPD_TITLES` untuk Bab 13 sampai Bab 18 (judul kanji resmi, subjudul topik, dan deskripsi cakupan materi).
   - Ubah kondisi `hasAuthenticLkpd = chapter >= 1 && chapter <= 18` agar seluruh bab langsung membuka LKPD interaktif resmi.
4. `[web/src/data/chapterModules.ts]`
   - Pastikan modul data Bab 13–18 terdaftar dengan referensi materi, Can-do, tata bahasa, dan kosakata yang sinkron.

### Tahap 4: Verifikasi & Uji Kualitas
5. `[Terminal / Browser]`
   - Jalankan `npm run build` di direktori `web/` untuk memastikan tidak ada error kompilasi Next.js / TypeScript.
   - Uji validitas sintaks JavaScript pada seluruh `data-soal.js` (Bab 1–18) menggunakan Node.js.

---

## Risiko dan Cara Membatalkan
- **Risiko 1:** Perubahan pada file `data-soal.js` Bab 1–12 bisa merusak data jika ada tanda kurung/koma yang salah.
  - *Cara membatalkan:* Kita menggunakan Git. Jika terjadi kesalahan, file bisa dikembalikan secara instan dengan `git checkout -- public/lkpd/`.
- **Risiko 2:** Bab 13–18 membutuhkan file audio yang cukup banyak sehingga ukuran repositori bertambah.
  - *Mitigasi:* File audio akan disinkronkan langsung dari folder aset lokal yang sudah tersedia di proyek.
- **Risiko 3:** LocalStorage browser siswa lama menyimpan format sesi lama.
  - *Mitigasi:* Nilai `sessionKey` dan `stateKey` di `data-soal.js` menggunakan versi baru (misal `v5`) sehingga tidak terjadi konflik dengan cache lama.

---

## Kriteria Selesai (Daftar Centang)
- [ ] LKPD Bab 1 s.d. 12 telah diperbarui standar KKM-nya ke **85 pt** dan regulasi teksnya telah dikoreksi.
- [ ] Folder dan file LKPD Bab 13, 14, 15, 16, 17, 18 telah dibuat lengkap dengan `data-soal.js`, `index.html`, `script.js`, `style.css`, dan audio terkait.
- [ ] Setiap LKPD Bab 13–18 memuat 8 tab lengkap: Panduan (KKM 85), Materi, Moji-Goi, Kaiwa, Choukai, Dokkai, Suplemen (Kanji, Kosakata, Terjemahan), Bank Audio, Hasil & Refleksi.
- [ ] `AUTHENTIC_LKPD_TITLES` di `LkpdWorksheet.tsx` mencakup Bab 1 s.d. 18 secara mulus.
- [ ] `npm run build` berjalan sukses tanpa error (Exit Code 0).

---

## Butuh Persetujuan Saya? (Langkah Berisiko)
- **Ya, pembuatan konten 6 bab baru (Bab 13–18) dan pembaruan 12 bab lama membutuhkan persetujuan Anda sebelum eksekusi dimulai.**
- Mohon tinjau rencana di atas. Jika Anda setuju, silakan balas dengan **"setuju"** agar tahap eksekusi dapat segera dijalankan.
