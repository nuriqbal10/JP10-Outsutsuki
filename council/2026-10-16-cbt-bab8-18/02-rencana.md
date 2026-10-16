# Rencana: Audit, Penguatan Audio Bab 1-7 & Pembuatan CBT JFT-Basic Bab 8-18

## Ringkasan
Kita akan memastikan kualitas Choukai dan Dokkai pada Bab 1–7 tetap prima dengan menambahkan *audio fallback mechanism* otomatis ke file lokal, kemudian menyusun dan memasukkan bank soal 4 seksi (Moji-Goi, Kaiwa, Choukai audio otentik, Dokkai wacana praktis) untuk Bab 8 sampai Bab 18 ke database Neon Cloud, serta memperbarui halaman menu ujian `/cbt`.

---

## Solusi yang Dipilih dan Alasannya
**Dipilih: Pilihan A (Penyempurnaan Bab 1–7 & Pembuatan Penuh Bab 8–18)**

**Alasan Sederhana:**
1. **Regulasi Bab 1–7 Sudah Terbukti Valid:** Hasil audit menunjukkan 190 soal Dokkai dan 160 soal Choukai yang ada sudah memiliki wacana bacaan lengkap, kunci jawaban valid, dan link audio yang berstatus 200 OK.
2. **Audio Anti-Macet (Fail-Safe):** Dengan menambahkan fallback otomatis ke aset MP3 lokal di `cbt/[chapter]/page.tsx`, audio Choukai dijamin 100% tidak akan pernah gagal berputar meskipun jaringan internet siswa lambat.
3. **Penyelesaian Seluruh Kurikulum:** Bab 8 hingga Bab 18 akan langsung tersedia di simulator CBT, sehingga peserta didik dapat mempersiapkan ujian resmi JFT-Basic A2 dari bab awal hingga bab akhir.

---

## Langkah Kerja

### Tahap 1: Penguatan Komponen Simulator CBT
1. `[web/src/app/cbt/[chapter]/page.tsx]`
   - Tambahkan atribut `onError` pada elemen `<audio>` untuk otomatis beralih ke file MP3 lokal `/lkpd/bab{chapter}/audio/...` jika koneksi remote audio terhambat.
   - Pastikan teks wacana Dokkai di `clay-card-light` tampil dengan kenyamanan membaca optimal (font size proporsional, line spacing lega, kontras tinggi).

### Tahap 2: Pembuatan Paket Soal Terstandarisasi Bab 8 – Bab 18
2. `[web/scripts/seed_cbt_bab8_18.ts]`
   - Menyusun butir soal proporsional 4 seksi untuk Bab 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, dan 18:
     - **Seksi 1 (Moji & Goi):** Kosakata kunci dan kanji fungsional bab target.
     - **Seksi 2 (Kaiwa & Hyougen):** Dialog komunikasi tempat kerja dan kehidupan sehari-hari di Jepang.
     - **Seksi 3 (Choukai):** Soal menyimak terhubung langsung ke audio otentik studio (dengan transkrip dialog di kolom `explanation` dan naskah disembunyikan dari siswa saat ujian).
     - **Seksi 4 (Dokkai):** Teks wacana pengumuman, brosur wisata/layanan, jadwal, etiket sosial, dan instruksi keselamatan.

### Tahap 3: Direct Seeding ke Database Neon Cloud
3. `[Terminal / Database Neon]`
   - Menjalankan skrip seeding untuk memasukkan seluruh butir soal baru ke tabel `questions` di database Neon.
   - Melakukan verifikasi jumlah soal per bab di database.

### Tahap 4: Pembaruan Antarmuka Halaman Menu CBT
4. `[web/src/app/cbt/page.tsx]`
   - Memperbarui daftar paket ujian sehingga menampilkan **Bab 1 sampai Bab 18 lengkap** dengan status *"Siap Ujian"*.

### Tahap 5: Verifikasi & Uji Mutu
5. `[Terminal & Build]`
   - Menjalankan pengujian endpoint API `/api/questions?chapter=X`.
   - Menjalankan `npm run build` untuk memverifikasi tidak ada error kompilasi.

---

## Risiko dan Cara Membatalkan
- **Risiko 1:** Gangguan jaringan saat insert data ke database Neon.
  - *Mitigasi:* Skrip seeding dilengkapi dengan mekanisme batch insertion dan retry otomatis.
- **Risiko 2:** Duplikasi data jika skrip dijalankan ulang.
  - *Mitigasi:* Menggunakan perintah `DELETE FROM questions WHERE chapter = X` sebelum meng-insert data bab tersebut.

---

## Kriteria Selesai (Daftar Centang)
- [ ] Hasil audit Choukai & Dokkai Bab 1–7 terbukti 100% patuh regulasi JFT-Basic.
- [ ] Audio fallback di `cbt/[chapter]/page.tsx` aktif dan menjamin audio selalu dapat diputar.
- [ ] Database Neon Cloud memuat bank soal lengkap untuk Bab 8 sampai Bab 18.
- [ ] Setiap bab 8–18 memiliki soal lengkap 4 seksi (Moji-Goi, Kaiwa, Choukai audio otentik, Dokkai teks wacana).
- [ ] Halaman `/cbt` menampilkan seluruh kartu ujian Bab 1 sampai Bab 18.
- [ ] `npm run build` sukses (Exit Code 0).

---

## Butuh Persetujuan Saya? (Langkah Berisiko)
- **Ya, revisi penguatan audio dan pembuatan soal Bab 8–18 ke database membutuhkan persetujuan Anda sebelum eksekusi dimulai.**
- Mohon tinjau hasil audit dan rencana kerja di atas. Jika Anda setuju, silakan balas dengan **"setuju"** agar tahap eksekusi dapat segera dijalankan.
