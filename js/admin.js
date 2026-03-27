// ===== Admin Panel JavaScript =====
import DataManager from './data-manager.js';
import { supabase } from './supabase.js';
import { imageUploadField, bindUploadEvents, getUploadedUrl } from './admin-upload.js';

let siteData = null;
let currentSection = 'general';
let session = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Check auth
  const { data: { session: currentSession } } = await supabase.auth.getSession();
  session = currentSession;

  const loading = document.getElementById('admin-loading');
  const loginScreen = document.getElementById('login-screen');
  const adminPanel = document.getElementById('admin-panel');

  if (!session) {
    if (loading) loading.classList.add('hidden');
    if (loginScreen) loginScreen.style.display = 'flex';
    initLogin();
    return;
  }

  // Load data from Supabase
  await DataManager.load();
  siteData = DataManager.get();
  
  if (loading) loading.classList.add('hidden');
  if (adminPanel) adminPanel.style.display = 'block';

  initSidebar();
  initTopActions();
  renderSection('general');
});

function initLogin() {
  const btn = document.getElementById('login-btn');
  const emailIn = document.getElementById('login-email');
  const passIn = document.getElementById('login-password');
  const err = document.getElementById('login-error');

  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    err.style.display = 'none';
    
    const { error } = await supabase.auth.signInWithPassword({
      email: emailIn.value,
      password: passIn.value,
    });

    if (error) {
      err.textContent = 'Sai email hoặc mật khẩu!';
      err.style.display = 'block';
      btn.disabled = false;
    } else {
      window.location.reload();
    }
  });
}

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

function initTopActions() {
  window.isDirty = false;
  window.setDirty = function(state = true) {
    window.isDirty = state;
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
  };

  // Init
  window.setDirty(false);

  // Save global
  document.getElementById('btn-save')?.addEventListener('click', async () => {
    if (!window.isDirty) return;
    const btn = document.getElementById('btn-save');
    const oldText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    btn.disabled = true;

    const success = await DataManager.save(siteData);
    if (success) {
      showToast('Đã đồng bộ lên Cloud!', 'success');
      window.setDirty(false);
      return;
    } else {
      showToast('Lưu thất bại!', 'error');
    }

    btn.innerHTML = oldText;
    btn.disabled = false;
  });

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.reload();
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
    default: content.innerHTML = '<p>Section not found</p>';
  }
  bindSectionEvents(section);
}

