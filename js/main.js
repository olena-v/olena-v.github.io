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
chips.forEach(chip => chip.addEventListener('click', () => {
  const f = chip.dataset.f;
  chips.forEach(c => c.setAttribute('aria-pressed', c === chip));
  let shown = 0;
  document.querySelectorAll('.t[data-cat]').forEach(t => {
    const on = f === 'all' || t.dataset.cat.split(' ').includes(f);
    t.classList.toggle('dim', !on);
    t.inert = !on;
    if (on) shown++;
  });
  if (status) status.textContent = f === 'all' ? 'Showing all work' : `Showing ${shown} ${chip.textContent} projects`;
}));

// Sketch vs final sliders: a real range input, so it works with keyboard and screen readers
document.querySelectorAll('.compare input[type=range]').forEach(r => {
  const box = r.closest('.compare');
  const set = () => box.style.setProperty('--cut', r.value + '%');
  r.addEventListener('input', set); set();
});

// "Web dev" view: #dev shows only the web development projects
const devView = () => {
  const on = location.hash === '#dev';
  document.body.classList.toggle('dev-view', on);
  if (on) document.getElementById('dev-h')?.scrollIntoView({ block: 'start' });
};
window.addEventListener('hashchange', devView);
devView();
