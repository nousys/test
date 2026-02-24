// js/ui/settingsMenu.js
import { getLang, setLang } from '../services/lang.js';

function syncLangBadge() {
  const current = getLang(); // Returns 'en' or 'vi'
  const flagSpan = document.getElementById('lang-flag');
  const codeSpan = document.getElementById('lang-code');

  if (!flagSpan || !codeSpan) return;

  if (current === 'vi') {
    // Swap to Vietnam flag and VI text
    flagSpan.className = 'fi fi-vn';
    codeSpan.textContent = 'VI';
  } else {
    // Default to US flag and EN text
    flagSpan.className = 'fi fi-us';
    codeSpan.textContent = 'EN';
  }
}

function syncActiveLang() {
  const current = getLang();
  document.querySelectorAll('#settings-menu .settings-item[data-lang]').forEach((el) => {
    const active = el.getAttribute('data-lang') === current;
    el.classList.toggle('active', active);
    el.setAttribute('aria-checked', active ? 'true' : 'false');
  });
  syncLangBadge();
}

function closeAllPopups() {
  const langMenu = document.getElementById('settings-menu');
  const menuPop = document.getElementById('menu-pop');

  const menuBtn = document.getElementById('settings-btn');
  const langBtn = document.getElementById('lang-btn');

  if (langMenu) langMenu.hidden = true;
  if (menuPop) menuPop.hidden = true;

  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
}

function toggleMenu(e) {
  e?.stopPropagation?.();

  const pop = document.getElementById('menu-pop');
  const btn = document.getElementById('settings-btn');
  if (!pop || !btn) return;

  const willOpen = pop.hidden;
  closeAllPopups();
  pop.hidden = !willOpen;
  btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
}

function toggleLang(e) {
  e?.stopPropagation?.();

  const menu = document.getElementById('settings-menu');
  const btn = document.getElementById('lang-btn');
  if (!menu || !btn) return;

  const willOpen = menu.hidden;
  closeAllPopups();
  menu.hidden = !willOpen;
  btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');

  if (willOpen) syncActiveLang();
}

function init() {
  const menuBtn = document.getElementById('settings-btn');
  const langBtn = document.getElementById('lang-btn');
  const restartBtn = document.getElementById('restart-btn');

  const langMenu = document.getElementById('settings-menu');
  const menuPop = document.getElementById('menu-pop');

  // If your HTML isn't updated yet, fail safely
  if (!menuBtn || !langBtn || !restartBtn || !langMenu || !menuPop) {
    // Still try to at least sync badge if present
    syncLangBadge();
    return;
  }

  // Button wiring
  menuBtn.addEventListener('click', toggleMenu);
  langBtn.addEventListener('click', toggleLang);

  restartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllPopups();
    if (typeof window.resetDiagnostic === 'function') window.resetDiagnostic();
    else window.location.href = window.location.pathname;
  });

  // Close on outside click
  document.addEventListener('click', () => closeAllPopups());

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPopups();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const accordionBtn = document.getElementById('archetype-accordion-btn');
    const sublist = document.getElementById('archetype-sublist');
    const arrow = document.getElementById('accordion-arrow');

    if (accordionBtn && sublist) {
        accordionBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Keeps the main menu open
            
            if (sublist.style.display === 'none') {
                sublist.style.display = 'flex';
                arrow.textContent = '▲';
            } else {
                sublist.style.display = 'none';
                arrow.textContent = '▼';
            }
        });
    }
});

  // Language items
  langMenu.querySelectorAll('[data-lang]').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = item.getAttribute('data-lang');
      setLang(lang);             // sets localStorage + ?lang=
      window.location.reload();  // simplest + reliable
    });
  });

  // Prevent clicks inside popups from closing them
  langMenu.addEventListener('click', (e) => e.stopPropagation());
  menuPop.addEventListener('click', (e) => e.stopPropagation());

  // Initial UI sync
  syncActiveLang();
}

init();
