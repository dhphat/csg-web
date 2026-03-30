import { imageUploadField, getUploadedUrl } from './admin-upload.js';
import { setNestedValue } from './admin-state.js';

const PROJECT_CATEGORIES = ['Event', 'Talkshow', 'Cuộc thi', 'Diễn đàn', 'Workshop', 'Triển lãm', 'Teambuilding', 'Festival', 'Concert', 'Từ thiện', 'Webinar', 'Âm nhạc'];

export function renderProjects(siteData, esc) {
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
            <div class="admin-item-title" style="font-size:1.1rem;margin-bottom:4px;">${esc(p.title)}</div>
            <div class="admin-item-sub" style="margin-bottom:8px;">${esc(p.category || 'event')} • ${esc(p.subtitle)} • Tác giả: ${esc(p.author || 'CSG')} • Năm: ${p.year}</div>
            <div>${tags.join('')}</div>
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn-primary" data-action="edit-project" data-index="${idx}"><i class="fas fa-edit"></i> Quản lý Chuyên sâu</button>
          <button class="btn-icon danger" data-action="delete-project" data-index="${idx}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
    `;
  }).join('');

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <h3>Dự án tiêu biểu (${realProjects.length})</h3>
      <button class="btn-add" data-action="add-project"><i class="fas fa-plus"></i> Thêm Dự Án (Form Mới)</button>
    </div>
    ${items}
  `;
}

