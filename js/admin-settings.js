export function renderGeneral(siteData, esc) {
  const g = siteData.general;
  const f = siteData.footer || {};
  const h = siteData.home;

  const banners = (h.hero.banners || []).map((b, i) => `
    <div class="admin-item">
      <img src="${b.bgImage}" alt="Banner" class="admin-item-thumb" />
      <div class="admin-item-info">
        <div class="admin-item-title" style="font-size:0.85rem;">Banner ${i + 1}</div>
        <div class="admin-item-sub" style="font-size:0.75rem;">${esc(b.link)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-banner" data-index="${i}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-banner" data-index="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  const statItems = (h.stats?.items || []).map((s, i) => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-title" style="font-size:0.85rem;">${s.number}${s.suffix} - ${esc(s.label)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-stat" data-index="${i}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-stat" data-index="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  return `
    <div class="admin-card">
      <div class="admin-card-header"><h3>Mạng xã hội (Socials)</h3></div>
      <div class="form-row">
        <div class="form-group"><label>Facebook</label><input type="text" value="${esc(g.socialLinks.facebook)}" data-bind="general.socialLinks.facebook" /></div>
        <div class="form-group"><label>Instagram</label><input type="text" value="${esc(g.socialLinks.instagram)}" data-bind="general.socialLinks.instagram" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>TikTok</label><input type="text" value="${esc(g.socialLinks.tiktok)}" data-bind="general.socialLinks.tiktok" /></div>
        <div class="form-group"><label>YouTube</label><input type="text" value="${esc(g.socialLinks.youtube)}" data-bind="general.socialLinks.youtube" /></div>
      </div>
    </div>

    <div class="admin-card" style="margin-top:24px;">
      <div class="admin-card-header"><h3>Footer (Mô tả, Địa chỉ, Liên hệ)</h3></div>
      <div class="form-group">
        <label>Mô tả (About)</label>
        <textarea data-bind="footer.description" style="min-height:80px;">${esc(f.description || '')}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Địa chỉ</label><input type="text" value="${esc(f.address || '')}" data-bind="footer.address" /></div>
        <div class="form-group"><label>Email</label><input type="text" value="${esc(f.email || '')}" data-bind="footer.email" /></div>
      </div>
      <div class="form-group"><label>Số điện thoại</label><input type="text" value="${esc(f.phone || '')}" data-bind="footer.phone" /></div>
    </div>

    <div class="admin-card" style="margin-top:24px;">
      <div class="admin-card-header">
        <h3>Hero Banner Slider (${(h.hero.banners||[]).length})</h3>
        <button class="btn-add" data-action="add-banner"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${banners}</div>
    </div>
    
    <div class="admin-card" style="margin-top:24px;">
      <div class="admin-card-header">
        <h3>Số liệu (Home Stats - ${(h.stats?.items||[]).length})</h3>
        <button class="btn-add" data-action="add-stat"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${statItems}</div>
    </div>
  `;
}

export function renderAbout(siteData, esc) {
  const a = siteData.about;
  const blocks = (a.blocks || []).map((b, i) => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-title"><i class="${b.icon}" style="margin-right:8px;color:var(--gold-primary);"></i> ${esc(b.title)}</div>
        <div class="admin-item-sub">${esc(b.content).substring(0,60)}...</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-about-block" data-index="${i}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-about-block" data-index="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  const benefits = (a.benefits?.items || []).map((b, i) => `
    <div class="admin-item">
      <img src="${b.image}" alt="" class="admin-item-thumb"/>
      <div class="admin-item-info">
        <div class="admin-item-title">${esc(b.title)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-benefit" data-index="${i}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-benefit" data-index="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  return `
    <div class="admin-card">
      <div class="admin-card-header"><h3>Quote Hero</h3></div>
      <div class="form-group">
        <label>Quote chính</label>
        <textarea data-bind="about.quote">${esc(a.quote)}</textarea>
      </div>
      <div class="form-group">
        <label>Giới thiệu</label>
        <textarea data-bind="about.introText">${esc(a.introText)}</textarea>
      </div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Khối thông tin (${(a.blocks||[]).length})</h3>
        <button class="btn-add" data-action="add-about-block"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${blocks}</div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header"><h3>Quyền lợi CSG-er</h3></div>
      <div class="form-group">
        <label>Tiêu đề section</label>
        <input type="text" value="${esc(a.benefits?.title || '')}" data-bind="about.benefits.title" />
      </div>
      <div class="admin-item-list">${benefits}</div>
      <button class="btn-add" data-action="add-benefit" style="margin-top:12px;"><i class="fas fa-plus"></i> Thêm quyền lợi</button>
    </div>
  `;
}

// Actions Handler
export function handleSettingsAction(action, index, siteData, showModal, renderSection) {
  switch (action) {
    case 'add-banner': showBannerModal(undefined, siteData, showModal, renderSection); break;
    case 'edit-banner': showBannerModal(index, siteData, showModal, renderSection); break;
    case 'delete-banner':
      if(confirm('Xóa banner này?')) { siteData.home.hero.banners.splice(index, 1); renderSection('general'); }
      break;

    case 'add-stat': showStatModal(undefined, siteData, showModal, renderSection); break;
    case 'edit-stat': showStatModal(index, siteData, showModal, renderSection); break;
    case 'delete-stat':
      if(confirm('Xóa thông số này?')) { siteData.home.stats.items.splice(index, 1); renderSection('general'); }
      break;

    case 'add-about-block': showAboutBlockModal(undefined, siteData, showModal, renderSection); break;
    case 'edit-about-block': showAboutBlockModal(index, siteData, showModal, renderSection); break;
    case 'delete-about-block':
      if (confirm('Xóa khối thông tin này?')) { siteData.about.blocks.splice(index, 1); renderSection('about'); }
      break;

    case 'add-benefit': showBenefitModal(undefined, siteData, showModal, renderSection); break;
    case 'edit-benefit': showBenefitModal(index, siteData, showModal, renderSection); break;
    case 'delete-benefit':
      if (confirm('Xóa quyền lợi này?')) { siteData.about.benefits.items.splice(index, 1); renderSection('about'); }
      break;
      
    // Footer dynamic arrays if exist (was gallery but gallery removed in HTML? Let's leave handle if any)
  }
}

function showBannerModal(index, siteData, showModal, renderSection) {
  const b = index !== undefined ? siteData.home.hero.banners[index] : {};
  showModal(index !== undefined ? 'Sửa banner' : 'Thêm banner', [
    { key: 'bgImage', label: 'Hình nền Banner', value: b.bgImage, type: 'image', folder: 'general' },
    { key: 'link', label: 'Đường dẫn đích khi click', value: b.link }
  ], (vals) => {
    if (index !== undefined) {
      siteData.home.hero.banners[index] = vals;
    } else {
      if (!siteData.home.hero.banners) siteData.home.hero.banners = [];
      siteData.home.hero.banners.push(vals);
    }
    renderSection('general');
  });
}

function showStatModal(index, siteData, showModal, renderSection) {
  const s = index !== undefined ? siteData.home.stats.items[index] : {};
  showModal(index !== undefined ? 'Sửa số liệu' : 'Thêm số liệu', [
    { key: 'number', label: 'Số', value: s.number?.toString() || '', type: 'number' },
    { key: 'suffix', label: 'Hậu tố (+, ...)', value: s.suffix },
    { key: 'label', label: 'Nhãn', value: s.label }
  ], (vals) => {
    const stat = { number: parseInt(vals.number) || 0, suffix: vals.suffix || '', label: vals.label || '' };
    if (index !== undefined) {
      siteData.home.stats.items[index] = stat;
    } else {
      siteData.home.stats.items.push(stat);
    }
    renderSection('general');
  });
}

function showAboutBlockModal(index, siteData, showModal, renderSection) {
  const b = index !== undefined ? siteData.about.blocks[index] : {};
  const iconPreview = b.icon ? `<i class="${b.icon}" style="margin-right:8px;"></i>` : '';
  showModal(index !== undefined ? 'Sửa khối' : 'Thêm khối', [
    { key: 'icon', label: `Icon class ${iconPreview} (VD: fas fa-rocket, fas fa-university, fas fa-gem)`, value: b.icon },
    { key: 'title', label: 'Tiêu đề', value: b.title },
    { key: 'content', label: 'Nội dung', value: b.content, type: 'textarea' }
  ], (vals) => {
    if (index !== undefined) {
      siteData.about.blocks[index] = vals;
    } else {
      if (!siteData.about.blocks) siteData.about.blocks = [];
      siteData.about.blocks.push(vals);
    }
    renderSection('about');
  });
}

function showBenefitModal(index, siteData, showModal, renderSection) {
  const b = index !== undefined ? siteData.about.benefits.items[index] : {};
  showModal(index !== undefined ? 'Sửa quyền lợi' : 'Thêm quyền lợi', [
    { key: 'title', label: 'Tiêu đề', value: b.title },
    { key: 'description', label: 'Mô tả', value: b.description, type: 'textarea' },
    { key: 'image', label: 'Ảnh Minh họa', value: b.image, type: 'image', folder: 'general' }
  ], (vals) => {
    if (index !== undefined) {
      siteData.about.benefits.items[index] = vals;
    } else {
      if (!siteData.about.benefits.items) siteData.about.benefits.items = [];
      siteData.about.benefits.items.push(vals);
    }
    renderSection('about');
  });
}