// ===== GENERAL & FOOTER =====
function renderGeneral() {
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

// ===== PROJECTS (exclude Chuyên mục) =====
function renderProjects() {
  const realProjects = siteData.projects.filter(p => p.year !== 'Chuyên mục');
  const items = realProjects.map((p) => {
    const idx = siteData.projects.indexOf(p);
    const tags = [];
    if (p.featured) tags.push('<span style="background:#FFDE21;color:#000;padding:2px 8px;border-radius:4px;font-size:0.7rem;font-weight:bold;margin-right:8px;line-height:1;"><i class="fas fa-star" style="font-size:0.6rem;margin-right:4px;"></i>NỔI BẬT</span>');
    if (p.ongoing) tags.push('<span style="background:#00D13B;color:#000;padding:2px 8px;border-radius:4px;font-size:0.7rem;font-weight:bold;line-height:1;"><i class="fas fa-circle" style="font-size:0.5rem;margin-right:4px;"></i>ĐANG DIỄN RA</span>');
    
    return `
    <div class="admin-card" style="padding:16px;">
      <div class="admin-card-header" style="margin-bottom:0;">
        <div style="display:flex;align-items:center;gap:16px;">
          <img src="${p.image}" style="width:60px;height:75px;object-fit:cover;border-radius:8px;" />
          <div>
            <div class="admin-item-title" style="font-size:1.1rem;margin-bottom:4px;display:flex;align-items:center;">
              <span style="margin-right:8px;">${esc(p.title)}</span> ${tags.join('')}
            </div>
            <div class="admin-item-sub">${p.year} • ${p.category}</div>
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn-primary" data-action="edit-project" data-index="${idx}"><i class="fas fa-edit"></i> Quản lý Dự án</button>
          <button class="btn-icon danger" data-action="delete-project" data-index="${idx}"><i class="fas fa-trash"></i></button>
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
    <div class="admin-card" id="admin-categories-section">
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
      <h3>Phòng Ban / Hội đồng (${siteData.departments.length})</h3>
      <button class="btn-add" data-action="add-dept"><i class="fas fa-plus"></i> Thêm ban mới</button>
    </div>
    ${deptCards}
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
        <h3>Chủ nhiệm qua các thời kỳ (${(siteData.presidents||[]).length})</h3>
        <button class="btn-add" data-action="add-president"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${presidents}</div>
    </div>
    
    <div class="admin-card" style="margin-top:32px;">
      <div class="admin-card-header">
        <h3 style="color:var(--text-gold);">Ban chủ nhiệm hiện tại (${currentGen.members.length})</h3>
        <button class="btn-add" data-action="add-board-member"><i class="fas fa-plus"></i> Thêm Thành viên</button>
      </div>
      <div class="admin-item-list" style="border-top:1px solid #333;">${groupedHtml || '<p style="padding:16px;color:#666;">Chưa có thành viên nào</p>'}</div>
    </div>
  `;
}

// ===== ACHIEVEMENTS & SPONSORS =====
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

  // Sponsors
  const sponsors = (siteData.sponsors || []).map((s, i) => `
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
        <h3>Đối tác / Hợp tác cùng (${(siteData.collaborators||[]).length})</h3>
        <button class="btn-add" data-action="add-collaborator"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${collabs}</div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Nhà tài trợ (${(siteData.sponsors||[]).length})</h3>
        <button class="btn-add" data-action="add-sponsor"><i class="fas fa-plus"></i> Thêm</button>
      </div>
      <div class="admin-item-list">${sponsors}</div>
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

// ===== HALL OF FAME =====
function renderHallOfFame() {
  const hof = siteData.hallOfFame || { individuals: { yearly: [], semesters: [] }, collectives: { yearly: [], semesters: [] } };

  function renderHofTable(type, period, periodKey, label) {
    const data = hof[type][period] || [];
    if (data.length === 0) return '';

    return data.map((item, index) => {
      const periodTitle = item.year || item.semester;
      const categoriesHtml = (item.categories || []).map((cat, ci) => {
        const membersRows = (cat.members || []).map((m, mi) => `
          <tr>
            <td style="color:var(--text-gold);font-weight:700;width:200px;">${esc(cat.name)}</td>
            <td>${esc(m.recipient)}</td>
            <td style="width:60px;"><img src="${m.image}" alt=""></td>
            <td style="text-align:right;width:120px;">
              <button class="btn-icon" data-action="edit-hof-member" data-type="${type}" data-period="${period}" data-year="${index}" data-cat="${ci}" data-index="${mi}"><i class="fas fa-pen"></i></button>
              <button class="btn-icon danger" data-action="delete-hof-member" data-type="${type}" data-period="${period}" data-year="${index}" data-cat="${ci}" data-index="${mi}"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        `).join('');

        return `
          <div style="margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
               <div style="display:flex;align-items:center;gap:8px;">
                 <strong style="color:#fff;font-size:0.95rem;">Danh hiệu: ${esc(cat.name)}</strong>
                 <button class="btn-icon" data-action="edit-hof-cat" data-type="${type}" data-period="${period}" data-year="${index}" data-cat="${ci}"><i class="fas fa-pen" style="font-size:0.7rem;"></i></button>
                 <button class="btn-icon danger" data-action="delete-hof-cat" data-type="${type}" data-period="${period}" data-year="${index}" data-cat="${ci}"><i class="fas fa-trash" style="font-size:0.7rem;"></i></button>
               </div>
               <button class="btn-add" data-action="add-hof-member" data-type="${type}" data-period="${period}" data-year="${index}" data-cat="${ci}" style="font-size:0.7rem;padding:4px 10px;"><i class="fas fa-plus"></i> Thêm người nhận</button>
            </div>
            <div class="admin-table-container">
              <table class="admin-table">
                <tbody>
                  ${membersRows || '<tr><td colspan="4" style="text-align:center;padding:20px;color:#666;">Chưa có người nhận nào</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="admin-card" style="margin-bottom:32px;">
          <div class="admin-card-header">
            <h3>${label} - ${esc(periodTitle)}</h3>
            <button class="btn-add" data-action="add-hof-cat" data-type="${type}" data-period="${period}" data-year="${index}"><i class="fas fa-plus"></i> Thêm danh hiệu</button>
          </div>
          <div style="padding:16px;">
            ${categoriesHtml || '<p style="color:#666;text-align:center;">Chưa có danh hiệu nào</p>'}
          </div>
        </div>
      `;
    }).join('');
  }

  return `
    <h2 style="color:var(--text-gold);margin:32px 0 16px;border-bottom:1px solid #333;padding-bottom:12px;text-transform:uppercase;letter-spacing:1px;">Cá nhân Vinh danh</h2>
    ${renderHofTable('individuals', 'yearly', 'year', 'Vinh danh Năm')}
    <button class="btn-add" data-action="add-hof-year" data-type="individuals" style="width:100%;justify-content:center;padding:12px;margin-bottom:20px;"><i class="fas fa-plus"></i> THÊM VINH DANH NĂM MỚI (CÁ NHÂN)</button>
    ${renderHofTable('individuals', 'semesters', 'semester', 'Vinh danh Học kỳ')}
    <button class="btn-add" data-action="add-hof-sem" data-type="individuals" style="width:100%;justify-content:center;padding:12px;margin-bottom:40px;"><i class="fas fa-plus"></i> THÊM VINH DANH HỌC KỲ MỚI (CÁ NHÂN)</button>

    <h2 style="color:var(--text-gold);margin:48px 0 16px;border-bottom:1px solid #333;padding-bottom:12px;text-transform:uppercase;letter-spacing:1px;">Tập thể Vinh danh</h2>
    ${renderHofTable('collectives', 'yearly', 'year', 'Vinh danh Năm')}
    <button class="btn-add" data-action="add-hof-year" data-type="collectives" style="width:100%;justify-content:center;padding:12px;margin-bottom:20px;"><i class="fas fa-plus"></i> THÊM VINH DANH NĂM MỚI (TẬP THỂ)</button>
    ${renderHofTable('collectives', 'semesters', 'semester', 'Vinh danh Học kỳ')}
    <button class="btn-add" data-action="add-hof-sem" data-type="collectives" style="width:100%;justify-content:center;padding:12px;margin-bottom:40px;"><i class="fas fa-plus"></i> THÊM VINH DANH HỌC KỲ MỚI (TẬP THỂ)</button>
  `;
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
    case 'add-project': showProjectAdvancedModal(); break;
    case 'edit-project': showProjectAdvancedModal(i); break;
    case 'delete-project':
      if (confirm('Xóa dự án này?')) { siteData.projects.splice(i, 1); renderSection('projects'); }
      break;

    // Departments
    case 'add-dept': showDeptAdvancedModal(); break;
    case 'edit-dept': showDeptAdvancedModal(i); break;
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
    case 'add-board-gen': showSimpleModal('Tên nhiệm kỳ (VD: Kỳ gần nhất)', '', (val) => { siteData.boardGenerations[0].term = val; renderSection('members'); }); break;
    case 'edit-board-gen': showSimpleModal('Sửa tên nhiệm kỳ', siteData.boardGenerations[0].term, (val) => { siteData.boardGenerations[0].term = val; renderSection('members'); }); break;
    case 'add-board-member': showMemberModal(null, 0); break;
    case 'edit-board-member': showMemberModal(i, 0); break;
    case 'delete-board-member':
      if (confirm('Xóa?')) { siteData.boardGenerations[0].members.splice(i, 1); renderSection('members'); }
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
      if (confirm('Xóa?')) { siteData.footer[key].splice(i, 1); renderSection('general'); }
      break;

    // Gallery
    case 'add-gallery': showGalleryModal(); break;
    case 'edit-gallery': showGalleryModal(i); break;
    case 'delete-gallery':
      if (confirm('Xóa?')) { siteData.home.gallery.items.splice(i, 1); renderSection('general'); }
      break;

    // Stats
    case 'add-stat': showStatModal(); break;
    case 'edit-stat': showStatModal(i); break;
    case 'delete-stat':
      if (confirm('Xóa?')) { siteData.home.stats.items.splice(i, 1); renderSection('general'); }
      break;

    // Banners
    case 'add-banner': showBannerModal(); break;
    case 'edit-banner': showBannerModal(i); break;
    case 'delete-banner':
      if (confirm('Xóa banner này?')) { siteData.home.hero.banners.splice(i, 1); renderSection('general'); }
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

    // Project Stats
    case 'add-project-stat': showProjectStatModal(i); break;
    case 'edit-project-stat': showProjectStatModal(i, yi); break;
    case 'delete-project-stat': {
      if (confirm('Xóa thông số này?')) {
        const key = Object.keys(siteData.projects[i].stats)[yi];
        delete siteData.projects[i].stats[key];
        renderSection('projects');
      }
      break;
    }

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

  const mSave = overlay.querySelector('#modal-save');
  overlay.querySelectorAll('input, textarea').forEach(el => {
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
      if(window.setDirty) window.setDirty(true);
      onSave(values);
      overlay.remove();
    }, 400); // UI delay for better UX
  });
}

function showSimpleModal(title, value, onSave) {
  showModal(title, [{ key: 'value', label: 'Nội dung', value, type: 'text' }], (vals) => onSave(vals.value));
}

function showProjectAdvancedModal(index) {
  const p = index !== undefined ? siteData.projects[index] : {
    id: 'new-project-' + Date.now(),
    title: '',
    subtitle: '',
    year: String(new Date().getFullYear()),
    category: 'event',
    image: '',
    banner: '',
    description: '',
    milestones: [],
    links: [],
    stats: {},
    gallery: [],
    featured: false,
    ongoing: false
  };

  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  
  // Local copies for dynamic editing
  let currentMilestones = [...(p.milestones || [])];
  let currentLinks = [...(p.links || [])].map(l => typeof l === 'string' ? {label: 'Liên kết', url: l} : l);
  let currentStats = {...(p.stats || {})};

  const renderModalContent = () => {
    const milestonesHtml = currentMilestones.map((m, i) => `
      <div class="modal-list-item">
        <input type="text" placeholder="Tên mốc" value="${esc(m.label)}" onchange="window._projModalUpdate('milestone', ${i}, 'label', this.value)" style="flex:1;">
        <input type="text" placeholder="VD: 15:30 - 20/11/2026 hoặc 20/11/2026" value="${esc(m.date)}" oninput="window._projModalUpdate('milestone', ${i}, 'date', this.value)" style="flex:1;">
        <button class="btn-icon danger" onclick="window._projModalDelete('milestone', ${i})"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');

    const linksHtml = currentLinks.map((l, i) => `
      <div class="modal-list-item">
        <input type="text" placeholder="Tên link" value="${esc(l.label || '')}" onchange="window._projModalUpdate('link', ${i}, 'label', this.value)" style="flex:1;">
        <input type="text" placeholder="URL" value="${esc(l.url || '')}" onchange="window._projModalUpdate('link', ${i}, 'url', this.value)" style="flex:2;">
        <button class="btn-icon danger" onclick="window._projModalDelete('link', ${i})"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');

    const statsEntries = Object.entries(currentStats);
    const statsHtml = statsEntries.map(([k, v], i) => `
      <div class="modal-list-item">
        <input type="text" placeholder="Tên (Reach...)" value="${esc(k)}" onchange="window._projModalUpdateStat('key', ${i}, this.value)" style="flex:1;">
        <input type="text" placeholder="Giá trị" value="${esc(v)}" onchange="window._projModalUpdateStat('val', ${i}, this.value)" style="flex:1;">
        <button class="btn-icon danger" onclick="window._projModalDelete('stat', ${i})"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');

    overlay.innerHTML = `
      <div class="admin-modal wide">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
          <h3 style="margin:0;">${index !== undefined ? 'Quản lý Dự án' : 'Thêm Dự án mới'}</h3>
          <button class="btn-icon" id="m-close" style="font-size:1.5rem;">&times;</button>
        </div>
        
        <div class="modal-split">
          <div class="modal-basic-info">
            <div class="form-row">
              <div class="form-group"><label>ID (slug)</label><input type="text" id="m-id" value="${esc(p.id)}"></div>
              <div class="form-group"><label>Thể loại</label><input type="text" id="m-cat" value="${esc(p.category)}"></div>
            </div>
            <div class="form-group"><label>Tên dự án</label><input type="text" id="m-title" value="${esc(p.title)}"></div>
            <div class="form-group"><label>Mô tả ngắn</label><input type="text" id="m-subtitle" value="${esc(p.subtitle)}"></div>
            <div class="form-row">
              <div class="form-group"><label>Năm</label><input type="text" id="m-year" value="${esc(p.year)}"></div>
              <div class="form-group" style="display:flex;align-items:center;gap:20px;padding-top:25px;white-space:nowrap;">
                <label style="margin:0;cursor:pointer;display:flex;align-items:center;gap:6px;color:#ccc;text-transform:none;letter-spacing:0;"><input type="checkbox" id="m-feat" ${p.featured ? 'checked' : ''}> Nổi bật</label>
                <label style="margin:0;cursor:pointer;display:flex;align-items:center;gap:6px;color:#ccc;text-transform:none;letter-spacing:0;"><input type="checkbox" id="m-ongoing" ${p.ongoing ? 'checked' : ''}> Đang diễn ra</label>
              </div>
            </div>
            <div class="form-group"><label>Poster dự án</label>${imageUploadField(p.image, 'm-img', 'projects')}</div>
            <div class="form-group"><label>Banner dự án</label>${imageUploadField(p.banner, 'm-banner', 'projects')}</div>
            <div class="form-group"><label>Chi tiết dự án</label><textarea id="m-desc" style="min-height:300px; resize:vertical;">${esc(p.description)}</textarea></div>
          </div>

          <div class="modal-dynamic-lists">
            <div class="modal-list-editor">
              <div class="modal-list-title"><span>Mốc thời gian</span> <button class="btn-add" onclick="window._projModalAdd('milestone')" style="padding:4px 10px;font-size:0.75rem;"><i class="fas fa-plus"></i> Thêm</button></div>
              <div class="modal-list-items">${milestonesHtml || '<p style="color:#666;font-size:0.8rem;margin:0;">Chưa có mốc thời gian</p>'}</div>
            </div>

            <div class="modal-list-editor">
              <div class="modal-list-title"><span>Liên kết dự án</span> <button class="btn-add" onclick="window._projModalAdd('link')" style="padding:4px 10px;font-size:0.75rem;"><i class="fas fa-plus"></i> Thêm</button></div>
              <div class="modal-list-items">${linksHtml || '<p style="color:#666;font-size:0.8rem;margin:0;">Chưa có liên kết</p>'}</div>
            </div>

            <div class="modal-list-editor">
              <div class="modal-list-title"><span>Thành tích & Số liệu</span> <button class="btn-add" onclick="window._projModalAdd('stat')" style="padding:4px 10px;font-size:0.75rem;"><i class="fas fa-plus"></i> Thêm</button></div>
              <div class="modal-list-items">${statsHtml || '<p style="color:#666;font-size:0.8rem;margin:0;">Chưa có số liệu</p>'}</div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" id="m-cancel">Hủy</button>
          <button class="btn-primary" id="m-save" style="padding:12px 40px;font-size:1rem;opacity:0.5;" disabled><i class="fas fa-save"></i> LƯU DỰ ÁN</button>
        </div>
      </div>
    `;

    if (index === undefined) {
      overlay.querySelector('#m-title').addEventListener('input', (e) => {
        let title = e.target.value.split(':')[0];
        let slug = title.toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        
        const mId = overlay.querySelector('#m-id');
        mId.value = slug;
        mId.dispatchEvent(new Event('input', { bubbles: true })); // trigger dirty state
      });
    }

    const msBtn = overlay.querySelector('#m-save');
    overlay.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => { msBtn.disabled = false; msBtn.style.opacity = '1'; });
      el.addEventListener('change', () => { msBtn.disabled = false; msBtn.style.opacity = '1'; });
    });

    overlay.querySelector('#m-cancel').onclick = () => { cleanup(); overlay.remove(); };
    overlay.querySelector('#m-close').onclick = () => { cleanup(); overlay.remove(); };
    msBtn.onclick = () => {
      msBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
      msBtn.disabled = true;
      setTimeout(() => {
        const basic = {
          id: overlay.querySelector('#m-id').value,
          title: overlay.querySelector('#m-title').value,
          subtitle: overlay.querySelector('#m-subtitle').value,
          year: overlay.querySelector('#m-year').value,
          category: overlay.querySelector('#m-cat').value,
          image: getUploadedUrl('m-img'),
          banner: getUploadedUrl('m-banner'),
          description: overlay.querySelector('#m-desc').value,
          featured: overlay.querySelector('#m-feat').checked,
          ongoing: overlay.querySelector('#m-ongoing').checked
        };

        const updated = { ...p, ...basic, milestones: currentMilestones, links: currentLinks, stats: currentStats };
        if (index !== undefined) { siteData.projects[index] = updated; } 
        else { updated.gallery = updated.gallery || []; siteData.projects.push(updated); }
        
        if(window.setDirty) window.setDirty(true);
        cleanup();
        overlay.remove();
        renderSection('projects');
        if (updated.year === 'Chuyên mục') {
            setTimeout(() => {
                const el = document.getElementById('admin-categories-section');
                if(el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }
        showToast('Đã cập nhật dự án thành công');
      }, 400);
    };
  };

  const cleanup = () => {
    delete window._projModalAdd;
    delete window._projModalUpdate;
    delete window._projModalUpdateStat;
    delete window._projModalDelete;
  };

  const syncDOMToP = () => {
    if (!overlay.querySelector('#m-title')) return;
    p.id = overlay.querySelector('#m-id').value;
    p.title = overlay.querySelector('#m-title').value;
    p.subtitle = overlay.querySelector('#m-subtitle').value;
    p.year = overlay.querySelector('#m-year').value;
    p.category = overlay.querySelector('#m-cat').value;
    p.image = getUploadedUrl('m-img') || p.image;
    p.banner = getUploadedUrl('m-banner') || p.banner;
    p.description = overlay.querySelector('#m-desc').value;
    p.featured = overlay.querySelector('#m-feat').checked;
    p.ongoing = overlay.querySelector('#m-ongoing').checked;
  };

  window._projModalAdd = (type) => {
    syncDOMToP();
    if (type === 'milestone') currentMilestones.push({label:'', date:''});
    if (type === 'link') currentLinks.push({label:'', url:''});
    if (type === 'stat') currentStats['Mới'] = '';
    renderModalContent();
  };
  window._projModalUpdate = (type, i, key, val) => {
    if (type === 'milestone') currentMilestones[i][key] = val;
    if (type === 'link') currentLinks[i][key] = val;
  };
  window._projModalUpdateStat = (updateType, i, val) => {
    const entries = Object.entries(currentStats);
    const [oldKey, oldVal] = entries[i];
    if (updateType === 'key') {
      delete currentStats[oldKey];
      currentStats[val] = oldVal;
    } else {
      currentStats[oldKey] = val;
    }
  };
  window._projModalDelete = (type, i) => {
    syncDOMToP();
    if (type === 'milestone') currentMilestones.splice(i, 1);
    if (type === 'link') currentLinks.splice(i, 1);
    if (type === 'stat') delete currentStats[Object.keys(currentStats)[i]];
    renderModalContent();
  };

  renderModalContent();
  document.body.appendChild(overlay);
  bindUploadEvents();
}

function showDeptAdvancedModal(index) {
  const d = index !== undefined ? siteData.departments[index] : {
    id: 'new-dept-' + Date.now(),
    name: '',
    image: '',
    description: '',
    subDepts: [],
    teams: []
  };

  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  
  // Clone current dept for local editing
  let currentDept = JSON.parse(JSON.stringify(d));

  const renderModalContent = () => {
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
          <div class="form-group"><label>Ảnh team (URL)</label><input type="text" value="${esc(t.image || '')}" onchange="window._deptModalUpdateTeam(${ti}, 'image', this.value)"></div>
        </div>
        <div class="form-group"><label>Mô tả team</label><textarea onchange="window._deptModalUpdateTeam(${ti}, 'description', this.value)">${esc(t.description || '')}</textarea></div>
        <div style="margin-top:10px;">
          <label style="font-size:0.75rem;color:#999;font-weight:700;margin-bottom:8px;display:block;">THÀNH VIÊN TEAM</label>
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
          <!-- Column 1: Basic Dept Info -->
          <div class="modal-basic-info" style="flex:1;">
            <div class="form-row">
              <div class="form-group"><label>ID (Slug)</label><input type="text" id="d-id" value="${esc(currentDept.id)}"></div>
              <div class="form-group" style="flex:2;"><label>Tên Ban</label><input type="text" id="d-name" value="${esc(currentDept.name)}"></div>
            </div>
            <div class="form-group">
              <label>Ảnh Ban</label>
              ${imageUploadField(currentDept.image || '', 'd-img', 'departments')}
            </div>
            <div class="form-group">
              <label>Mô tả Ban</label>
              <textarea id="d-desc" style="min-height:300px;">${esc(currentDept.description || '')}</textarea>
            </div>
          </div>

          <!-- Column 2: Teams Management -->
          <div class="modal-dynamic-lists" style="flex:1.8; max-height:70vh; overflow-y:auto; padding-right:12px; border-left: 1px solid #333; padding-left: 20px;">
            <div class="modal-list-title"><span>DANH SÁCH TEAMS TRONG BAN</span></div>
            ${teamsHtml || '<p style="color:#666;margin-bottom:16px;">Phòng ban này chưa có team nào.</p>'}
            <button class="btn-add" style="width:100%;justify-content:center;padding:12px;border-style:solid;" onclick="window._deptModalAddTeam()"><i class="fas fa-plus"></i> THÊM TEAM MỚI</button>
          </div>
        </div>

        <div class="modal-actions" style="margin-top:24px; padding-top:20px; border-top:1px solid #333; display:flex; justify-content:flex-end; gap:12px;">
          <button class="btn-secondary" id="d-cancel">Hủy</button>
          <button class="btn-primary" id="d-save" style="padding:12px 40px; font-size:1rem;"><i class="fas fa-save"></i> LƯU THÔNG TIN BAN</button>
        </div>
      </div>
    `;

    overlay.querySelector('#d-cancel').onclick = () => { cleanup(); overlay.remove(); };
    overlay.querySelector('#d-close').onclick = () => { cleanup(); overlay.remove(); };
    overlay.querySelector('#d-save').onclick = () => {
      currentDept.id = overlay.querySelector('#d-id').value;
      currentDept.name = overlay.querySelector('#d-name').value;
      currentDept.image = getUploadedUrl('d-img');
      currentDept.description = overlay.querySelector('#d-desc').value;
      currentDept.subDepts = []; // Removed redundant field

      if (index !== undefined) {
        siteData.departments[index] = currentDept;
      } else {
        siteData.departments.push(currentDept);
      }
      cleanup();
      overlay.remove();
      renderSection('departments');
      showToast('Đã lưu thông tin ban thành công');
    };
  };

  const cleanup = () => {
    delete window._deptModalAddTeam;
    delete window._deptModalDeleteTeam;
    delete window._deptModalUpdateTeam;
    delete window._deptModalAddMember;
    delete window._deptModalUpdateMember;
    delete window._deptModalDeleteMember;
  };

  // Helper bindings
  window._deptModalAddTeam = () => {
    if (!currentDept.teams) currentDept.teams = [];
    currentDept.teams.push({ name: 'Team mới', image: '', description: '', members: [] });
    renderModalContent();
  };
  window._deptModalDeleteTeam = (ti) => {
    if (confirm('Xóa team này?')) {
      currentDept.teams.splice(ti, 1);
      renderModalContent();
    }
  };
  window._deptModalUpdateTeam = (ti, key, val) => {
    currentDept.teams[ti][key] = val;
  };
  window._deptModalAddMember = (ti) => {
    if (!currentDept.teams[ti].members) currentDept.teams[ti].members = [];
    currentDept.teams[ti].members.push({ name: '', role: '' });
    renderModalContent();
  };
  window._deptModalUpdateMember = (ti, mi, key, val) => {
    currentDept.teams[ti].members[mi][key] = val;
  };
  window._deptModalDeleteMember = (ti, mi) => {
    currentDept.teams[ti].members.splice(mi, 1);
    renderModalContent();
  };

  renderModalContent();
  document.body.appendChild(overlay);
  bindUploadEvents();
}

function showCategoryModal() {
  showModal('Thêm chuyên mục', [
    { key: 'id', label: 'ID (slug)', value: '' },
    { key: 'title', label: 'Tên chuyên mục', value: '' },
    { key: 'subtitle', label: 'Phụ đề', value: '' },
    { key: 'image', label: 'Ảnh Minh họa', value: '', type: 'image', folder: 'projects' },
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
    if(window.setDirty) window.setDirty(true);
    renderSection('projects');
    setTimeout(() => {
        const el = document.getElementById('admin-categories-section');
        if(el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  });
}



function showMemberModal(index, yearIndex) {
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

function showAwardModal(index) {
  const a = index !== undefined ? siteData.awards[index] : {};
  showModal(index !== undefined ? 'Sửa danh hiệu' : 'Thêm danh hiệu', [
    { key: 'title', label: 'Tiêu đề', value: a.title },
    { key: 'image', label: 'Ảnh Minh họa', value: a.image, type: 'image', folder: 'awards' }
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
    { key: 'image', label: 'Ảnh chân dung', value: m.image, type: 'image', folder: 'halloffame' }
  ], (vals) => {
    if (memberIdx !== undefined) { list[memberIdx] = vals; } else { list.push(vals); }
    renderSection('halloffame');
  });
}

function showSponsorModal(index) {
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

function showPresidentModal(index) {
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

function showBenefitModal(index) {
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
    renderSection('general');
  });
}

function showGalleryModal(index) {
  const g = index !== undefined ? siteData.home.gallery.items[index] : {};
  showModal(index !== undefined ? 'Sửa ảnh' : 'Thêm ảnh', [
    { key: 'label', label: 'Nhãn', value: g.label },
    { key: 'image', label: 'Hình ảnh', value: g.image, type: 'image', folder: 'general' }
  ], (vals) => {
    if (index !== undefined) {
      siteData.home.gallery.items[index] = vals;
    } else {
      siteData.home.gallery.items.push(vals);
    }
    renderSection('general');
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
    renderSection('general');
  });
}

function showBannerModal(index) {
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

function showEcoChannelModal(index) {
  const eco = siteData.mediaEcosystem || { totalFollowers: '', channels: [] };
  const c = index !== undefined ? eco.channels[index] : {};
  showModal(index !== undefined ? 'Sửa kênh' : 'Thêm kênh truyền thông', [
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

function showCollaboratorModal(index) {
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