export function renderCategories(siteData, esc) {
  const cats = siteData.projects.filter(p => p.year === 'Chuyên mục');
  const items = cats.map((p) => {
    const idx = siteData.projects.indexOf(p);
    return `
    <div class="admin-item">
      <img src="${p.image}" alt="" class="admin-item-thumb" />
      <div class="admin-item-info">
        <div class="admin-item-title">${esc(p.title)}</div>
        <div class="admin-item-sub">ID: ${p.id}</div>
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

export function handleProjectAction(action, index, dataset, siteData, showModal, showSimpleModal, renderSection) {
  switch (action) {
    case 'add-project': showProjectAdvancedModal(undefined, false, siteData, renderSection); break;
    case 'edit-project': showProjectAdvancedModal(index, false, siteData, renderSection); break;
    case 'delete-project':
      if (confirm('Xóa hoàn toàn dự án/chuyên mục này?')) { 
        siteData.projects.splice(index, 1); 
        window.setDirty(true);
        renderSection('projects'); 
      }
      break;

    case 'add-category': showProjectAdvancedModal(undefined, true, siteData, renderSection); break;

    case 'add-milestone': showMilestoneModal(index, undefined, siteData, showModal, renderSection); break;
    case 'edit-milestone': showMilestoneModal(index, dataset.year, siteData, showModal, renderSection); break;
    case 'delete-milestone':
      if (confirm('Xóa mốc này?')) { siteData.projects[index].milestones.splice(dataset.year, 1); window.setDirty(true); renderSection('projects'); }
      break;

    case 'add-link': showLinkModal(index, undefined, siteData, showModal, renderSection); break;
    case 'edit-link': showLinkModal(index, dataset.year, siteData, showModal, renderSection); break;
    case 'delete-link':
      if (confirm('Xóa liên kết?')) {
        const proj = siteData.projects[index];
        if (proj.links) { proj.links.splice(dataset.year, 1); }
        else if (proj.link) { delete proj.link; }
        renderSection('projects');
      }
      break;

    case 'add-project-stat': showProjectStatModal(index, undefined, siteData, showSimpleModal, renderSection); break;
    case 'edit-project-stat': showProjectStatModal(index, dataset.year, siteData, showSimpleModal, renderSection); break;
    case 'delete-project-stat':
      if (confirm('Xóa thông số này?')) {
        const key = Object.keys(siteData.projects[index].stats)[dataset.year];
        delete siteData.projects[index].stats[key];
        renderSection('projects');
      }
      break;
  }
}

function showProjectAdvancedModal(index, forceCategory = false, siteData, renderSection) {
  const p = index !== undefined ? siteData.projects[index] : {
    id: `new-${forceCategory ? 'category' : 'project'}-` + Date.now(),
    title: '',
    subtitle: '',
    year: forceCategory ? 'Chuyên mục' : String(new Date().getFullYear()),
    category: forceCategory ? 'category' : 'event',
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

  const isCat = forceCategory || p.year === 'Chuyên mục';
  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  
  let currentMilestones = [...(p.milestones || [])];
  let currentLinks = [...(p.links || [])].map(l => typeof l === 'string' ? {label: 'Liên kết', url: l} : l);
  let currentStats = {...(p.stats || {})};

  let currentId = p.id;
  let currentTitle = p.title;
  let currentSubtitle = p.subtitle || '';
  let currentImage = p.image || '';
  let currentBanner = p.banner || '';
  let currentCategory = p.category || (forceCategory ? 'category' : 'event');
  let currentFeatured = p.featured;
  let currentOngoing = p.ongoing;
  let currentDesc = p.description || '';

  const renderModalContent = () => {
    const esc = (str) => {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    const milestonesHtml = currentMilestones.map((m, i) => {
      let d = m.date || ''; let t = m.time || '';
      if(d.includes('T')) { const pt = d.split('T'); d = pt[0]; t = pt[1]; }
      return `
      <div class="modal-list-item" style="display: flex; gap: 8px; align-items: center;">
        <input type="text" placeholder="Tên mốc" value="${esc(m.label)}" onchange="window._projModalUpdate('milestone', ${i}, 'label', this.value)" style="flex:1; min-width: 100px;">
        <input type="date" value="${esc(d)}" onchange="window._projModalUpdate('milestone', ${i}, 'date', this.value)" style="width: 140px; flex-shrink: 0;">
        <input type="time" value="${esc(t)}" onchange="window._projModalUpdate('milestone', ${i}, 'time', this.value)" style="width: 110px; flex-shrink: 0;">
        <button class="btn-icon danger" onclick="window._projModalDelete('milestone', ${i})"><i class="fas fa-trash"></i></button>
      </div>
      `;
    }).join('');

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
      <div class="admin-modal wide" style="max-width:1100px; display: block !important;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
          <h3 style="margin:0;">${index !== undefined ? (isCat ? 'Quản lý Chuyên mục: ' : 'Quản lý Dự án: ') + p.title : (isCat ? 'Thêm Chuyên mục mới' : 'Thêm Dự án mới')}</h3>
          <button class="btn-icon" id="pm-close" style="font-size:1.5rem;">&times;</button>
        </div>
        
        <div class="modal-split" style="display:flex; gap:32px; width: 100%;">
          <!-- CỘT TRÁI: THÔNG TIN CƠ BẢN -->
          <div class="modal-basic-info" style="flex:1;">
            <div class="form-row">
              <div class="form-group"><label>Mã ID (Slug URL)</label><input type="text" id="pm-id" value="${esc(currentId)}"></div>
              <div class="form-group" style="flex:2;"><label>Tên ${isCat ? 'Chuyên mục' : 'Dự án'}</label><input type="text" id="pm-title" value="${esc(currentTitle)}"></div>
            </div>
            
            <div class="form-row">
              <div class="form-group"><label>Subtitle (Dòng phụ)</label><input type="text" id="pm-subtitle" value="${esc(currentSubtitle)}"></div>
              ${!isCat ? `
              <div class="form-group"><label>Thể loại</label>
                <select id="pm-category" style="width:100%; background:var(--bg-primary); color:var(--text-primary); border:1px solid var(--border-color); padding:8px; border-radius:4px;">
                  ${PROJECT_CATEGORIES.map(cat => `<option value="${cat.toLowerCase()}" ${currentCategory.toLowerCase() === cat.toLowerCase() ? 'selected' : ''}>${cat}</option>`).join('')}
                </select>
              </div>` : ''}
            </div>

            <div class="form-group">
              <label>${isCat ? 'Logo chuyên mục' : 'Poster dự án'}</label>
              ${imageUploadField(currentImage, 'pm-img', 'projects')}
            </div>
            <div class="form-group">
              <label>Ảnh bìa trang chi tiết</label>
              ${imageUploadField(currentBanner, 'pm-banner', 'projects')}
            </div>
            ${!isCat ? `
            <div class="form-row" style="background: rgba(255,222,33,0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,222,33,0.2); margin-top: 20px;">
              <div class="form-group" style="margin-bottom: 0; display: flex; align-items: center; gap: 12px; cursor: pointer;">
                <input type="checkbox" id="pm-featured" ${currentFeatured ? 'checked' : ''} style="width: 20px; height: 20px; margin: 0; cursor: pointer;">
                <label for="pm-featured" style="margin: 0; cursor: pointer; font-size: 0.9rem; font-weight: 700; color: #fff;">NỔI BẬT</label>
              </div>
              <div class="form-group" style="margin-bottom: 0; display: flex; align-items: center; gap: 12px; cursor: pointer;">
                <input type="checkbox" id="pm-ongoing" ${currentOngoing ? 'checked' : ''} style="width: 20px; height: 20px; margin: 0; cursor: pointer;">
                <label for="pm-ongoing" style="margin: 0; cursor: pointer; font-size: 0.9rem; font-weight: 700; color: #fff;">ĐANG DIỄN RA</label>
              </div>
            </div>` : ''}
            <div class="form-group">
              <label>Chi tiết ${isCat ? 'Chuyên mục' : 'Dự án'}</label>
              <textarea id="pm-desc" style="min-height:120px;">${esc(currentDesc)}</textarea>
            </div>
          </div>

          <!-- CỘT PHẢI: QUẢN LÝ DANH SÁCH -->
          <div class="modal-dynamic-lists" style="flex:1.8; max-height:70vh; overflow-y:auto; padding-right:12px; border-left: 1px solid #333; padding-left: 20px;">
            <div class="modal-list-title"><span>CÁC MỐC THỜI GIAN (Dùng để xác định Năm dự án)</span></div>
            ${milestonesHtml || '<p style="color:#666;margin-bottom:16px;">Vui lòng tạo ít nhất 1 mốc thời gian.</p>'}
            <button class="btn-add" style="width:100%;justify-content:center;padding:12px;border-style:dashed;margin-bottom:32px;" onclick="window._projModalAdd('milestone')"><i class="fas fa-plus"></i> THÊM MỐC THỜI GIAN</button>

            <div class="modal-list-title"><span>CÁC LIÊN KẾT NGOÀI</span></div>
            ${linksHtml || '<p style="color:#666;margin-bottom:16px;">Chưa có liên kết.</p>'}
            <button class="btn-add" style="width:100%;justify-content:center;padding:12px;border-style:dashed;margin-bottom:32px;" onclick="window._projModalAdd('link')"><i class="fas fa-plus"></i> THÊM LIÊN KẾT TRUYỀN THÔNG</button>

             <div class="modal-list-title"><span>THÔNG SỐ DỰ ÁN (Reach, View, Chia sẻ...)</span></div>
            ${statsHtml || '<p style="color:#666;margin-bottom:16px;">Chưa có thông số.</p>'}
            <button class="btn-add" style="width:100%;justify-content:center;padding:12px;border-style:dashed;margin-bottom:32px;" onclick="window._projModalAdd('stat')"><i class="fas fa-plus"></i> THÊM THÔNG SỐ</button>
          </div>
        </div>

        <div class="modal-actions" style="margin-top:24px; padding-top:20px; border-top:1px solid #333; display:flex; justify-content:flex-end; gap:12px;">
          <button class="btn-secondary" id="pm-cancel">Hủy</button>
          <button class="btn-primary" id="pm-save" style="padding:12px 40px; font-size:1rem; opacity:0.5;" disabled><i class="fas fa-save"></i> LƯU THÔNG TIN DỰ ÁN</button>
        </div>
      </div>
    `;

    const mSave = overlay.querySelector('#pm-save');
    overlay.addEventListener('input', () => { mSave.disabled = false; mSave.style.opacity = '1'; });
    overlay.addEventListener('change', () => { mSave.disabled = false; mSave.style.opacity = '1'; });

    // Slug validation logic
    const idInput = overlay.querySelector('#pm-id');
    if (idInput) {
      idInput.onblur = (e) => {
        let val = e.target.value;
        if (!val) return;
        // Normalize Vietnamese: remove accents, spaces, special chars
        val = val.toLowerCase()
                 .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                 .replace(/đ/g, 'd')
                 .replace(/[^a-z0-9-]/g, '-')
                 .replace(/-+/g, '-')
                 .replace(/^-|-$/g, '');
        e.target.value = val;
      };
    }

    overlay.querySelector('#pm-cancel').onclick = () => { cleanup(); overlay.remove(); };
    overlay.querySelector('#pm-close').onclick = () => { cleanup(); overlay.remove(); };
    overlay.querySelector('#pm-save').onclick = () => {
      // Validate Data before Save
      let derivedYear = isCat ? 'Chuyên mục' : '';
      if (!isCat && currentMilestones.length > 0 && currentMilestones[0].date) {
        derivedYear = currentMilestones[0].date.substring(0, 4);
      }
      if (!isCat && !derivedYear) {
         alert('Vui lòng tạo ít nhất 1 Mốc thời gian (có ngày/tháng/năm) để hệ thống tự động xác nhận Năm Dự Án.');
         return;
      }

      const mSaveBtn = overlay.querySelector('#pm-save');
      mSaveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
      mSaveBtn.disabled = true;

      const updatedProj = {
        id: overlay.querySelector('#pm-id').value,
        title: overlay.querySelector('#pm-title').value,
        subtitle: overlay.querySelector('#pm-subtitle').value,
        year: derivedYear,
        category: forceCategory ? 'category' : (overlay.querySelector('#pm-category')?.value || 'event'),
        image: getUploadedUrl('pm-img') || p.image,
        banner: getUploadedUrl('pm-banner') || p.banner,
        description: overlay.querySelector('#pm-desc').value,
        featured: isCat ? false : overlay.querySelector('#pm-featured').checked,
        ongoing: isCat ? false : overlay.querySelector('#pm-ongoing').checked,
        milestones: currentMilestones.map(m => {
          if(!m.date && !m.time) return {label: m.label, date: ''};
          if(m.date && !m.time) return {label: m.label, date: m.date};
          return {label: m.label, date: `${m.date}T${m.time || '00:00'}`};
        }),
        links: currentLinks,
        stats: currentStats,
        gallery: p.gallery || [] // Gallery management is separate or not implemented in complex modal
      };

      if (index !== undefined) {
        siteData.projects[index] = updatedProj;
      } else {
        siteData.projects.unshift(updatedProj);
      }

      setTimeout(() => {
        cleanup();
        overlay.remove();
        if(window.setDirty) window.setDirty(true);
        renderSection(isCat ? 'categories' : 'projects');
        
        // redirect to target if it was category
        if (isCat) {
            setTimeout(() => {
                const el = document.getElementById('admin-categories-section');
                if(el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }
      }, 400);
    };
  };

  const syncDOM = () => {
    // Sync basic info fields
    const elId = overlay.querySelector('#pm-id');
    const elTitle = overlay.querySelector('#pm-title');
    const elSubtitle = overlay.querySelector('#pm-subtitle');
    const elDesc = overlay.querySelector('#pm-desc');
    const elFeatured = overlay.querySelector('#pm-featured');
    const elOngoing = overlay.querySelector('#pm-ongoing');
    const elImgUrl = overlay.querySelector('#url-pm-img');
    const elBannerUrl = overlay.querySelector('#url-pm-banner');

    if (elId) currentId = elId.value;
    if (elTitle) currentTitle = elTitle.value;
    if (elSubtitle) currentSubtitle = elSubtitle.value;
    const elCategory = overlay.querySelector('#pm-category');
    if (elCategory) currentCategory = elCategory.value;
    if (elDesc) currentDesc = elDesc.value;
    if (elFeatured) currentFeatured = elFeatured.checked;
    if (elOngoing) currentOngoing = elOngoing.checked;
    if (elImgUrl) currentImage = elImgUrl.value;
    if (elBannerUrl) currentBanner = elBannerUrl.value;

    // Keep local states updated before re-render
    const keys = Object.keys(currentStats);
    keys.forEach((k, i) => {
      const elK = overlay.querySelectorAll("input[placeholder='Tên (Reach...)']")[i];
      const elV = overlay.querySelectorAll("input[placeholder='Giá trị']")[i];
      if (elK && elK.value !== k) {
         const val = currentStats[k];
         delete currentStats[k];
         currentStats[elK.value] = elV.value;
      } else if (elK) {
         currentStats[k] = elV.value;
      }
    });

    currentLinks.forEach((l, i) => {
      const elL = overlay.querySelectorAll("input[placeholder='Tên link']")[i];
      const elU = overlay.querySelectorAll("input[placeholder='URL']")[i];
      if(elL) l.label = elL.value;
      if(elU) l.url = elU.value;
    });

    currentMilestones.forEach((m, i) => {
      const elL = overlay.querySelectorAll("input[placeholder='Tên mốc']")[i];
      const elD = overlay.querySelectorAll("input[type='date']")[i];
      const elT = overlay.querySelectorAll("input[type='time']")[i];
      if(elL) m.label = elL.value;
      if(elD) m.date = elD.value;
      if(elT) m.time = elT.value;
    });
  };

  window._projModalAdd = (type) => {
    syncDOM();
    if (type === 'milestone') currentMilestones.push({ label: 'Mốc mới', date: '', time: '' });
    if (type === 'link') currentLinks.push({ label: 'Bài viết', url: '' });
    if (type === 'stat') {
      const num = Object.keys(currentStats).length + 1;
      currentStats[`Thống kê ${num}`] = '0';
    }
    renderModalContent();
    const save = document.getElementById('pm-save'); if(save) { save.disabled = false; save.style.opacity = '1'; }
  };

  window._projModalDelete = (type, index) => {
    syncDOM();
    if (type === 'milestone') currentMilestones.splice(index, 1);
    if (type === 'link') currentLinks.splice(index, 1);
    if (type === 'stat') {
       const key = Object.keys(currentStats)[index];
       delete currentStats[key];
    }
    renderModalContent();
    const save = document.getElementById('pm-save'); if(save) { save.disabled = false; save.style.opacity = '1'; }
  };

  window._projModalUpdate = (type, index, field, value) => {
    if (type === 'milestone') currentMilestones[index][field] = value;
    if (type === 'link') currentLinks[index][field] = value;
  };
  
  window._projModalUpdateStat = (type, index, value) => {
     // Managed by syncDOM to avoid key shifting issues mid-type
  };

  const cleanup = () => {
    delete window._projModalAdd;
    delete window._projModalDelete;
    delete window._projModalUpdate;
    delete window._projModalUpdateStat;
  };

  renderModalContent();
  document.body.appendChild(overlay);
  if(window.bindUploadEventsAdmin) window.bindUploadEventsAdmin();
}

function showMilestoneModal(index, mIndex, siteData, showModal, renderSection) {
  const proj = siteData.projects[index];
  const m = mIndex !== undefined ? proj.milestones[mIndex] : {};
  showModal(mIndex !== undefined ? 'Sửa mốc thời gian' : 'Thêm mốc thời gian', [
    { key: 'date', label: 'Ngày/Tháng/Năm (VD: 25.10.2023)', value: m.date },
    { key: 'label', label: 'Tên mốc', value: m.label }
  ], (vals) => {
    if (mIndex !== undefined) { proj.milestones[mIndex] = vals; }
    else { if (!proj.milestones) proj.milestones = []; proj.milestones.push(vals); }
    renderSection('projects');
  });
}

function showLinkModal(index, lIndex, siteData, showModal, renderSection) {
  const proj = siteData.projects[index];
  if (!proj.links) proj.links = proj.link ? [{label:'Báo chí', url:proj.link}] : [];
  
  const l = lIndex !== undefined ? proj.links[lIndex] : {};
  showModal(lIndex !== undefined ? 'Sửa liên kết' : 'Thêm liên kết', [
    { key: 'label', label: 'Nhãn (VD: Kênh14, Fanpage)', value: l.label },
    { key: 'url', label: 'URL', value: l.url }
  ], (vals) => {
    if (lIndex !== undefined) { proj.links[lIndex] = vals; }
    else { proj.links.push(vals); }
    renderSection('projects');
  });
}

function showProjectStatModal(index, statKeyIndex, siteData, showSimpleModal, renderSection) {
  const proj = siteData.projects[index];
  if (!proj.stats) proj.stats = {};
  
  let keyName = '', val = '';
  if (statKeyIndex !== undefined) {
    keyName = Object.keys(proj.stats)[statKeyIndex];
    val = proj.stats[keyName];
  }

  const newKey = prompt('Nhập tên thông số (VD: Reach, Views, Shares):', keyName);
  if (!newKey) return;
  
  showSimpleModal(`Giá trị cho '${newKey}'`, val, (v) => {
    if (statKeyIndex !== undefined && keyName !== newKey) {
      delete proj.stats[keyName];
    }
    proj.stats[newKey] = v;
    renderSection('projects');
  });
}
