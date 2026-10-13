import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "irodori-assets";

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder")) {
  console.error("❌ Kredensial Supabase belum diset di .env.local!");
  console.error("Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY telah diisi.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncAssets() {
  console.log(`🚀 Memulai Sinkronisasi Aset ke Supabase Storage (Bucket: ${bucketName})...\n`);

  // Pastikan bucket sudah ada
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === bucketName);

  if (!bucketExists) {
    console.log(`📦 Membuat bucket '${bucketName}' (Public)...`);
    const { error: createErr } = await supabase.storage.createBucket(bucketName, {
      public: true,
    });
    if (createErr) {
      console.warn("Peringatan saat membuat bucket (mungkin sudah ada atau perlu dibuat via dashboard):", createErr.message);
    }
  }

  const audioDir = path.resolve(__dirname, "../../Aset Audio & Gambar/Audio 初級2");
  const imgDir = path.resolve(__dirname, "../../Aset Audio & Gambar/Ilustrasi 初級2");

  // Upload Audio
  if (fs.existsSync(audioDir)) {
    const audioFiles = fs.readdirSync(audioDir).filter(f => f.endsWith(".mp3"));
    console.log(`🎵 Ditemukan ${audioFiles.length} file audio MP3.`);
    let count = 0;
    for (const f of audioFiles) {
      const fullPath = path.join(audioDir, f);
      const fileBuffer = fs.readFileSync(fullPath);
      const safeName = f.replace(/\[/g, "").replace(/\]/g, "");
      const storagePath = `audio/shokyu2/${safeName}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, fileBuffer, {
          contentType: "audio/mpeg",
          upsert: true,
        });

      if (error) {
        console.error(`Gagal upload ${f}:`, error.message);
      } else {
        count++;
        if (count % 25 === 0 || count === audioFiles.length) {
          console.log(`   [Audio] ${count}/${audioFiles.length} terunggah (${f})`);
        }
      }
    }
  }

  // Upload Gambar (Recursive)
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

  if (fs.existsSync(imgDir)) {
    const allImages = getAllFiles(imgDir);
    console.log(`\n🖼️ Ditemukan ${allImages.length} file gambar ilustrasi.`);
    for (const fullPath of allImages) {
      const rel = path.relative(imgDir, fullPath).replace(/\\/g, "/");
      const safeRel = rel.replace(/\[/g, "").replace(/\]/g, "");
      const fileBuffer = fs.readFileSync(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      const mime = ext === ".png" ? "image/png" : ext === ".jpeg" || ext === ".jpg" ? "image/jpeg" : "application/octet-stream";
      const storagePath = `images/shokyu2/${safeRel}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, fileBuffer, {
          contentType: mime,
          upsert: true,
        });

      if (error) {
        console.error(`Gagal upload ${safeRel}:`, error.message);
      } else {
        console.log(`   ✓ [Gambar] ${safeRel} terunggah`);
      }
    }
  }

  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl("audio/shokyu2/Z_01-01_kotoba1.mp3");
  console.log("\n🎉 SELURUH ASET BERHASIL DIUNGGAH KE SUPABASE STORAGE!");
  console.log(`🌐 Contoh URL Publik Audio: ${publicUrlData.publicUrl}`);
}

syncAssets().catch(err => {
  console.error("Terjadi kesalahan:", err);
  process.exit(1);
});
