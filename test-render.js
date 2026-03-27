import DataManager from './js/data-manager.js';

const siteData = DataManager._getDefaults();
const f = siteData.footer || {};
const g = siteData.general;
const h = siteData.home;

console.log('footer:', f);
console.log('general:', g);
console.log('home:', h);

try {
  const esc = (str) => str;
  const banners = (h.hero.banners || []).map((b, i) => b.bgImage).join('');
  const statItems = (h.stats?.items || []).map((s, i) => s.number).join('');
  console.log(esc(g.socialLinks.facebook));
} catch(e) {
  console.error("ERROR IN RENDER:", e);
}
