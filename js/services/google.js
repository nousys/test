import { getSessionId } from './session.js';

// --- CONFIG ---
const formID = "1FAIpQLScEWdwVaCJC-K7C_Ek7eQFWg8IaGiNvx-6txv8cTP6-x8drIQ";
const submitURL = `https://docs.google.com/forms/d/e/${formID}/formResponse`;

// Results
const ENTRY_E = "entry.484401858";
const ENTRY_C = "entry.1614447615";
const ENTRY_T = "entry.2008857398";
const ENTRY_S = "entry.2035459769";         // Total Stretch score
const ENTRY_S_RANGE = "entry.551179813";    // New: Range (Hermes)
const ENTRY_S_RECOVERY = "entry.1065389659";// New: Recovery (Demeter)
const ENTRY_ARCHETYPE = "entry.702670164";

// Feedback
const ENTRY_RATING = "entry.139106860";
const ENTRY_TEXT = "entry.476361627";

// Session ID
const ENTRY_SESSION = "entry.1125820041";

/**
 * Updated to include sRange and sRecovery
 */
export function submitToGoogle(e, c, t, s, sRange, sRecovery, type) {
  const data = new FormData();
  data.append(ENTRY_E, e);
  data.append(ENTRY_C, c);
  data.append(ENTRY_T, t);
  data.append(ENTRY_S, s);
  
  // --- New Fields ---
  data.append(ENTRY_S_RANGE, sRange);
  data.append(ENTRY_S_RECOVERY, sRecovery);
  // ------------------

  data.append(ENTRY_ARCHETYPE, type);
  data.append(ENTRY_SESSION, getSessionId());

  fetch(submitURL, { method: 'POST', mode: 'no-cors', body: data })
    .catch(err => console.log('Headless submit error', err));
}

export async function submitFeedbackToGoogle(rating, feedbackText, archetype) {
  const data = new FormData();
  data.append(ENTRY_RATING, rating);
  data.append(ENTRY_TEXT, feedbackText || '');
  data.append(ENTRY_ARCHETYPE, archetype);
  data.append(ENTRY_SESSION, getSessionId());

  try {
    await fetch(submitURL, { method: 'POST', mode: 'no-cors', body: data });
    return true;
  } catch (err) {
    console.log('Headless feedback submit error', err);
    return false;
  }
}