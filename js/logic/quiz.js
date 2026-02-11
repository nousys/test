import { questions } from '../config/questions.js';
import { archetypes } from '../data/archetypes.js';
import { submitToGoogle } from '../services/google.js';
import { track } from '../services/analytics.js';

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
  // Keep same path, update only query (no reload)
  history.replaceState(null, '', `${url.pathname}${url.search}`);
  return url;
}

// --------------------
// UI helpers (minimal)
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
  warn.style.display = show ? 'block' : 'none';
}

// --------------------
// Split-card init
// --------------------
function initQuiz() {
  if (form && form.dataset.initialized === '1') return;
  if (form) form.dataset.initialized = '1';

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
          <span>${q.leftLabel || 'Disagree'}</span>
          <span>${q.rightLabel || 'Agree'}</span>
        </div>
      `;
    } else {
      const systemTag = q.systemTag || TYPE_TO_SYSTEM[q.type] || 'SYSTEM';

      div.innerHTML = `
        <div class="q-top">
          <div class="q-tag">${systemTag}</div>
          <div class="q-title">${q.title}</div>
          <div class="q-scene">
            <strong>Scene:</strong> ${q.scene}
          </div>
        </div>

        <div class="q-cards">
          <button type="button" class="q-card q-card-left" data-value="1">
            <div class="q-card-label">Option 1 (Left)</div>
            <div class="q-card-body">${q.leftOption}</div>
          </button>

          <button type="button" class="q-card q-card-right" data-value="5">
            <div class="q-card-label">Option 5 (Right)</div>
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
          <span>${q.leftLabel || 'Left'}</span>
          <span>${q.rightLabel || 'Right'}</span>
        </div>
      `;

      // clicking cards selects 1 or 5
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
  const flavor = (key === 'HERMES') ? 'Range / Adaptation' : 'Recovery / Regeneration';
  return { key, flavor };
}

// --------------------
// Radar chart
// --------------------
function renderRadarChart({ sE, sC, sT, sS, max }) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  if (typeof window.Chart === 'undefined') {
    console.warn('Chart.js not found. Make sure chart.umd.min.js is loaded BEFORE main.js executes.');
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
      labels: ['Energy', 'Control', 'Threat', 'Adapt'],
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

  initQuiz();
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
    track('question_view', { question_index: currentQ + 1 });
  } else {
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = `100%`;

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

  track('question_view', { question_index: currentQ + 1, nav: 'back' });
}

// --------------------
// RESULT CALC
// --------------------
function calculateResult() {
  let sE = 0, sC = 0, sT = 0, sS = 0;
  let sRange = 0, nRange = 0;
  let sRecovery = 0, nRecovery = 0;

  const formData = new FormData(form);

  const nE = questions.filter(q => q.type === 'E').length;
  const nC = questions.filter(q => q.type === 'C').length;
  const nT = questions.filter(q => q.type === 'T').length;
  const nS = questions.filter(q => q.type === 'S').length;

  questions.forEach(q => {
    let val = parseInt(formData.get(q.id), 10);
    if (q.reverse) val = 6 - val;

    if (q.type === 'E') sE += val;
    if (q.type === 'C') sC += val;
    if (q.type === 'T') sT += val;

    if (q.type === 'S') {
      sS += val;

      if (['s1', 's4', 's5'].includes(q.id)) { sRange += val; nRange++; }
      if (['s2', 's3', 's6'].includes(q.id)) { sRecovery += val; nRecovery++; }
    }
  });

  const avgE = nE ? sE / nE : 0;
  const avgC = nC ? sC / nC : 0;
  const avgT = nT ? sT / nT : 0;
  const avgS = nS ? sS / nS : 0;
  const avgRange = nRange ? sRange / nRange : 0;
  const avgRecovery = nRecovery ? sRecovery / nRecovery : 0;

  const MID = 3.0;
  const PEAK = 4.1;
  const LOW = 2.75;
  const STRONG = 3.5;

  let type = "";

  if (avgE >= PEAK && avgC >= PEAK && avgT >= 3.8) type = "ZEUS";
  else if (avgE >= PEAK && avgT >= PEAK && avgC <= LOW) type = "POSEIDON";
  else if (avgT >= PEAK && avgE <= LOW && avgC >= STRONG) type = "HADES";
  else {
    const avgCore = (avgE + avgC + avgT) / 3;
    const stretchDominates = (avgS >= 4.0) && (avgS > avgCore * 1.15);

    if (stretchDominates) type = (avgRange >= avgRecovery) ? "HERMES" : "DEMETER";
    else {
      const E = avgE > MID;
      const C = avgC > MID;
      const T = avgT > MID;

      if (E && C && T) type = "HERA";
      else if (E && C && !T) type = "ARES";
      else if (E && !C && T) type = "APHRODITE";
      else if (E && !C && !T) type = "APOLLO";
      else if (!E && C && T) type = (avgC >= STRONG || avgT >= STRONG) ? "ATHENA" : "HESTIA";
      else if (!E && C && !T) type = "HEPHAESTUS";
      else if (!E && !C && T) type = "ARTEMIS";
      else type = "HESTIA";
    }
  }

  // --- Wing (adapt-based) ---
  const wing = computeAdaptWing({ avgS, avgRange, avgRecovery, primaryType: type });
  const wingKey = wing?.key || null;

  // save last result (include wing)
  lastResult = { sE, sC, sT, sS, type, wing: wingKey };

  track('quiz_complete', { archetype: type });

  // --- Update URL NOW (so shareResult can just use window.location.href) ---
  updateUrlForResult({ type, sE, sC, sT, sS, wingKey });

  // --- Render result ---
  const data = archetypes[type];
  const resScreen = document.getElementById('result-screen');
  resScreen.style.display = 'block';

  document.getElementById('result-name').innerText = data.name;
  document.getElementById('result-role').innerText = data.role;
  document.getElementById('result-img').src = data.img;
  document.getElementById('result-desc').innerHTML = data.desc;
  document.getElementById('result-bug').innerHTML = data.bug;
  document.getElementById('result-fix').innerHTML = data.fix;

  // Bars (dynamic max)
  const maxE = nE * 5;
  const maxC = nC * 5;
  const maxT = nT * 5;
  const maxS = nS * 5;

  document.getElementById('bar-e').style.width = `${maxE ? (sE / maxE) * 100 : 0}%`;
  document.getElementById('bar-c').style.width = `${maxC ? (sC / maxC) * 100 : 0}%`;
  document.getElementById('bar-t').style.width = `${maxT ? (sT / maxT) * 100 : 0}%`;
  document.getElementById('bar-s').style.width = `${maxS ? (sS / maxS) * 100 : 0}%`;

  // Radar chart scale: use the biggest max across traits (usually 30)
  renderRadarChart({ sE, sC, sT, sS, max: Math.max(maxE, maxC, maxT, maxS, 1) });

  // Wing UI + link
  const wingText = document.getElementById('result-wing');
  const wingImg = document.getElementById('wing-img');

  if (wingKey && archetypes[wingKey]) {
    const url = buildResultUrl({ type, sE, sC, sT, sS, wingKey }).toString();
    const wingUrl = new URL(url);
    wingUrl.searchParams.set('a', wingKey); // link to wing archetype page view

    if (wingText) {
      wingText.innerHTML = `Secondary Influence: <strong>${wingKey}</strong> <span style="opacity:0.8;">(${wing.flavor})</span>
        <br><a href="${wingUrl.toString()}" style="color: var(--primary); text-decoration: underline;">Open ${wingKey} view</a>`;
    }

    if (wingImg) {
      wingImg.src = archetypes[wingKey].img;
      wingImg.style.display = 'block';
      wingImg.style.cursor = 'pointer';
      wingImg.onclick = () => window.location.href = wingUrl.toString();
    }
  } else {
    if (wingText) wingText.textContent = '';
    if (wingImg) wingImg.style.display = 'none';
  }

  submitToGoogle(sE, sC, sT, sS, type);
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

  const e = intParam(params, 'e');
  const c = intParam(params, 'c');
  const t = intParam(params, 't');
  const s = intParam(params, 's');
  const w = params.get('w') ? params.get('w').toUpperCase() : null;

  // Hide intro/quiz
  const intro = document.getElementById('intro-screen');
  const quiz = document.getElementById('quiz-screen');
  if (intro) intro.style.display = 'none';
  if (quiz) quiz.style.display = 'none';

  // Show result
  const resScreen = document.getElementById('result-screen');
  if (resScreen) resScreen.style.display = 'block';

  document.getElementById('result-name').innerText = data.name;
  document.getElementById('result-role').innerText = data.role;
  document.getElementById('result-img').src = data.img;
  document.getElementById('result-desc').innerHTML = data.desc;
  document.getElementById('result-bug').innerHTML = data.bug;
  document.getElementById('result-fix').innerHTML = data.fix;

  // Max per trait based on current question config
  const nE = questions.filter(q => q.type === 'E').length;
  const nC = questions.filter(q => q.type === 'C').length;
  const nT = questions.filter(q => q.type === 'T').length;
  const nS = questions.filter(q => q.type === 'S').length;

  const maxE = nE * 5;
  const maxC = nC * 5;
  const maxT = nT * 5;
  const maxS = nS * 5;

  // If URL has scores, render bars + chart
  const sE = (e != null) ? e : 0;
  const sC = (c != null) ? c : 0;
  const sT = (t != null) ? t : 0;
  const sS = (s != null) ? s : 0;

  document.getElementById('bar-e').style.width = `${maxE ? (sE / maxE) * 100 : 0}%`;
  document.getElementById('bar-c').style.width = `${maxC ? (sC / maxC) * 100 : 0}%`;
  document.getElementById('bar-t').style.width = `${maxT ? (sT / maxT) * 100 : 0}%`;
  document.getElementById('bar-s').style.width = `${maxS ? (sS / maxS) * 100 : 0}%`;

  renderRadarChart({ sE, sC, sT, sS, max: Math.max(maxE, maxC, maxT, maxS, 1) });

  // Wing UI (from URL param)
  const wingText = document.getElementById('result-wing');
  const wingImg = document.getElementById('wing-img');

  if (w && archetypes[w]) {
    const base = buildResultUrl({ type, sE, sC, sT, sS, wingKey: w }).toString();
    const wingUrl = new URL(base);
    wingUrl.searchParams.set('a', w);

    if (wingText) {
      wingText.innerHTML = `Secondary Influence: <strong>${w}</strong>
        <br><a href="${wingUrl.toString()}" style="color: var(--primary); text-decoration: underline;">Open ${w} view</a>`;
    }

    if (wingImg) {
      wingImg.src = archetypes[w].img;
      wingImg.style.display = 'block';
      wingImg.style.cursor = 'pointer';
      wingImg.onclick = () => window.location.href = wingUrl.toString();
    }
  } else {
    if (wingText) wingText.textContent = '';
    if (wingImg) wingImg.style.display = 'none';
  }

  // set lastResult so Share works on direct-link page too
  lastResult = { sE, sC, sT, sS, type, wing: w };

  track('result_view', { archetype: type, via: 'url' });
}

// --------------------
window.addEventListener('pagehide', () => {
  if (!quizStarted) return;
  if (currentQ >= questions.length) return;
  track('quiz_abandon', { last_question_index: currentQ + 1 });
});

export { startQuiz, nextQuestion, prevQuestion };
