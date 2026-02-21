import { questions } from '../config/questions.js';
import { archetypes } from '../data/archetypes.js';
import { submitToGoogle } from '../services/google.js';
import { track } from '../services/analytics.js';
import { t, getLang, setLang as setLangInternal } from '../services/lang.js';


// --- 3. THE LOGIC ---
let currentQ = 0;
let quizStarted = false;
let radarChartInstance = null;

const form = document.getElementById('quiz-form');

let lastResult = null;
export function getLastResult() {
  return lastResult;
}


// --------------------
// Upsell / Fake-door email capture
// --------------------
const UPSELL_ENTRY_EMAIL = "entry.592806153";

// [Unverified] This assumes you want to submit to the SAME Google Form as submitToGoogle() uses.
// If your submitToGoogle() uses a different form, set this to the same formID.
const UPSELL_FORM_ID = "1FAIpQLScEWdwVaCJC-K7C_Ek7eQFWg8IaGiNvx-6txv8cTP6-x8drIQ";
const UPSELL_SUBMIT_URL = `https://docs.google.com/forms/d/e/${UPSELL_FORM_ID}/formResponse`;

let upsellBound = false;

function isValidEmail(email) {
  // basic sanity check; not perfect, but prevents garbage.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || '').trim());
}

async function submitUpsellEmail(email) {
  const data = new FormData();
  data.append(UPSELL_ENTRY_EMAIL, email);

  // no-cors means we can't read response; success = no exception thrown
  await fetch(UPSELL_SUBMIT_URL, { method: 'POST', mode: 'no-cors', body: data });
}

function buildUpsellMessage(avgS) {
  // avgS is 1..5
  if (avgS >= 3.7) {
    return `Your <strong>Adaptability</strong> is high — which means you can “shape-shift” across situations.
    Many high-S users feel less locked into one archetype. The Premium Guide explains your blended pattern and gives a deeper read.`;
  }
  if (avgS <= 2.6) {
    return `Your <strong>Adaptability</strong> is lower — which often makes your pattern more stable and repeatable.
    The Premium Guide gives a sharper “failure mode” + a step-by-step patch plan.`;
  }
  return `Want the deeper breakdown? The Premium Guide adds more detail, examples, and a clearer “why this happens” explanation.`;
}

function setupUpsellUI({ avgS }) {
  const block = document.getElementById('upsell-block');
  const text = document.getElementById('upsell-text');
  const openBtn = document.getElementById('upsell-open');

  const modal = document.getElementById('upsell-modal');
  const closeBtn = document.getElementById('upsell-close');
  const submitBtn = document.getElementById('upsell-submit');
  const emailEl = document.getElementById('upsell-email');
  const status = document.getElementById('upsell-status');

  if (!block || !text || !openBtn || !modal || !closeBtn || !submitBtn || !emailEl || !status) return;

  // show & set message
  block.style.display = 'block';
  text.innerHTML = buildUpsellMessage(avgS);

  if (upsellBound) return;
  upsellBound = true;

  function openModal() {
    modal.hidden = false;
    status.style.display = 'none';
    status.textContent = '';
    emailEl.value = '';
    emailEl.focus();
    track?.('upsell_open');
  }

  function closeModal() {
    modal.hidden = true;
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  // click outside closes
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (!modal.hidden && e.key === 'Escape') closeModal();
  });

  submitBtn.addEventListener('click', async () => {
    const email = String(emailEl.value || '').trim();

    if (!isValidEmail(email)) {
      status.style.display = 'block';
      status.textContent = 'Please enter a valid email.';
      return;
    }

    status.style.display = 'block';
    status.textContent = 'Sending...';

    try {
      await submitUpsellEmail(email);
      status.textContent = 'Thanks — you’re on the list.';
      track?.('upsell_email_submit', { ok: true });
    } catch (err) {
      console.log('Upsell submit error', err);
      status.textContent = 'Error sending. Please try again.';
      track?.('upsell_email_submit', { ok: false });
    }
  });
}


