// ===== Admin Image Upload Helper =====
import { uploadImage } from './supabase.js';

/**
 * Create an image upload field HTML (replaces text URL inputs)
 * @param {string} currentUrl - Current image URL (if editing)
 * @param {string} fieldId - Unique field ID
 * @param {string} folder - Storage folder name
 * @returns {string} HTML string
 */
export function imageUploadField(currentUrl, fieldId, folder = 'general', suggestion = 'Tự động nén HD (Max 1920px)') {
  const preview = currentUrl ? `<img src="${currentUrl}" class="upload-preview-img" />` : '';
  return `
    <div class="image-upload-field" data-field-id="${fieldId}" data-folder="${folder}">
      <div class="upload-preview" id="preview-${fieldId}">
        ${preview}
      </div>
      <div class="upload-controls">
        <input type="file" id="file-${fieldId}" accept="image/*" style="display:none" />
        <button type="button" class="btn-upload" onclick="document.getElementById('file-${fieldId}').click()">
          <i class="fas fa-cloud-upload-alt"></i> ${currentUrl ? 'Đổi ảnh' : 'Chọn ảnh'}
        </button>
        <div style="font-size:0.75rem; color:#888; margin-top:6px; margin-bottom:4px;">${suggestion}</div>
        ${currentUrl ? `<span class="upload-status" id="status-${fieldId}">Đã có ảnh</span>` : `<span class="upload-status" id="status-${fieldId}">Chưa có ảnh</span>`}
      </div>
      <input type="hidden" id="url-${fieldId}" value="${currentUrl || ''}" />
    </div>
  `;
}

function compressImage(file, maxWidth = 1920, maxHeight = 1080) {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) { resolve(file); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#000"; // For transparent PNGs converted to JPEG
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(blob => {
          if (!blob) { reject(new Error('Canvas empty')); return; }
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' });
          if (file.size < compressedFile.size) resolve(file);
          else resolve(compressedFile);
        }, 'image/jpeg', 0.85); // Facebook-like 85% JPEG compression
      };
      img.onerror = err => reject(err);
      img.src = ev.target.result;
    };
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Bind upload events for all image upload fields in the DOM
 * Call this after rendering HTML with imageUploadField()
 */
export function bindUploadEvents() {
  document.querySelectorAll('.image-upload-field').forEach(field => {
    const fieldId = field.dataset.fieldId;
    const folder = field.dataset.folder;
    const fileInput = document.getElementById(`file-${fieldId}`);
    if (!fileInput || fileInput._bound) return;
    fileInput._bound = true;

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const status = document.getElementById(`status-${fieldId}`);
      const preview = document.getElementById(`preview-${fieldId}`);
      const urlInput = document.getElementById(`url-${fieldId}`);
      const btn = field.querySelector('.btn-upload');

      // Show loading
      status.textContent = 'Đang tải lên...';
      btn.disabled = true;

      // Preview locally first
      const reader = new FileReader();
      reader.onload = (ev) => {
        preview.innerHTML = `<img src="${ev.target.result}" class="upload-preview-img" />`;
      };
      reader.readAsDataURL(file);

      // Compress Image Before Upload
      status.textContent = 'Đang nén ảnh (Tối ưu hóa)...';
      let fileToUpload = file;
      try {
        if (file.size > 300 * 1024) { // Compress if > 300KB
          fileToUpload = await compressImage(file);
        }
      } catch(e) { console.error('Compression failed', e); }

      // Upload to Supabase
      status.textContent = 'Đang tải lên Supabase...';
      const publicUrl = await uploadImage(fileToUpload, folder);
      
      if (publicUrl) {
        urlInput.value = publicUrl;
        status.textContent = 'Đã tải lên ✓';
        status.style.color = '#00D13B';
        btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Đổi ảnh';
      } else {
        status.textContent = 'Lỗi tải lên!';
        status.style.color = '#ff4444';
      }
      btn.disabled = false;
    });
  });
}

/**
 * Get the uploaded URL value for a field
 */
export function getUploadedUrl(fieldId) {
  const el = document.getElementById(`url-${fieldId}`);
  return el ? el.value : '';
}
