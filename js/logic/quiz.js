// js/logic/quiz.js
import { questions } from '../config/questions.js';
import { archetypes } from '../data/archetypes.js';
import { submitToGoogle, submitEmailToGoogle } from '../services/google.js';
import { track } from '../services/analytics.js';
import { t, getLang, setLang as setLangInternal } from '../services/lang.js';

function isValidEmail(email) {
  // simple, safe validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

let lastResult = null;
export function getLastResult() {
  return lastResult;
}

// --------------------
// i18n helpers (safe fallback)
// --------------------
// Supports:
// - dot paths: "ui.start", "questions.t1.title", "archetypes.APHRODITE.role"
// - interpolation: "Open {k} view" via vars {k: "..."} (works for BOTH en/vi if you standardize to strings)
function tr(path, fallback, vars) {
  try {
    const dict = t?.() || {};
    const parts = String(path).split('.');
    let cur = dict;
    for (const p of parts) cur = cur?.[p];

    if (cur == null || cur === '') return fallback;

    // If someone accidentally left a function in the dict, try to call it safely.
    // (Still recommend making both en/vi strings for consistency.)
    if (typeof cur === 'function') {
      const v = (vars && typeof vars === 'object') ? (vars.k ?? vars) : vars;
      return String(cur(v));
    }

    let s = String(cur);

    if (vars && typeof vars === 'object') {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replaceAll(`{${k}}`, String(v));
      }
    }
    return s;
  } catch {
    return fallback;
  }
}

// Prefer i18n archetype fields if present; fallback to archetypes.js data.
function trA(type, field, fallback) {
  return tr(`archetypes.${String(type).toUpperCase()}.${field}`, fallback);
}

// Prefer i18n question fields if present; fallback to questions.js data.
function trQ(qid, field, fallback) {
  return tr(`questions.${String(qid)}.${field}`, fallback);
}

function applyStaticUIText() {
  // Set <html lang="">
  try { document.documentElement.lang = getLang(); } catch {}

  // These elements may exist before quiz start
  const prevBtn = document.getElementById('btn-prev');
  if (prevBtn) prevBtn.textContent = tr('ui.prev', prevBtn.textContent || 'Previous Command');

  const nextBtn = document.getElementById('btn-next');
  if (nextBtn) nextBtn.textContent = tr('ui.next', nextBtn.textContent || 'Next Command');

  const restartBtn = document.getElementById('btn-restart');
  if (restartBtn) restartBtn.textContent = tr('ui.restart', restartBtn.textContent || 'Restart');

  const startBtn = document.getElementById('btn-start');
  if (startBtn) startBtn.textContent = tr('ui.start', startBtn.textContent || 'Initialize System');

  const warn = document.getElementById('quiz-warning');
  if (warn) warn.textContent = tr('ui.selectWarning', warn.textContent || 'Please select an option.');
}

function sNoteFromAvgS(avgS) {
  if (avgS == null) return null;

  if (avgS >= 3.7) {
    return tr(
      'premium.sNoteHigh',
      `Because your <strong>Adaptability</strong> is high, you may relate to multiple archetypes.`
    );
  }
  if (avgS <= 2.6) {
    return tr(
      'premium.sNoteLow',
      `Because your <strong>Adaptability</strong> is lower, your pattern tends to be more stable and repeatable.`
    );
  }
  return tr(
    'premium.sNoteMid',
    `Your <strong>Adaptability</strong> is moderate — your pattern shifts depending on context.`
  );
}

// --- 3. THE LOGIC ---
let currentQ = 0;
let quizStarted = false;
let radarChartInstance = null;

const form = document.getElementById('quiz-form');

