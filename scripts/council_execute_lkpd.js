const fs = require('fs');
const path = require('path');

console.log('=== MEMULAI SIKLUS EKSEKUSI COUNCIL: STANDARISASI & PEMBUATAN LKPD BAB 1-18 ===\n');

const BASE_DIR = path.resolve(__dirname, '..');
const LKPD_DIR = path.join(BASE_DIR, 'public', 'lkpd');
const AUDIO_SOURCE_DIR = path.resolve(BASE_DIR, '..', 'Aset Audio & Gambar', 'Audio 初級2');

console.log('Base dir:', BASE_DIR);
console.log('LKPD dir:', LKPD_DIR);
console.log('Audio source:', AUDIO_SOURCE_DIR);

// ============================================================================
// 1. UPDATE STANDAR KKM 85 PT & PANDUAN PADA BAB 1 S.D. BAB 12
// ============================================================================
console.log('\n--- 1. Menyelaraskan KKM 85 pt pada Bab 1 s.d. 12 ---');

for (let i = 1; i <= 12; i++) {
  const dataPath = path.join(LKPD_DIR, `bab${i}`, 'data-soal.js');
  const scriptPath = path.join(LKPD_DIR, `bab${i}`, 'script.js');

  if (fs.existsSync(dataPath)) {
    let content = fs.readFileSync(dataPath, 'utf8');

    // Standarisasi KKM tabel panduan
    content = content.replace(/≥\s*75/g, '≥ 85 (Tuntas KKM)');
    content = content.replace(/≥\s*70/g, '≥ 85');
    content = content.replace(/≥\s*60%/g, '≥ 70%');
    content = content.replace(/Nilai\s*Akhir\s*&ge;\s*75\.0/g, 'Nilai Akhir &ge; 85.0 (Tuntas KKM)');
    content = content.replace(/Mini\s*JFT-like\s*&ge;\s*70\.0/g, 'Mini JFT-like &ge; 85.0');
    content = content.replace(/Nilai\s*≥\s*80%/g, 'Nilai ≥ 85% (Tuntas KKM LPK)');

    // Standarisasi keterangan audio
    content = content.replace(
      /Audio diputar menggunakan teks-ke-suara browser\./g,
      'Audio diputar langsung menggunakan rekaman otentik penutur asli Jepang (Studio Quality MP3).'
    );
    content = content.replace(
      /Jika suara bahasa Jepang tidak tersedia, guru dapat membacakan naskah audio setelah login sebagai guru\./g,
      'Seluruh audio otentik dapat diakses langsung pada tab Bank Audio atau tombol putar pada soal.'
    );

    fs.writeFileSync(dataPath, content, 'utf8');
    console.log(`✓ Updated KKM & audio panduan: Bab ${i} data-soal.js`);
  }

  if (fs.existsSync(scriptPath)) {
    let sContent = fs.readFileSync(scriptPath, 'utf8');

    // Update kelulusan KKM 85 di script.js
    sContent = sContent.replace(
      /const isLulus = finalNilai >= 65 && weak\.length <= 1;/g,
      'const isLulus = finalNilai >= 85 && weak.length === 0;'
    );
    sContent = sContent.replace(
      /const isLulus = finalNilai >= 70;/g,
      'const isLulus = finalNilai >= 85;'
    );
    sContent = sContent.replace(
      /const isLulus = finalNilai >= 75;/g,
      'const isLulus = finalNilai >= 85;'
    );
    sContent = sContent.replace(
      /LULUS \(CHECKPOINT 1 TERCAPAI\)/g,
      'LULUS (TUNTAS KKM LPK ≥ 85.0 pt)'
    );
    sContent = sContent.replace(
      /BELUM LULUS \(REMEDIAL CHECKPOINT 1\)/g,
      'BELUM MEMENUHI KKM (REMEDIAL KKM < 85.0 pt)'
    );

    fs.writeFileSync(scriptPath, sContent, 'utf8');
    console.log(`✓ Updated kelulusan KKM 85: Bab ${i} script.js`);
  }
}

console.log('Selesai tahap 1.');
