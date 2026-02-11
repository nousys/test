import { startQuiz, nextQuestion, prevQuestion } from './logic/quiz.js';
import { shareResult, followFacebook, submitFeedback } from './logic/results.js';

window.startQuiz = startQuiz;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;

window.shareResult = shareResult;
window.followFacebook = followFacebook;
window.submitFeedback = submitFeedback;

