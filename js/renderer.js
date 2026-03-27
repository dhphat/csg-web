// ===== Renderer =====
// Shared rendering functions for header, footer, and common components

import DataManager from './data-manager.js';

const Renderer = {
  /** Render the header/nav */
  renderHeader(activeHref) {
    const data = DataManager.get();
    const header = document.getElementById('header');
    if (!header) return;

    const half = Math.ceil(data.nav.length / 2);
    const leftNav = data.nav.slice(0, half).map(item => {
      const isActive = (activeHref === item.href) || 
        (activeHref && item.href !== '/' && activeHref.includes(item.href));
      return `<li><a href="${item.href}" class="nav-link${isActive ? ' active' : ''}">${item.label}</a></li>`;
    }).join('');

    const rightNav = data.nav.slice(half).map(item => {
      const isActive = (activeHref === item.href) || 
        (activeHref && item.href !== '/' && activeHref.includes(item.href));
      return `<li><a href="${item.href}" class="nav-link${isActive ? ' active' : ''}">${item.label}</a></li>`;
    }).join('');

    header.innerHTML = `
      <div class="header-inner">
        <!-- Mobile Logo (hidden on desktop) -->
        <div class="header-logo mobile-only" style="cursor: pointer;">
          <img src="/assets/logo/logo.svg" alt="${data.general.siteName} Logo" />
        </div>

        <!-- Desktop Navigation with Centered Logo -->
        <nav class="main-nav desktop-nav">
          <ul class="nav-list left-nav">${leftNav}</ul>
          
          <div class="header-logo desktop-only" style="cursor: pointer;">
            <img src="/assets/logo/logo.svg" alt="${data.general.siteName} Logo" />
          </div>
          
          <ul class="nav-list right-nav">${rightNav}</ul>
        </nav>

        <div class="header-right">
          <button class="menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>
      </div>
    `;
  },

  /** Render the footer */
  renderFooter() {
    const data = DataManager.get();
    const footer = document.getElementById('footer');
    if (!footer) return;

    const social = data.general.socialLinks;
    const ft = data.footer;

    // Lists
    const deptsHtml = (data.departments || []).map(d => `<li><a href="/department?id=${d.id}" class="footer-subtle-link">${d.name}</a></li>`).join('');
    const projectsHtml = (data.projects || []).slice(0, 6).map(p => `<li><a href="/project/${p.id}" class="footer-subtle-link">${p.title}</a></li>`).join('');
    const categoriesHtml = (data.projectCategories || []).map(c => `<li><a href="/project?category=${c.id}" class="footer-subtle-link">${c.name}</a></li>`).join('');

    footer.innerHTML = `
      <div class="container">
        <!-- Top row: brand + social -->
        <div class="footer-top" style="align-items: center;">
          <div class="footer-brand" style="flex-direction: row; gap: 16px; align-items: center;">
            <img src="/assets/logo/logo.svg" alt="${data.general.siteName}" style="height: 35px; width: auto; border-radius: 0;" />
            <div class="footer-brand-info">
              <span style="font-weight: 500; font-size: 0.95rem; white-space: nowrap;">${data.general.description.split('-')[0].trim()}</span>
            </div>
          </div>
          <div class="footer-right">
            <div class="footer-contact-info">
              <div class="footer-social">
                ${social.facebook ? `<a href="${social.facebook}" aria-label="Facebook" class="footer-subtle-icon"><i class="fab fa-facebook-f"></i></a>` : ''}
                ${social.instagram ? `<a href="${social.instagram}" aria-label="Instagram" class="footer-subtle-icon"><i class="fab fa-instagram"></i></a>` : ''}
                ${social.tiktok ? `<a href="${social.tiktok}" aria-label="TikTok" class="footer-subtle-icon"><i class="fab fa-tiktok"></i></a>` : ''}
                ${social.youtube ? `<a href="${social.youtube}" aria-label="YouTube" class="footer-subtle-icon"><i class="fab fa-youtube"></i></a>` : ''}
              </div>
            </div>
          </div>
        </div>

        <div class="footer-brand-desc" style="font-size: 0.9rem; margin-top: 16px;">
          ${ft.address ? `<p><span style="color:var(--text-secondary)">Địa chỉ:</span> ${ft.address}</p>` : ''}
          ${ft.email ? `<p><span style="color:var(--text-secondary)">Email:</span> ${ft.email}</p>` : ''}
          ${ft.phone ? `<p><span style="color:var(--text-secondary)">Hotline:</span> ${ft.phone}</p>` : ''}
        </div>

        <div class="footer-links-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 32px; padding: 24px 0 0 0;">
          <!-- Ban trực thuộc -->
          <div class="footer-link-col">
            <h4 style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 16px;">Ban trực thuộc</h4>
            <ul style="list-style: none; padding: 0; line-height: 2.2; font-size: 0.9rem;">${deptsHtml}</ul>
          </div>
          <!-- Dự án -->
          <div class="footer-link-col">
            <h4 style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 16px;">Dự án nổi bật</h4>
            <ul style="list-style: none; padding: 0; line-height: 2.2; font-size: 0.9rem;">${projectsHtml}</ul>
          </div>
          <!-- Chuyên mục -->
          <div class="footer-link-col">
            <h4 style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 16px;">Chuyên mục</h4>
            <ul style="list-style: none; padding: 0; line-height: 2.2; font-size: 0.9rem;">${categoriesHtml}</ul>
          </div>
        </div>

        <!-- Bottom -->
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} ${data.general.siteName}. All rights reserved.</p>
        </div>
      </div>
    `;
  },

  /** Initialize header + footer on any page */
  init(activeHref) {
    this.renderHeader(activeHref || window.location.pathname);
    this.renderFooter();
  }
};

export default Renderer;
