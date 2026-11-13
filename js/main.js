// Theme switch: light by default, choice remembered in this browser
const toggles = document.querySelectorAll('.theme-toggle');
const setTheme = dark => {
  if (dark) document.documentElement.dataset.theme = 'dark'; else delete document.documentElement.dataset.theme;
  toggles.forEach(b => b.setAttribute('aria-pressed', dark));
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
};
toggles.forEach(b => {
  b.setAttribute('aria-pressed', document.documentElement.dataset.theme === 'dark');
  b.addEventListener('click', () => setTheme(document.documentElement.dataset.theme !== 'dark'));
});

// Live Pacific time in the location tile
const clock = document.getElementById('clock');
if (clock) {
  const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' });
  const tick = () => { clock.textContent = fmt.format(new Date()); };
  tick(); setInterval(tick, 30000);
}

// Project filters: non-matching tiles fade out and leave the Tab order (inert)
const chips = document.querySelectorAll('.chip[data-f]');
const status = document.getElementById('filterStatus');
const applyFilter = (chip, announce = true) => {
  const f = chip.dataset.f;
  chips.forEach(c => c.setAttribute('aria-pressed', c === chip));
  let shown = 0;
  document.querySelectorAll('.t[data-cat]').forEach(t => {
    const on = f === 'all' || t.dataset.cat.split(' ').includes(f);
    t.classList.toggle('dim', !on);
    t.inert = !on;
    if (on) shown++;
  });
  if (status && announce) status.textContent = f === 'all' ? 'Showing all work' : `Showing ${shown} ${chip.textContent} projects`;
};
chips.forEach(chip => chip.addEventListener('click', () => applyFilter(chip)));
// Reset any active filter back to "All"
const resetFilter = () => { const all = document.querySelector('.chip[data-f="all"]'); if (all) applyFilter(all, false); };

// Sketch vs final sliders: a real range input, so it works with keyboard and screen readers
document.querySelectorAll('.compare input[type=range]').forEach(r => {
  const box = r.closest('.compare');
  const set = () => box.style.setProperty('--cut', r.value + '%');
  r.addEventListener('input', set); set();
});

// "Web dev" view: #dev shows only the web development projects
const devView = () => {
  resetFilter();
  const on = location.hash === '#dev';
  document.body.classList.toggle('dev-view', on);
  if (on) document.getElementById('dev-h')?.scrollIntoView({ block: 'start' });
};
window.addEventListener('hashchange', devView);
devView();

// Any top-menu link clears the filters first (also when the hash does not change)
document.querySelectorAll('header nav a, .dev-head a').forEach(a => a.addEventListener('click', () => {
  resetFilter();
  if (a.getAttribute('href') === '#') { history.replaceState(null, '', location.pathname); devView(); }
}));
