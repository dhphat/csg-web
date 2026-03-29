export function renderMembers(siteData, esc) {
  // Presidents
  const presidents = (siteData.presidents || []).map((p, i) => `
    <div class="admin-item">
      <img src="${p.photo}" alt="${esc(p.name)}" class="admin-item-thumb" />
      <div class="admin-item-info">
        <div class="admin-item-title">${esc(p.name)}</div>
        <div class="admin-item-sub">${esc(p.gen)} • ${esc(p.term)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-president" data-index="${i}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-president" data-index="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  // Current Board
  if (!siteData.boardGenerations || siteData.boardGenerations.length === 0) {
    siteData.boardGenerations = [{ term: 'Hiện tại', members: [] }];
  }
  const currentGen = siteData.boardGenerations[0];

  // Group members by level
  const membersByLevel = {};
  (currentGen.members || []).forEach(m => {
    const lv = m.level || 1;
    if (!membersByLevel[lv]) membersByLevel[lv] = [];
    membersByLevel[lv].push(m);
  });

  let groupedHtml = '';
  // Sort levels descending (5 down to 1)
  [5, 4, 3, 2, 1].forEach(lv => {
    if (!membersByLevel[lv]) return;
    const listHtml = membersByLevel[lv].map((m, mi) => {
      const realIdx = currentGen.members.indexOf(m);
      return `
      <div class="admin-item" style="padding:10px 16px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${m.photo}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">
          <div class="admin-item-info">
            <div class="admin-item-title" style="font-weight:600;">${esc(m.name)}</div>
            <div class="admin-item-sub">Level ${lv} • ${esc(m.role)}</div>
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn-icon" data-action="edit-board-member" data-index="${realIdx}"><i class="fas fa-pen"></i></button>
          <button class="btn-icon danger" data-action="delete-board-member" data-index="${realIdx}"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
    }).join('');
    groupedHtml += `<div style="padding:8px 16px;background:rgba(255,222,33,0.05);color:var(--text-gold);font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;border-top:1px solid #222;">Cấp độ ${lv}</div>${listHtml}`;
  });

  return `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Chủ nhiệm qua các thời kỳ (${(siteData.presidents || []).length})</h3>
        <button class="btn-add" data-action="add-president"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${presidents}</div>
    </div>
    
    <div class="admin-card" style="margin-top:32px;">
      <div class="admin-card-header">
        <h3 style="color:var(--text-gold);">Ban điều hành hiện tại (${currentGen.members.length})</h3>
        <button class="btn-add" data-action="add-board-member"><i class="fas fa-plus"></i> Thêm Thành viên</button>
      </div>
      <div class="admin-item-list" style="border-top:1px solid #333;">${groupedHtml || '<p style="padding:16px;color:#666;">Chưa có thành viên nào</p>'}</div>
    </div>
  `;
}

export function handleMemberAction(action, index, siteData, showModal, renderSection) {
  switch (action) {
    case 'add-president': showPresidentModal(undefined, siteData, showModal, renderSection); break;
    case 'edit-president': showPresidentModal(index, siteData, showModal, renderSection); break;
    case 'delete-president':
      if (confirm('Xóa chủ nhiệm này?')) { siteData.presidents.splice(index, 1); window.setDirty(true); renderSection('members'); }
      break;

    case 'add-board-member': showMemberModal(null, 0, siteData, showModal, renderSection); break;
    case 'edit-board-member': showMemberModal(index, 0, siteData, showModal, renderSection); break;
    case 'delete-board-member':
      if (confirm('Xóa thành viên này?')) { siteData.boardGenerations[0].members.splice(index, 1); window.setDirty(true); renderSection('members'); }
      break;
  }
}

function showPresidentModal(index, siteData, showModal, renderSection) {
  const p = index !== undefined ? siteData.presidents[index] : {};
  showModal(index !== undefined ? 'Sửa chủ nhiệm' : 'Thêm chủ nhiệm', [
    { key: 'name', label: 'Họ tên', value: p.name },
    { key: 'gen', label: 'Chủ nhiệm đời thứ mấy', value: p.gen },
    { key: 'term', label: 'Nhiệm kỳ (VD: 2023 - 2024)', value: p.term },
    { key: 'photo', label: 'Ảnh Đại diện', value: p.photo, type: 'image', folder: 'members' }
  ], (vals) => {
    if (!siteData.presidents) siteData.presidents = [];
    if (index !== undefined) {
      siteData.presidents[index] = vals;
    } else {
      siteData.presidents.push(vals);
    }
    renderSection('members');
  });
}

function showMemberModal(index, yearIndex, siteData, showModal, renderSection) {
  const m = index !== null ? siteData.boardGenerations[yearIndex].members[index] : { level: 1 };
  showModal(index !== null ? 'Sửa thành viên' : 'Thêm thành viên', [
    { key: 'name', label: 'Họ tên', value: m.name },
    { key: 'role', label: 'Vai trò', value: m.role },
    { key: 'level', label: 'Cấp độ (1: Thành viên -> 5: Cao nhất)', value: m.level?.toString() || '1', type: 'number' },
    { key: 'photo', label: 'Ảnh Đại diện', value: m.photo, type: 'image', folder: 'members' }
  ], (vals) => {
    const member = { ...m, name: vals.name, role: vals.role, level: parseInt(vals.level) || 1, photo: vals.photo };
    if (index !== null) siteData.boardGenerations[yearIndex].members[index] = member;
    else siteData.boardGenerations[yearIndex].members.push(member);
    renderSection('members');
  });
}