function refreshPremiumUI() {
  const res = getLastResult();
  const nS = questions.filter(q => q.type === 'S').length;

  // Get archetype from result OR URL params
  const params = new URLSearchParams(window.location.search);
  const urlType = params.get('a')?.toUpperCase();
  const archetype = res?.type || urlType || 'UNKNOWN';

  const sNoteEl = document.getElementById('premium-s-note');
  const formEl = document.getElementById('premium-form');
  const openBtn = document.getElementById('premium-open');
  const submitBtn = document.getElementById('premium-submit');
  const emailEl = document.getElementById('premium-email');
  const statusEl = document.getElementById('premium-status');

  if (!openBtn || !formEl || !submitBtn || !emailEl) return;

  // Always show fake door; only show S-note if we have S data
  const hasS = !!(res && typeof res.sS === 'number' && nS > 0);
  const avgS = hasS ? (res.sS / nS) : null;

  if (sNoteEl) {
    const note = sNoteFromAvgS(avgS);
    if (note) {
      sNoteEl.innerHTML = note;
      sNoteEl.hidden = false;
    } else {
      sNoteEl.textContent = '';
      sNoteEl.hidden = true;
    }
  }

  // Fake door: expand email form on click
  openBtn.onclick = () => {
    formEl.hidden = false;
    emailEl.focus();
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.style.display = 'none';
    }
    track('premium_open_click', { archetype });
  };

  submitBtn.onclick = async () => {
    const email = String(emailEl.value || '').trim();

    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.textContent = '';
    }

    if (!isValidEmail(email)) {
      if (statusEl) statusEl.textContent = tr('premium.emailInvalid', 'Please enter a valid email.');
      track('premium_email_invalid', { archetype });
      return;
    }

    if (statusEl) statusEl.textContent = tr('premium.submitting', 'Submitting...');

    track('premium_email_submit_click', { archetype });

    const ok = await submitEmailToGoogle(email, archetype, hasS ? res.sS : undefined);

    if (ok) {
      if (statusEl) statusEl.textContent = tr('premium.thanks', `Thanks! We'll notify you.`);
      track('premium_email_submit_success', { archetype });
    } else {
      if (statusEl) statusEl.textContent = tr('premium.sendError', 'Error sending. Please try again.');
      track('premium_email_submit_fail', { archetype });
    }
  };
}

// --------------------
// Reset + Lang globals (for HTML onclick)
// --------------------
const STORAGE_KEY = 'nousys_quiz_state_v1';
const STORAGE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function resetDiagnostic() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  history.replaceState(null, '', window.location.pathname); // remove query
  window.location.reload();
}

// Make callable from HTML
window.resetDiagnostic = resetDiagnostic;

// Use your lang.js setter, then reload so the quiz/result re-renders in new lang
window.setLang = (lang) => {
  try { setLangInternal(lang); } catch {}
  window.location.reload();
};

// --------------------
// Local save (progress + last result)
// --------------------
function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj?.updatedAt && (Date.now() - obj.updatedAt) > STORAGE_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return obj;
  } catch {
    return null;
  }
}

