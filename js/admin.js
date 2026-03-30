// ===== Admin Panel JavaScript (Controller) =====
import DataManager from './data-manager.js';
import { supabase } from './supabase.js';
import { bindUploadEvents } from './admin-upload.js';
import { siteData, setSiteData, setDirty, isDirty, showToast, esc, setNestedValue } from './admin-state.js';
import { showModal, showSimpleModal } from './admin-utils.js';

import { renderGeneral, renderAbout, handleSettingsAction } from './admin-settings.js';
import { renderProjects, renderCategories, handleProjectAction } from './admin-projects.js';
import { renderDepartments, handleDeptAction } from './admin-departments.js';
import { renderMembers, handleMemberAction } from './admin-members.js';
import { renderAchievements, renderSponsors, renderHallOfFame, handleContentAction } from './admin-content.js';

let currentSection = 'general';
let session = null;

// Expose these for embedded HTML onclicks mapped inside Modals
window.setDirty = setDirty;
window.isDirty = false;
window.bindUploadEventsAdmin = bindUploadEvents;

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
  setSiteData(DataManager.get());
  
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
  setDirty(false); // Init dirty flag using exported core

  // Save global
  document.getElementById('btn-save')?.addEventListener('click', async () => {
    if (!isDirty) return;
    const btn = document.getElementById('btn-save');
    const oldText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    btn.disabled = true;

    const success = await DataManager.save(siteData);
    if (success) {
      showToast('Đã đồng bộ lên Cloud!', 'success');
      setDirty(false);
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

function renderSection(section) {
  const content = document.getElementById('admin-content');
  switch (section) {
    case 'general': content.innerHTML = renderGeneral(siteData, esc); break;
    case 'projects': content.innerHTML = renderProjects(siteData, esc); break;
    case 'categories': content.innerHTML = renderCategories(siteData, esc); break;
    case 'departments': content.innerHTML = renderDepartments(siteData, esc); break;
    case 'halloffame': content.innerHTML = renderHallOfFame(siteData, esc, showSimpleModal); break;
    case 'members': content.innerHTML = renderMembers(siteData, esc); break;
    case 'achievements': content.innerHTML = renderAchievements(siteData, esc); break;
    case 'sponsors': content.innerHTML = renderSponsors(siteData, esc); break;
    case 'about': content.innerHTML = renderAbout(siteData, esc); break;
    default: content.innerHTML = '<p>Section not found</p>';
  }
  bindSectionEvents();
}

function bindSectionEvents() {
  document.querySelectorAll('[data-bind]').forEach(el => {
    const event = el.tagName === 'TEXTAREA' ? 'input' : 'change';
    el.addEventListener(event, () => {
      setNestedValue(siteData, el.dataset.bind, el.value);
      setDirty(true);
    });
    if (el.tagName === 'INPUT') {
      el.addEventListener('input', () => {
        setNestedValue(siteData, el.dataset.bind, el.value);
        setDirty(true);
      });
    }
  });
}

// Global UI Delegate
document.body.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const index = btn.dataset.index !== undefined ? parseInt(btn.dataset.index) : undefined;
  
  if (['add-banner','edit-banner','delete-banner','add-stat','edit-stat','delete-stat','add-about-block','edit-about-block','delete-about-block','add-benefit','edit-benefit','delete-benefit'].includes(action)) {
    handleSettingsAction(action, index, siteData, showModal, renderSection);
  } else if (action.includes('project') || action.includes('category') || action.includes('milestone') || action.includes('link')) {
    handleProjectAction(action, index, btn.dataset, siteData, showModal, showSimpleModal, renderSection);
  } else if (action.includes('dept') || action.includes('team')) {
    handleDeptAction(action, index, siteData, renderSection);
  } else if (['add-president','edit-president','delete-president','add-board-member','edit-board-member','delete-board-member','move-up-board-member','move-down-board-member'].includes(action)) {
    handleMemberAction(action, index, siteData, showModal, renderSection);
  } else if (action.includes('award') || action.includes('eco-channel') || action.includes('collaborator') || action.includes('sponsor') || action.includes('hof')) {
    handleContentAction(action, index, btn.dataset, siteData, showModal, showSimpleModal, renderSection);
  }
});
