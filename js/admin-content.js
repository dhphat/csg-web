export function renderAchievements(siteData, esc) {
  const awards = siteData.awards.map((a, i) => `
    <div class="admin-item">
      <img src="${a.image}" alt="" class="admin-item-thumb" />
      <div class="admin-item-info">
        <div class="admin-item-title">${esc(a.title)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-award" data-index="${i}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-award" data-index="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  const eco = siteData.mediaEcosystem || { totalFollowers: '', channels: [] };
  const ecoChannels = (eco.channels || []).map((c, i) => `
    <div class="admin-item">
      <img src="${c.logo}" alt="" class="admin-item-thumb" />
      <div class="admin-item-info">
        <div class="admin-item-title">${esc(c.name)}</div>
        <div class="admin-item-sub">${esc(c.followers)} followers</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-eco-channel" data-index="${i}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-eco-channel" data-index="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  const collabs = (siteData.collaborators || []).map((c, i) => `
    <div class="admin-item">
      <img src="${c.photo}" alt="" class="admin-item-thumb" />
      <div class="admin-item-info">
        <div class="admin-item-title">${esc(c.name)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-collaborator" data-index="${i}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-collaborator" data-index="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  return `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Giải thưởng / Thành tích (${siteData.awards.length})</h3>
        <button class="btn-add" data-action="add-award"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${awards}</div>
    </div>

    <div class="admin-card" style="margin-top:24px;">
      <div class="admin-card-header">
        <h3>Hệ sinh thái truyền thông (Tổng Follow: <input type="text" value="${esc(eco.totalFollowers)}" data-bind="mediaEcosystem.totalFollowers" style="width:100px;font-size:1rem;font-weight:bold;margin-left:8px;" />)</h3>
        <button class="btn-add" data-action="add-eco-channel"><i class="fas fa-plus"></i> Thêm kênh</button>
      </div>
      <div class="admin-item-list">${ecoChannels}</div>
    </div>

    <div class="admin-card" style="margin-top:24px;">
      <div class="admin-card-header">
        <h3>Đối tác phát triển / Đồng hành (${(siteData.collaborators||[]).length})</h3>
        <button class="btn-add" data-action="add-collaborator"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${collabs}</div>
    </div>
  `;
}

export function renderSponsors(siteData, esc) {
  const items = siteData.sponsors.map((s, i) => `
    <div class="admin-item">
      <img src="${s.logo}" alt="${esc(s.name)}" class="admin-item-thumb" />
      <div class="admin-item-info">
        <div class="admin-item-title">${esc(s.name)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-sponsor" data-index="${i}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-sponsor" data-index="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  return `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Nhà tài trợ (${siteData.sponsors.length})</h3>
        <button class="btn-add" data-action="add-sponsor"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${items}</div>
    </div>
  `;
}

export function renderHallOfFame(siteData, esc, showSimpleModal) {
  const hof = siteData.hallOfFame || { individuals: { yearly: [], semesters: [] }, collectives: { yearly: [], semesters: [] } };

  function renderHofTable(type, period, periodKey, label) {
    const data = hof[type][period] || [];
    if (data.length === 0) return '';

    return data.map((item, index) => {
      const periodTitle = item.year || item.semester;
      const categoriesHtml = (item.categories || []).map((cat, ci) => {
        const membersRows = (cat.members || []).map((m, mi) => `
          <div style="display:flex;align-items:center;padding:8px;border-bottom:1px solid #333;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:12px;">
              <img src="${m.image}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;">
              <span>${esc(m.recipient)}</span>
            </div>
            <div>
              <button class="btn-icon" data-action="edit-hof-member" data-type="${type}" data-period="${period}" data-year="${index}" data-cat="${ci}" data-member="${mi}" style="scale:0.8;"><i class="fas fa-pen"></i></button>
              <button class="btn-icon danger" data-action="delete-hof-member" data-type="${type}" data-period="${period}" data-year="${index}" data-cat="${ci}" data-member="${mi}" style="scale:0.8;"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `).join('');

        return `
          <div style="margin-bottom:16px;background:rgba(255,255,255,0.02);border:1px dashed #444;border-radius:8px;padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <h5 style="color:var(--gold-primary);margin:0;">${esc(cat.name)}</h5>
              <div>
                <button class="btn-icon" data-action="add-hof-member" data-type="${type}" data-period="${period}" data-year="${index}" data-cat="${ci}" style="scale:0.8;"><i class="fas fa-plus"></i></button>
                <button class="btn-icon" data-action="edit-hof-cat" data-type="${type}" data-period="${period}" data-year="${index}" data-cat="${ci}" style="scale:0.8;"><i class="fas fa-pen"></i></button>
                <button class="btn-icon danger" data-action="delete-hof-cat" data-type="${type}" data-period="${period}" data-year="${index}" data-cat="${ci}" style="scale:0.8;"><i class="fas fa-trash"></i></button>
              </div>
            </div>
            ${membersRows || '<p style="font-size:0.8rem;color:#666;">Chưa có vinh danh nào.</p>'}
          </div>
        `;
      }).join('');

      return `
        <div class="admin-item" style="flex-direction:column;align-items:stretch;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h4 style="margin:0;font-size:1.1rem;">${label} ${esc(periodTitle)}</h4>
            <div>
              <button class="btn-add" data-action="add-hof-cat" data-type="${type}" data-period="${period}" data-year="${index}" style="font-size:0.7rem;padding:4px 8px;"><i class="fas fa-plus"></i> Thêm Danh hiệu</button>
              <button class="btn-icon danger" data-action="delete-hof-period" data-type="${type}" data-period="${period}" data-year="${index}"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          <div>${categoriesHtml}</div>
        </div>
      `;
    }).join('');
  }

  return `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Vinh danh CÁ NHÂN Xuất Sắc (Theo ${'Học kỳ'})</h3>
        <button class="btn-add" data-action="add-hof-period" data-type="individuals" data-period="semesters"><i class="fas fa-plus"></i> Thêm Kỳ Học mới</button>
      </div>
      <div class="admin-item-list">${renderHofTable('individuals', 'semesters', 'semester', 'Học kỳ')}</div>
    </div>
    <div class="admin-card" style="margin-top:24px;">
      <div class="admin-card-header">
        <h3>Vinh danh CÁ NHÂN Cống Hiến (Theo ${'Năm'})</h3>
        <button class="btn-add" data-action="add-hof-period" data-type="individuals" data-period="yearly"><i class="fas fa-plus"></i> Thêm Năm mới</button>
      </div>
      <div class="admin-item-list">${renderHofTable('individuals', 'yearly', 'year', 'Năm')}</div>
    </div>

    <div class="admin-card" style="margin-top:40px;">
      <div class="admin-card-header">
        <h3>Vinh danh TẬP THỂ Xuất Sắc (Theo Học kỳ)</h3>
        <button class="btn-add" data-action="add-hof-period" data-type="collectives" data-period="semesters"><i class="fas fa-plus"></i> Thêm Kỳ Học mới</button>
      </div>
      <div class="admin-item-list">${renderHofTable('collectives', 'semesters', 'semester', 'Học kỳ')}</div>
    </div>
    <div class="admin-card" style="margin-top:24px;">
      <div class="admin-card-header">
        <h3>Vinh danh TẬP THỂ Cống Hiến (Theo Năm)</h3>
        <button class="btn-add" data-action="add-hof-period" data-type="collectives" data-period="yearly"><i class="fas fa-plus"></i> Thêm Năm mới</button>
      </div>
      <div class="admin-item-list">${renderHofTable('collectives', 'yearly', 'year', 'Năm')}</div>
    </div>
  `;
}

export function handleContentAction(action, index, dataset, siteData, showModal, showSimpleModal, renderSection) {
  switch (action) {
    case 'add-award': showAwardModal(undefined, siteData, showModal, renderSection); break;
    case 'edit-award': showAwardModal(index, siteData, showModal, renderSection); break;
    case 'delete-award':
      if (confirm('Xóa giải thưởng này?')) { siteData.awards.splice(index, 1); renderSection('achievements'); }
      break;

    case 'add-eco-channel': showEcoChannelModal(undefined, siteData, showModal, renderSection); break;
    case 'edit-eco-channel': showEcoChannelModal(index, siteData, showModal, renderSection); break;
    case 'delete-eco-channel':
      if (confirm('Xóa kênh truyền thông này?')) { siteData.mediaEcosystem.channels.splice(index, 1); renderSection('achievements'); }
      break;

    case 'add-collaborator': showCollaboratorModal(undefined, siteData, showModal, renderSection); break;
    case 'edit-collaborator': showCollaboratorModal(index, siteData, showModal, renderSection); break;
    case 'delete-collaborator':
      if (confirm('Xóa đối tác này?')) { siteData.collaborators.splice(index, 1); renderSection('achievements'); }
      break;

    case 'add-sponsor': showSponsorModal(undefined, siteData, showModal, renderSection); break;
    case 'edit-sponsor': showSponsorModal(index, siteData, showModal, renderSection); break;
    case 'delete-sponsor':
      if (confirm('Xóa nhà tài trợ này?')) { siteData.sponsors.splice(index, 1); renderSection('sponsors'); }
      break;
      
    // HOF
    case 'add-hof-period': {
      const { type, period } = dataset;
      showSimpleModal('Nhập tên ' + (period === 'yearly' ? 'Năm (VD: 2024)' : 'Học kỳ (VD: Spring 2024)'), '', (val) => {
        siteData.hallOfFame[type][period].unshift({ [period==='yearly'?'year':'semester']: val, categories: [] });
        renderSection('halloffame');
      });
      break;
    }
    case 'delete-hof-period': {
      const { type, period, year: yi } = dataset;
      if (confirm('Xóa toàn bộ dữ liệu của kỳ/năm này?')) {
        siteData.hallOfFame[type][period].splice(parseInt(yi), 1);
        renderSection('halloffame');
      }
      break;
    }
    case 'add-hof-cat': {
      const { type, period, year: yi } = dataset;
      showSimpleModal('Nhập tên Danh hiệu (Cat)', '', (val) => {
        siteData.hallOfFame[type][period][parseInt(yi)].categories.push({ name: val, members: [] });
        renderSection('halloffame');
      });
      break;
    }
    case 'edit-hof-cat': {
      const { type, period, year: yi, cat } = dataset;
      const catObj = siteData.hallOfFame[type][period][parseInt(yi)].categories[parseInt(cat)];
      showSimpleModal('Sửa tên danh hiệu', catObj.name, (val) => {
        catObj.name = val;
        renderSection('halloffame');
      });
      break;
    }
    case 'delete-hof-cat': {
      const { type, period, year: yi, cat } = dataset;
      if (confirm('Xóa danh hiệu này và tất cả người nhận?')) {
        siteData.hallOfFame[type][period][parseInt(yi)].categories.splice(parseInt(cat), 1);
        renderSection('halloffame');
      }
      break;
    }
    case 'add-hof-member':
      showHOFMemberModal(dataset.type, dataset.period, parseInt(dataset.year), parseInt(dataset.cat), undefined, siteData, showModal, renderSection);
      break;
    case 'edit-hof-member':
      showHOFMemberModal(dataset.type, dataset.period, parseInt(dataset.year), parseInt(dataset.cat), parseInt(dataset.member), siteData, showModal, renderSection);
      break;
    case 'delete-hof-member': {
      const { type, period, year: yi, cat, member } = dataset;
      if (confirm('Xóa người nhận này?')) {
        siteData.hallOfFame[type][period][parseInt(yi)].categories[parseInt(cat)].members.splice(parseInt(member), 1);
        renderSection('halloffame');
      }
      break;
    }
  }
}

function showAwardModal(index, siteData, showModal, renderSection) {
  const a = index !== undefined ? siteData.awards[index] : {};
  showModal(index !== undefined ? 'Sửa danh hiệu/thành tích' : 'Thêm danh hiệu/thành tích', [
    { key: 'title', label: 'Tiêu đề', value: a.title },
    { key: 'image', label: 'Ảnh Minh họa', value: a.image, type: 'image', folder: 'awards' }
  ], (vals) => {
    if (index !== undefined) siteData.awards[index] = vals;
    else siteData.awards.push(vals);
    renderSection('achievements');
  });
}

function showEcoChannelModal(index, siteData, showModal, renderSection) {
  const eco = siteData.mediaEcosystem || { totalFollowers: '', channels: [] };
  const c = index !== undefined ? eco.channels[index] : {};
  showModal(index !== undefined ? 'Sửa kênh truyền thông' : 'Thêm kênh truyền thông', [
    { key: 'name', label: 'Tên kênh', value: c.name },
    { key: 'logo', label: 'Logo kênh', value: c.logo, type: 'image', folder: 'sponsors' },
    { key: 'followers', label: 'Số followers', value: c.followers },
    { key: 'url', label: 'Link kênh', value: c.url }
  ], (vals) => {
    if (!siteData.mediaEcosystem) siteData.mediaEcosystem = { totalFollowers: '', channels: [] };
    if (index !== undefined) {
      siteData.mediaEcosystem.channels[index] = vals;
    } else {
      siteData.mediaEcosystem.channels.push(vals);
    }
    renderSection('achievements');
  });
}

function showCollaboratorModal(index, siteData, showModal, renderSection) {
  const c = index !== undefined ? siteData.collaborators[index] : {};
  showModal(index !== undefined ? 'Sửa' : 'Thêm người hợp tác', [
    { key: 'name', label: 'Tên', value: c.name },
    { key: 'photo', label: 'Ảnh Đại diện/Logo', value: c.photo, type: 'image', folder: 'collaborators' }
  ], (vals) => {
    if (!siteData.collaborators) siteData.collaborators = [];
    if (index !== undefined) {
      siteData.collaborators[index] = vals;
    } else {
      siteData.collaborators.push(vals);
    }
    renderSection('achievements');
  });
}

function showSponsorModal(index, siteData, showModal, renderSection) {
  const s = index !== undefined ? siteData.sponsors[index] : {};
  showModal(index !== undefined ? 'Sửa nhà tài trợ' : 'Thêm nhà tài trợ', [
    { key: 'name', label: 'Tên', value: s.name },
    { key: 'logo', label: 'Logo', value: s.logo, type: 'image', folder: 'sponsors' }
  ], (vals) => {
    if (index !== undefined) {
      siteData.sponsors[index] = vals;
    } else {
      siteData.sponsors.push(vals);
    }
    renderSection('sponsors');
  });
}

function showHOFMemberModal(type, period, yi, ci, memberIdx, siteData, showModal, renderSection) {
  const list = siteData.hallOfFame[type][period][yi].categories[ci].members;
  const m = memberIdx !== undefined ? list[memberIdx] : {};
  showModal(memberIdx !== undefined ? 'Sửa' : 'Thêm', [
    { key: 'recipient', label: 'Người/Tập thể nhận', value: m.recipient },
    { key: 'image', label: 'Ảnh chân dung/Đại diện', value: m.image, type: 'image', folder: 'halloffame' }
  ], (vals) => {
    if (memberIdx !== undefined) { list[memberIdx] = vals; } else { list.push(vals); }
    renderSection('halloffame');
  });
}
