// ===== Data Manager V2 (Relational Database Version) =====
// Manages loading, saving, and mapping site data from 10 separate Supabase tables

import { supabase } from './supabase.js';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const DataManager = {
  _data: null,
  _loaded: false,
  _loadPromise: null,

  /** Load data from Multi-tables Supabase into Front-end JSON Tree */
  async load() {
    if (this._loadPromise) return this._loadPromise;

    this._loadPromise = (async () => {
      try {
        const [
          { data: settings },
          { data: projects },
          { data: departments },
          { data: teams },
          { data: members },
          { data: awards },
          { data: collaborators },
          { data: sponsors },
          { data: media },
          { data: hof }
        ] = await Promise.all([
          supabase.from('csg_settings').select('*'),
          supabase.from('csg_projects').select('*'),
          supabase.from('csg_departments').select('*'),
          supabase.from('csg_teams').select('*'),
          supabase.from('csg_members').select('*'),
          supabase.from('csg_awards').select('*'),
          supabase.from('csg_collaborators').select('*'),
          supabase.from('csg_sponsors').select('*'),
          supabase.from('csg_media').select('*'),
          supabase.from('csg_hall_of_fame').select('*'),
        ]);

        const def = this._getDefaults();

        // 1. Dữ liệu tĩnh (Settings)
        if (settings) {
          settings.forEach(s => {
            if (def[s.type]) def[s.type] = this._deepMerge(def[s.type], s.data);
          });
        }

        // 2. Dự án 
        if (projects) {
          def.projects = projects;
          def.projectCategories = projects.filter(p => p.year === 'Chuyên mục').map(p => ({
            id: p.id,
            name: p.title,
            logo: p.image
          }));
        }

        // 3. Giải thưởng, Đối tác, Nhà tài trợ
        if (awards) def.awards = awards;
        if (sponsors) def.sponsors = sponsors;
        if (collaborators) def.collaborators = collaborators;
        if (media) def.mediaEcosystem.channels = media;

        // 4. Vinh danh
        if (hof) {
            hof.forEach(h => {
               // VD h.period_type='yearly', h.award_type='individuals'
               let pType = h.period_type; // 'yearly' / 'semesters'
               let aType = h.award_type; // 'individuals' / 'collectives'
               
               if(!def.hallOfFame[aType]) def.hallOfFame[aType] = { yearly: [], semesters: [] };
               let arr = def.hallOfFame[aType][pType];
               if(!arr) arr = [];
               
               let periodMatch = arr.find(x => x.year === h.period_name || x.semester === h.period_name);
               if(!periodMatch) { 
                 periodMatch = pType === 'yearly' ? { year: h.period_name, categories: [] } : { semester: h.period_name, categories: [] }; 
                 arr.push(periodMatch); 
               }
               
               let c = periodMatch.categories.find(x => x.name === h.category);
               if(!c) { c = { name: h.category, members: [] }; periodMatch.categories.push(c); }
               
               c.members.push({ recipient: h.recipient, image: h.image, id: h.id });
               def.hallOfFame[aType][pType] = arr;
            });
        }

        // 5. Hierarchy Ban -> Nhóm -> TV
        if (departments) {
            def.departments = departments.map(d => {
                const dTeams = (teams || []).filter(t => t.department_id === d.id).map(t => {
                   const tMembers = (members || []).filter(m => m.team_id === t.id && m.type === 'team_member').map(m => ({
                       id: m.id, name: m.name, role: m.role, photo: m.photo
                   }));
                   return { ...t, members: tMembers };
                });
                const dMembers = (members || []).filter(m => m.department_id === d.id && m.type === 'dept_member').map(m => ({
                   id: m.id, name: m.name, role: m.role, photo: m.photo
                }));
                return { ...d, teams: dTeams, members: dMembers };
            });
        }
        
        // 6. Ban Chủ nhiệm & Chủ tịch
        if (members) {
            def.presidents = members.filter(m => m.type === 'president').map(m => ({
                id: m.id, name: m.name, gen: m.generation, term: m.term, photo: m.photo
            }));
            
            const board = members.filter(m => m.type === 'board_member');
            const termsMap = {};
            board.forEach(m => {
               if(!termsMap[m.term]) termsMap[m.term] = [];
               termsMap[m.term].push({ id: m.id, name: m.name, role: m.role, level: m.level, photo: m.photo });
            });
            def.boardGenerations = Object.keys(termsMap).length > 0 ? Object.entries(termsMap).map(([term, mems]) => ({
                term, members: mems
            })) : [{ term: "Nhiệm kỳ hiện tại", members: [] }];
        }

        this._data = def;

      } catch (e) {
        console.error('Failed to load multi-tables:', e);
        this._data = this._getDefaults();
      }
      this._loaded = true;
      return this._data;
    })();

    return this._loadPromise;
  },

  get() {
    if (!this._data) this._data = this._getDefaults();
    return this._data;
  },

  /** Tự động băm nhỏ cấu trúc JSON trên Front-end để Save vào 10 Bảng Supabase */
  async save(data) {
    if (data) this._data = data;
    const d = this._data;

    // Chuẩn bị Row Data (Chỉ trích xuất)
    const settingsRows = [
      { id: 'general', type: 'general', data: d.general },
      { id: 'footer', type: 'footer', data: d.footer },
      { id: 'home', type: 'home', data: d.home },
      { id: 'about', type: 'about', data: d.about }
    ];

    const projectRows = (d.projects || []).map(p => ({
        id: p.id || uuidv4(),
        title: p.title || '', subtitle: p.subtitle || '', year: p.year || '',
        category: p.category || '', image: p.image || '', banner: p.banner || '',
        description: p.description || '', featured: p.featured || false, ongoing: p.ongoing || false,
        links: p.links || [], milestones: p.milestones || [], stats: p.stats || {}
    }));

    const awardRows = (d.awards || []).map(a => ({ id: a.id || uuidv4(), title: a.title, image: a.image }));
    const collabRows = (d.collaborators || []).map(c => ({ id: c.id || uuidv4(), name: c.name, photo: c.photo }));
    const sponsorRows = (d.sponsors || []).map(c => ({ id: c.id || uuidv4(), name: c.name, logo: c.logo }));
    const mediaRows = (d.mediaEcosystem?.channels || []).map(c => ({ id: c.id || uuidv4(), name: c.name, logo: c.logo, followers: c.followers, url: c.url }));

    const hofRows = [];
    ['individuals', 'collectives'].forEach(aType => {
      ['yearly', 'semesters'].forEach(pType => {
        const periods = (d.hallOfFame?.[aType]?.[pType] || []);
        periods.forEach(period => {
           const pName = period.year || period.semester;
           (period.categories || []).forEach(cat => {
               (cat.members || []).forEach(mem => {
                   hofRows.push({ id: mem.id || uuidv4(), period_type: pType, period_name: pName, award_type: aType, category: cat.name, recipient: mem.recipient, image: mem.image });
               });
           });
        });
      });
    });

    const deptRows = [];
    const teamRows = [];
    const memberRows = [];

    (d.departments || []).forEach(dept => {
       const dId = dept.id || uuidv4();
       deptRows.push({ id: dId, name: dept.name, image: dept.image, description: dept.description });
       (dept.teams || []).forEach(team => {
          const tId = uuidv4();
          teamRows.push({ id: tId, department_id: dId, name: team.name, image: team.image, description: team.description });
          (team.members || []).forEach(mem => {
             memberRows.push({ id: mem.id || uuidv4(), team_id: tId, type: 'team_member', name: mem.name, role: mem.role, photo: mem.photo });
          });
       });
       (dept.members || []).forEach(mem => {
          memberRows.push({ id: mem.id || uuidv4(), department_id: dId, type: 'dept_member', name: mem.name, role: mem.role, photo: mem.photo });
       });
    });

    (d.boardGenerations || []).forEach(gen => {
       (gen.members || []).forEach(mem => {
           memberRows.push({ id: mem.id || uuidv4(), type: 'board_member', name: mem.name, role: mem.role, level: mem.level || 1, photo: mem.photo, term: gen.term });
       });
    });

    (d.presidents || []).forEach(mem => {
       memberRows.push({ id: mem.id || uuidv4(), type: 'president', name: mem.name, term: mem.term, generation: mem.gen, photo: mem.photo });
    });

    try {
      const replaceTable = async (table, rows) => {
        const { error: delErr } = await supabase.from(table).delete().not('id', 'is', null);
        if (delErr) throw new Error(`Delete ${table} failed: ` + delErr.message);
        
        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i += 500) {
              const { error: insErr } = await supabase.from(table).insert(rows.slice(i, i+500));
              if (insErr) throw new Error(`Insert ${table} failed: ` + insErr.message);
            }
        }
      };

      const { error: setErr } = await supabase.from('csg_settings').upsert(settingsRows);
      if (setErr) throw new Error("Settings upsert failed: " + setErr.message);
      
      await replaceTable('csg_projects', projectRows);
      await replaceTable('csg_awards', awardRows);
      await replaceTable('csg_collaborators', collabRows);
      await replaceTable('csg_sponsors', sponsorRows);
      await replaceTable('csg_media', mediaRows);
      await replaceTable('csg_hall_of_fame', hofRows);

      // Foreign keys: xóa con trước, cha sau
      const { error: err1 } = await supabase.from('csg_members').delete().not('id', 'is', null);
      if(err1) throw err1;
      const { error: err2 } = await supabase.from('csg_teams').delete().not('id', 'is', null);
      if(err2) throw err2;
      const { error: err3 } = await supabase.from('csg_departments').delete().not('id', 'is', null);
      if(err3) throw err3;

      if (deptRows.length > 0) {
        const { error } = await supabase.from('csg_departments').insert(deptRows);
        if (error) throw new Error("Dept Insert: " + error.message);
      }
      if (teamRows.length > 0) {
        const { error } = await supabase.from('csg_teams').insert(teamRows);
        if (error) throw new Error("Team Insert: " + error.message);
      }
      if (memberRows.length > 0) await replaceTable('csg_members', memberRows);

      return true;
    } catch (e) {
      console.error('Save failed details:', e);
      alert('Đồng bộ lên Cloud THẤT BẠI: ' + (e.message || String(e)));
      return false;
    }
  },

  exportJSON() { return JSON.stringify(this.get(), null, 2); },

  async importJSON(jsonStr) {
    try {
      this._data = JSON.parse(jsonStr);
      await this.save(this._data);
      return true;
    } catch (e) {
      console.error('Invalid JSON:', e);
      return false;
    }
  },

  getProject(id) { return (this.get().projects || []).find(p => p.id === id) || null; },
  getDepartment(id) { return (this.get().departments || []).find(d => d.id === id) || null; },

  _deepMerge(target, source) {
    const result = { ...target };
    if(!source) return result;
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  },

  _getDefaults() {
    return {
      general: { siteName: "Cóc Sài Gòn", siteTagline: "Câu lạc bộ Truyền thông", logoUrl: "/assets/logo/logo.svg", description: "", socialLinks: { facebook: "#", instagram: "#", tiktok: "#", youtube: "#" } },
      nav: [ { label: "Trang chủ", href: "/" }, { label: "Dự án", href: "/projects" }, { label: "Vinh danh", href: "/hall-of-fame" }, { label: "Thành viên", href: "/member" }, { label: "Ấn tượng", href: "/achievement" }, { label: "Về Cóc", href: "/about" } ],
      home: { hero: { banners: [] }, diary: { title: "", tag: "", cardTitle: "", cardDesc: "", cardImage: "" }, gallery: { title: "", items: [] }, stats: { title: "Những con số ấn tượng", items: [] }, testimonials: { title: "", items: [] } },
      projectCategories: [], projects: [], awards: [], departments: [],
      about: { quote: "", introText: "", blocks: [], benefits: { title: "", items: [] } },
      hallOfFame: { individuals: { yearly: [], semesters: [] }, collectives: { yearly: [], semesters: [] } },
      presidents: [], boardGenerations: [{ term: "Nhiệm kỳ hiện tại", members: [] }], mediaEcosystem: { totalFollowers: "", channels: [] }, sponsors: [], collaborators: [],
      footer: { description: "", address: "", email: "", phone: "", affiliates: [], projectLinks: [], otherLinks: [], competitions: [] }
    };
  }
};

export default DataManager;
window.DataManager = DataManager;
