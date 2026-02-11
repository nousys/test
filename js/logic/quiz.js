import { questions } from '../config/questions.js';
import { archetypes } from '../data/archetypes.js';
import { submitToGoogle } from '../services/google.js';
import { track } from '../services/analytics.js';

// --- 3. THE LOGIC ---
let currentQ = 0;
let quizStarted = false;
const form = document.getElementById('quiz-form');

function initQuiz() {
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = `question-card`;
        div.id = `q-${index}`;
        div.innerHTML = `
            <div class="question-text">${index + 1}/16: ${q.text}</div>
            <div class="options">
                ${[1, 2, 3, 4, 5].map(val => `
                    <label class="option-label">
                        <input type="radio" name="${q.id}" value="${val}">
                        <span>${val}</span>
                    </label>
                `).join('')}
            </div>
            <div style="display:flex; justify-content:space-between; font-size: 0.8rem; opacity: 0.5; padding: 0 5px;">
                <span>Disagree</span>
                <span>Agree</span>
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

function calculateResult() {
    let sE = 0, sC = 0, sT = 0, sS = 0;
    let sRange = 0, sRecovery = 0;

    const formData = new FormData(form);
    questions.forEach(q => {
        let val = parseInt(formData.get(q.id));
        if (q.reverse) val = 6 - val;

        if (q.type === 'E') sE += val;
        if (q.type === 'C') sC += val;
        if (q.type === 'T') sT += val;
        if (q.type === 'S') {
            sS += val;
            if (q.id === 's1' || q.id === 's2') sRange += val;
            if (q.id === 's3' || q.id === 's4') sRecovery += val;
        }
    });

    // ALGORITHM
    let type = "";
    const H = 12; // Midpoint (4 questions * 3 = 12)

    // 1. Check Stretch (Priority 1)
    if (sS >= 15) {
        type = (sRange > sRecovery) ? "HERMES" : "DEMETER";
    }
    // 2. Check Bosses (Priority 2)
    else if (sE >= 16 && sC >= 16 && sT >= 16) type = "ZEUS";
    else if (sE >= 16 && sT >= 15 && sC <= 11) type = "POSEIDON";
    else if (sT >= 17 && sE <= 11) type = "HADES";
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

    // Render Bars (Max 20)
    document.getElementById('bar-e').style.width = `${(sE/20)*100}%`;
    document.getElementById('bar-c').style.width = `${(sC/20)*100}%`;
    document.getElementById('bar-t').style.width = `${(sT/20)*100}%`;
    document.getElementById('bar-s').style.width = `${(sS/20)*100}%`;

    // Send Data
    submitToGoogle(sE, sC, sT, sS, type);
}

// Best-effort abandon tracking (fires when user leaves page mid-quiz)
window.addEventListener('pagehide', () => {
    if (!quizStarted) return;
    if (currentQ >= questions.length) return;
    track('quiz_abandon', { last_question_index: currentQ + 1 });
});

export { startQuiz, nextQuestion };
