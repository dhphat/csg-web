// ===== Main JavaScript =====

import Renderer from './renderer.js';
import DataManager from './data-manager.js';

// Global promise that resolves when data is loaded
window.__csgDataReady = (async () => {
  await DataManager.load();
  return true;
})();

document.addEventListener('DOMContentLoaded', async () => {
  // Wait for data to be loaded from Supabase
  await window.__csgDataReady;

  // Render header + footer from data
  Renderer.init();

  // Re-bind after dynamic render
  setTimeout(() => {
    initHeader();
    initScrollReveal();
    initMobileMenu();
    initLogoInteraction();
  }, 50);
});

// ===== Logo Interaction =====
function initLogoInteraction() {
  const logos = document.querySelectorAll('.header-logo');
  logos.forEach(logo => {
    let clickCount = 0;
    let timer = null;

    logo.addEventListener('click', () => {
      clickCount++;
      const img = logo.querySelector('img');
      
      // Clear existing animation
      img.classList.remove('logo-pulse', 'logo-super');
      void img.offsetWidth; // Trigger reflow

      if (clickCount >= 5) {
        img.classList.add('logo-super');
        clickCount = 0; // Reset
      } else {
        img.classList.add('logo-pulse');
      }

      // Reset counter if no click for 2s
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        clickCount = 0;
      }, 500);
    });
  });
}

// ===== Header scroll effect =====
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ===== Mobile menu toggle =====
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('open');
  });

  const navLinks = nav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}

// ===== Scroll reveal animation =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ===== Counter animation =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString() + suffix;
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString() + suffix;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          update();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

// ===== Tab filter =====
function initTabFilter(containerSelector, tabSelector, itemSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const tabs = container.querySelectorAll(tabSelector);
  const items = document.querySelectorAll(itemSelector);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
          item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Export for use in page-specific scripts
window.CSG = {
  animateCounters,
  initTabFilter,
};
