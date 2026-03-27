// ===== Data Manager =====
// Manages loading, saving, and accessing site data from Supabase

import { supabase } from './supabase.js';

const DataManager = {
  _data: null,
  _loaded: false,
  _loadPromise: null,

  /** Load data from Supabase (or fallback to empty defaults) */
  async load() {
    // Avoid duplicate fetches
    if (this._loadPromise) return this._loadPromise;

    this._loadPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('site_data')
          .select('data')
          .eq('id', 'main')
          .single();

        if (error) throw error;

        if (data && data.data && Object.keys(data.data).length > 0) {
          this._data = this._deepMerge(this._getDefaults(), data.data);
        } else {
          this._data = this._getDefaults();
        }
      } catch (e) {
        console.warn('Failed to load from Supabase, using defaults:', e);
        this._data = this._getDefaults();
      }
      this._loaded = true;
      return this._data;
    })();

    return this._loadPromise;
  },

  /** Get current data (must call load() first on page init) */
  get() {
    if (!this._data) {
      this._data = this._getDefaults();
    }
    return this._data;
  },

  /** Save current data to Supabase */
  async save(data) {
    if (data) this._data = data;
    try {
      const { error } = await supabase
        .from('site_data')
        .update({
          data: this._data,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'main');

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Failed to save data:', e);
      return false;
    }
  },

  /** Update a specific section */
  async updateSection(key, value) {
    if (!this._data) await this.load();
    this._data[key] = value;
    return this.save();
  },

  /** Reset to defaults (clears Supabase data too) */
  async reset() {
    this._data = this._getDefaults();
    await this.save();
    return this._data;
  },

  /** Export data as JSON string */
  exportJSON() {
    return JSON.stringify(this.get(), null, 2);
  },

  /** Import data from JSON string */
  async importJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      this._data = parsed;
      await this.save();
      return true;
    } catch (e) {
      console.error('Invalid JSON:', e);
      return false;
    }
  },

  /** Find a project by ID */
  getProject(id) {
    const data = this.get();
    return (data.projects || []).find(p => p.id === id) || null;
  },

  /** Find a department by ID */
  getDepartment(id) {
    const data = this.get();
    return (data.departments || []).find(d => d.id === id) || null;
  },

  /** Empty default structure */
  _getDefaults() {
    return {
      general: {
        siteName: "Cóc Sài Gòn",
        siteTagline: "Câu lạc bộ Truyền thông",
        logoUrl: "/assets/logo/logo.svg",
        description: "Câu lạc bộ Truyền thông Cóc Sài Gòn - CLB xuất sắc 7 năm liên tiếp tại trường Đại học FPT HCM.",
        socialLinks: { facebook: "#", instagram: "#", tiktok: "#", youtube: "#" }
      },
      nav: [
        { label: "Trang chủ", href: "/" },
        { label: "Dự án", href: "/project" },
        { label: "Vinh danh", href: "/hall-of-fame" },
        { label: "Thành viên", href: "/member" },
        { label: "Ấn tượng", href: "/achievement" },
        { label: "Về Cóc", href: "/about" }
      ],
      home: {
        hero: { banners: [] },
        diary: { title: "", tag: "", cardTitle: "", cardDesc: "", cardImage: "" },
        gallery: { title: "", items: [] },
        stats: { title: "Những con số ấn tượng", items: [] },
        testimonials: { title: "", items: [] }
      },
      projectCategories: [],
      projects: [],
      awards: [],
      departments: [],
      about: {
        quote: "",
        introText: "",
        blocks: [],
        benefits: { title: "", items: [] }
      },
      hallOfFame: {
        individuals: { yearly: [], semesters: [] },
        collectives: { yearly: [], semesters: [] }
      },
      presidents: [],
      boardGenerations: [{ term: "Nhiệm kỳ hiện tại", members: [] }],
      mediaEcosystem: { totalFollowers: "", channels: [] },
      sponsors: [],
      collaborators: [],
      footer: {
        description: "",
        address: "",
        email: "",
        phone: "",
        affiliates: [],
        projectLinks: [],
        otherLinks: [],
        competitions: []
      }
    };
  },

  /** Deep merge helper */
  _deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
};

export default DataManager;
