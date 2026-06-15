// THEME CYCLING
const themes = ['', 'theme-ocean', 'theme-dusk', 'theme-sui', 'theme-near', 'theme-ada', 'theme-light'];
let themeIndex = 0;

function cycleTheme() {
  document.body.classList.remove(...themes);
  themeIndex = (themeIndex + 1) % themes.length;
  if (themes[themeIndex]) document.body.classList.add(themes[themeIndex]);
  localStorage.setItem('devblock-theme', themes[themeIndex]);
}

// LOAD SAVED THEME
const savedTheme = localStorage.getItem('devblock-theme');
if (savedTheme) {
  document.body.classList.add(savedTheme);
  themeIndex = themes.indexOf(savedTheme);
}

// LIVE COUNTDOWN TIMER
function startTimer(endTime) {
  const el = document.getElementById('timer');
  if (!el) return;
  setInterval(() => {
    const diff = endTime - Date.now();
    if (diff <= 0) { el.textContent = 'ENDED'; return; }
    const h = Math.floor(diff / 3600000).toString().padStart(2,'0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2,'0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2,'0');
    el.textContent = `${h}:${m}:${s}`;
  }, 1000);
}
startTimer(Date.now() + 2 * 60 * 60 * 1000 + 14 * 60 * 1000 + 33 * 1000);

// LIVE ONLINE COUNT
function animateCount() {
  const el = document.getElementById('online');
  if (!el) return;
  setInterval(() => {
    const base = 312;
    const jitter = Math.floor(Math.random() * 10) - 5;
    el.textContent = base + jitter;
  }, 5000);
}
animateCount();

// TABS
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// VOTE BUTTONS
document.querySelectorAll('.vote-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const col = btn.closest('.vote-col');
    const count = col.querySelector('.vote-count');
    const isUp = btn.querySelector('.ti-chevron-up');
    const current = parseInt(count.textContent);
    count.textContent = isUp ? current + 1 : current - 1;
  });
});

// ACTIVE NAV
document.querySelectorAll('.nav-item, .nav-tab').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});
