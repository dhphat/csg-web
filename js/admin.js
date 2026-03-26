// ===== Admin Panel JavaScript =====
import DataManager from './data-manager.js';

let siteData = null;
let currentSection = 'general';

document.addEventListener('DOMContentLoaded', () => {
  siteData = DataManager.get();
  initSidebar();
  initTopActions();
  renderSection('general');
});

// ===== Sidebar Navigation =====
function initSidebar() {
  const links = document.querySelectorAll('.sidebar-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      currentSection = link.dataset.section;
      document.getElementById('admin-page-title').textContent = link.textContent.trim();
      renderSection(currentSection);
    });
  });

  // Mobile toggle
  const toggle = document.getElementById('admin-menu-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  toggle?.addEventListener('click', () => sidebar.classList.toggle('open'));

  // Close sidebar on section click (mobile)
  links.forEach(link => {
    link.addEventListener('click', () => sidebar.classList.remove('open'));
  });
}

// ===== Top Actions =====
function initTopActions() {
  // Save
  document.getElementById('btn-save')?.addEventListener('click', () => {
    if (DataManager.save(siteData)) {
      showToast('Đã lưu thành công!', 'success');
    } else {
      showToast('Lưu thất bại!', 'error');
    }
  });

  // Export
  document.getElementById('btn-export')?.addEventListener('click', () => {
    const json = DataManager.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `csg-data-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất file JSON!', 'success');
  });

  // Import
  document.getElementById('btn-import')?.addEventListener('click', () => {
    document.getElementById('import-file').click();
  });

  document.getElementById('import-file')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (DataManager.importJSON(ev.target.result)) {
        siteData = DataManager.get();
        renderSection(currentSection);
        showToast('Đã import thành công!', 'success');
      } else {
        showToast('File JSON không hợp lệ!', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // Reset
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn reset về mặc định? Tất cả thay đổi sẽ bị mất.')) {
      siteData = DataManager.reset();
      renderSection(currentSection);
      showToast('Đã reset về mặc định!', 'success');
    }
  });
}

// ===== Render Section =====
function renderSection(section) {
  const content = document.getElementById('admin-content');
  switch (section) {
    case 'general': content.innerHTML = renderGeneral(); break;
    case 'projects': content.innerHTML = renderProjects(); break;
    case 'categories': content.innerHTML = renderCategories(); break;
    case 'departments': content.innerHTML = renderDepartments(); break;
    case 'halloffame': content.innerHTML = renderHallOfFame(); break;
    case 'members': content.innerHTML = renderMembers(); break;
    case 'achievements': content.innerHTML = renderAchievements(); break;
    case 'sponsors': content.innerHTML = renderSponsors(); break;
    case 'about': content.innerHTML = renderAbout(); break;
    case 'footer': content.innerHTML = renderFooter(); break;
    case 'home': content.innerHTML = renderHome(); break;
    default: content.innerHTML = '<p>Section not found</p>';
  }
  bindSectionEvents(section);
}

// ===== GENERAL =====
function renderGeneral() {
  const g = siteData.general;
  return `
    <div class="admin-card">
      <div class="admin-card-header"><h3>Social Links</h3></div>
      <div class="form-row">
        <div class="form-group">
          <label>Facebook</label>
          <input type="text" value="${esc(g.socialLinks.facebook)}" data-bind="general.socialLinks.facebook" />
        </div>
        <div class="form-group">
          <label>Instagram</label>
          <input type="text" value="${esc(g.socialLinks.instagram)}" data-bind="general.socialLinks.instagram" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>TikTok</label>
          <input type="text" value="${esc(g.socialLinks.tiktok)}" data-bind="general.socialLinks.tiktok" />
        </div>
        <div class="form-group">
          <label>YouTube</label>
          <input type="text" value="${esc(g.socialLinks.youtube)}" data-bind="general.socialLinks.youtube" />
        </div>
      </div>
    </div>
  `;
}

// ===== PROJECTS (exclude Chuyên mục) =====
function renderProjects() {
  const realProjects = siteData.projects.filter(p => p.year !== 'Chuyên mục');
  const items = realProjects.map((p) => {
    const idx = siteData.projects.indexOf(p);
    const milestones = (p.milestones || []).map((m, mi) => `
      <div class="admin-item" style="padding:4px 8px;">
        <div class="admin-item-info"><div class="admin-item-sub">${esc(m.label)}: <strong>${esc(m.date)}</strong></div></div>
        <div class="admin-item-actions">
          <button class="btn-icon" data-action="edit-milestone" data-index="${idx}" data-year="${mi}"><i class="fas fa-pen"></i></button>
          <button class="btn-icon danger" data-action="delete-milestone" data-index="${idx}" data-year="${mi}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('');
    const links = (p.links || (p.link ? [{url: p.link, label: 'Liên kết dự án'}] : [])).map((l, li) => `
      <div class="admin-item" style="padding:4px 8px;">
        <div class="admin-item-info"><div class="admin-item-sub"><a href="${l.url}" target="_blank" style="color:var(--gold-primary);">${esc(l.label || l.url)}</a></div></div>
        <div class="admin-item-actions">
          <button class="btn-icon" data-action="edit-link" data-index="${idx}" data-year="${li}"><i class="fas fa-pen"></i></button>
          <button class="btn-icon danger" data-action="delete-link" data-index="${idx}" data-year="${li}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('');
    return `
    <div class="admin-card">
      <div class="admin-card-header">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${p.image}" style="width:48px;height:60px;object-fit:cover;border-radius:6px;" />
          <div><div class="admin-item-title">${esc(p.title)}</div><div class="admin-item-sub">${p.year} • ${p.category}${p.featured ? ' ⭐' : ''}${p.ongoing ? ' 🟢 Đang diễn ra' : ''}</div></div>
        </div>
        <div>
          <button class="btn-add" data-action="edit-project" data-index="${idx}"><i class="fas fa-pen"></i> Sửa</button>
          <button class="btn-icon danger" data-action="delete-project" data-index="${idx}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div style="padding:0 16px 12px;display:flex;gap:24px;flex-wrap:wrap;">
        <div style="flex:1;min-width:250px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;"><strong style="font-size:0.8rem;color:var(--text-secondary);">Mốc thời gian (${(p.milestones||[]).length})</strong><button class="btn-add" data-action="add-milestone" data-index="${idx}" style="padding:2px 8px;font-size:0.75rem;"><i class="fas fa-plus"></i></button></div>
          <div class="admin-item-list" style="border:1px solid var(--border-color);border-radius:6px;">${milestones || '<p style="padding:8px;color:var(--text-muted);font-size:0.8rem;">Chưa có</p>'}</div>
        </div>
        <div style="flex:1;min-width:250px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;"><strong style="font-size:0.8rem;color:var(--text-secondary);">Liên kết (${(p.links||[]).length || (p.link ? 1 : 0)})</strong><button class="btn-add" data-action="add-link" data-index="${idx}" style="padding:2px 8px;font-size:0.75rem;"><i class="fas fa-plus"></i></button></div>
          <div class="admin-item-list" style="border:1px solid var(--border-color);border-radius:6px;">${links || '<p style="padding:8px;color:var(--text-muted);font-size:0.8rem;">Chưa có</p>'}</div>
        </div>
      </div>
    </div>`;
  }).join('');

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <h3>Dự án (${realProjects.length})</h3>
      <button class="btn-add" data-action="add-project"><i class="fas fa-plus"></i> Thêm dự án</button>
    </div>
    ${items}
  `;
}

// ===== CATEGORIES (Chuyên mục) =====
function renderCategories() {
  const cats = siteData.projects.filter(p => p.year === 'Chuyên mục');
  const items = cats.map((c) => {
    const idx = siteData.projects.indexOf(c);
    return `
    <div class="admin-item">
      <img src="${c.image}" alt="${esc(c.title)}" class="admin-item-thumb" />
      <div class="admin-item-info">
        <div class="admin-item-title">${esc(c.title)}</div>
        <div class="admin-item-sub">${esc(c.subtitle || '')}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-project" data-index="${idx}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-project" data-index="${idx}"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');

  return `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Chuyên mục (${cats.length})</h3>
        <button class="btn-add" data-action="add-category"><i class="fas fa-plus"></i> Thêm chuyên mục</button>
      </div>
      <div class="admin-item-list">${items}</div>
    </div>
  `;
}

// ===== DEPARTMENTS =====
function renderDepartments() {
  const deptCards = siteData.departments.map((d, di) => {
    const teamsHtml = (d.teams || []).map((t, ti) => {
      const membersHtml = (t.members || []).map((m, mi) => `
        <div class="admin-item" style="padding:2px 8px;">
          <div class="admin-item-info"><div class="admin-item-sub">${esc(m.name)} - <em>${esc(m.role)}</em></div></div>
          <div class="admin-item-actions">
            <button class="btn-icon" data-action="edit-team-member" data-index="${di}" data-year="${ti}" data-cat="${mi}"><i class="fas fa-pen"></i></button>
            <button class="btn-icon danger" data-action="delete-team-member" data-index="${di}" data-year="${ti}" data-cat="${mi}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `).join('');
      return `
      <div style="background:rgba(255,255,255,0.02);border:1px solid var(--border-color);border-radius:8px;padding:12px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:10px;"><img src="${t.image}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;" /><strong>${esc(t.name)}</strong></div>
          <div>
            <button class="btn-icon" data-action="edit-team" data-index="${di}" data-year="${ti}"><i class="fas fa-pen"></i></button>
            <button class="btn-icon" data-action="add-team-member" data-index="${di}" data-year="${ti}"><i class="fas fa-user-plus"></i></button>
            <button class="btn-icon danger" data-action="delete-team" data-index="${di}" data-year="${ti}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="admin-item-list">${membersHtml || '<p style="padding:4px;color:var(--text-muted);font-size:0.8rem;">Chưa có thành viên</p>'}</div>
      </div>`;
    }).join('');

    return `
      <div class="admin-card">
        <div class="admin-card-header">
          <div style="display:flex;align-items:center;gap:12px;">
            ${d.image ? `<img src="${d.image}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;" />` : ''}
            <h3>${esc(d.name)}</h3>
          </div>
          <div>
            <button class="btn-add" data-action="edit-dept" data-index="${di}"><i class="fas fa-pen"></i> Sửa</button>
            <button class="btn-add" data-action="add-team" data-index="${di}"><i class="fas fa-plus"></i> Thêm team</button>
            <button class="btn-icon danger" data-action="delete-dept" data-index="${di}" style="margin-left:8px;"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div style="padding:0 16px 16px;">${teamsHtml || '<p style="color:var(--text-muted);">Chưa có team</p>'}</div>
      </div>
    `;
  }).join('');
  return `
    ${deptCards}
    <button class="btn-add" data-action="add-dept" style="width:100%;justify-content:center;padding:12px;"><i class="fas fa-plus"></i> Thêm Ban mới</button>
  `;
}

// ===== MEMBERS =====
function renderMembers() {
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

  // Board generations
  const generations = siteData.boardGenerations.map((gen, gi) => {
    const memberItems = gen.members.map((m, mi) => `
      <div class="admin-item">
        <img src="${m.photo}" alt="${esc(m.name)}" class="admin-item-thumb" />
        <div class="admin-item-info">
          <div class="admin-item-title">${esc(m.name)}</div>
          <div class="admin-item-sub">${esc(m.role)} • ${esc(m.gen)}</div>
        </div>
        <div class="admin-item-actions">
          <button class="btn-icon" data-action="edit-board-member" data-year="${gi}" data-index="${mi}"><i class="fas fa-pen"></i></button>
          <button class="btn-icon danger" data-action="delete-board-member" data-year="${gi}" data-index="${mi}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('');

    return `
      <div class="admin-card">
        <div class="admin-card-header">
          <h3>Ban chủ nhiệm: ${gen.term} (${gen.members.length})</h3>
          <div>
            <button class="btn-add" data-action="edit-board-gen" data-year="${gi}"><i class="fas fa-pen"></i> Sửa nhiệm kỳ</button>
            <button class="btn-add" data-action="add-board-member" data-year="${gi}"><i class="fas fa-plus"></i> Thêm TV</button>
          </div>
        </div>
        <div class="admin-item-list">${memberItems}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Chủ nhiệm qua các thời kỳ (${(siteData.presidents||[]).length})</h3>
        <button class="btn-add" data-action="add-president"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${presidents}</div>
    </div>
    ${generations}
    <button class="btn-add" data-action="add-board-gen" style="width:100%;justify-content:center;padding:12px;"><i class="fas fa-plus"></i> Thêm nhiệm kỳ mới</button>
  `;
}

// ===== ACHIEVEMENTS =====
function renderAchievements() {
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

  // Media Ecosystem
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

  // Collaborators
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
        <h3>Giải thưởng CLB Xuất sắc (${siteData.awards.length})</h3>
        <button class="btn-add" data-action="add-award"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${awards}</div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header"><h3>Hệ sinh thái truyền thông</h3></div>
      <div class="form-group">
        <label>Tổng lượt theo dõi</label>
        <input type="text" value="${esc(eco.totalFollowers)}" data-bind="mediaEcosystem.totalFollowers" />
      </div>
      <div class="admin-card-header" style="margin-top:16px;"><h3>Kênh truyền thông (${(eco.channels||[]).length})</h3><button class="btn-add" data-action="add-eco-channel"><i class="fas fa-plus"></i> Thêm</button></div>
      <div class="admin-item-list">${ecoChannels}</div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Đã hợp tác cùng (${(siteData.collaborators||[]).length})</h3>
        <button class="btn-add" data-action="add-collaborator"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${collabs}</div>
    </div>
  `;
}

// ===== SPONSORS =====
function renderSponsors() {
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

// ===== ABOUT =====
function renderAbout() {
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

// ===== FOOTER =====
function renderFooter() {
  const f = siteData.footer;
  return `
    <div class="admin-card">
      <div class="admin-card-header"><h3>Thông tin chung</h3></div>
      <div class="form-group">
        <label>Mô tả</label>
        <textarea data-bind="footer.description">${esc(f.description)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Địa chỉ</label>
          <input type="text" value="${esc(f.address || '')}" data-bind="footer.address" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="text" value="${esc(f.email || '')}" data-bind="footer.email" />
        </div>
      </div>
      <div class="form-group">
        <label>Số điện thoại</label>
        <input type="text" value="${esc(f.phone || '')}" data-bind="footer.phone" />
      </div>
    </div>
  `;
}

function renderFooterList(title, key, items) {
  const list = items.map((item, i) => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-title">${esc(item.name)}</div>
        <div class="admin-item-sub">${esc(item.email || '')} • ${esc(item.phone || '')}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-footer-item" data-key="${key}" data-index="${i}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-footer-item" data-key="${key}" data-index="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  return `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>${title} (${items.length})</h3>
        <button class="btn-add" data-action="add-footer-item" data-key="${key}"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${list}</div>
    </div>
  `;
}

// ===== HOME =====
function renderHome() {
  const h = siteData.home;

  // Banners list
  const banners = (h.hero.banners || []).map((b, i) => `
    <div class="admin-item">
      <img src="${b.bgImage}" alt="Banner" class="admin-item-thumb" />
      <div class="admin-item-info">
        <div class="admin-item-title">Banner ${i + 1}</div>
        <div class="admin-item-sub">${esc(b.link)}</div>
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
        <div class="admin-item-title">${s.number}${s.suffix} - ${esc(s.label)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon" data-action="edit-stat" data-index="${i}"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" data-action="delete-stat" data-index="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  return `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Hero Banner Slider (${(h.hero.banners||[]).length})</h3>
        <button class="btn-add" data-action="add-banner"><i class="fas fa-plus"></i> Thêm banner</button>
      </div>
      <div class="admin-item-list">${banners}</div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Số liệu (${(h.stats?.items||[]).length})</h3>
        <button class="btn-add" data-action="add-stat"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${statItems}</div>
    </div>
  `;
}

// ===== HALL OF FAME =====
function renderHallOfFame() {
  const hof = siteData.hallOfFame || { individuals: { yearly: [], semesters: [] }, collectives: { yearly: [], semesters: [] } };

  function renderHofSection(type, label) {
    const section = hof[type] || { yearly: [], semesters: [] };
    
    // Yearly
    const yearlyCards = (section.yearly || []).map((yr, yi) => {
      const cats = (yr.categories || []).map((cat, ci) => {
        const members = (cat.members || []).map((m, mi) => `
          <div class="admin-item">
            <img src="${m.image}" class="admin-item-thumb" />
            <div class="admin-item-info"><div class="admin-item-title">${esc(m.recipient)}</div></div>
            <div class="admin-item-actions">
              <button class="btn-icon" data-action="edit-hof-member" data-type="${type}" data-period="yearly" data-year="${yi}" data-cat="${ci}" data-index="${mi}"><i class="fas fa-pen"></i></button>
              <button class="btn-icon danger" data-action="delete-hof-member" data-type="${type}" data-period="yearly" data-year="${yi}" data-cat="${ci}" data-index="${mi}"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `).join('');
        return `<div style="margin-bottom:16px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><strong style="color:var(--text-gold);font-size:0.85rem;">${esc(cat.name)}</strong><button class="btn-icon" data-action="edit-hof-cat" data-type="${type}" data-period="yearly" data-year="${yi}" data-cat="${ci}" style="padding:2px;"><i class="fas fa-pen" style="font-size:0.65rem;"></i></button><button class="btn-icon danger" data-action="delete-hof-cat" data-type="${type}" data-period="yearly" data-year="${yi}" data-cat="${ci}" style="padding:2px;"><i class="fas fa-trash" style="font-size:0.65rem;"></i></button></div><div class="admin-item-list">${members}</div><button class="btn-add" data-action="add-hof-member" data-type="${type}" data-period="yearly" data-year="${yi}" data-cat="${ci}" style="margin-top:4px;"><i class="fas fa-plus"></i> Thêm</button></div>`;
      }).join('');
      return `
        <div class="admin-card">
          <div class="admin-card-header"><h3>${label} - Năm ${esc(yr.year)}</h3>
            <button class="btn-add" data-action="add-hof-cat" data-type="${type}" data-period="yearly" data-year="${yi}"><i class="fas fa-plus"></i> Thêm danh hiệu</button></div>
          ${cats}
        </div>`;
    }).join('');

    // Semesters
    const semCards = (section.semesters || []).map((sem, si) => {
      const cats = (sem.categories || []).map((cat, ci) => {
        const members = (cat.members || []).map((m, mi) => `
          <div class="admin-item">
            <img src="${m.image}" class="admin-item-thumb" />
            <div class="admin-item-info"><div class="admin-item-title">${esc(m.recipient)}</div></div>
            <div class="admin-item-actions">
              <button class="btn-icon" data-action="edit-hof-member" data-type="${type}" data-period="semesters" data-year="${si}" data-cat="${ci}" data-index="${mi}"><i class="fas fa-pen"></i></button>
              <button class="btn-icon danger" data-action="delete-hof-member" data-type="${type}" data-period="semesters" data-year="${si}" data-cat="${ci}" data-index="${mi}"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `).join('');
        return `<div style="margin-bottom:16px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><strong style="color:var(--text-gold);font-size:0.85rem;">${esc(cat.name)}</strong><button class="btn-icon" data-action="edit-hof-cat" data-type="${type}" data-period="semesters" data-year="${si}" data-cat="${ci}" style="padding:2px;"><i class="fas fa-pen" style="font-size:0.65rem;"></i></button><button class="btn-icon danger" data-action="delete-hof-cat" data-type="${type}" data-period="semesters" data-year="${si}" data-cat="${ci}" style="padding:2px;"><i class="fas fa-trash" style="font-size:0.65rem;"></i></button></div><div class="admin-item-list">${members}</div><button class="btn-add" data-action="add-hof-member" data-type="${type}" data-period="semesters" data-year="${si}" data-cat="${ci}" style="margin-top:4px;"><i class="fas fa-plus"></i> Thêm</button></div>`;
      }).join('');
      return `
        <div class="admin-card">
          <div class="admin-card-header"><h3>${label} - ${esc(sem.semester)}</h3>
            <button class="btn-add" data-action="add-hof-cat" data-type="${type}" data-period="semesters" data-year="${si}"><i class="fas fa-plus"></i> Thêm danh hiệu</button></div>
          ${cats}
        </div>`;
    }).join('');

    return `
      <h2 style="color:var(--text-primary);font-size:1.2rem;margin:24px 0 12px;text-transform:uppercase;letter-spacing:1px;">${label}</h2>
      ${yearlyCards}
      <button class="btn-add" data-action="add-hof-year" data-type="${type}" style="width:100%;justify-content:center;padding:8px;margin-bottom:16px;"><i class="fas fa-plus"></i> Thêm năm mới (${label})</button>
      ${semCards}
      <button class="btn-add" data-action="add-hof-sem" data-type="${type}" style="width:100%;justify-content:center;padding:8px;margin-bottom:24px;"><i class="fas fa-plus"></i> Thêm học kỳ mới (${label})</button>
    `;
  }

  return renderHofSection('individuals', 'Cá nhân') + renderHofSection('collectives', 'Tập thể');
}

// ===== Bind Events =====
function bindSectionEvents(section) {
  // Auto-bind data inputs
  document.querySelectorAll('[data-bind]').forEach(el => {
    const event = el.tagName === 'TEXTAREA' ? 'input' : 'change';
    el.addEventListener(event, () => {
      setNestedValue(siteData, el.dataset.bind, el.value);
    });
    // Also bind on blur for inputs
    if (el.tagName === 'INPUT') {
      el.addEventListener('input', () => {
        setNestedValue(siteData, el.dataset.bind, el.value);
      });
    }
  });

  // Action buttons
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => handleAction(btn.dataset));
  });
}