function saveSaved(patch) {
  try {
    const prev = loadSaved() || {};
    const next = { ...prev, ...patch, updatedAt: Date.now(), version: 1 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

function getAnswersFromForm() {
  const fd = new FormData(form);
  const answers = {};
  questions.forEach(q => {
    const v = fd.get(q.id);
    if (v != null) answers[q.id] = Number(v);
  });
  return answers;
}

function applyAnswersToForm(answers) {
  if (!answers || !form) return;
  Object.entries(answers).forEach(([qid, val]) => {
    const input = form.querySelector(`input[name="${qid}"][value="${val}"]`);
    if (input) input.checked = true;
  });
}

function saveProgress() {
  if (!quizStarted) return;
  if (!form) return;
  if (currentQ >= questions.length) return;
  saveSaved({
    progress: {
      currentQ,
      answers: getAnswersFromForm(),
      started: true,
    }
  });
}

function restoreProgressIfAny() {
  const saved = loadSaved();
  const p = saved?.progress;
  if (!p?.started || !p?.answers) return false;

  applyAnswersToForm(p.answers);

  const idx = (typeof p.currentQ === 'number') ? p.currentQ : 0;
  const clamped = Math.max(0, Math.min(questions.length - 1, idx));

  document.getElementById(`q-${currentQ}`)?.classList.remove('active');
  currentQ = clamped;
  document.getElementById(`q-${currentQ}`)?.classList.add('active');

  setProgressUI();
  return true;
}

// --------------------
// URL helpers
// --------------------
function intParam(params, key) {
  const v = parseInt(params.get(key), 10);
  return Number.isFinite(v) ? v : null;
}

function buildResultUrl({ type, sE, sC, sT, sS, wingKey }) {
  const url = new URL(window.location.href);
  url.searchParams.set('a', String(type).toUpperCase());
  url.searchParams.set('e', String(sE));
  url.searchParams.set('c', String(sC));
  url.searchParams.set('t', String(sT));
  url.searchParams.set('s', String(sS));
  if (wingKey) url.searchParams.set('w', String(wingKey).toUpperCase());
  else url.searchParams.delete('w');
  return url;
}

function updateUrlForResult(payload) {
  const url = buildResultUrl(payload);
  history.replaceState(null, '', `${url.pathname}${url.search}`);
  return url;
}

// --------------------
// UI helpers
// --------------------
function setProgressUI() {
  const total = questions.length;

  const bar = document.getElementById('progress-bar');
  if (bar) {
    const pct = total ? ((currentQ + 1) / total) * 100 : 0;
    bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  }

  const pt = document.getElementById('progress-text');
  if (pt) pt.textContent = `${currentQ + 1} / ${total}`;

  const prevBtn = document.getElementById('btn-prev');
  if (prevBtn) prevBtn.disabled = (currentQ === 0);
}

function showWarning(show) {
  const warn = document.getElementById('quiz-warning');
  if (!warn) return;
  warn.textContent = tr('ui.selectWarning', 'Please select an option.');
  warn.style.display = show ? 'block' : 'none';
}

// --------------------
// Split-card init
// --------------------
function initQuiz() {
  if (!form) return;
  if (form.dataset.initialized === '1') return;
  form.dataset.initialized = '1';

  const TYPE_TO_SYSTEM = {
    T: 'SYSTEM: THREAT',
    C: 'SYSTEM: CONTROL',
    E: 'SYSTEM: ENERGY',
    S: 'SYSTEM: STRETCH',
  };

  questions.forEach((q, index) => {
    const div = document.createElement('div');
    div.className = `question-card`;
    div.id = `q-${index}`;

    const hasSplitFields = q.title && q.scene && q.leftOption && q.rightOption;

    if (!hasSplitFields) {
      const text = trQ(q.id, 'text', q.text);
      const leftLab = trQ(q.id, 'leftLabel', q.leftLabel) || tr('ui.disagree', 'Disagree');
      const rightLab = trQ(q.id, 'rightLabel', q.rightLabel) || tr('ui.agree', 'Agree');

      div.innerHTML = `
        <div class="question-text">${text}</div>
        <div class="options">
          ${[1, 2, 3, 4, 5].map(val => `
            <label class="option-label">
              <input type="radio" name="${q.id}" value="${val}">
              <span>${val}</span>
            </label>
          `).join('')}
        </div>
        <div style="display:flex; justify-content:space-between; font-size: 0.8rem; opacity: 0.5; padding: 0 5px;">
          <span>${leftLab}</span>
          <span>${rightLab}</span>
        </div>
      `;
    } else {
      const systemTag = trQ(
        q.id,
        'systemTag',
        q.systemTag || TYPE_TO_SYSTEM[q.type] || 'SYSTEM'
      );

      const title = trQ(q.id, 'title', q.title);
      const scene = trQ(q.id, 'scene', q.scene);
      const leftOption = trQ(q.id, 'leftOption', q.leftOption);
      const rightOption = trQ(q.id, 'rightOption', q.rightOption);
      const leftLabel = trQ(q.id, 'leftLabel', q.leftLabel);
      const rightLabel = trQ(q.id, 'rightLabel', q.rightLabel);

      div.innerHTML = `
        <div class="q-top">
          <div class="q-tag">${systemTag}</div>
          <div class="q-title">${title}</div>
          <div class="q-scene">
            <strong>${tr('ui.scene', 'Scene:')}</strong> ${scene}
          </div>
        </div>

        <div class="q-cards">
          <button type="button" class="q-card q-card-left" data-value="1">
            <div class="q-card-body">${leftOption}</div>
          </button>

          <button type="button" class="q-card q-card-right" data-value="5">
            <div class="q-card-body">${rightOption}</div>
          </button>
        </div>

        <div class="options options-centered">
          ${[1, 2, 3, 4, 5].map(val => `
            <label class="option-label">
              <input type="radio" name="${q.id}" value="${val}">
              <span>${val}</span>
            </label>
          `).join('')}
        </div>

        <div class="q-scale">
          <span>${leftLabel || tr('ui.left', 'Left')}</span>
          <span>${rightLabel || tr('ui.right', 'Right')}</span>
        </div>
      `;

      div.querySelectorAll('.q-card').forEach((btn) => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-value');
          const input = div.querySelector(`input[name="${q.id}"][value="${val}"]`);
          if (input) {
            input.checked = true;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
          showWarning(false);
        });
      });
    }

    // autosave on any selection change inside this question
    div.addEventListener('change', (e) => {
      if (e.target?.matches?.('input[type="radio"]')) {
        showWarning(false);
        saveProgress();
      }
    });

    form.appendChild(div);
  });

  currentQ = 0;
  document.getElementById('q-0')?.classList.add('active');

  showWarning(false);
  setProgressUI();

  track('question_view', { question_index: 1 });
}

// --------------------
// Wing logic (Adapt)
// --------------------
function computeAdaptWing({ avgS, avgRange, avgRecovery, primaryType }) {
  const SHOW_WING_AT = 3.75;

  if (!avgS || avgS < SHOW_WING_AT) return null;
  if (primaryType === 'HERMES' || primaryType === 'DEMETER') return null;

  const key = (avgRange >= avgRecovery) ? 'HERMES' : 'DEMETER';
  const flavor = (key === 'HERMES')
    ? tr('wing.hermesFlavor', 'Range / Adaptation')
    : tr('wing.demeterFlavor', 'Recovery / Regeneration');
  return { key, flavor };
}

// --------------------
// Radar chart
// --------------------
function renderRadarChart({ sE, sC, sT, sS, max }) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  if (typeof window.Chart === 'undefined') {
    console.warn('Chart.js not found. Ensure chart.umd.min.js loads before your module executes.');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (radarChartInstance) {
    radarChartInstance.destroy();
    radarChartInstance = null;
  }

  radarChartInstance = new window.Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        tr('ui.energy', 'Energy'),
        tr('ui.control', 'Control'),
        tr('ui.threat', 'Threat'),
        tr('ui.adapt', 'Adapt'),
      ],
      datasets: [{
        label: tr('ui.scores', 'Scores'),
        data: [sE, sC, sT, sS],
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.9)',
        backgroundColor: 'rgba(212, 175, 55, 0.18)',
        pointBackgroundColor: 'rgba(212, 175, 55, 1)',
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0,
          max: max,
          ticks: { display: false },
          grid: { color: 'rgba(255,255,255,0.08)' },
          angleLines: { color: 'rgba(255,255,255,0.08)' },
          pointLabels: { color: 'rgba(203, 213, 225, 0.9)', font: { size: 12 } }
        }
      },
      animation: { duration: 350 }
    }
  });
}

