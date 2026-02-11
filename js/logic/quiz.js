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

    // Track first question view (1-indexed)
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

        // Track question view (1-indexed)
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

    // Optional: tracking (useful)
    track('question_view', { question_index: currentQ + 1, nav: 'back' });
}

function calculateResult() {
    let sE = 0, sC = 0, sT = 0, sS = 0;

    // New S split (3 questions total): s1 = adapt; s2+s3 = tenacity
    let sAdapt = 0;
    let sTenacity = 0;

    const formData = new FormData(form);
    questions.forEach(q => {
        let val = parseInt(formData.get(q.id));
        if (q.reverse) val = 6 - val;

        if (q.type === 'E') sE += val;
        if (q.type === 'C') sC += val;
        if (q.type === 'T') sT += val;
        if (q.type === 'S') {
            sS += val;
            if (q.id === 's1') sAdapt += val;
            if (q.id === 's2' || q.id === 's3') sTenacity += val;
        }
    });

    // ALGORITHM (new scale: 3 questions per axis, max=15, midpoint=9)
    let type = "";
    const H = 9; // Midpoint (3 questions * 3 = 9)

    // 1. Check Stretch (Priority 1): old 15/20 ~= 75% => new 12/15
    if (sS >= 12) {
        // Hermes = more adaptability; Demeter = more tenacity/endurance
        type = (sAdapt >= (sTenacity / 2)) ? "HERMES" : "DEMETER";
    }
    // 2. Check Bosses (Priority 2): scaled thresholds to new max=15
    else if (sE >= 12 && sC >= 12 && sT >= 12) type = "ZEUS";
    else if (sE >= 12 && sT >= 12 && sC <= 8) type = "POSEIDON";
    else if (sT >= 13 && sE <= 8) type = "HADES";
    // 3. Check Matrix (Priority 3)
    else {
        const E = sE > H;
        const C = sC > H;
        const T = sT > H;

        if (E && C && T) type = "HERA"; // Fallback from Zeus
        else if (E && C && !T) type = "ARES";
        else if (E && !C && T) type = "APHRODITE";
        else if (E && !C && !T) type = "APOLLO";
        else if (!E && C && T) type = "ATHENA";
        else if (!E && C && !T) type = "HEPHAESTUS";
        else if (!E && !C && T) type = "ARTEMIS";
        else type = "HESTIA";
    }

    lastResult = { sE, sC, sT, sS, type };

    // Track completion
    track('quiz_complete', { archetype: type });

    // RENDER
    const data = archetypes[type];
    const resScreen = document.getElementById('result-screen');
    resScreen.style.display = 'block';

    document.getElementById('result-name').innerText = data.name;
    document.getElementById('result-role').innerText = data.role;
    document.getElementById('result-img').src = data.img;
    document.getElementById('result-desc').innerHTML = data.desc;
    document.getElementById('result-bug').innerHTML = data.bug;
    document.getElementById('result-fix').innerHTML = data.fix;

    // Render Bars (Max 15)
    document.getElementById('bar-e').style.width = `${(sE/15)*100}%`;
    document.getElementById('bar-c').style.width = `${(sC/15)*100}%`;
    document.getElementById('bar-t').style.width = `${(sT/15)*100}%`;
    document.getElementById('bar-s').style.width = `${(sS/15)*100}%`;

    // Send Data
    submitToGoogle(sE, sC, sT, sS, type);
}

// Best-effort abandon tracking (fires when user leaves page mid-quiz)
window.addEventListener('pagehide', () => {
    if (!quizStarted) return;
    if (currentQ >= questions.length) return;
    track('quiz_abandon', { last_question_index: currentQ + 1 });
});

export { startQuiz, nextQuestion, prevQuestion };
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

    // Track first question view (1-indexed)
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

        // Track question view (1-indexed)
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

    // Optional: tracking (useful)
    track('question_view', { question_index: currentQ + 1, nav: 'back' });
}

function calculateResult() {
    let sE = 0, sC = 0, sT = 0, sS = 0;

    // New S split (3 questions total): s1 = adapt; s2+s3 = tenacity
    let sAdapt = 0;
    let sTenacity = 0;

    const formData = new FormData(form);
    questions.forEach(q => {
        let val = parseInt(formData.get(q.id));
        if (q.reverse) val = 6 - val;

        if (q.type === 'E') sE += val;
        if (q.type === 'C') sC += val;
        if (q.type === 'T') sT += val;
        if (q.type === 'S') {
            sS += val;
            if (q.id === 's1') sAdapt += val;
            if (q.id === 's2' || q.id === 's3') sTenacity += val;
        }
    });

    // ALGORITHM (new scale: 3 questions per axis, max=15, midpoint=9)
    let type = "";
    const H = 9; // Midpoint (3 questions * 3 = 9)

    // 1. Check Stretch (Priority 1): old 15/20 ~= 75% => new 12/15
    if (sS >= 12) {
        // Hermes = more adaptability; Demeter = more tenacity/endurance
        type = (sAdapt >= (sTenacity / 2)) ? "HERMES" : "DEMETER";
    }
    // 2. Check Bosses (Priority 2): scaled thresholds to new max=15
    else if (sE >= 12 && sC >= 12 && sT >= 12) type = "ZEUS";
    else if (sE >= 12 && sT >= 12 && sC <= 8) type = "POSEIDON";
    else if (sT >= 13 && sE <= 8) type = "HADES";
    // 3. Check Matrix (Priority 3)
    else {
        const E = sE > H;
        const C = sC > H;
        const T = sT > H;

        if (E && C && T) type = "HERA"; // Fallback from Zeus
        else if (E && C && !T) type = "ARES";
        else if (E && !C && T) type = "APHRODITE";
        else if (E && !C && !T) type = "APOLLO";
        else if (!E && C && T) type = "ATHENA";
        else if (!E && C && !T) type = "HEPHAESTUS";
        else if (!E && !C && T) type = "ARTEMIS";
        else type = "HESTIA";
    }

    lastResult = { sE, sC, sT, sS, type };

    // Track completion
    track('quiz_complete', { archetype: type });

    // RENDER
    const data = archetypes[type];
    const resScreen = document.getElementById('result-screen');
    resScreen.style.display = 'block';

    document.getElementById('result-name').innerText = data.name;
    document.getElementById('result-role').innerText = data.role;
    document.getElementById('result-img').src = data.img;
    document.getElementById('result-desc').innerHTML = data.desc;
    document.getElementById('result-bug').innerHTML = data.bug;
    document.getElementById('result-fix').innerHTML = data.fix;

    // Render Bars (Max 15)
    document.getElementById('bar-e').style.width = `${(sE/15)*100}%`;
    document.getElementById('bar-c').style.width = `${(sC/15)*100}%`;
    document.getElementById('bar-t').style.width = `${(sT/15)*100}%`;
    document.getElementById('bar-s').style.width = `${(sS/15)*100}%`;

    // Send Data
    submitToGoogle(sE, sC, sT, sS, type);
}

// Best-effort abandon tracking (fires when user leaves page mid-quiz)
window.addEventListener('pagehide', () => {
    if (!quizStarted) return;
    if (currentQ >= questions.length) return;
    track('quiz_abandon', { last_question_index: currentQ + 1 });
});

export { startQuiz, nextQuestion, prevQuestion };
