// ===== Supabase Client =====
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hesrhmyqtcivzcvaebvf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhlc3JobXlxdGNpdnpjdmFlYnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjE0MzMsImV4cCI6MjA5MDE5NzQzM30.cAza33BM21FhacJ-AM7ZQCIMBFxjWxkeu-hn2zIjcyY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const STORAGE_BUCKET = 'images';

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} folder - Folder name (e.g., 'banners', 'projects', 'members')
 * @returns {Promise<string|null>} - Public URL of the uploaded file
 */
export async function uploadImage(file, folder = 'general') {
  // Generate unique filename
  const ext = file.name.split('.').pop();
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const fileName = `${folder}/${timestamp}-${randomStr}.${ext}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its public URL
 * @param {string} publicUrl - The public URL of the file
 */
export async function deleteImage(publicUrl) {
  if (!publicUrl || !publicUrl.includes(SUPABASE_URL)) return;

  // Extract path from URL
  const path = publicUrl.split(`/storage/v1/object/public/${STORAGE_BUCKET}/`)[1];
  if (!path) return;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    console.error('Delete error:', error);
  }
}
