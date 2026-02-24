export const questions = [
  // =========================
  // SET 1
  // =========================
  {
    id: "t1",
    type: "T",
    reverse: true,
    systemTag: "SYSTEM: THREAT",
    title: "Trial of the Nemean Lion",
    scene: "To earn passage, you must subdue the Lion. Your weapon fails on impact. Each wrong move costs Time and Honor.",
    leftOption: "I pull back to reassess strategy; rushing risks total failure.",
    rightOption: "I stay close and adapt in the chaos; hesitation is the real risk.",
    leftLabel: "Calculated Pause",
    rightLabel: "Action in Chaos"
  },
  {
    id: "c1",
    type: "C",
    reverse: false,
    systemTag: "SYSTEM: CONTROL",
    title: "Trial of the Augean Stables",
    scene: "You must clear the Stables before sundown. Wasted effort costs Time and Honor.",
    leftOption: "Start immediately, optimize as I go—momentum first.",
    rightOption: "Pause to redesign the system so the work becomes automatic.",
    leftLabel: "Move Fast",
    rightLabel: "Build a System"
  },
  {
    id: "e1",
    type: "E", // Measures Energy (Introvert vs Extrovert)
    reverse: false,
    systemTag: "SYSTEM: ENERGY",
    title: "Trial of Hippolyta's Belt",
    scene: "The Queen invites you to negotiate for the Belt in the middle of a deafening, chaotic war-feast. The sensory input is maximum.",
    leftOption: "The noise scatters my focus. I try to pull her to a quiet corner.",
    rightOption: "The noise sharpens my focus. I feed off the crowd's energy.",
    leftLabel: "Overstimulated",
    rightLabel: "Activated"
    },
  {
    id: "s1",
    type: "S",
    reverse: false,
    systemTag: "SYSTEM: STRETCH",
    title: "Trial of the Hydra",
    scene: "Each time you strike wrong, the Hydra multiplies. If you lock into one failing approach, you lose Time and Progress rapidly.",
    leftOption: "I double down on the method I know best; consistency beats chaos.",
    rightOption: "I throw out the plan and try entirely new angles.",
    leftLabel: "Mastery/Depth",
    rightLabel: "Adapt/Pivot"
  },

  // =========================
  // SET 2
  // =========================
  {
    id: "t2",
    type: "T",
    reverse: false,
    systemTag: "SYSTEM: THREAT",
    title: "Trial of the Stymphalian Birds",
    scene: "A toxic swarm descends. Mishandling costs Time and Allies' trust.",
    leftOption: "I can act while uneasy—move even when conditions are unclear.",
    rightOption: "I stabilize first—reduce exposure and steady myself.",
    leftLabel: "Act in Fog",
    rightLabel: "Stabilize"
  },
  {
    id: "c2",
    type: "C",
    reverse: true,
    systemTag: "SYSTEM: CONTROL",
    title: "Trial of the Mares of Diomedes",
    scene: "You must transport wild horses whose behavior is unknown. Mistakes cost Progress and Allies' trust.",
    leftOption: "Set constraints first, test safely, then release control.",
    rightOption: "Engage directly and learn through feedback.",
    leftLabel: "Control Variables",
    rightLabel: "Learn in Motion"
  },
  {
    id: "e2",
    type: "E",
    reverse: true,
    systemTag: "SYSTEM: ENERGY",
    title: "Trial of the Erymanthian Boar",
    scene: "The hunt lasts days in unfamiliar terrain—new tracks, new weather, no stable rhythm.",
    leftOption: "The unknown wakes me up; novelty energizes me.",
    rightOption: "I create routine and simplify to keep my energy steady.",
    leftLabel: "Novelty",
    rightLabel: "Routine"
  },
  {
    id: "s2",
    type: "S",
    reverse: true,
    systemTag: "SYSTEM: STRETCH",
    title: "Trial of the Ceryneian Hind",
    scene: "After repeated near-catches, you must choose how to protect momentum over a long pursuit.",
    leftOption: "I shake it off immediately; analysis can wait, speed matters.",
    rightOption: "I stop to analyze exactly why I failed so I don't repeat it.",
    leftLabel: "Rebound Fast",
    rightLabel: "Analyze Deeply"
  },

  // =========================
  // SET 3
  // =========================
  {
    id: "t3",
    type: "T",
    reverse: true,
    systemTag: "SYSTEM: THREAT",
    title: "Trial of Cerberus",
    scene: "You must enter a realm with unknown rules. If you lose orientation, you waste Time and Progress in dead ends.",
    leftOption: "I delay until I define exit conditions; entering blind risks endless loops.",
    rightOption: "I enter without guarantees; I can orient inside the fog.",
    leftLabel: "Wait for Clarity",
    rightLabel: "Enter Uncertain"
  },
  {
    id: "c3",
    type: "C",
    reverse: false,
    systemTag: "SYSTEM: CONTROL",
    title: "Trial of the Cretan Bull",
    scene: "Chaos is destroying the city. Every minute costs Progress and Honor.",
    leftOption: "Engage now to contain damage—even if messy.",
    rightOption: "Control the environment first, then capture cleanly.",
    leftLabel: "Direct Force",
    rightLabel: "Structured Capture"
  },
  {
    id: "e3",
    type: "E",
    reverse: false,
    systemTag: "SYSTEM: ENERGY",
    title: "Trial of Geryon's Cattle",
    scene: "A long march with interruptions—heat, strangers, detours, shifting plans—every day.",
    leftOption: "Too much stimulus drains me; I protect focus by reducing noise.",
    rightOption: "Variety keeps me switched on; repetition drains me more.",
    leftLabel: "Preserve Focus",
    rightLabel: "Seek Variety"
  },
  {
    id: "s3",
    type: "S",
    reverse: false,
    systemTag: "SYSTEM: STRETCH",
    title: "Trial of the Golden Apples",
    scene: "To earn the Apples, you must carry extreme strain. The trade-off is how badly it slows your Recovery afterward.",
    leftOption: "I avoid loads that will wreck my recovery; I choose sustainable strain.",
    rightOption: "I can take extreme strain and still rebound; I'll pay the cost.",
    leftLabel: "Sustainability",
    rightLabel: "Endurance"
  },
];