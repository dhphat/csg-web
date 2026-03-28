export let siteData = null;
export let isDirty = false;

export function setSiteData(data) {
  siteData = data;
}

export function setDirty(state = true) {
  isDirty = state;
  window.isDirty = state; // Backward compatibility
  const btn = document.getElementById('btn-save');
  if (btn) {
    if (state) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-save"></i> Cần lưu thay đổi *';
      btn.style.opacity = '1';
      btn.style.boxShadow = '0 0 8px rgba(255, 222, 33, 0.5)';
    } else {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-check"></i> Đã lưu';
      btn.style.opacity = '0.5';
      btn.style.boxShadow = 'none';
    }
  }
}

export function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `admin-toast show ${type}`;
  setTimeout(() => toast.className = 'admin-toast', 3000);
}
