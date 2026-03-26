// ===== Data Manager =====
// Manages loading, saving, and accessing site data from localStorage

import DEFAULT_SITE_DATA from '/data/site-data.js';

const STORAGE_KEY = 'csg_site_data';

const DataManager = {
  _data: null,

  /** Load data from localStorage or fall back to defaults */
  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deep merge: defaults + stored (stored wins)
        this._data = this._deepMerge(DEFAULT_SITE_DATA, parsed);
      } else {
        this._data = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
      }
    } catch (e) {
      console.warn('Failed to load saved data, using defaults:', e);
      this._data = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    }
    return this._data;
  },

  /** Get current data (auto-load if needed) */
  get() {
    if (!this._data) this.load();
    return this._data;
  },

  /** Save current data to localStorage */
  save(data) {
    if (data) this._data = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
      return true;
    } catch (e) {
      console.error('Failed to save data:', e);
      return false;
    }
  },

  /** Update a specific section */
  updateSection(key, value) {
    if (!this._data) this.load();
    this._data[key] = value;
    return this.save();
  },

  /** Reset to defaults */
  reset() {
    localStorage.removeItem(STORAGE_KEY);
    this._data = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    return this._data;
  },

  /** Export data as JSON string */
  exportJSON() {
    return JSON.stringify(this.get(), null, 2);
  },

  /** Import data from JSON string */
  importJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      this._data = parsed;
      this.save();
      return true;
    } catch (e) {
      console.error('Invalid JSON:', e);
      return false;
    }
  },

  /** Find a project by ID */
  getProject(id) {
    const data = this.get();
    return data.projects.find(p => p.id === id) || null;
  },

  /** Find a department by ID */
  getDepartment(id) {
    const data = this.get();
    return data.departments.find(d => d.id === id) || null;
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
