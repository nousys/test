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
    type: "E",
    reverse: false,
    systemTag: "SYSTEM: ENERGY",
    title: "Trial of Hippolyta's Belt",
    scene: "You must negotiate for the Belt inside a loud, intense court. The atmosphere can either charge you or drain you before you even speak.",
    leftOption: "I keep it calm and efficient—too much stimulation drains me.",
    rightOption: "I lean into the intensity—it energizes and sharpens me.",
    leftLabel: "Inner Focus",
    rightLabel: "Outer Stimulus"
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

  // =========================
  // SET 4
  // =========================
  {
    id: "t4",
    type: "T",
    reverse: false,
    systemTag: "SYSTEM: THREAT",
    title: "Interlude: The Oracle's Whisper",
    scene: "The Oracle gives a warning you cannot decode. If you misread it, you waste Time and lose Honor for acting foolishly.",
    leftOption: "I move forward. Waiting for certainty means missing the window.",
    rightOption: "I hold position. Acting without clear intel is reckless.",
    leftLabel: "Move Now",
    rightLabel: "Hold for Intel"
  },
  {
    id: "c4",
    type: "C",
    reverse: false,
    systemTag: "SYSTEM: CONTROL",
    title: "Interlude: The Broken Chariot",
    scene: "Your chariot breaks mid-journey. If you lose pace, you lose Progress. If it fails again publicly, you lose Honor.",
    leftOption: "Quick fix. Reaching the destination matters more than a perfect vehicle.",
    rightOption: "Deep repair. I won't drive a compromised vehicle.",
    leftLabel: "Efficiency",
    rightLabel: "Perfection"
  },
  {
    id: "e4",
    type: "E",
    reverse: false,
    systemTag: "SYSTEM: ENERGY",
    title: "Interlude: Dionysus' Revel",
    scene: "To gain an ally, you must navigate a wild festival—noise, movement, strangers, constant stimulation.",
    leftOption: "I withdraw to recharge; this drains me fast.",
    rightOption: "The crowd charges me; I become sharper and faster.",
    leftLabel: "Quiet Fuel",
    rightLabel: "Crowd Fuel"
  },
  {
    id: "s4",
    type: "S",
    reverse: false,
    systemTag: "SYSTEM: STRETCH",
    title: "Interlude: The Mask of Hermes",
    scene: "To prevent conflict, you must play a role that is not your natural mode (diplomat, performer, negotiator). Your output depends on your Range.",
    leftOption: "I struggle to fake it; I need to stay true to my natural style.",
    rightOption: "I can wear any mask; I adapt my persona to fit the mission.",
    leftLabel: "Authenticity",
    rightLabel: "Adaptability"
  },

  // =========================
  // SET 5
  // =========================
  {
    id: "t5",
    type: "T",
    reverse: true,
    systemTag: "SYSTEM: THREAT",
    title: "Interlude: The Narrow Pass",
    scene: "You must carry a sacred flame across a narrow pass before the storm closes it. Conditions shift unpredictably. Hesitation costs Time and Progress.",
    leftOption: "I become hyper-cautious; I double-check every step before moving.",
    rightOption: "I stay loose and fluid; I trust my reflexes to handle surprises.",
    leftLabel: "Caution",
    rightLabel: "Fluidity"
  },
  {
    id: "c5",
    type: "C",
    reverse: false,
    systemTag: "SYSTEM: CONTROL",
    title: "Interlude: The Poisoned Well",
    scene: "The village drinks from one well. If it's poisoned, people fall sick; if you close it wrongly, unrest spreads and you lose Honor and Allies' trust.",
    leftOption: "I take small reversible actions to learn fast (tiny trials, quick feedback).",
    rightOption: "I run a clear verification protocol before making a public decision.",
    leftLabel: "Probe & Learn",
    rightLabel: "Protocol & Verify"
  },
  {
    id: "e5",
    type: "E",
    reverse: true,
    systemTag: "SYSTEM: ENERGY",
    title: "Interlude: The Silent Shrine",
    scene: "To receive the shrine's blessing, you must hold a 3-hour vigil in absolute silence—no speaking, no movement, no distraction. Breaking the ritual costs Honor and delays Progress.",
    leftOption: "The stillness drains me. I become restless and feel my energy leaking without stimulation.",
    rightOption: "The stillness restores me. My energy becomes steady and clear as the hours pass.",
    leftLabel: "Stillness Drains",
    rightLabel: "Stillness Restores"
  },
  {
    id: "s5",
    type: "S",
    reverse: false,
    systemTag: "SYSTEM: STRETCH",
    title: "Interlude: The Long Watch",
    scene: "You must guard a gate until dawn. Nothing happens for hours—same view, same posture, same routine. If your attention slips, you lose Allies' trust and your Progress resets.",
    leftOption: "I stay alert by rotating attention deliberately (scan cycles, checkpoints, small rituals).",
    rightOption: "I can hold steady single-point focus for hours without needing variation.",
    leftLabel: "Rotate Attention",
    rightLabel: "Laser Focus"
  },

  // =========================
  // SET 6
  // =========================
  {
    id: "s6",
    type: "S",
    reverse: true,
    systemTag: "SYSTEM: STRETCH",
    title: "Interlude: The Wound of Words",
    scene: "After a public mistake, an ally criticizes you sharply in front of everyone. If you spiral, you lose Time and Progress on the next trial.",
    leftOption: "I ignore the noise; results will speak louder than their words.",
    rightOption: "I take it seriously; I need to resolve the accusation before moving on.",
    leftLabel: "Reset",
    rightLabel: "Process"
  },
  {
    id: "c6",
    type: "C",
    reverse: true,
    systemTag: "SYSTEM: CONTROL",
    title: "Interlude: The Labyrinth of Doors",
    scene: "You must reach the exit before the torches burn out. Some doors loop you back; some traps waste Time and Progress.",
    leftOption: "I search for rules/patterns first, then commit decisively.",
    rightOption: "I try paths quickly and adjust based on what happens.",
    leftLabel: "Map First",
    rightLabel: "Explore Routes"
  },
  {
    id: "e6",
    type: "E",
    reverse: false,
    systemTag: "SYSTEM: ENERGY",
    title: "Interlude: The Market of Hermes",
    scene: "You must bargain for a rare item before it's gone. Vendors shout, deals change, strangers interrupt, and new info arrives every minute.",
    leftOption: "I filter out the noise; I focus better in a controlled environment.",
    rightOption: "This chaos energizes me; rapid change keeps me sharp and switched on.",
    leftLabel: "Filtered",
    rightLabel: "Open"
  },
  {
    id: "t6",
    type: "T",
    reverse: false,
    systemTag: "SYSTEM: THREAT",
    title: "Interlude: Judgment of Olympus",
    scene: "You must demonstrate your skill before the gods to earn passage. They watch in silence—no feedback, no clues. A shaky performance costs Honor and delays Progress.",
    leftOption: "I trust my training and flow; I don't look back.",
    rightOption: "I constantly self-monitor to ensure I'm not making a mistake.",
    leftLabel: "Flow State",
    rightLabel: "Self-Check"
  }
];