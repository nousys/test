import { getLang, setLang } from '../services/lang.js';

function syncActiveLang() {
  const current = getLang();
  document.querySelectorAll('#settings-menu .settings-item[data-lang]').forEach((el) => {
    const active = el.getAttribute('data-lang') === current;
    el.classList.toggle('active', active);
    el.setAttribute('aria-checked', active ? 'true' : 'false');
  });
}

function closeMenu() {
  const menu = document.getElementById('settings-menu');
  const btn = document.getElementById('settings-btn');
  if (!menu || !btn) return;
  menu.hidden = true;
  btn.setAttribute('aria-expanded', 'false');
}

function toggleMenu(e) {
  e?.stopPropagation?.();
  const menu = document.getElementById('settings-menu');
  const btn = document.getElementById('settings-btn');
  if (!menu || !btn) return;
  const next = menu.hidden; // open if hidden
  menu.hidden = !next;
  btn.setAttribute('aria-expanded', next ? 'true' : 'false');
  if (next) syncActiveLang();
}

function init() {
  const btn = document.getElementById('settings-btn');
  const menu = document.getElementById('settings-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', toggleMenu);

  // close on outside click
  document.addEventListener('click', () => closeMenu());

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Language items
  menu.querySelectorAll('[data-lang]').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = item.getAttribute('data-lang');
      setLang(lang);           // sets localStorage + ?lang=
      window.location.reload(); // simplest + reliable for now
    });
  });

  // Restart
  const restart = document.getElementById('settings-restart');
  if (restart) {
    restart.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.resetDiagnostic === 'function') window.resetDiagnostic();
      else window.location.href = window.location.pathname;
    });
  }
}

init();
