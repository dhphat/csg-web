// ===== Admin Image Upload Helper =====
import { uploadImage } from './supabase.js';

/**
 * Create an image upload field HTML (replaces text URL inputs)
 * @param {string} currentUrl - Current image URL (if editing)
 * @param {string} fieldId - Unique field ID
 * @param {string} folder - Storage folder name
 * @returns {string} HTML string
 */
export function imageUploadField(currentUrl, fieldId, folder = 'general', suggestion = 'Tự động nén HD (Max 1920px)', cropInfo = null) {
  const preview = currentUrl ? `<img src="${currentUrl}" class="upload-preview-img" crossorigin="anonymous" />` : '';
  const cropDataAttr = cropInfo ? `data-crop="${cropInfo}"` : '';
  const cropBtn = (currentUrl && cropInfo) ? `<button type="button" class="btn-upload btn-crop" style="margin-left:8px;background:#333;" id="btn-crop-${fieldId}"><i class="fas fa-crop"></i> Cắt ảnh</button>` : '';
  return `
    <div class="image-upload-field" data-field-id="${fieldId}" data-folder="${folder}" ${cropDataAttr}>
      <div class="upload-preview" id="preview-${fieldId}">
        ${preview}
      </div>
      <div class="upload-controls">
        <input type="file" id="file-${fieldId}" accept="image/*" style="display:none" />
        <button type="button" class="btn-upload" onclick="document.getElementById('file-${fieldId}').click()">
          <i class="fas fa-cloud-upload-alt"></i> ${currentUrl ? 'Đổi ảnh' : 'Chọn ảnh'}
        </button>
        ${cropBtn}
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
 * Show a modal with Cropper.js
 */
function showCropModal(imageSrc, cropInfo) {
  return new Promise((resolve) => {
    let ratio = NaN;
    if (cropInfo === '1:1') ratio = 1;

    const overlay = document.createElement('div');
    overlay.className = 'admin-modal-overlay';
    overlay.style.zIndex = '10000'; 
    overlay.innerHTML = `
      <div class="admin-modal" style="max-width: 600px; width: 90%;">
        <h3>Cắt Ảnh</h3>
        <div style="height: 50vh; overflow:hidden; background:#111; margin-bottom: 20px; display:flex; justify-content:center; align-items:center;">
          <img id="cropper-img" src="${imageSrc}" style="max-width: 100%; max-height: 100%; display: block;" crossorigin="anonymous" />
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" id="crop-cancel">Hủy</button>
          <button class="btn-primary" id="crop-save"><i class="fas fa-check"></i> Xác nhận</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const img = overlay.querySelector('#cropper-img');
    const btnCancel = overlay.querySelector('#crop-cancel');
    const btnSave = overlay.querySelector('#crop-save');

    let cropper;
    img.onload = () => {
      cropper = new Cropper(img, {
        aspectRatio: ratio,
        viewMode: 1,
        background: false,
        autoCropArea: 1
      });
    };

    const closeAndResolve = (result) => {
      if (cropper) cropper.destroy();
      overlay.remove();
      resolve(result);
    };

    btnCancel.onclick = () => closeAndResolve(null);
    btnSave.onclick = () => {
      if (!cropper) return closeAndResolve(null);
      btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
      btnSave.disabled = true;
      
      const canvas = cropper.getCroppedCanvas({
        maxWidth: 1920,
        maxHeight: 1920,
        fillColor: '#000'
      });
      
      canvas.toBlob((blob) => {
        closeAndResolve(blob);
      }, 'image/jpeg', 0.85);
    };
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
    const cropInfo = field.dataset.crop;
    const fileInput = document.getElementById(`file-${fieldId}`);
    const cropBtn = document.getElementById(`btn-crop-${fieldId}`);
    
    // Bind crop button for existing images
    if (cropBtn && !cropBtn._bound) {
      cropBtn._bound = true;
      cropBtn.addEventListener('click', async () => {
        const urlInput = document.getElementById(`url-${fieldId}`);
        const currentSrc = urlInput ? urlInput.value : '';
        if (!currentSrc) return;
        
        const preview = document.getElementById(`preview-${fieldId}`);
        const status = document.getElementById(`status-${fieldId}`);
        const btnUpload = field.querySelector('.btn-upload:not(.btn-crop)');
        
        const croppedBlob = await showCropModal(currentSrc, cropInfo);
        if (!croppedBlob) return;
        
        status.textContent = 'Đang tải lên Supabase...';
        btnUpload.disabled = true;
        cropBtn.disabled = true;

        const fileToUpload = new File([croppedBlob], `crop_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const publicUrl = await uploadImage(fileToUpload, folder);

        if (publicUrl) {
          urlInput.value = publicUrl;
          preview.innerHTML = `<img src="${publicUrl}" class="upload-preview-img" crossorigin="anonymous" />`;
          status.textContent = 'Đã tải lên ✓ (Cắt xong)';
          status.style.color = '#00D13B';
          // trigger change event so modal knows data changed
          urlInput.dispatchEvent(new Event('change'));
        } else {
          status.textContent = 'Lỗi tải lên!';
          status.style.color = '#ff4444';
        }
        btnUpload.disabled = false;
        cropBtn.disabled = false;
      });
    }

    if (!fileInput || fileInput._bound) return;
    fileInput._bound = true;

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const status = document.getElementById(`status-${fieldId}`);
      const preview = document.getElementById(`preview-${fieldId}`);
      const urlInput = document.getElementById(`url-${fieldId}`);
      const btn = field.querySelector('.btn-upload:not(.btn-crop)');

      status.textContent = 'Đang xử lý ảnh...';
      btn.disabled = true;

      let fileToUpload = file;
      if (cropInfo) {
         const readerDataUrl = new Promise((resolve) => {
           const reader = new FileReader();
           reader.onload = (e) => resolve(e.target.result);
           reader.readAsDataURL(file);
         });
         const dataUrl = await readerDataUrl;
         const croppedBlob = await showCropModal(dataUrl, cropInfo);
         
         if (!croppedBlob) {
            status.textContent = 'Đã hủy tải lên';
            btn.disabled = false;
            fileInput.value = ''; // reset so same file can be picked
            return;
         }
         fileToUpload = new File([croppedBlob], file.name.replace(/\.[^/.]+$/, "") + "_cropped.jpg", { type: 'image/jpeg' });
         preview.innerHTML = `<img src="${URL.createObjectURL(croppedBlob)}" class="upload-preview-img" crossorigin="anonymous" />`;
      } else {
         const reader = new FileReader();
         reader.onload = (ev) => {
           preview.innerHTML = `<img src="${ev.target.result}" class="upload-preview-img" crossorigin="anonymous" />`;
         };
         reader.readAsDataURL(file);

         status.textContent = 'Đang nén ảnh (Tối ưu hóa)...';
         try {
           if (file.size > 300 * 1024) { 
             fileToUpload = await compressImage(file);
           }
         } catch(err) { console.error('Compression failed', err); }
      }

      status.textContent = 'Đang tải lên Supabase...';
      const publicUrl = await uploadImage(fileToUpload, folder);
      
      if (publicUrl) {
        urlInput.value = publicUrl;
        status.textContent = 'Đã tải lên ✓';
        status.style.color = '#00D13B';
        btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Đổi ảnh';
        if (cropBtn) cropBtn.style.display = 'inline-block';
      } else {
        status.textContent = 'Lỗi tải lên!';
        status.style.color = '#ff4444';
      }
      btn.disabled = false;
      // trigger input event so modal knows data changed
      urlInput.dispatchEvent(new Event('change'));
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