// ===== Action Handler =====
function handleAction(dataset) {
  const { action, index, key, year } = dataset;
  const i = parseInt(index);
  const yi = parseInt(year);

  switch (action) {
    // Projects
    case 'add-project': showProjectModal(); break;
    case 'edit-project': showProjectModal(i); break;
    case 'delete-project':
      if (confirm('Xóa dự án này?')) { siteData.projects.splice(i, 1); renderSection('projects'); }
      break;

    // Departments
    case 'add-dept': showDeptModal(); break;
    case 'edit-dept': showDeptModal(i); break;
    case 'delete-dept':
      if (confirm('Xóa ban này?')) { siteData.departments.splice(i, 1); renderSection('departments'); }
      break;

    // Hall Of Fame (new structure)
    case 'add-hof-member': {
      const { type, period, year: yi2, cat } = dataset;
      showHOFMemberModal(type, period, parseInt(yi2), parseInt(cat));
      break;
    }
    case 'edit-hof-member': {
      const { type, period, year: yi2, cat } = dataset;
      showHOFMemberModal(type, period, parseInt(yi2), parseInt(cat), i);
      break;
    }
    case 'delete-hof-member': {
      const { type, period, year: yi2, cat } = dataset;
      if (confirm('Xóa?')) {
        siteData.hallOfFame[type][period][parseInt(yi2)].categories[parseInt(cat)].members.splice(i, 1);
        renderSection('halloffame');
      }
      break;
    }
    case 'add-hof-cat': {
      const { type, period, year: yi2 } = dataset;
      showSimpleModal('Tên danh hiệu', '', (val) => {
        siteData.hallOfFame[type][period][parseInt(yi2)].categories.push({ name: val, members: [] });
        renderSection('halloffame');
      });
      break;
    }
    case 'add-hof-year': {
      const { type } = dataset;
      showSimpleModal('Năm (VD: 2024)', '', (val) => {
        if (!siteData.hallOfFame[type].yearly) siteData.hallOfFame[type].yearly = [];
        siteData.hallOfFame[type].yearly.push({ year: val, categories: [] });
        renderSection('halloffame');
      });
      break;
    }
    case 'add-hof-sem': {
      const { type } = dataset;
      showSimpleModal('Tên học kỳ (VD: Spring 2024)', '', (val) => {
        if (!siteData.hallOfFame[type].semesters) siteData.hallOfFame[type].semesters = [];
        siteData.hallOfFame[type].semesters.push({ semester: val, categories: [] });
        renderSection('halloffame');
      });
      break;
    }

    // Presidents
    case 'add-president': showPresidentModal(); break;
    case 'edit-president': showPresidentModal(i); break;
    case 'delete-president':
      if (confirm('Xóa?')) { siteData.presidents.splice(i, 1); renderSection('members'); }
      break;

    // Board Members
    case 'add-board-gen': showSimpleModal('Tên nhiệm kỳ (VD: Kỳ gần nhất)', '', (val) => { siteData.boardGenerations.unshift({ term: val, members: [] }); renderSection('members'); }); break;
    case 'edit-board-gen': showSimpleModal('Sửa tên nhiệm kỳ', siteData.boardGenerations[yi].term, (val) => { siteData.boardGenerations[yi].term = val; renderSection('members'); }); break;
    case 'add-board-member': showMemberModal(null, yi); break;
    case 'edit-board-member': showMemberModal(i, yi); break;
    case 'delete-board-member':
      if (confirm('Xóa?')) { siteData.boardGenerations[yi].members.splice(i, 1); renderSection('members'); }
      break;

    // Teams (Department)
    case 'add-team': showTeamModal(i); break;
    case 'edit-team': showTeamModal(i, yi); break;
    case 'delete-team':
      if (confirm('Xóa team này?')) { siteData.departments[i].teams.splice(yi, 1); renderSection('departments'); }
      break;

    // Awards
    case 'add-award': showAwardModal(); break;
    case 'edit-award': showAwardModal(i); break;
    case 'delete-award':
      if (confirm('Xóa?')) { siteData.awards.splice(i, 1); renderSection('achievements'); }
      break;

    // Sponsors
    case 'add-sponsor': showSponsorModal(); break;
    case 'edit-sponsor': showSponsorModal(i); break;
    case 'delete-sponsor':
      if (confirm('Xóa?')) { siteData.sponsors.splice(i, 1); renderSection('sponsors'); }
      break;

    // About blocks
    case 'add-about-block': showAboutBlockModal(); break;
    case 'edit-about-block': showAboutBlockModal(i); break;
    case 'delete-about-block':
      if (confirm('Xóa?')) { siteData.about.blocks.splice(i, 1); renderSection('about'); }
      break;

    // Benefits
    case 'add-benefit': showBenefitModal(); break;
    case 'edit-benefit': showBenefitModal(i); break;
    case 'delete-benefit':
      if (confirm('Xóa?')) { siteData.about.benefits.items.splice(i, 1); renderSection('about'); }
      break;

    // Footer items
    case 'add-footer-item': showFooterItemModal(key); break;
    case 'edit-footer-item': showFooterItemModal(key, i); break;
    case 'delete-footer-item':
      if (confirm('Xóa?')) { siteData.footer[key].splice(i, 1); renderSection('footer'); }
      break;

    // Gallery
    case 'add-gallery': showGalleryModal(); break;
    case 'edit-gallery': showGalleryModal(i); break;
    case 'delete-gallery':
      if (confirm('Xóa?')) { siteData.home.gallery.items.splice(i, 1); renderSection('home'); }
      break;

    // Stats
    case 'add-stat': showStatModal(); break;
    case 'edit-stat': showStatModal(i); break;
    case 'delete-stat':
      if (confirm('Xóa?')) { siteData.home.stats.items.splice(i, 1); renderSection('home'); }
      break;

    // Banners
    case 'add-banner': showBannerModal(); break;
    case 'edit-banner': showBannerModal(i); break;
    case 'delete-banner':
      if (confirm('Xóa banner này?')) { siteData.home.hero.banners.splice(i, 1); renderSection('home'); }
      break;

    // Media Ecosystem Channels
    case 'add-eco-channel': showEcoChannelModal(); break;
    case 'edit-eco-channel': showEcoChannelModal(i); break;
    case 'delete-eco-channel':
      if (confirm('Xóa kênh này?')) { siteData.mediaEcosystem.channels.splice(i, 1); renderSection('achievements'); }
      break;

    // Collaborators
    case 'add-collaborator': showCollaboratorModal(); break;
    case 'edit-collaborator': showCollaboratorModal(i); break;
    case 'delete-collaborator':
      if (confirm('Xóa?')) { siteData.collaborators.splice(i, 1); renderSection('achievements'); }
      break;

    // Category (Chuyên mục) - adds with year='Chuyên mục'
    case 'add-category': showCategoryModal(); break;

    // HoF Category edit/delete
    case 'edit-hof-cat': {
      const { type, period, year: yi2, cat } = dataset;
      const catObj = siteData.hallOfFame[type][period][parseInt(yi2)].categories[parseInt(cat)];
      showSimpleModal('Sửa tên danh hiệu', catObj.name, (val) => {
        catObj.name = val;
        renderSection('halloffame');
      });
      break;
    }
    case 'delete-hof-cat': {
      const { type, period, year: yi2, cat } = dataset;
      if (confirm('Xóa danh hiệu này và tất cả người nhận?')) {
        siteData.hallOfFame[type][period][parseInt(yi2)].categories.splice(parseInt(cat), 1);
        renderSection('halloffame');
      }
      break;
    }

    // Milestones
    case 'add-milestone': showMilestoneModal(i); break;
    case 'edit-milestone': showMilestoneModal(i, yi); break;
    case 'delete-milestone':
      if (confirm('Xóa mốc này?')) { siteData.projects[i].milestones.splice(yi, 1); renderSection('projects'); }
      break;

    // Links
    case 'add-link': showLinkModal(i); break;
    case 'edit-link': showLinkModal(i, yi); break;
    case 'delete-link': {
      if (confirm('Xóa liên kết?')) {
        const proj = siteData.projects[i];
        if (proj.links) { proj.links.splice(yi, 1); }
        else if (proj.link) { delete proj.link; }
        renderSection('projects');
      }
      break;
    }

    // Team members
    case 'add-team-member': showTeamMemberModal(i, yi); break;
    case 'edit-team-member': {
      const ci2 = parseInt(dataset.cat);
      showTeamMemberModal(i, yi, ci2);
      break;
    }
    case 'delete-team-member': {
      const ci2 = parseInt(dataset.cat);
      if (confirm('Xóa thành viên?')) {
        siteData.departments[i].teams[yi].members.splice(ci2, 1);
        renderSection('departments');
      }
      break;
    }
  }
}

