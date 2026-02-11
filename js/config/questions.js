export const questions = [
  // =========================
  // SET 1
  // =========================
  {
    id: "t1", type: "T", reverse: true, // Left = Caution (High T)
    leftLabel: "Calculated Pause", rightLabel: "Action in Chaos",
    text: `Trial of the Nemean Lion<br><br>
          <strong>Scene:</strong> To earn passage, you must subdue the Lion. Your weapon fails on impact. Each wrong move costs <strong>Time</strong> and <strong>Honor</strong>.<br><br>
          <strong>1 (Left):</strong> I pull back to reassess strategy; rushing risks total failure.<br>
          <strong>5 (Right):</strong> I stay close and adapt in the chaos; hesitation is the real risk.`
  },
  {
    id: "c1", type: "C", reverse: false,
    leftLabel: "Move Fast", rightLabel: "Build a System",
    text: `Trial of the Augean Stables<br><br>
          <strong>Scene:</strong> You must clear the Stables before sundown. Wasted effort costs <strong>Time</strong> and <strong>Honor</strong>.<br><br>
          <strong>1 (Left):</strong> Start immediately, optimize as I go—momentum first.<br>
          <strong>5 (Right):</strong> Pause to redesign the system so the work becomes automatic.`
  },
  {
    id: "e1", type: "E", reverse: false,
    leftLabel: "Inner Focus", rightLabel: "Outer Stimulus",
    text: `Trial of Hippolyta's Belt<br><br>
          <strong>Scene:</strong> You must negotiate for the Belt inside a loud, intense court. The atmosphere can either charge you or drain you before you even speak.<br><br>
          <strong>1 (Left):</strong> I keep it calm and efficient—too much stimulation drains me.<br>
          <strong>5 (Right):</strong> I lean into the intensity—it energizes and sharpens me.`
  },
  {
    id: "s1", type: "S", reverse: false,
    leftLabel: "Mastery/Depth", rightLabel: "Adapt/Pivot",
    text: `Trial of the Hydra<br><br>
          <strong>Scene:</strong> Each time you strike wrong, the Hydra multiplies. If you lock into one failing approach, you lose <strong>Time</strong> and <strong>Progress</strong> rapidly.<br><br>
          <strong>1 (Left):</strong> I double down on the method I know best; consistency beats chaos.<br>
          <strong>5 (Right):</strong> I throw out the plan and try entirely new angles.`
  },

  // =========================
  // SET 2
  // =========================
  {
    id: "t2", type: "T", reverse: false, // ✅ PATCHED: Right = Caution (High T)
    leftLabel: "Act in Fog", rightLabel: "Stabilize",
    text: `Trial of the Stymphalian Birds<br><br>
          <strong>Scene:</strong> A toxic swarm descends. Mishandling costs <strong>Time</strong> and <strong>Allies' trust</strong>.<br><br>
          <strong>1 (Left):</strong> I can act while uneasy—move even when conditions are unclear.<br>
          <strong>5 (Right):</strong> I stabilize first—reduce exposure and steady myself.`
  },
  {
    id: "c2", type: "C", reverse: true, // Left = Control (High C)
    leftLabel: "Control Variables", rightLabel: "Learn in Motion",
    text: `Trial of the Mares of Diomedes<br><br>
          <strong>Scene:</strong> You must transport wild horses whose behavior is unknown. Mistakes cost <strong>Progress</strong> and <strong>Allies' trust</strong>.<br><br>
          <strong>1 (Left):</strong> Set constraints first, test safely, then release control.<br>
          <strong>5 (Right):</strong> Engage directly and learn through feedback.`
  },
  {
    id: "e2", type: "E", reverse: true, // Left = Novelty (High E)
    leftLabel: "Novelty", rightLabel: "Routine",
    text: `Trial of the Erymanthian Boar<br><br>
          <strong>Scene:</strong> The hunt lasts days in unfamiliar terrain—new tracks, new weather, no stable rhythm.<br><br>
          <strong>1 (Left):</strong> The unknown wakes me up; novelty energizes me.<br>
          <strong>5 (Right):</strong> I create routine and simplify to keep my energy steady.`
  },
  {
    id: "s2", type: "S", reverse: true, // Left = Rebound (High S)
    leftLabel: "Rebound Fast", rightLabel: "Analyze Deeply",
    text: `Trial of the Ceryneian Hind<br><br>
          <strong>Scene:</strong> After repeated near-catches, you must choose how to protect momentum over a long pursuit.<br><br>
          <strong>1 (Left):</strong> I shake it off immediately; analysis can wait, speed matters.<br>
          <strong>5 (Right):</strong> I stop to analyze exactly why I failed so I don't repeat it.`
  },

  // =========================
  // SET 3
  // =========================
  {
    id: "t3", type: "T", reverse: true, // ✅ PATCHED: Wording Neutralized
    leftLabel: "Wait for Clarity", rightLabel: "Enter Uncertain",
    text: `Trial of Cerberus<br><br>
          <strong>Scene:</strong> You must enter a realm with unknown rules. If you lose orientation, you waste <strong>Time</strong> and <strong>Progress</strong> in dead ends.<br><br>
          <strong>1 (Left):</strong> I delay until I define exit conditions; entering blind risks endless loops.<br>
          <strong>5 (Right):</strong> I enter without guarantees; I can orient inside the fog.`
  },
  {
    id: "c3", type: "C", reverse: false,
    leftLabel: "Direct Force", rightLabel: "Structured Capture",
    text: `Trial of the Cretan Bull<br><br>
          <strong>Scene:</strong> Chaos is destroying the city. Every minute costs <strong>Progress</strong> and <strong>Honor</strong>.<br><br>
          <strong>1 (Left):</strong> Engage now to contain damage—even if messy.<br>
          <strong>5 (Right):</strong> Control the environment first, then capture cleanly.`
  },
  {
    id: "e3", type: "E", reverse: false,
    leftLabel: "Preserve Focus", rightLabel: "Seek Variety",
    text: `Trial of Geryon's Cattle<br><br>
          <strong>Scene:</strong> A long march with interruptions—heat, strangers, detours, shifting plans—every day.<br><br>
          <strong>1 (Left):</strong> Too much stimulus drains me; I protect focus by reducing noise.<br>
          <strong>5 (Right):</strong> Variety keeps me switched on; repetition drains me more.`
  },
  {
    id: "s3", type: "S", reverse: false,
    leftLabel: "Sustainability", rightLabel: "Endurance",
    text: `Trial of the Golden Apples<br><br>
          <strong>Scene:</strong> To earn the Apples, you must carry extreme strain. The trade-off is how badly it slows your <strong>Recovery</strong> afterward.<br><br>
          <strong>1 (Left):</strong> I avoid loads that will wreck my recovery; I choose sustainable strain.<br>
          <strong>5 (Right):</strong> I can take extreme strain and still rebound; I'll pay the cost.`
  },

  // =========================
  // SET 4
  // =========================
  {
    id: "t4", type: "T", reverse: false, // ✅ PATCHED: Right = Caution (High T)
    leftLabel: "Move Now", rightLabel: "Hold for Intel",
    text: `Interlude: The Oracle's Whisper<br><br>
          <strong>Scene:</strong> The Oracle gives a warning you cannot decode. If you misread it, you waste <strong>Time</strong> and lose <strong>Honor</strong> for acting foolishly.<br><br>
          <strong>1 (Left):</strong> I move forward. Waiting for certainty means missing the window.<br>
          <strong>5 (Right):</strong> I hold position. Acting without clear intel is reckless.`
  },
  {
    id: "c4", type: "C", reverse: false,
    leftLabel: "Efficiency", rightLabel: "Perfection",
    text: `Interlude: The Broken Chariot<br><br>
          <strong>Scene:</strong> Your chariot breaks mid-journey. If you lose pace, you lose <strong>Progress</strong>. If it fails again publicly, you lose <strong>Honor</strong>.<br><br>
          <strong>1 (Left):</strong> Quick fix. Reaching the destination matters more than a perfect vehicle.<br>
          <strong>5 (Right):</strong> Deep repair. I won't drive a compromised vehicle.`
  },
  {
    id: "e4", type: "E", reverse: false,
    leftLabel: "Quiet Fuel", rightLabel: "Crowd Fuel",
    text: `Interlude: Dionysus' Revel<br><br>
          <strong>Scene:</strong> To gain an ally, you must navigate a wild festival—noise, movement, strangers, constant stimulation.<br><br>
          <strong>1 (Left):</strong> I withdraw to recharge; this drains me fast.<br>
          <strong>5 (Right):</strong> The crowd charges me; I become sharper and faster.`
  },
  {
    id: "s4", type: "S", reverse: false,
    leftLabel: "Authenticity", rightLabel: "Adaptability",
    text: `Interlude: The Mask of Hermes<br><br>
          <strong>Scene:</strong> To prevent conflict, you must play a role that is not your natural mode (diplomat, performer, negotiator). Your output depends on your <strong>Range</strong>.<br><br>
          <strong>1 (Left):</strong> I struggle to fake it; I need to stay true to my natural style.<br>
          <strong>5 (Right):</strong> I can wear any mask; I adapt my persona to fit the mission.`
  },

  // =========================
  // SET 5
  // =========================
  {
    id: "t5", type: "T", reverse: true, // Left = Caution (High T)
    leftLabel: "Caution", rightLabel: "Fluidity",
    text: `Interlude: The Narrow Pass<br><br>
          <strong>Scene:</strong> You must carry a sacred flame across a narrow pass before the storm closes it. Conditions shift unpredictably. Hesitation costs <strong>Time</strong> and <strong>Progress</strong>.<br><br>
          <strong>1 (Left):</strong> I become hyper-cautious; I double-check every step before moving.<br>
          <strong>5 (Right):</strong> I stay loose and fluid; I trust my reflexes to handle surprises.`
  },
  {
    id: "c5", type: "C", reverse: false,
    leftLabel: "Probe & Learn", rightLabel: "Protocol & Verify",
    text: `Interlude: The Poisoned Well<br><br>
          <strong>Scene:</strong> The village drinks from one well. If it's poisoned, people fall sick; if you close it wrongly, unrest spreads and you lose <strong>Honor</strong> and <strong>Allies' trust</strong>.<br><br>
          <strong>1 (Left):</strong> I take small reversible actions to learn fast (tiny trials, quick feedback).<br>
          <strong>5 (Right):</strong> I run a clear verification protocol before making a public decision.`
  },
  {
    id: "e5", type: "E", reverse: true, // Left = Stillness Drains (High E)
    leftLabel: "Stillness Drains", rightLabel: "Stillness Restores",
    text: `Interlude: The Silent Shrine<br><br>
          <strong>Scene:</strong> To receive the shrine's blessing, you must hold a <strong>3-hour vigil</strong> in absolute silence—no speaking, no movement, no distraction. Breaking the ritual costs <strong>Honor</strong> and delays <strong>Progress</strong>.<br><br>
          <strong>1 (Left):</strong> The stillness drains me. I become restless and feel my energy leaking without stimulation.<br>
          <strong>5 (Right):</strong> The stillness restores me. My energy becomes steady and clear as the hours pass.`
  },
  {
    id: "s5", type: "S", reverse: false, // Balanced Competence
    leftLabel: "Rotate Attention", rightLabel: "Laser Focus",
    text: `Interlude: The Long Watch<br><br>
          <strong>Scene:</strong> You must guard a gate until dawn. Nothing happens for hours—same view, same posture, same routine. If your attention slips, you lose <strong>Allies' trust</strong> and your <strong>Progress</strong> resets.<br><br>
          <strong>1 (Left):</strong> I stay alert by rotating attention deliberately (scan cycles, checkpoints, small rituals).<br>
          <strong>5 (Right):</strong> I can hold steady single-point focus for hours without needing variation.`
  },

  // =========================
  // SET 6
  // =========================
  {
    id: "t6", type: "T", reverse: false, // ✅ PATCHED: Right = Caution (High T)
    leftLabel: "Flow State", rightLabel: "Self-Check",
    text: `Interlude: Judgment of Olympus<br><br>
          <strong>Scene:</strong> You must demonstrate your skill before the gods to earn passage. They watch in silence—no feedback, no clues. A shaky performance costs <strong>Honor</strong> and delays <strong>Progress</strong>.<br><br>
          <strong>1 (Left):</strong> I trust my training and flow; I don't look back.<br>
          <strong>5 (Right):</strong> I constantly self-monitor to ensure I'm not making a mistake.`
  },
  {
    id: "c6", type: "C", reverse: true, // Left = Map First (High C)
    leftLabel: "Map First", rightLabel: "Explore Routes",
    text: `Interlude: The Labyrinth of Doors<br><br>
          <strong>Scene:</strong> You must reach the exit before the torches burn out. Some doors loop you back; some traps waste <strong>Time</strong> and <strong>Progress</strong>.<br><br>
          <strong>1 (Left):</strong> I search for rules/patterns first, then commit decisively.<br>
          <strong>5 (Right):</strong> I try paths quickly and adjust based on what happens.`
  },
  {
    id: "e6", type: "E", reverse: false,
    leftLabel: "Filtered", rightLabel: "Open",
    text: `Interlude: The Market of Hermes<br><br>
          <strong>Scene:</strong> You must bargain for a rare item before it's gone. Vendors shout, deals change, strangers interrupt, and new info arrives every minute.<br><br>
          <strong>1 (Left):</strong> I filter out the noise; I focus better in a controlled environment.<br>
          <strong>5 (Right):</strong> This chaos energizes me; rapid change keeps me sharp and switched on.`
  },
  {
    id: "s6", type: "S", reverse: true, // Left = Reset (High S)
    leftLabel: "Reset", rightLabel: "Process",
    text: `Interlude: The Wound of Words<br><br>
          <strong>Scene:</strong> After a public mistake, an ally criticizes you sharply in front of everyone. If you spiral, you lose <strong>Time</strong> and <strong>Progress</strong> on the next trial.<br><br>
          <strong>1 (Left):</strong> I ignore the noise; results will speak louder than their words.<br>
          <strong>5 (Right):</strong> I take it seriously; I need to resolve the accusation before moving on.`
  }
];