// --------------------
// i18n helpers (safe fallback)
// --------------------
function tr(path, fallback) {
  try {
    const dict = t?.() || {};
    const parts = String(path).split('.');
    let cur = dict;
    for (const p of parts) cur = cur?.[p];
    return (cur == null || cur === '') ? fallback : cur;
  } catch {
    return fallback;
  }
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
      div.innerHTML = `
        <div class="question-text">${q.text}</div>
        <div class="options">
          ${[1, 2, 3, 4, 5].map(val => `
            <label class="option-label">
              <input type="radio" name="${q.id}" value="${val}">
              <span>${val}</span>
            </label>
          `).join('')}
        </div>
        <div style="display:flex; justify-content:space-between; font-size: 0.8rem; opacity: 0.5; padding: 0 5px;">
          <span>${q.leftLabel || tr('ui.disagree', 'Disagree')}</span>
          <span>${q.rightLabel || tr('ui.agree', 'Agree')}</span>
        </div>
      `;
    } else {
      const systemTag = q.systemTag || TYPE_TO_SYSTEM[q.type] || 'SYSTEM';

      div.innerHTML = `
        <div class="q-top">
          <div class="q-tag">${systemTag}</div>
          <div class="q-title">${q.title}</div>
          <div class="q-scene">
            <strong>${tr('ui.scene', 'Scene:')}</strong> ${q.scene}
          </div>
        </div>

        <div class="q-cards">
          <button type="button" class="q-card q-card-left" data-value="1">
            <div class="q-card-label">${tr('ui.option1', 'Option 1 (Left)')}</div>
            <div class="q-card-body">${q.leftOption}</div>
          </button>

          <button type="button" class="q-card q-card-right" data-value="5">
            <div class="q-card-label">${tr('ui.option5', 'Option 5 (Right)')}</div>
            <div class="q-card-body">${q.rightOption}</div>
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
          <span>${q.leftLabel || tr('ui.left', 'Left')}</span>
          <span>${q.rightLabel || tr('ui.right', 'Right')}</span>
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
  const flavor = (key === 'HERMES') ? tr('wing.hermesFlavor', 'Range / Adaptation')
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
        label: 'Scores',
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
      // Hermes (Range) vs Demeter (Recovery) sub-scores
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
  const MID = 3.0;      // P50 (Cutoff for High/Low)
  const VH  = 4.4;      // P90 (Trigger for Very High)
  const VL  = 1.6;      // P10 (Trigger for Very Low)

  let type = "";

  // --- 4. LAYER 1: DETERMINE BASE ARCHETYPE (The 8 Cores) ---
  const isHighE = avgE >= MID;
  const isHighC = avgC >= MID;
  const isHighT = avgT >= MID;

  if (isHighE && isHighC && isHighT)       type = "HERA";       // H-H-H
  else if (isHighE && isHighC && !isHighT) type = "ARES";       // H-H-L
  else if (isHighE && !isHighC && isHighT) type = "APHRODITE";  // H-L-H
  else if (isHighE && !isHighC && !isHighT) type = "APOLLO";    // H-L-L
  else if (!isHighE && isHighC && isHighT) type = "ATHENA";     // L-H-H
  else if (!isHighE && isHighC && !isHighT) type = "HEPHAESTUS";// L-H-L
  else if (!isHighE && !isHighC && isHighT) type = "ARTEMIS";   // L-L-H
  else                                      type = "HESTIA";    // L-L-L (Default fallback)

  // --- 5. LAYER 2: EXTREME OVERRIDE (The 3 Rare Modes) ---
  // ZEUS: Very High Energy + Very High Control (Overrides Hera/Ares)
  if (avgE >= VH && avgC >= VH) {
      type = "ZEUS";
  }
  // HADES: Very High Threat + Very Low Energy (Overrides Athena/Hephaestus)
  else if (avgT >= VH && avgE <= VL) {
      type = "HADES";
  }
  // POSEIDON: Very High Threat + Very Low Control (Overrides Artemis/Aphrodite)
  else if (avgT >= VH && avgC <= VL) {
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

  document.getElementById('result-name').innerText = data.name;
  document.getElementById('result-role').innerText = data.role;
  document.getElementById('result-img').src = data.img;
  document.getElementById('result-desc').innerHTML = data.desc;
  document.getElementById('result-bug').innerHTML = data.bug || ""; 
  document.getElementById('result-fix').innerHTML = data.fix || "";

  const maxE = nE * 5;
  const maxC = nC * 5;
  const maxT = nT * 5;
  const maxS = nS * 5;

  document.getElementById('bar-e').style.width = `${maxE ? (sE / maxE) * 100 : 0}%`;
  document.getElementById('bar-c').style.width = `${maxC ? (sC / maxC) * 100 : 0}%`;
  document.getElementById('bar-t').style.width = `${maxT ? (sT / maxT) * 100 : 0}%`;
  document.getElementById('bar-s').style.width = `${maxS ? (sS / maxS) * 100 : 0}%`;

  renderRadarChart({ sE, sC, sT, sS, max: Math.max(maxE, maxC, maxT, maxS, 1) });

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
        `<br><a href="${wingViewUrl}" style="color: var(--primary); text-decoration: underline;">View</a>`;
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

  // NEW: initialize upsell after we know avgS
  setupUpsellUI({ avgS });
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

  document.getElementById('result-name').innerText = data.name;
  document.getElementById('result-role').innerText = data.role;
  document.getElementById('result-img').src = data.img;
  document.getElementById('result-desc').innerHTML = data.desc;
  document.getElementById('result-bug').innerHTML = data.bug;
  document.getElementById('result-fix').innerHTML = data.fix;

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

  renderRadarChart({ sE, sC, sT, sS, max: Math.max(maxE, maxC, maxT, maxS, 1) });
  setupUpsellUI({ avgS });

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
        `<br><a href="${wingViewUrl}" style="color: var(--primary); text-decoration: underline;">${tr('ui.openView', 'Open')} ${w} ${tr('ui.view', 'view')}</a>`;
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

export { startQuiz, nextQuestion, prevQuestion };
