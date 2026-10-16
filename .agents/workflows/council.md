Jalankan council untuk tugas yang saya berikan setelah perintah /council.

Langkah 0 - Cek ukuran tugas:
Jika tugasnya sepele (misalnya mengganti teks, warna, atau satu baris kode), lewati council. Langsung kerjakan dengan hati-hati, lalu cek dengan `node --check`. Beri tahu saya bahwa council dilewati.

Jika tugasnya besar (fitur baru, perubahan banyak file, perbaikan bug yang rumit), lanjut ke bawah.

1. Buat folder `council/TANGGAL-namatugas/`.
2. Gunakan skill council-research. Hasil: 01-riset.md.
3. Gunakan skill council-advisor. Hasil: 02-rencana.md. Setelah itu BERHENTI, tampilkan ringkasan rencana dengan bahasa sederhana, dan tunggu saya menjawab "setuju".
4. Setelah saya setuju, gunakan skill council-execute. Hasil: 03-perubahan.md.
5. Gunakan skill council-crosscheck. Hasil: 04-review.md.
6. Jika status PERLU PERBAIKAN, ulangi langkah 4 dan 5 maksimal 2 kali. Jika masih belum lulus, berhenti dan jelaskan masalahnya kepada saya.
7. Akhiri dengan ringkasan singkat untuk orang awam: apa yang dikerjakan, apa hasilnya, dan apa yang perlu saya lakukan selanjutnya.
