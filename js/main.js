import { startQuiz, nextQuestion, prevQuestion } from './logic/quiz.js';
import { shareResult, followFacebook, submitFeedback } from './logic/results.js';
import { archetypes } from './data/archetypes.js';

// Expose functions for inline onclick="" in HTML
window.startQuiz = startQuiz;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;

window.shareResult = shareResult;
window.followFacebook = followFacebook;
window.submitFeedback = submitFeedback;

function clampInt(v, lo, hi) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return 0;
  return Math.max(lo, Math.min(hi, n));
}

function renderArchetypeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const a = params.get('a');
  if (!a) return;

  const key = a.toUpperCase();
  const data = archetypes[key];
  if (!data) return;

  // Hide intro/quiz, show result screen
  const intro = document.getElementById('intro-screen');
  const quiz = document.getElementById('quiz-screen');
  const resScreen = document.getElementById('result-screen');

  if (intro) intro.style.display = 'none';
  if (quiz) quiz.style.display = 'none';
  if (resScreen) resScreen.style.display = 'block';

  document.getElementById('result-name').innerText = data.name;
  document.getElementById('result-role').innerText = data.role;
  document.getElementById('result-img').src = data.img;
  document.getElementById('result-desc').innerHTML = data.desc;
  document.getElementById('result-bug').innerHTML = data.bug;
  document.getElementById('result-fix').innerHTML = data.fix;

  // Bars unknown without quiz scores (deep link), set 0
  const MAX = 72; // your new scale (3 questions * 5)

  const e = clampInt(params.get('e'), 0, MAX);
  const c = clampInt(params.get('c'), 0, MAX);
  const t = clampInt(params.get('t'), 0, MAX);
  const s = clampInt(params.get('s'), 0, MAX);

  // If scores exist, render them; otherwise keep 0
  document.getElementById('bar-e').style.width = `${(e / MAX) * 100}%`;
  document.getElementById('bar-c').style.width = `${(c / MAX) * 100}%`;
  document.getElementById('bar-t').style.width = `${(t / MAX) * 100}%`;
  document.getElementById('bar-s').style.width = `${(s / MAX) * 100}%`;
}

// Run once on load
renderArchetypeFromUrl();
