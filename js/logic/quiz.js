import { questions } from '../config/questions.js';
import { archetypes } from '../data/archetypes.js';
import { submitToGoogle } from '../services/google.js';
import { track } from '../services/analytics.js';

// --- 3. THE LOGIC ---
let currentQ = 0;
let quizStarted = false;
const form = document.getElementById('quiz-form');

let lastResult = null;

export function getLastResult() {
  return lastResult;
}

function initQuiz() {
  questions.forEach((q, index) => {
    const div = document.createElement('div');
    div.className = `question-card`;
    div.id = `q-${index}`;
    div.innerHTML = `
      <div class="question-text">${index + 1}/${questions.length}: ${q.text}</div>
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
    form.appendChild(div);
  });

  document.getElementById('q-0').classList.add('active');
  track('question_view', { question_index: 1 });
}

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

  if (!selected) { alert("Please select an option."); return; }

  document.getElementById(`q-${currentQ}`).classList.remove('active');
  currentQ++;
  document.getElementById('progress-bar').style.width = `${(currentQ / questions.length) * 100}%`;

  if (currentQ < questions.length) {
    document.getElementById(`q-${currentQ}`).classList.add('active');
    track('question_view', { question_index: currentQ + 1 });
  } else {
    document.getElementById('quiz-screen').style.display = 'none';
    calculateResult();
  }
}

function prevQuestion() {
  if (currentQ <= 0) return;

  document.getElementById(`q-${currentQ}`).classList.remove('active');
  currentQ--;

  document.getElementById(`q-${currentQ}`).classList.add('active');
  document.getElementById('progress-bar').style.width = `${(currentQ / questions.length) * 100}%`;

  track('question_view', { question_index: currentQ + 1, nav: 'back' });
}

function calculateResult() {
  let sE = 0, sC = 0, sT = 0, sS = 0;
  let sRange = 0, nRange = 0;       // Added counter
  let sRecovery = 0, nRecovery = 0; // Added counter

  const formData = new FormData(form);

  // Dynamic Counters for Core
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
      // Dynamic split based on IDs
      if (['s1', 's4', 's5'].includes(q.id)) {
        sRange += val;
        nRange++;
      }
      if (['s2', 's3', 's6'].includes(q.id)) {
        sRecovery += val;
        nRecovery++;
      }
    }
  });

  // Safe Averages
  const avgE = nE ? sE / nE : 0;
  const avgC = nC ? sC / nC : 0;
  const avgT = nT ? sT / nT : 0;
  const avgS = nS ? sS / nS : 0;
  const avgRange = nRange ? sRange / nRange : 0;
  const avgRecovery = nRecovery ? sRecovery / nRecovery : 0;

  // --- TUNED THRESHOLDS ---
  const MID = 3.0;       
  const PEAK = 4.1;      // Hard, but possible (requires mostly 4s and 5s)
  const LOW = 2.75;      // Realistic low
  const STRONG = 3.5;    // Threshold for Hades/Athena distinctness

  let type = "";

  // TIER 1: THE BIG THREE (Legendary)
  // Zeus: Needs high energy/control/threat
  if (avgE >= PEAK && avgC >= PEAK && avgT >= 3.8) { 
    type = "ZEUS";
  } 
  // Poseidon: High Energy/Threat, but Chaos (Low Control)
  else if (avgE >= PEAK && avgT >= PEAK && avgC <= LOW) {
    type = "POSEIDON";
  } 
  // Hades: High Threat, Low Energy (Dark/Quiet), High Control (Rigid)
  else if (avgT >= PEAK && avgE <= LOW && avgC >= STRONG) {
    type = "HADES";
  }

  // TIER 2: STRETCH HEROES
  else {
    const avgCore = (avgE + avgC + avgT) / 3;
    // Stretch must be high AND significantly higher than core traits
    const stretchDominates = (avgS >= 4.0) && (avgS > avgCore * 1.15);

    if (stretchDominates) {
      type = (avgRange >= avgRecovery) ? "HERMES" : "DEMETER";
    } else {
      // TIER 3: THE OLYMPIANS (Matrix)
      const E = avgE > MID;
      const C = avgC > MID;
      const T = avgT > MID;

      if (E && C && T) type = "HERA";
      else if (E && C && !T) type = "ARES";
      else if (E && !C && T) type = "APHRODITE";
      else if (E && !C && !T) type = "APOLLO";
      else if (!E && C && T) {
        // Athena needs to be distinct from Hestia
        type = (avgC >= STRONG || avgT >= STRONG) ? "ATHENA" : "HESTIA";
      }
      else if (!E && C && !T) type = "HEPHAESTUS";
      else if (!E && !C && T) type = "ARTEMIS";
      else type = "HESTIA";
    }
  }

  lastResult = { sE, sC, sT, sS, type };
  track('quiz_complete', { archetype: type });

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

  document.getElementById('bar-e').style.width = `${(sE / maxE) * 100}%`;
  document.getElementById('bar-c').style.width = `${(sC / maxC) * 100}%`;
  document.getElementById('bar-t').style.width = `${(sT / maxT) * 100}%`;
  document.getElementById('bar-s').style.width = `${(sS / maxS) * 100}%`;

  submitToGoogle(sE, sC, sT, sS, type);
}


window.addEventListener('pagehide', () => {
  if (!quizStarted) return;
  if (currentQ >= questions.length) return;
  track('quiz_abandon', { last_question_index: currentQ + 1 });
});

export { startQuiz, nextQuestion, prevQuestion };
