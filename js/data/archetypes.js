export const archetypes = {
    // --- MATRIX TYPES ---
    "HERA": {
        name: "HERA",
        role: "THE SOVEREIGN ARCHITECT",
        img: "img/Hera.png",

        // Sử dụng dấu backtick (`) để viết nhiều dòng và chứa HTML
        desc: `
            <p><strong>(High Control • High Energy)</strong></p>
            <p><em>"Order is not something that happens naturally. Order is something that is enforced."</em></p>
            
            <br>
            <strong>🏛️ The Operating System</strong>
            <p>You operate on the <strong>Sovereign OS</strong>. While others drift through life reacting to circumstances, you are actively terraforming your environment to fit your vision. To a Hera, the world is not a playground—it is a construction site, and you are the only one with the blueprints.</p>
            <p>You possess a rare combination of visionary energy and meticulous control. You don’t just want to lead the team; you want to <em>design</em> the team. You have an innate authority that makes you the gravitational center of any room. People look to you for direction not because you ask for it, but because you are usually the only one with a clear plan.</p>

            <br>
            <strong>⚖️ The Burden of Competence</strong>
            <p>Your greatest strength—and your heaviest burden—is your terrifying level of competence. You have a "high-resolution" mind; you spot inefficiencies, risks, and errors seconds after walking into a room.</p>
            <p>This often creates a sense of isolation. You stay late to fix the formatting on the group presentation because "good enough" is physically painful for you. You are the "Parent" of your social group—not the nurturing kind who bakes cookies, but the pragmatic kind who ensures nobody misses their flight.</p>
            
            <br>
            <strong>🔒 The "High Standards" Paradox</strong>
            <p>You value loyalty and efficiency above all else. If someone is in your "inner circle," you will move mountains for them. However, the price of admission is high. You would rather work alone and exhaust yourself than work with people who slow you down.</p>
        `,

        bug: `
            <strong>⛔ System Error: The "Atlas Complex"</strong>
            <p>Your code has a critical glitch: <strong>You do not know how to trust.</strong></p>
            <p>Deep down, you harbor a secret belief: <em>"If I stop pushing, everything will collapse."</em> You carry the weight of the world (like Atlas) because you refuse to let anyone else help lift it. You micromanage not because you enjoy power, but because you are terrified of the chaos that ensues when you let go.</p>
            <p>This creates a self-fulfilling prophecy: Because you fix everything, people around you become dependent. You then think, "See? They are useless," and take on even more work. This leads to <strong>Hera-Burnout</strong>: exhaustion mixed with resentment.</p>
        `,

        fix: `
            <strong>🛠️ Patch v1.0: The 80% Rule</strong>
            <p>Your growth path is not about doing <em>more</em>; it is about doing <em>less</em>.</p>
            <ul style="text-align: left; margin-top: 10px;">
                <li><strong>The 80% Rule:</strong> If someone can do a task 80% as well as you, delegate it. That missing 20% of quality is not worth your sanity.</li>
                <li><strong>Let It Break:</strong> Sometimes, you have to let the glass fall. If you always catch it, others will never learn to hold it themselves.</li>
                <li><strong>Define "Done," Not "How":</strong> Tell people the result you want, but ban yourself from telling them how to get there. It’s painful, but it’s the only way you scale.</li>
            </ul>
        `
    },
    "ARES": { 
        name: "ARES", role: "THE WARRIOR", img: "img/Ares.png",
        desc: "Your system is built for conflict and conquest. With High Energy and High Control but Low Threat perception, you are fearless. You don't just solve problems; you attack them. You thrive in high-stakes environments where hesitation means failure. You are decisive, blunt, and incredibly effective in short bursts. While others are paralyzed by potential risks, you are already charging forward. You are the engine of execution.",
        bug: "<strong>Collateral Damage.</strong> You treat everything as a battle to be won, including conversations with loved ones. Your directness is often perceived as aggression. You bulldoze over people's feelings without noticing, leaving you victorious but isolated. You view empathy as inefficiency, not realizing that 'winning' an argument often means losing the relationship.",
        fix: "<strong>Tactical Empathy.</strong> You need to install a 'Diplomacy' patch. Pause for exactly 3 seconds before responding in anger. Realize that not every disagreement is a declaration of war. Soft power is often more effective than brute force."
    },
    "APHRODITE": {
        name: "APHRODITE", role: "THE MUSE", img: "img/Aphrodite.png",
        desc: "You operate on pure emotional voltage. High Energy and High Threat sensitivity create a vibrant, chaotic, and magnetic personality. You feel everything deeply—joy, sorrow, beauty, and rejection. You can read the emotional temperature of a room instantly. You are the spark that ignites others, the creator of vibes, and the aesthetic soul of any group. You live for connection and expression.",
        bug: "<strong>Emotional Volatility.</strong> Your system lacks the 'Control' module. You are prone to dramatic highs and crushing lows. You struggle with discipline and routine, often abandoning projects when the emotional excitement fades. You are easily hurt by criticism, letting one negative comment ruin an entire week. Your identity fluctuates based on how others perceive you.",
        fix: "<strong>External Structure.</strong> You cannot rely on willpower or 'feeling like it.' You need external systems (deadlines, accountability partners, rigid schedules) to keep you grounded. Learn to separate your self-worth from your momentary emotions. You are not your feelings."
    },
    "APOLLO": {
        name: "APOLLO", role: "THE STAR", img: "img/Apollo.png",
        desc: "Your OS is designed for radiance. High Energy combined with Low Control and Low Threat makes you naturally optimistic, charismatic, and lucky. You breeze through life, attracting opportunities and people without seemingly trying hard. You are the life of the party, the generator of ideas, and the eternal optimist. You bring light wherever you go, and people love to bask in it.",
        bug: "<strong>Shiny Object Syndrome.</strong> You lack depth and persistence. You are addicted to the 'new'—new hobbies, new projects, new people. When things get difficult, boring, or require deep grinding, you vanish. You have incredible potential but rarely finish what you start. You fear that committing to one thing means missing out on everything else.",
        fix: "<strong>The Deep Dive.</strong> Commit to one boring, difficult thing for 30 days. Force your system to endure the discomfort of depth. Talent is cheap; discipline is expensive. You need to buy some discipline to turn your potential into kinetic power."
    },
    "ATHENA": {
        name: "ATHENA", role: "THE STRATEGIST", img: "img/Athena.png",
        desc: "You are the master of logic. Low Energy (Introversion) mixed with High Control and High Threat makes you a brilliant planner. You see risks miles away. You don't guess; you calculate. You are the brain behind the operation, the architect of systems, and the debugger of reality. You value competence above all else and have little patience for stupidity or emotional outbursts.",
        bug: "<strong>Analysis Paralysis.</strong> You spend 90% of your RAM preparing for scenarios that have a 1% chance of happening. Your fear of failure masquerades as 'preparation.' You struggle to pull the trigger because you are waiting for perfect certainty, which does not exist. You live in your head, often forgetting to actually live in the real world.",
        fix: "<strong>The Beta Launch.</strong> Adopt a 'Ship It' mentality. Action cures fear. Force yourself to execute when you are only 70% ready. You can fix bugs later, but you can't fix a product that doesn't exist. Get out of your head and into the arena."
    },
    "HEPHAESTUS": {
        name: "HEPHAESTUS", role: "THE MAKER", img: "img/Hephaestus.png",
        desc: "You are the stoic builder. Low Energy and Low Threat but High Control means you are steady, reliable, and incredibly focused. You don't need the spotlight; you just want to do the work and do it right. You find peace in process and craftsmanship. You are the backbone of any team, the one who actually gets things done while others are just talking about it.",
        bug: "<strong>The Silo Trap.</strong> You isolate yourself. You believe that asking for help is a sign of weakness or incompetence. You silently resent people who talk more than they work, but you never voice this frustration. Your rigidity makes it hard for you to adapt when the plan changes, and you often burn out in silence.",
        fix: "<strong>Open Source.</strong> Connect with the network. Share your work before it's finished. Realize that soft skills (communication) are just as important as hard skills (technical execution). Asking for help is an efficiency tool, not a weakness."
    },
    "ARTEMIS": {
        name: "ARTEMIS", role: "THE HUNTER", img: "img/Artemis.png",
        desc: "Your system is optimized for independence. Low Energy and Low Control but High Threat makes you hyper-vigilant and self-reliant. You value freedom above all else. You are sharp, observant, and impossible to tame. You are comfortable in the wild (metaphorically or literally) and trust your instincts more than you trust society's rules. You are a survivor.",
        bug: "<strong>Defensive Walls.</strong> Your 'Threat' radar is too sensitive. You interpret intimacy as a trap and reliance on others as a weakness. You push people away before they can hurt you, leading to a safe but lonely existence. You mistake hyper-independence for strength, when it is actually a trauma response.",
        fix: "<strong>Trust Protocol.</strong> Independence is a survival tactic, not a lifestyle. Pick one person to trust completely this month. Lower the drawbridge just a little bit. You don't have to hunt alone forever."
    },
    "HESTIA": {
        name: "HESTIA", role: "THE KEEPER", img: "img/Hestia.png",
        desc: "You are the calm in the chaos. Low Energy, Low Control, and Low Threat create a Zen-like operating system. You are content, peaceful, and a great listener. You don't seek drama, status, or conflict. You create a safe harbor for others, offering warmth and acceptance without judgment. You are the grounding force in a frantic world.",
        bug: "<strong>The Comfort Coma.</strong> You are so conflict-averse that you become passive. You let life happen *to* you rather than making it happen. You suppress your own desires and needs to keep the peace, slowly fading into the background. You risk waking up one day realizing you lived everyone else's life but your own.",
        fix: "<strong>Ignite the Fire.</strong> Assertiveness is not aggression. Pick one thing you want this week and demand it. Your voice matters, but only if you use it. Conflict is necessary for growth."
    },
    
    // --- STRETCH TYPES (High Adaptability) ---
    "HERMES": {
        name: "HERMES", role: "THE ALCHEMIST", img: "img/Hermes.png",
        desc: "You are a shapeshifter. Your High Adaptability score indicates a fluid operating system. You can hack into any environment—High Energy, Low Energy, Chaos, or Order—and mimic the necessary protocols. You are the ultimate survivor, the diplomat, and the connector. You can speak the language of kings and thieves alike.",
        bug: "<strong>Identity Fragmentation.</strong> You are so good at adapting that you've forgotten who you actually are. You are a mirror reflecting everyone else. You lack a core foundation, making you feel hollow despite your success. You are a 'Jack of all trades, master of none,' and people may perceive you as slippery or untrustworthy.",
        fix: "<strong>Core Kernel.</strong> Define your non-negotiables. What will you *never* do, regardless of the situation? Build a solid center so you can shape-shift without losing yourself. Commit to a singular identity when no one is watching."
    },
    "DEMETER": {
        name: "DEMETER", role: "THE NURTURER", img: "img/Demeter.png",
        desc: "You possess a regenerative OS. Your High Adaptability (Recovery) score means you have an endless capacity to heal, forgive, and grow. You are the soil from which others grow. You provide stability and sustenance to the ecosystem. You are the first person people call when they are in trouble because they know you will handle it.",
        bug: "<strong>The Savior Complex.</strong> You give until you are empty. You attract broken people because they know you will fix them. You equate 'love' with 'sacrifice,' leaving your own battery constantly critically low. You feel guilty when you take time for yourself.",
        fix: "<strong>The Fence.</strong> Boundaries are not mean; they are necessary. You cannot pour from an empty cup. Prioritize your own recovery before you attempt to save the world. Learn to say 'No' without explaining yourself."
    },

    // --- BOSS TYPES (Special Overrides) ---
    "ZEUS": {
        name: "ZEUS", role: "THE OLYMPIAN", img: "img/Zeus.png",
        desc: "CRITICAL ALERT: Your stats are maxed out. High Energy, High Control, High Threat. You are a force of nature. You have the vision of a god, the discipline of a soldier, and the paranoia of a dictator. You are built for empire. You can outwork, outthink, and outlast almost anyone. You are the CEO, the Founder, the Commander.",
        bug: "<strong>Total System Overload.</strong> You are untethered from reality. You expect superhuman performance from yourself and others 24/7. You are likely lonely, sleep-deprived, and on the verge of a massive cardiac or existential crash. You believe you are indispensable, which is a dangerous delusion.",
        fix: "<strong>Mortal Mode.</strong> You are human. Accept it. If you don't schedule rest, your body will schedule it for you (in a hospital). Delegate power or collapse. The world will spin without you for a few hours."
    },
    "POSEIDON": { 
        name: "POSEIDON", role: "THE TEMPEST", img: "img/Poseidon.png",
        desc: "You are the storm. Your Energy and Threat levels are critical, but Control is low. You are raw power without a steering wheel. You feel emotions with terrifying intensity—passion, rage, joy, grief. You are deeply creative and destructive in equal measure. You are the artist who burns down the studio to paint the fire.",
        bug: "<strong>Tsunami Damage.</strong> Your mood swings are destructive. You flood the people around you with your intensity. You struggle to regulate your internal weather, making you unpredictable and exhausting to be around. You make permanent decisions based on temporary emotions.",
        fix: "<strong>Build Levees.</strong> You need emotional regulation techniques immediately (meditation, therapy, journaling). Do not act on a feeling until 24 hours have passed. Use your intensity for creation, not destruction."
    },
    "HADES": { 
        name: "HADES", role: "THE SHADOW", img: "img/Hades.png",
        desc: "You dwell in the deep. Your Threat perception is off the charts. You see the worst-case scenario in 4K resolution while everyone else is blind. You are a deep thinker, uncomfortably realistic, and protective. You understand the darker side of human nature and aren't afraid to look at it.",
        bug: "<strong>The Bunker.</strong> You have retreated so far into your mind that you are disconnected from the light. Cynicism is your shield. You reject joy because you are waiting for the other shoe to drop. You are safe, but you are not alive.",
        fix: "<strong>Surface Time.</strong> Force yourself to engage in 'trivial' fun. Optimism is not stupidity; it's a survival tool. Come up for air. Not everyone is out to get you."
    }
};