// --------------------
// Quiz controls
// --------------------
function startQuiz() {
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';

  quizStarted = true;
  track('quiz_start');

  applyStaticUIText();
  initQuiz();

  const restored = restoreProgressIfAny();
  if (restored) {
    track('quiz_resume', { question_index: currentQ + 1 });
  }
}

function nextQuestion() {
  const inputs = document.getElementsByName(questions[currentQ].id);
  let selected = false;
  for (let input of inputs) if (input.checked) selected = true;

  if (!selected) {
    showWarning(true);
    return;
  }
  showWarning(false);

  document.getElementById(`q-${currentQ}`)?.classList.remove('active');
  currentQ++;

  if (currentQ < questions.length) {
    document.getElementById(`q-${currentQ}`)?.classList.add('active');
    setProgressUI();
    saveProgress();
    track('question_view', { question_index: currentQ + 1 });
  } else {
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = `100%`;

    saveSaved({ progress: { started: false, currentQ: questions.length, answers: getAnswersFromForm() } });

    document.getElementById('quiz-screen').style.display = 'none';
    calculateResult();
  }
}

function prevQuestion() {
  if (currentQ <= 0) return;

  showWarning(false);

  document.getElementById(`q-${currentQ}`)?.classList.remove('active');
  currentQ--;

  document.getElementById(`q-${currentQ}`)?.classList.add('active');
  setProgressUI();
  saveProgress();

  track('question_view', { question_index: currentQ + 1, nav: 'back' });
}

