import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'irodori-assets';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const imgDir = path.resolve('..', 'Aset Audio & Gambar/Ilustrasi 初級2');

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

async function uploadImages() {
  const allImages = getAllFiles(imgDir);
  console.log(`🖼️ Ditemukan ${allImages.length} file gambar ilustrasi.`);
  let successCount = 0;

  for (let i = 0; i < allImages.length; i++) {
    const fullPath = allImages[i];
    const rel = path.relative(imgDir, fullPath).replace(/\\/g, '/');
    const safeRel = rel
      .replace(/第(\d+)課/g, (_, p1) => `bab${p1.padStart(2, '0')}`)
      .replace(/\[/g, '')
      .replace(/\]/g, '');

    const fileBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    const mime =
      ext === '.png'
        ? 'image/png'
        : ext === '.jpeg' || ext === '.jpg'
        ? 'image/jpeg'
        : 'application/octet-stream';

    const storagePath = `images/shokyu2/${safeRel}`;

    const { error } = await supabase.storage.from(bucketName).upload(storagePath, fileBuffer, {
      contentType: mime,
      upsert: true,
    });

    if (error) {
      console.error(`❌ Gagal: ${safeRel} - ${error.message}`);
    } else {
      successCount++;
    }

    if ((i + 1) % 50 === 0 || i === allImages.length - 1) {
      console.log(`📸 Progress: ${i + 1}/${allImages.length} gambar diproses (${successCount} sukses)`);
    }
  }

  console.log(`🎉 Selesai mengunggah ${successCount} dari ${allImages.length} gambar!`);
}

uploadImages();
