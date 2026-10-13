import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || "irodori-assets";

/**
 * Upload file buffer ke Supabase Storage
 */
export async function uploadToSupabase(path: string, fileBuffer: Buffer, contentType: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  return getSupabasePublicUrl(path);
}

/**
 * Ambil Public URL file dari Supabase Storage
 */
export function getSupabasePublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}
