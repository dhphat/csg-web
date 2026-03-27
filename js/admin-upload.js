// ===== Admin Image Upload Helper =====
import { uploadImage } from './supabase.js';

/**
 * Create an image upload field HTML (replaces text URL inputs)
 * @param {string} currentUrl - Current image URL (if editing)
 * @param {string} fieldId - Unique field ID
 * @param {string} folder - Storage folder name
 * @returns {string} HTML string
 */
export function imageUploadField(currentUrl, fieldId, folder = 'general') {
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
        ${currentUrl ? `<span class="upload-status" id="status-${fieldId}">Đã có ảnh</span>` : `<span class="upload-status" id="status-${fieldId}">Chưa có ảnh</span>`}
      </div>
      <input type="hidden" id="url-${fieldId}" value="${currentUrl || ''}" />
    </div>
  `;
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

      // Upload to Supabase
      const publicUrl = await uploadImage(file, folder);
      
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
