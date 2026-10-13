import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config({ path: ".env.local" });

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "irodori-assets";
const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

if (!accountId || !accessKeyId || !secretAccessKey || accountId === "placeholder_account_id") {
  console.error("❌ Kredensial Cloudflare R2 belum diset lengkap di .env.local!");
  console.error("Harap isi R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, dan R2_SECRET_ACCESS_KEY.");
  process.exit(1);
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function uploadFile(localPath: string, r2Key: string, contentType: string) {
  const fileBuffer = fs.readFileSync(localPath);
  const cmd = new PutObjectCommand({
    Bucket: bucketName,
    Key: r2Key,
    Body: fileBuffer,
    ContentType: contentType,
  });
  await r2.send(cmd);
}

async function syncAssets() {
  console.log(`🚀 Sinkronisasi Aset ke Cloudflare R2 (Bucket: ${bucketName})...\n`);

  const audioDir = path.resolve(__dirname, "../../Aset Audio & Gambar/Audio 初級2");
  const imgDir = path.resolve(__dirname, "../../Aset Audio & Gambar/Ilustrasi 初級2");

  if (fs.existsSync(audioDir)) {
    const audioFiles = fs.readdirSync(audioDir).filter(f => f.endsWith(".mp3"));
    console.log(`🎵 Ditemukan ${audioFiles.length} file audio MP3.`);
    let count = 0;
    for (const f of audioFiles) {
      const fullPath = path.join(audioDir, f);
      const r2Key = `audio/shokyu2/${f}`;
      await uploadFile(fullPath, r2Key, "audio/mpeg");
      count++;
      if (count % 25 === 0 || count === audioFiles.length) {
        console.log(`   [Audio] ${count}/${audioFiles.length} terunggah (${f})`);
      }
    }
  }

  if (fs.existsSync(imgDir)) {
    const imgFiles = fs.readdirSync(imgDir);
    console.log(`\n🖼️ Ditemukan ${imgFiles.length} file gambar.`);
    for (const f of imgFiles) {
      const fullPath = path.join(imgDir, f);
      const ext = path.extname(f).toLowerCase();
      const mime = ext === ".png" ? "image/png" : ext === ".jpeg" || ext === ".jpg" ? "image/jpeg" : "application/octet-stream";
      const r2Key = `images/shokyu2/${f}`;
      await uploadFile(fullPath, r2Key, mime);
      console.log(`   ✓ [Gambar] ${f} terunggah ke ${r2Key}`);
    }
  }

  console.log("\n🎉 SELURUH ASET BERHASIL DIUNGGAH KE CLOUDFLARE R2!");
  if (publicUrl) {
    console.log(`🌐 Akses publik: ${publicUrl}/audio/shokyu2/Z_[01-01]_kotoba1.mp3`);
  }
}

syncAssets().catch(err => {
  console.error("Terjadi kesalahan:", err);
  process.exit(1);
});