// ===== Modals =====

function showModal(title, fields, onSave) {
  const existing = document.querySelector('.admin-modal-overlay');
  if (existing) existing.remove();

  const fieldsHtml = fields.map(f => {
    if (f.type === 'textarea') {
      return `<div class="form-group"><label>${f.label}</label><textarea id="modal-${f.key}">${esc(f.value || '')}</textarea></div>`;
    }
    if (f.type === 'checkbox') {
      return `<div class="form-group"><label><input type="checkbox" id="modal-${f.key}" ${f.value ? 'checked' : ''} /> ${f.label}</label></div>`;
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
        <button class="btn-primary" id="modal-save"><i class="fas fa-check"></i> Lưu</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#modal-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#modal-save').addEventListener('click', () => {
    const values = {};
    fields.forEach(f => {
      const el = document.getElementById(`modal-${f.key}`);
      values[f.key] = f.type === 'checkbox' ? el.checked : el.value;
    });
    onSave(values);
    overlay.remove();
  });
}

function showSimpleModal(title, value, onSave) {
  showModal(title, [{ key: 'value', label: 'Nội dung', value, type: 'text' }], (vals) => onSave(vals.value));
}

function showProjectModal(index) {
  const p = index !== undefined ? siteData.projects[index] : {};
  showModal(index !== undefined ? 'Sửa dự án' : 'Thêm dự án', [
    { key: 'id', label: 'ID (slug)', value: p.id },
    { key: 'title', label: 'Tên dự án', value: p.title },
    { key: 'subtitle', label: 'Phụ đề', value: p.subtitle },
    { key: 'year', label: 'Năm', value: p.year },
    { key: 'category', label: 'Thể loại', value: p.category },
    { key: 'image', label: 'Ảnh thẻ (URL)', value: p.image },
    { key: 'banner', label: 'Banner rộng (URL, nếu khác ảnh thẻ)', value: p.banner },
    { key: 'description', label: 'Mô tả', value: p.description, type: 'textarea' },
    { key: 'featured', label: 'Nổi bật', value: p.featured, type: 'checkbox' },
    { key: 'ongoing', label: 'Đang diễn ra', value: p.ongoing, type: 'checkbox' }
  ], (vals) => {
    const project = {
      ...p,
      id: vals.id || vals.title?.toLowerCase().replace(/\s+/g, '-') || 'new',
      title: vals.title || '',
      subtitle: vals.subtitle || '',
      year: vals.year || String(new Date().getFullYear()),
      category: vals.category || 'event',
      image: vals.image || '',
      banner: vals.banner || '',
      description: vals.description || '',
      featured: vals.featured,
      ongoing: vals.ongoing
    };
    if (index !== undefined) {
      siteData.projects[index] = project;
    } else {
      project.milestones = [];
      project.links = [];
      project.stats = {};
      project.gallery = [];
      siteData.projects.push(project);
    }
    renderSection('projects');
  });
}

function showDeptModal(index) {
  const d = index !== undefined ? siteData.departments[index] : {};
  showModal(index !== undefined ? 'Sửa Ban' : 'Thêm Ban', [
    { key: 'id', label: 'ID', value: d.id },
    { key: 'name', label: 'Tên Ban', value: d.name },
    { key: 'image', label: 'Ảnh Ban (URL)', value: d.image },
    { key: 'subDepts', label: 'Sub-departments (cách nhau bởi dấu phẩy)', value: (d.subDepts || []).join(', ') },
    { key: 'description', label: 'Mô tả', value: d.description, type: 'textarea' }
  ], (vals) => {
    const dept = {
      id: vals.id || vals.name?.toLowerCase().replace(/\s+/g, '-') || 'new',
      name: vals.name || '',
      image: vals.image || '',
      subDepts: vals.subDepts ? vals.subDepts.split(',').map(s => s.trim()).filter(Boolean) : [],
      description: vals.description || '',
      teams: d.teams || []
    };
    if (index !== undefined) {
      siteData.departments[index] = dept;
    } else {
      siteData.departments.push(dept);
    }
    renderSection('departments');
  });
}

function showMemberModal(index, yearIndex) {
  const m = index !== null ? siteData.boardGenerations[yearIndex].members[index] : {};

  const fields = [
    { key: 'name', label: 'Họ tên', value: m.name },
    { key: 'role', label: 'Vai trò', value: m.role },
    { key: 'gen', label: 'Gen/Khóa', value: m.gen },
    { key: 'photo', label: 'Ảnh URL', value: m.photo }
  ];

  showModal(index !== null ? 'Sửa thành viên' : 'Thêm thành viên', fields, (vals) => {
    const member = { name: vals.name, role: vals.role, gen: vals.gen, photo: vals.photo };
    if (index !== null) siteData.boardGenerations[yearIndex].members[index] = member;
    else siteData.boardGenerations[yearIndex].members.push(member);
    renderSection('members');
  });
}

function showAwardModal(index) {
  const a = index !== undefined ? siteData.awards[index] : {};
  showModal(index !== undefined ? 'Sửa danh hiệu' : 'Thêm danh hiệu', [
    { key: 'title', label: 'Tiêu đề', value: a.title },
    { key: 'image', label: 'Ảnh Minh họa', value: a.image }
  ], (vals) => {
    if (index !== undefined) siteData.awards[index] = vals;
    else siteData.awards.push(vals);
    renderSection('achievements');
  });
}

function showHOFMemberModal(type, period, yi, ci, memberIdx) {
  const list = siteData.hallOfFame[type][period][yi].categories[ci].members;
  const m = memberIdx !== undefined ? list[memberIdx] : {};
  showModal(memberIdx !== undefined ? 'Sửa' : 'Thêm', [
    { key: 'recipient', label: 'Người/Tập thể nhận', value: m.recipient },
    { key: 'image', label: 'Ảnh URL', value: m.image }
  ], (vals) => {
    if (memberIdx !== undefined) { list[memberIdx] = vals; } else { list.push(vals); }
    renderSection('halloffame');
  });
}

function showSponsorModal(index) {
  const s = index !== undefined ? siteData.sponsors[index] : {};
  showModal(index !== undefined ? 'Sửa nhà tài trợ' : 'Thêm nhà tài trợ', [
    { key: 'name', label: 'Tên', value: s.name },
    { key: 'logo', label: 'Logo URL', value: s.logo }
  ], (vals) => {
    if (index !== undefined) {
      siteData.sponsors[index] = vals;
    } else {
      siteData.sponsors.push(vals);
    }
    renderSection('sponsors');
  });
}

function showAboutBlockModal(index) {
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

function showTeamModal(deptIndex, teamIndex) {
  const dept = siteData.departments[deptIndex];
  const t = teamIndex !== undefined ? dept.teams[teamIndex] : {};
  showModal(teamIndex !== undefined ? 'Sửa team' : 'Thêm team mới', [
    { key: 'name', label: 'Tên team', value: t.name },
    { key: 'image', label: 'Ảnh URL', value: t.image },
    { key: 'description', label: 'Mô tả', value: t.description, type: 'textarea' }
  ], (vals) => {
    const team = {
      name: vals.name || '',
      image: vals.image || '',
      description: vals.description || '',
      members: t.members || []
    };
    if (teamIndex !== undefined) {
      dept.teams[teamIndex] = team;
    } else {
      if (!dept.teams) dept.teams = [];
      dept.teams.push(team);
    }
    renderSection('departments');
  });
}

function showCategoryModal() {
  showModal('Thêm chuyên mục', [
    { key: 'id', label: 'ID (slug)', value: '' },
    { key: 'title', label: 'Tên chuyên mục', value: '' },
    { key: 'subtitle', label: 'Phụ đề', value: '' },
    { key: 'image', label: 'Ảnh URL', value: '' },
    { key: 'description', label: 'Mô tả', value: '', type: 'textarea' }
  ], (vals) => {
    siteData.projects.push({
      id: vals.id || vals.title?.toLowerCase().replace(/\s+/g, '-') || 'new',
      title: vals.title || '',
      subtitle: vals.subtitle || '',
      year: 'Chuyên mục',
      category: vals.id || 'category',
      image: vals.image || '',
      description: vals.description || '',
      stats: {},
      gallery: [],
      featured: false
    });
    renderSection('categories');
  });
}

function showMilestoneModal(projectIdx, milestoneIdx) {
  const p = siteData.projects[projectIdx];
  if (!p.milestones) p.milestones = [];
  const m = milestoneIdx !== undefined ? p.milestones[milestoneIdx] : {};
  showModal(milestoneIdx !== undefined ? 'Sửa mốc' : 'Thêm mốc thời gian', [
    { key: 'label', label: 'Tên mốc (VD: Khai mạc)', value: m.label },
    { key: 'date', label: 'Ngày (VD: 15/04/2024)', value: m.date }
  ], (vals) => {
    if (milestoneIdx !== undefined) { p.milestones[milestoneIdx] = vals; }
    else { p.milestones.push(vals); }
    renderSection('projects');
  });
}

function showLinkModal(projectIdx, linkIdx) {
  const p = siteData.projects[projectIdx];
  // Migrate old single link to links array
  if (!p.links && p.link) { p.links = [{url: p.link, label: 'Liên kết dự án'}]; delete p.link; }
  if (!p.links) p.links = [];
  const l = linkIdx !== undefined ? p.links[linkIdx] : {};
  showModal(linkIdx !== undefined ? 'Sửa liên kết' : 'Thêm liên kết', [
    { key: 'label', label: 'Tên hiển thị', value: l.label },
    { key: 'url', label: 'URL', value: l.url }
  ], (vals) => {
    if (linkIdx !== undefined) { p.links[linkIdx] = vals; }
    else { p.links.push(vals); }
    renderSection('projects');
  });
}

function showTeamMemberModal(deptIdx, teamIdx, memberIdx) {
  const team = siteData.departments[deptIdx].teams[teamIdx];
  if (!team.members) team.members = [];
  const m = memberIdx !== undefined ? team.members[memberIdx] : {};
  showModal(memberIdx !== undefined ? 'Sửa thành viên' : 'Thêm thành viên', [
    { key: 'name', label: 'Họ tên', value: m.name },
    { key: 'role', label: 'Vai trò', value: m.role }
  ], (vals) => {
    if (memberIdx !== undefined) { team.members[memberIdx] = vals; }
    else { team.members.push(vals); }
    renderSection('departments');
  });
}

function showPresidentModal(index) {
  const p = index !== undefined ? siteData.presidents[index] : {};
  showModal(index !== undefined ? 'Sửa chủ nhiệm' : 'Thêm chủ nhiệm', [
    { key: 'name', label: 'Họ tên', value: p.name },
    { key: 'gen', label: 'Chủ nhiệm đời thứ mấy', value: p.gen },
    { key: 'term', label: 'Nhiệm kỳ (VD: 2023 - 2024)', value: p.term },
    { key: 'photo', label: 'Ảnh URL', value: p.photo }
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

function showBenefitModal(index) {
  const b = index !== undefined ? siteData.about.benefits.items[index] : {};
  showModal(index !== undefined ? 'Sửa quyền lợi' : 'Thêm quyền lợi', [
    { key: 'title', label: 'Tiêu đề', value: b.title },
    { key: 'description', label: 'Mô tả', value: b.description, type: 'textarea' },
    { key: 'image', label: 'Ảnh URL', value: b.image }
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

function showFooterItemModal(key, index) {
  const item = index !== undefined ? siteData.footer[key][index] : {};
  showModal(index !== undefined ? 'Sửa mục' : 'Thêm mục', [
    { key: 'name', label: 'Tên', value: item.name },
    { key: 'description', label: 'Mô tả', value: item.description, type: 'textarea' },
    { key: 'email', label: 'Email', value: item.email },
    { key: 'phone', label: 'SĐT', value: item.phone },
    { key: 'socialFb', label: 'Facebook URL', value: item.socialFb },
    { key: 'socialIg', label: 'Instagram URL', value: item.socialIg }
  ], (vals) => {
    if (index !== undefined) {
      siteData.footer[key][index] = vals;
    } else {
      if (!siteData.footer[key]) siteData.footer[key] = [];
      siteData.footer[key].push(vals);
    }
    renderSection('footer');
  });
}

function showGalleryModal(index) {
  const g = index !== undefined ? siteData.home.gallery.items[index] : {};
  showModal(index !== undefined ? 'Sửa ảnh' : 'Thêm ảnh', [
    { key: 'label', label: 'Nhãn', value: g.label },
    { key: 'image', label: 'Image URL', value: g.image }
  ], (vals) => {
    if (index !== undefined) {
      siteData.home.gallery.items[index] = vals;
    } else {
      siteData.home.gallery.items.push(vals);
    }
    renderSection('home');
  });
}

function showStatModal(index) {
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
    renderSection('home');
  });
}

function showBannerModal(index) {
  const b = index !== undefined ? siteData.home.hero.banners[index] : {};
  showModal(index !== undefined ? 'Sửa banner' : 'Thêm banner', [
    { key: 'bgImage', label: 'Hình nền (URL)', value: b.bgImage },
    { key: 'link', label: 'Đường dẫn đích khi click', value: b.link }
  ], (vals) => {
    if (index !== undefined) {
      siteData.home.hero.banners[index] = vals;
    } else {
      if (!siteData.home.hero.banners) siteData.home.hero.banners = [];
      siteData.home.hero.banners.push(vals);
    }
    renderSection('home');
  });
}

function showEcoChannelModal(index) {
  const eco = siteData.mediaEcosystem || { totalFollowers: '', channels: [] };
  const c = index !== undefined ? eco.channels[index] : {};
  showModal(index !== undefined ? 'Sửa kênh' : 'Thêm kênh truyền thông', [
    { key: 'name', label: 'Tên kênh', value: c.name },
    { key: 'logo', label: 'Logo URL', value: c.logo },
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

function showCollaboratorModal(index) {
  const c = index !== undefined ? siteData.collaborators[index] : {};
  showModal(index !== undefined ? 'Sửa' : 'Thêm người hợp tác', [
    { key: 'name', label: 'Tên', value: c.name },
    { key: 'photo', label: 'Ảnh URL', value: c.photo }
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

// ===== Helpers =====
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `admin-toast show ${type}`;
  setTimeout(() => toast.className = 'admin-toast', 3000);
}
