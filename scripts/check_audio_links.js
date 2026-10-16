const fs = require('fs');
const path = require('path');

console.log('=== AUDIT FILE AUDIO DI LKPD (BAB 1 - 18) ===');

for (let ch = 1; ch <= 18; ch++) {
  const p = path.join(__dirname, '..', 'public', 'lkpd', `bab${ch}`, 'data-soal.js');
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');
  
  // Find all audio files mentioned
  const regex = /["'](audio\/[^"']+\.mp3)["']/g;
  let match;
  const notFound = [];
  let total = 0;
  
  while ((match = regex.exec(content)) !== null) {
    total++;
    const audioRel = match[1];
    const absPath = path.join(__dirname, '..', 'public', 'lkpd', `bab${ch}`, audioRel);
    if (!fs.existsSync(absPath)) {
      notFound.push(audioRel);
    }
  }

  if (notFound.length > 0) {
    console.log(`❌ Bab ${ch}: ${notFound.length} dari ${total} audio TIDAK DITEMUKAN di disk:`, notFound);
  } else {
    console.log(`✅ Bab ${ch}: Semua ${total} audio ditemukan di disk!`);
  }
}
