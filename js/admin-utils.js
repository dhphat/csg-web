import { setDirty, esc, siteData } from './admin-state.js';
import { imageUploadField, bindUploadEvents, getUploadedUrl } from './admin-upload.js';

export function showModal(title, fields, onSave, onRenderContent) {
  const existing = document.querySelector('.admin-modal-overlay');
  if (existing) existing.remove();

  const fieldsHtml = fields.map(f => {
    if (f.type === 'textarea') {
      return `<div class="form-group"><label>${f.label}</label><textarea id="modal-${f.key}">${esc(f.value || '')}</textarea></div>`;
    }
    if (f.type === 'checkbox') {
      return `<div class="form-group"><label><input type="checkbox" id="modal-${f.key}" ${f.value ? 'checked' : ''} /> ${f.label}</label></div>`;
    }
    if (f.type === 'image') {
      return `<div class="form-group"><label>${f.label}</label>${imageUploadField(f.value || '', 'modal-'+f.key, f.folder || 'general')}</div>`;
    }
    return `<div class="form-group"><label>${f.label}</label><input type="${f.type || 'text'}" id="modal-${f.key}" value="${esc(f.value || '')}" /></div>`;
  }).join('');

  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  overlay.innerHTML = `
    <div class="admin-modal">
      <h3>${title}</h3>
      ${fieldsHtml}
      <div class="modal-actions">
        <button class="btn-secondary" id="modal-cancel">Hủy</button>
        <button class="btn-primary" id="modal-save" style="opacity:0.5;" disabled><i class="fas fa-check"></i> Lưu</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  bindUploadEvents();
  if (onRenderContent) onRenderContent(overlay);

  const mSave = overlay.querySelector('#modal-save');
  overlay.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => { mSave.disabled = false; mSave.style.opacity = '1'; });
    el.addEventListener('change', () => { mSave.disabled = false; mSave.style.opacity = '1'; });
  });

  overlay.querySelector('#modal-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  mSave.addEventListener('click', () => {
    mSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    mSave.disabled = true;
    setTimeout(() => {
      const values = {};
      fields.forEach(f => {
        const el = document.getElementById(`modal-${f.key}`);
        if (f.type === 'image') {
          values[f.key] = getUploadedUrl(`modal-${f.key}`);
        } else {
          values[f.key] = f.type === 'checkbox' ? el.checked : el.value;
        }
      });
      setDirty(true);
      onSave(values);
      overlay.remove();
    }, 400);
  });
}

export function showSimpleModal(title, value, onSave) {
  showModal(title, [{ key: 'value', label: 'Nội dung', value, type: 'text' }], (vals) => onSave(vals.value));
}
