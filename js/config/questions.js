// export const questions = [
//     // ENERGY (1-4)
//     { id: "e1", type: "E", text: "I feel drained or bored if my daily routine stays exactly the same for too long.", reverse: false },
//     { id: "e2", type: "E", text: "Socializing and meeting new people energizes me rather than exhausts me.", reverse: false },
//     { id: "e3", type: "E", text: "I prefer quiet, private environments over loud and busy ones.", reverse: true },
//     { id: "e4", type: "E", text: "Tight deadlines make me feel excited and focused, rather than panicked.", reverse: false },
//     // CONTROL (5-8)
//     { id: "c1", type: "C", text: "I need a clear, detailed plan or roadmap before I start working on anything.", reverse: false },
//     { id: "c2", type: "C", text: "I prefer to 'go with the flow' and improvise rather than following a strict schedule.", reverse: true },
//     { id: "c3", type: "C", text: "I feel stuck or paralyzed when instructions are vague or unclear.", reverse: false },
//     { id: "c4", type: "C", text: "I prefer to launch a 'rough draft' quickly and fix it later, rather than waiting for perfection.", reverse: true },
//     // THREAT (9-12)
//     { id: "t1", type: "T", text: "Uncertainty about the future often keeps me awake at night or affects my focus.", reverse: false },
//     { id: "t2", type: "T", text: "I easily feel overwhelmed or 'freeze up' when facing too many tasks at once.", reverse: false },
//     { id: "t3", type: "T", text: "I stay calm and clear-headed even in high-pressure situations.", reverse: true },
//     { id: "t4", type: "T", text: "I tend to overthink negative feedback or criticism for a long time.", reverse: false },
//     // STRETCH (13-16)
//     { id: "s1", type: "S", text: "I can function well even in environments that I dislike (e.g., too noisy or boring).", reverse: false },
//     { id: "s2", type: "S", text: "I can easily switch between detailed planning mode and fast action mode.", reverse: false },
//     { id: "s3", type: "S", text: "I recover my mental energy quickly (within 1-2 days) after a stressful event.", reverse: false },
//     { id: "s4", type: "S", text: "When I fall off track, I bounce back quickly instead of spiraling downward.", reverse: false }
// ];


