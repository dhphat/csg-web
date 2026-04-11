import { imageUploadField, getUploadedUrl } from './admin-upload.js';

export function renderDepartments(siteData, esc) {
  const deptCards = siteData.departments.map((d, di) => {
    return `
      <div class="admin-card" style="padding:16px;">
        <div class="admin-card-header" style="margin-bottom:0;">
          <div style="display:flex;align-items:center;gap:12px;">
            ${d.image ? `<img src="${d.image}" style="width:50px;height:50px;border-radius:10px;object-fit:cover;" />` : ''}
            <div>
              <div class="admin-item-title" style="font-size:1.1rem;margin-bottom:4px;">${esc(d.name)}</div>
              <div class="admin-item-sub">ID: ${d.id} • ${(d.teams || []).length} teams</div>
            </div>
          </div>
          <div class="admin-item-actions">
            <button class="btn-primary" data-action="edit-dept" data-index="${di}"><i class="fas fa-edit"></i> Quản lý Ban & Team</button>
            <button class="btn-icon danger" data-action="delete-dept" data-index="${di}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <h3>Phòng Ban (${siteData.departments.length})</h3>
      <button class="btn-add" data-action="add-dept"><i class="fas fa-plus"></i> Thêm ban mới</button>
    </div>
    ${deptCards}
  `;
}

export function handleDeptAction(action, index, siteData, renderSection) {
  switch (action) {
    case 'add-dept': showDeptAdvancedModal(undefined, siteData, renderSection); break;
    case 'edit-dept': showDeptAdvancedModal(index, siteData, renderSection); break;
    case 'delete-dept':
      if (confirm('Xóa phòng ban này và toàn bộ dữ liệu team bên trong?')) { siteData.departments.splice(index, 1); window.setDirty(true); renderSection('departments'); }
      break;
  }
}

function showDeptAdvancedModal(index, siteData, renderSection) {
  const d = index !== undefined ? siteData.departments[index] : {
    id: 'new-dept-' + Date.now(),
    name: '',
    image: '',
    thumbnail: '',
    description: '',
    subDepts: [],
    teams: []
  };

  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  
  let currentDept = JSON.parse(JSON.stringify(d));

  const renderModalContent = () => {
    const esc = (str) => {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    const deptMembersHtml = (currentDept.members || []).map((m, mi) => `
      <div class="modal-member-item" style="margin-bottom:8px;">
        <input type="text" placeholder="Tên (VD: Nguyễn Văn A)" value="${esc(m.name)}" onchange="window._deptModalUpdateDeptMember(${mi}, 'name', this.value)" style="flex:1;">
        <input type="text" placeholder="Vai trò (VD: Trưởng ban)" value="${esc(m.role)}" onchange="window._deptModalUpdateDeptMember(${mi}, 'role', this.value)" style="flex:1;">
        <button class="btn-icon danger" onclick="window._deptModalDeleteDeptMember(${mi})"><i class="fas fa-times"></i></button>
      </div>
    `).join('');

    const teamsHtml = (currentDept.teams || []).map((t, ti) => {
      const membersHtml = (t.members || []).map((m, mi) => `
        <div class="modal-member-item">
          <input type="text" placeholder="Tên" value="${esc(m.name)}" onchange="window._deptModalUpdateMember(${ti}, ${mi}, 'name', this.value)" style="flex:1;">
          <input type="text" placeholder="Vai trò" value="${esc(m.role)}" onchange="window._deptModalUpdateMember(${ti}, ${mi}, 'role', this.value)" style="flex:1;">
          <button class="btn-icon danger" onclick="window._deptModalDeleteMember(${ti}, ${mi})"><i class="fas fa-times"></i></button>
        </div>
      `).join('');

      return `
      <div class="modal-team-item">
        <div class="modal-team-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <strong>Team:</strong> 
            <input type="text" value="${esc(t.name)}" style="width:200px;background:#000;color:#fff;border:1px solid #333;border-radius:4px;padding:4px 8px;" onchange="window._deptModalUpdateTeam(${ti}, 'name', this.value)">
          </div>
          <button class="btn-icon danger" onclick="window._deptModalDeleteTeam(${ti})"><i class="fas fa-trash"></i></button>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Ảnh team</label>${imageUploadField(t.image || '', 'd-team-img-'+ti, 'departments')}</div>
        </div>
        <div class="form-group"><label>Mô tả team</label><textarea onchange="window._deptModalUpdateTeam(${ti}, 'description', this.value)">${esc(t.description || '')}</textarea></div>
        <div style="margin-top:10px;">
          <label style="font-size:0.75rem;color:#999;font-weight:700;margin-bottom:8px;display:block;">QUẢN LÝ TEAM</label>
          ${membersHtml || '<p style="color:#666;font-size:0.8rem;margin-bottom:8px;">Chưa có thành viên</p>'}
          <button class="btn-add" onclick="window._deptModalAddMember(${ti})" style="font-size:0.7rem;padding:4px 8px;"><i class="fas fa-plus"></i> Thêm thành viên</button>
        </div>
      </div>`;
    }).join('');

    overlay.innerHTML = `
      <div class="admin-modal wide" style="max-width:1100px; display: block !important;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
          <h3 style="margin:0;">${index !== undefined ? 'Quản lý Ban: ' + currentDept.name : 'Thêm Ban mới'}</h3>
          <button class="btn-icon" id="d-close" style="font-size:1.5rem;">&times;</button>
        </div>
        
        <div class="modal-split" style="display:flex; gap:32px; width: 100%;">
          <div class="modal-basic-info" style="flex:1;">
            <div class="form-row">
              <div class="form-group"><label>ID (Slug)</label><input type="text" id="d-id" value="${esc(currentDept.id)}"></div>
              <div class="form-group" style="flex:2;"><label>Tên Ban</label><input type="text" id="d-name" value="${esc(currentDept.name)}"></div>
            </div>
            <div class="form-group">
              <label>Ảnh Ban (Banner)</label>
              ${imageUploadField(currentDept.image || '', 'd-img', 'departments')}
            </div>
            <div class="form-group">
              <label>Thumbnail (Ảnh chia sẻ mạng xã hội)</label>
              ${imageUploadField(currentDept.thumbnail || '', 'd-thumb', 'departments')}
            </div>
            <div class="form-group">
              <label>Mô tả Ban</label>
              <textarea id="d-desc" style="min-height:200px;">${esc(currentDept.description || '')}</textarea>
            </div>
            <div class="form-group" style="margin-top:20px; border-top:1px solid #333; padding-top:20px;">
              <div class="modal-list-title" style="margin-bottom:12px;"><span>QUẢN LÝ BAN</span></div>
              ${deptMembersHtml || '<p style="color:#666;font-size:0.8rem;margin-bottom:8px;">Chưa có quản lý ban</p>'}
              <button class="btn-add" onclick="window._deptModalAddDeptMember()" style="font-size:0.7rem;padding:8px;width:100%;justify-content:center;border-style:dashed;"><i class="fas fa-plus"></i> Thêm Quản lý Ban</button>
            </div>
          </div>

          <div class="modal-dynamic-lists" style="flex:1.8; max-height:70vh; overflow-y:auto; padding-right:12px; border-left: 1px solid #333; padding-left: 20px;">
            <div class="modal-list-title"><span>DANH SÁCH TEAMS TRONG BAN</span></div>
            ${teamsHtml || '<p style="color:#666;margin-bottom:16px;">Phòng ban này chưa có team nào.</p>'}
            <button class="btn-add" style="width:100%;justify-content:center;padding:12px;border-style:solid;" onclick="window._deptModalAddTeam()"><i class="fas fa-plus"></i> THÊM TEAM MỚI</button>
          </div>
        </div>

        <div class="modal-actions" style="margin-top:24px; padding-top:20px; border-top:1px solid #333; display:flex; justify-content:flex-end; gap:12px;">
          <button class="btn-secondary" id="d-cancel">Hủy</button>
          <button class="btn-primary" id="d-save" style="padding:12px 40px; font-size:1rem; opacity:0.5;" disabled><i class="fas fa-save"></i> LƯU THÔNG TIN BAN</button>
        </div>
      </div>
    `;

    const dSave = overlay.querySelector('#d-save');
    overlay.addEventListener('input', () => { dSave.disabled = false; dSave.style.opacity = '1'; });
    overlay.addEventListener('change', () => { dSave.disabled = false; dSave.style.opacity = '1'; });

    overlay.querySelector('#d-cancel').onclick = () => { cleanup(); overlay.remove(); };
    overlay.querySelector('#d-close').onclick = () => { cleanup(); overlay.remove(); };
    dSave.onclick = () => {
      dSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
      dSave.disabled = true;
      syncDeptDOM();
      currentDept.description = overlay.querySelector('#d-desc').value;
      currentDept.subDepts = [];

      if (index !== undefined) {
        siteData.departments[index] = currentDept;
      } else {
        siteData.departments.push(currentDept);
      }
      setTimeout(() => {
        cleanup();
        overlay.remove();
        if(window.setDirty) window.setDirty(true);
        renderSection('departments');
        // trigger global showToast
        const t = document.getElementById('toast');
        if(t){ t.textContent='Lưu thành công'; t.className='admin-toast show success'; setTimeout(()=>t.className='admin-toast',3000); }
      }, 400);
    };
  };

  const syncDeptDOM = () => {
    if (!overlay.querySelector('#d-name')) return;
    currentDept.id = overlay.querySelector('#d-id').value;
    currentDept.name = overlay.querySelector('#d-name').value;
    currentDept.image = getUploadedUrl('d-img') || currentDept.image;
    currentDept.thumbnail = getUploadedUrl('d-thumb') || currentDept.thumbnail;
    currentDept.description = overlay.querySelector('#d-desc').value;
    
    if (currentDept.teams) {
      currentDept.teams.forEach((t, ti) => {
        const teamImgUrl = getUploadedUrl('d-team-img-' + ti);
        if (teamImgUrl) t.image = teamImgUrl;
      });
    }
  };

  window._deptModalAddDeptMember = () => {
    syncDeptDOM();
    if (!currentDept.members) currentDept.members = [];
    currentDept.members.push({ name: '', role: '' });
    renderModalContent();
  };
  window._deptModalUpdateDeptMember = (mi, key, val) => {
    currentDept.members[mi][key] = val;
  };
  window._deptModalDeleteDeptMember = (mi) => {
    syncDeptDOM();
    currentDept.members.splice(mi, 1);
    renderModalContent();
  };

  const cleanup = () => {
    delete window._deptModalAddTeam;
    delete window._deptModalDeleteTeam;
    delete window._deptModalUpdateTeam;
    delete window._deptModalAddMember;
    delete window._deptModalUpdateMember;
    delete window._deptModalDeleteMember;
    delete window._deptModalAddDeptMember;
    delete window._deptModalUpdateDeptMember;
    delete window._deptModalDeleteDeptMember;
  };

  // Helper bindings
  window._deptModalAddTeam = () => {
    syncDeptDOM();
    if (!currentDept.teams) currentDept.teams = [];
    currentDept.teams.push({ name: 'Team mới', image: '', description: '', members: [] });
    renderModalContent();
  };
  window._deptModalDeleteTeam = (ti) => {
    if (confirm('Xóa team này?')) {
      syncDeptDOM();
      currentDept.teams.splice(ti, 1);
      renderModalContent();
    }
  };
  window._deptModalUpdateTeam = (ti, key, val) => {
    currentDept.teams[ti][key] = val;
  };
  window._deptModalAddMember = (ti) => {
    syncDeptDOM();
    if (!currentDept.teams[ti].members) currentDept.teams[ti].members = [];
    currentDept.teams[ti].members.push({ name: '', role: '' });
    renderModalContent();
  };
  window._deptModalUpdateMember = (ti, mi, key, val) => {
    currentDept.teams[ti].members[mi][key] = val;
  };
  window._deptModalDeleteMember = (ti, mi) => {
    syncDeptDOM();
    currentDept.teams[ti].members.splice(mi, 1);
    renderModalContent();
  };

  renderModalContent();
  document.body.appendChild(overlay);
  if(window.bindUploadEventsAdmin) window.bindUploadEventsAdmin(); // Because it uses imageUploadField, needs bindings
}