// --------------------
// RESULT CALC
// --------------------
function calculateResult() {
  // --- 1. SETUP VARIABLES ---
  let sE = 0, sC = 0, sT = 0, sS = 0;
  let sRange = 0, nRange = 0;
  let sRecovery = 0, nRecovery = 0;

  const formData = new FormData(form);

  // Count questions per type
  const nE = questions.filter(q => q.type === 'E').length;
  const nC = questions.filter(q => q.type === 'C').length;
  const nT = questions.filter(q => q.type === 'T').length;
  const nS = questions.filter(q => q.type === 'S').length;

  // --- 2. CALCULATE SCORES ---
  questions.forEach(q => {
    let val = parseInt(formData.get(q.id), 10);
    if (q.reverse) val = 6 - val; // Assuming 1-5 scale

    if (q.type === 'E') sE += val;
    if (q.type === 'C') sC += val;
    if (q.type === 'T') sT += val;

    if (q.type === 'S') {
      sS += val;
      // Hermers (Range) vs Demeter (Recovery) sub-scores
      if (['s1', 's4', 's5'].includes(q.id)) { sRange += val; nRange++; }
      if (['s2', 's3', 's6'].includes(q.id)) { sRecovery += val; nRecovery++; }
    }
  });

  // Calculate Averages
  const avgE = nE ? sE / nE : 0;
  const avgC = nC ? sC / nC : 0;
  const avgT = nT ? sT / nT : 0;
  const avgS = nS ? sS / nS : 0;
  const avgRange = nRange ? sRange / nRange : 0;
  const avgRecovery = nRecovery ? sRecovery / nRecovery : 0;

  // --- 3. DEFINE LOGIC THRESHOLDS ---
  // Adjust these based on your dataset percentiles
  const MID = 3.0;      // P50 (Cutoff for High/Low)
  const VH  = 4.4;      // P90 (Trigger for Very High)
  const VL  = 1.6;      // P10 (Trigger for Very Low)

  let type = "";

  // --- 4. LAYER 1: DETERMINE BASE ARCHETYPE (The 8 Cores) ---
  // Logic: Binary check against MID (High vs Low)
  const isHighE = avgE >= MID;
  const isHighC = avgC >= MID;
  const isHighT = avgT >= MID;

  if (isHighE && isHighC && isHighT)      type = "HERA";        // H-H-H
  else if (isHighE && isHighC && !isHighT) type = "ARES";       // H-H-L
  else if (isHighE && !isHighC && isHighT) type = "APHRODITE";  // H-L-H
  else if (isHighE && !isHighC && !isHighT) type = "APOLLO";    // H-L-L
  else if (!isHighE && isHighC && isHighT) type = "ATHENA";     // L-H-H
  else if (!isHighE && isHighC && !isHighT) type = "HEPHAESTUS";// L-H-L
  else if (!isHighE && !isHighC && isHighT) type = "ARTEMIS";   // L-L-H
  else                                      type = "HESTIA";    // L-L-L (Default fallback)

  // --- 5. LAYER 2: EXTREME OVERRIDE (The 3 Rare Modes) ---
  if (avgE >= VH && avgC >= VH) {
    type = "ZEUS";
  } else if (avgT >= VH && avgE <= VL) {
    type = "HADES";
  } else if (avgT >= VH && avgC <= VL) {
    type = "POSEIDON";
  }

  // --- 6. OUTPUT & UI UPDATES ---
  const wing = computeAdaptWing({ avgS, avgRange, avgRecovery, primaryType: type });
  const wingKey = wing?.key || null;

  lastResult = { sE, sC, sT, sS, type, wing: wingKey };
  saveSaved({ lastResult });

  track('quiz_complete', { archetype: type });
  updateUrlForResult({ type, sE, sC, sT, sS, wingKey });

  // Update UI Elements
  const data = archetypes[type];
  if (!data) console.error("Archetype data missing for:", type);

  const resScreen = document.getElementById('result-screen');
  resScreen.style.display = 'block';

  // Archetype fields: prefer i18n if you add js/i18n/archetypes_*.js later
  document.getElementById('result-name').innerText = trA(type, 'name', data?.name ?? type);
  document.getElementById('result-role').innerText = trA(type, 'role', data?.role ?? '');
  document.getElementById('result-img').src = data?.img ?? '';

  document.getElementById('result-desc').innerHTML = trA(type, 'desc', data?.desc ?? '');
  document.getElementById('result-roast').innerHTML = trA(type, 'roast', data?.roast ?? '');
  document.getElementById('result-bug').innerHTML = trA(type, 'bug', data?.bug ?? '');
  document.getElementById('result-fix').innerHTML = trA(type, 'fix', data?.fix ?? '');

  // Update Bars
  const maxE = nE * 5;
  const maxC = nC * 5;
  const maxT = nT * 5;
  const maxS = nS * 5;

  document.getElementById('bar-e').style.width = `${maxE ? (sE / maxE) * 100 : 0}%`;
  document.getElementById('bar-c').style.width = `${maxC ? (sC / maxC) * 100 : 0}%`;
  document.getElementById('bar-t').style.width = `${maxT ? (sT / maxT) * 100 : 0}%`;
  document.getElementById('bar-s').style.width = `${maxS ? (sS / maxS) * 100 : 0}%`;

  renderRadarChart({ sE, sC, sT, sS, max: Math.max(maxE, maxC, maxT, maxS, 1) });
  refreshPremiumUI();

  // Handle Wing/Secondary Display
  const wingText = document.getElementById('result-wing');
  const wingImg = document.getElementById('wing-img');

  if (wingKey && archetypes[wingKey]) {
    const wingViewUrl = buildResultUrl({
      type: wingKey, sE, sC, sT, sS, wingKey: type,
    }).toString();

    if (wingText) {
      wingText.innerHTML =
        `${tr('ui.secondaryInfluence', 'Secondary:')} <strong>${wingKey}</strong> ` +
        `<span style="opacity:0.8;">(${wing.flavor})</span>` +
        `<br><a href="${wingViewUrl}" style="color: var(--primary); text-decoration: underline;">` +
        `${tr('ui.openView', 'Open {k} view', { k: wingKey })}</a>`;
    }

    if (wingImg) {
      wingImg.src = archetypes[wingKey].img;
      wingImg.style.display = 'block';
      wingImg.onclick = () => { window.location.href = wingViewUrl; };
    }
  } else {
    if (wingText) wingText.textContent = '';
    if (wingImg) wingImg.style.display = 'none';
  }

  // Clear progress
  saveSaved({ progress: { started: false, currentQ: 0, answers: null } });
  submitToGoogle(sE, sC, sT, sS, sRange, sRecovery, type);
}

