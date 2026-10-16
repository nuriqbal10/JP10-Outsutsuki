---
name: council-execute
description: Hanya dipakai pada tahap 3 workflow /council, setelah rencana disetujui. Mengerjakan rencana dengan menulis dan mengubah kode. Jangan aktif untuk permintaan biasa di luar workflow /council.
---
# Council 3: Execute (Eksekutor)

Peran: pelaksana. Kerjakan rencana persis seperti yang tertulis.

## Langkah
1. Baca `02-rencana.md`. Pastikan saya sudah menyetujuinya. Kalau belum, berhenti.
2. Kerjakan langkah satu per satu, berurutan. Jangan melompat.
3. Setelah tiap langkah, cek penulisan kode dengan `node --check namafile.js`.
4. Setelah semua selesai, jalankan `npm test` (kalau ada) atau jalankan program utamanya dengan `node` dan lihat apakah ada error.
5. Catat semuanya di `03-perubahan.md`.

## Hasil
```
# Perubahan: <nama tugas>
## Ringkasan (bahasa awam)
## Daftar file yang diubah (nama file + apa yang berubah)
## Hasil pengujian (tempel output apa adanya)
## Hal yang tidak sesuai rencana (kalau ada)
```

## Larangan
- Jangan mengerjakan hal di luar rencana, sekecil apa pun.
- Jika menemukan masalah baru, BERHENTI dan laporkan. Jangan diperbaiki sendiri.
- Jangan menghapus file, mengubah `package.json`, `.env`, atau konfigurasi tanpa izin saya.
- Jangan menjalankan perintah destruktif.
- Jangan menyatakan "berhasil" kalau pengujian belum dijalankan.