export const questions = [
  // GROUP 1: THREAT (T)
  {
    id: "t1", type: "T", reverse: false,
    leftLabel: "Safety-First", rightLabel: "Risk-Taking",
    text: `Trial of the Nemean Lion<br><br>
          <strong>Scenario:</strong> You face a beast with impenetrable golden fur. Your sword snaps upon impact, and your usual methods have failed.<br><br>
          <strong>Your Instinct:</strong><br>
          <strong>Left instinct:</strong> Tactical Retreat: "My weapons are useless. I must withdraw to rethink my strategy rather than fight a losing battle."<br>
          <strong>Right instinct:</strong> Close Combat: "If weapons fail, I will adapt and grapple it with my bare hands."`
  },
  {
    id: "t2", type: "T", reverse: false,
    leftLabel: "Safety-First", rightLabel: "Risk-Taking",
    text: `Trial of the Stymphalian Birds<br><br>
          <strong>Scenario:</strong> The sky darkens as thousands of bronze-beaked birds descend. The swarm is overwhelming and toxic.<br><br>
          <strong>Your Instinct:</strong><br>
          <strong>Left instinct:</strong> Shield & Cover: "Prioritize survival. Find cover immediately to weather the storm."<br>
          <strong>Right instinct:</strong> Disrupt & Attack: "Create chaos. Use noise to scare them into the air, then pick them off."`
  },
  {
    id: "t3", type: "T", reverse: false,
    leftLabel: "Safety-First", rightLabel: "Risk-Taking",
    text: `Trial of Cerberus<br><br>
          <strong>Scenario:</strong> To complete the mission, you must voluntarily enter the Underworld—a realm of high stakes from which few return.<br><br>
          <strong>Your Instinct:</strong><br>
          <strong>Left instinct:</strong> Risk Aversion: "The cost of failure is eternal entrapment. I would look for a safer alternative."<br>
          <strong>Right instinct:</strong> Risk Acceptance: "High risk yields high rewards. I am willing to step into the unknown."`
  },

  // GROUP 2: CONTROL (C)
  {
    id: "c1", type: "C", reverse: false,
    leftLabel: "Action-Oriented", rightLabel: "System-Oriented",
    text: `Trial of the Augean Stables<br><br>
          <strong>Scenario:</strong> You are tasked with cleaning 30 years of accumulated filth in a single day. The volume is impossible for normal means.<br><br>
          <strong>Your Approach:</strong><br>
          <strong>Left instinct:</strong> Rapid Execution: "Start shoveling immediately. Speed and intensity are the only ways to finish."<br>
          <strong>Right instinct:</strong> System Re-engineering: "Stop and plan. I will divert a nearby river to wash it all out automatically."`
  },
  {
    id: "c2", type: "C", reverse: false,
    leftLabel: "Action-Oriented", rightLabel: "System-Oriented",
    text: `Trial of the Mares of Diomedes<br><br>
          <strong>Scenario:</strong> You are given charge of a team of powerful, wild horses. You are unaware of their true nature.<br><br>
          <strong>Your Approach:</strong><br>
          <strong>Left instinct:</strong> Trust & Delegate: "I give them freedom and trust things will work out naturally."<br>
          <strong>Right instinct:</strong> Verify & Contain: "I restrain them first to check for hidden dangers before releasing them."`
  },
  {
    id: "c3", type: "C", reverse: false,
    leftLabel: "Action-Oriented", rightLabel: "System-Oriented",
    text: `Trial of the Cretan Bull<br><br>
          <strong>Scenario:</strong> A raging bull is destroying the city infrastructure. It is a force of pure chaos.<br><br>
          <strong>Your Approach:</strong><br>
          <strong>Left instinct:</strong> Head-On: "I will meet its force with my own and wrestle it down."<br>
          <strong>Right instinct:</strong> Outsmart: "I will set a trap or lure it into a corner to subdue it without a fight."`
  },

  // GROUP 3: ENERGY (E)
  {
    id: "e1", type: "E", reverse: false,
    leftLabel: "Independent/Skeptic", rightLabel: "Collaborative/Trusting",
    text: `Trial of Hippolyta's Belt<br><br>
          <strong>Scenario:</strong> You need an item from a stranger (The Queen). Rumors circulate that her people might be hostile.<br><br>
          <strong>Your Reaction:</strong><br>
          <strong>Left instinct:</strong> Guarded: "Trust no one. I keep my hand on my weapon just in case."<br>
          <strong>Right instinct:</strong> Open: "I approach with open arms to clear up any misunderstandings."`
  },
  {
    id: "e2", type: "E", reverse: false,
    leftLabel: "Independent/Skeptic", rightLabel: "Collaborative/Trusting",
    text: `Trial of the Erymanthian Boar<br><br>
          <strong>Scenario:</strong> You are hunting in a snowy, unfamiliar mountain range and have lost the track.<br><br>
          <strong>Your Reaction:</strong><br>
          <strong>Left instinct:</strong> Self-Reliant: "I will figure it out myself. I work best when I focus alone."<br>
          <strong>Right instinct:</strong> Seek Counsel: "I will find a local Centaur (mentor) to ask for guidance."`
  },
  {
    id: "e3", type: "E", reverse: false,
    leftLabel: "Independent/Skeptic", rightLabel: "Collaborative/Trusting",
    text: `Trial of Geryon's Cattle<br><br>
          <strong>Scenario:</strong> The journey is long and plagued by constant small annoyances (gadflies, heat, detours).<br><br>
          <strong>Your Reaction:</strong><br>
          <strong>Left instinct:</strong> Result-Focused: "I find these distractions draining. I just want to finish the job."<br>
          <strong>Right instinct:</strong> Journey-Focused: "The chaos is part of the adventure. I take it in stride."`
  },

  // GROUP 4: STRETCH (S)
  {
    id: "s1", type: "S", reverse: false,
    leftLabel: "Pragmatic", rightLabel: "Tenacious",
    text: `Trial of the Hydra<br><br>
          <strong>Scenario:</strong> The problem evolves. When you cut off one head, two more grow back. Your current tactic is backfiring.<br><br>
          <strong>Your Mindset:</strong><br>
          <strong>Left instinct:</strong> Pragmatic Stop: "This approach is futile. Better to stop now than waste more energy."<br>
          <strong>Right instinct:</strong> Adaptive Pivot: "If the sword fails, I will try fire. I will keep changing tactics until I win."`
  },
  {
    id: "s2", type: "S", reverse: false,
    leftLabel: "Pragmatic", rightLabel: "Tenacious",
    text: `Trial of the Ceryneian Hind<br><br>
          <strong>Scenario:</strong> Your goal is elusive and faster than an arrow. You have been chasing it for a year.<br><br>
          <strong>Your Mindset:</strong><br>
          <strong>Left instinct:</strong> Opportunity Cost: "A year is too long. It is smarter to switch to a more achievable target."<br>
          <strong>Right instinct:</strong> Relentless: "I don't care how long it takes. I will not stop until I catch it."`
  },
  {
    id: "s3", type: "S", reverse: false,
    leftLabel: "Pragmatic", rightLabel: "Tenacious",
    text: `Trial of the Golden Apples<br><br>
          <strong>Scenario:</strong> To gain the prize, you must temporarily bear the crushing weight of the entire Sky on your shoulders.<br><br>
          <strong>Your Mindset:</strong><br>
          <strong>Left instinct:</strong> Know Your Limits: "That is too much weight. I will not destroy myself for a prize."<br>
          <strong>Right instinct:</strong> Endure: "I will grit my teeth and hold it. I can handle the pressure."`
  }
];