// --------------------
// Render result from URL (share links)
// --------------------
export function renderResultFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const a = params.get('a');
  if (!a) return;

  const type = a.toUpperCase();
  const data = archetypes[type];
  if (!data) return;

  applyStaticUIText();

  const e = intParam(params, 'e');
  const c = intParam(params, 'c');
  const tV = intParam(params, 't');
  const sV = intParam(params, 's');
  const w = params.get('w') ? params.get('w').toUpperCase() : null;

  const intro = document.getElementById('intro-screen');
  const quiz = document.getElementById('quiz-screen');
  if (intro) intro.style.display = 'none';
  if (quiz) quiz.style.display = 'none';

  const resScreen = document.getElementById('result-screen');
  if (resScreen) resScreen.style.display = 'block';

  document.getElementById('result-name').innerText = trA(type, 'name', data.name);
  document.getElementById('result-role').innerText = trA(type, 'role', data.role);
  document.getElementById('result-img').src = data.img;

  document.getElementById('result-desc').innerHTML = trA(type, 'desc', data.desc);
  document.getElementById('result-roast').innerHTML = trA(type, 'roast', data.roast || '');
  document.getElementById('result-bug').innerHTML = trA(type, 'bug', data.bug || '');
  document.getElementById('result-fix').innerHTML = trA(type, 'fix', data.fix || '');

  const nE = questions.filter(q => q.type === 'E').length;
  const nC = questions.filter(q => q.type === 'C').length;
  const nT = questions.filter(q => q.type === 'T').length;
  const nS = questions.filter(q => q.type === 'S').length;

  const maxE = nE * 5;
  const maxC = nC * 5;
  const maxT = nT * 5;
  const maxS = nS * 5;

  const sE = (e != null) ? e : 0;
  const sC = (c != null) ? c : 0;
  const sT = (tV != null) ? tV : 0;
  const sS = (sV != null) ? sV : 0;

  document.getElementById('bar-e').style.width = `${maxE ? (sE / maxE) * 100 : 0}%`;
  document.getElementById('bar-c').style.width = `${maxC ? (sC / maxC) * 100 : 0}%`;
  document.getElementById('bar-t').style.width = `${maxT ? (sT / maxT) * 100 : 0}%`;
  document.getElementById('bar-s').style.width = `${maxS ? (sS / maxS) * 100 : 0}%`;

  if (sE != 0 && sC != 0 && sT != 0 && sS != 0) {
    renderRadarChart({ sE, sC, sT, sS, max: Math.max(maxE, maxC, maxT, maxS, 1) });
  }
  refreshPremiumUI();

  // Wing UI (from URL w=)
  const wingText = document.getElementById('result-wing');
  const wingImg = document.getElementById('wing-img');

  if (w && archetypes[w]) {
    const wingViewUrl = buildResultUrl({
      type: w,
      sE, sC, sT, sS,
      wingKey: type,
    }).toString();

    if (wingText) {
      wingText.innerHTML =
        `${tr('ui.secondaryInfluence', 'Secondary Influence:')} <strong>${w}</strong>` +
        `<br><a href="${wingViewUrl}" style="color: var(--primary); text-decoration: underline;">` +
        `${tr('ui.openView', 'Open {k} view', { k: w })}</a>`;
    }

    if (wingImg) {
      wingImg.src = archetypes[w].img;
      wingImg.style.display = 'block';
      wingImg.style.cursor = 'pointer';
      wingImg.onclick = () => { window.location.href = wingViewUrl; };
    }
  } else {
    if (wingText) wingText.textContent = '';
    if (wingImg) wingImg.style.display = 'none';
  }

  lastResult = { sE, sC, sT, sS, type, wing: w };
  saveSaved({ lastResult });

  track('result_view', { archetype: type, via: 'url' });
}

// --------------------
window.addEventListener('pagehide', () => {
  if (!quizStarted) return;
  if (currentQ >= questions.length) return;

  saveProgress();
  track('quiz_abandon', { last_question_index: currentQ + 1 });
});

// Run once (safe, DOM exists because module is at end of body)
applyStaticUIText();
refreshPremiumUI();

export { startQuiz, nextQuestion, prevQuestion };