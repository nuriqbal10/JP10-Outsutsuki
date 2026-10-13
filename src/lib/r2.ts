import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "irodori-assets";
const publicDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
  credentials: {
    accessKeyId: accessKeyId || "placeholder",
    secretAccessKey: secretAccessKey || "placeholder",
  },
});

/**
 * Upload buffer directly to Cloudflare R2
 */
export async function uploadToR2(key: string, fileBuffer: Buffer, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);
  return getR2PublicUrl(key);
}

/**
 * Generate a pre-signed URL for direct browser uploads
 */
export async function getPresignedUploadUrl(key: string, contentType: string, expiresInSeconds = 3600) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Generate public URL or signed download URL
 */
export function getR2PublicUrl(key: string) {
  if (publicDomain) {
    return `${publicDomain.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
  }
  return `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;
}
