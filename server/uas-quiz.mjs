function slugId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const UAS_SKILL_SOURCE = {
  Astra: ["Nova Pulse", "Nebula  / Dissipate", "Gravity Well", "Astral Form / Cosmic Divide"],
  Breach: ["Flashpoint", "Fault Line", "Aftershock", "Rolling Thunder"],
  Brimstone: ["Stim Beacon", "Incendiary", "Sky Smoke", "Orbital Strike"],
  Chamber: ["Rendezvous", "Trademark", "Headhunter", "Tour De Force"],
  Clove: ["Pick-me-up", "Ruse", "Not Dead Yet", "Meddle"],
  Cypher: ["Cyber Cage", "Spycam", "Trapwire", "Neural Theft"],
  Deadlock: ["Sonic Sensor", "Barrier Mesh", "GravNet", "Annihilation"],
  Fade: ["Seize", "Haunt", "Prowler", "Nightfall"],
  Gekko: ["Wingman", "Dizzy", "Mosh Pit", "Thrash"],
  Harbor: ["High Tide", "Storm Surge", "Cove", "Reckoning"],
  Iso: ["Undercut", "Kill Contract", "Double Tap", "Contingency"],
  Jett: ["Updraft", "Tailwind", "Cloudburst", "Blade Storm"],
  "KAY/O": ["FRAG/ment", "FLASH/drive", "ZERO/point", "NULL/cmd"],
  Killjoy: ["Nanoswarm", "ALARMBOT", "TURRET", "Lockdown"],
  Miks: ["M-pulse", "Waveform", "Harmonize", "Bassquake"],
  Neon: ["High Gear", "Relay Bolt", "Fast Lane", "Overdrive"],
  Omen: ["Paranoia", "Dark Cover", "Shrouded Step", "From the Shadows"],
  Phoenix: ["Blaze", "Hot Hands", "Curveball", "Run it Back"],
  Raze: ["Blast Pack", "Paint Shells", "Boom Bot", "Showstopper"],
  Reyna: ["Devour", "Dismiss", "Leer", "Empress"],
  Sage: ["Slow Orb", "Healing Orb", "Barrier Orb", "Resurrection"],
  Skye: ["Trailblazer", "Guiding Light", "Regrowth", "Seekers"],
  Sova: ["Shock Bolt", "Recon Bolt", "Owl Drone", "Hunter's Fury"],
  Tejo: ["Guided Salvo", "Special Delivery", "Armageddon", "Stealth Drone"],
  Veto: ["Interceptor", "Crosscut", "Evolution", "Chokehold"],
  Viper: ["Poison Cloud", "Toxic Screen", "Snake Bite", "Viper's Pit"],
  Vyse: ["Shear", "Arc Rose", "Razorvine", "Steel Garden"],
  Waylay: ["Refract", "Saturate", "Lightspeed", "Convergent Paths"],
  Yoru: ["FAKEOUT", "BLINDSIDE", "GATECRASH", "DIMENSIONAL DRIFT"],
};

const UAS_SKILL_QUESTIONS = Object.entries(UAS_SKILL_SOURCE).flatMap(
  ([agent, abilities]) =>
    abilities.map((ability) => ({
      id: `skill-${slugId(agent)}-${slugId(ability)}`,
      answer: agent,
      group: "skill",
      points: 10,
    })),
);

const UAS_ULTIMATE_VOICE_LINES = [
  ["You Want To Play? Let's Play", "Chamber"],
  ["They Are So Dead!", "Chamber"],
  ["Joke's Over, You're Dead!", "Phoenix"],
  ["Come On, Let's Go!", "Phoenix"],
  ["It's You And Me!", "Iso"],
  ["No Distractions!", "Iso"],
  ["Open Up The Sky!", "Brimstone"],
  ["Prepare For Hellfire!", "Brimstone"],
  ["It's All You, Lil' Homie!", "Gekko"],
  ["Oye! Monster On The Loose!", "Gekko"],
  ["I've Got Your Trail!", "Skye"],
  ["Seek Them Out!", "Skye"],
  ["Nowhere To Run!", "Sova"],
  ["I Am The Hunter!", "Sova"],
  ["Get Out Of My Way!", "Jett"],
  ["Watch This!", "Jett"],
  ["I'll Handle This!", "Yoru"],
  ["Who's Next!", "Yoru"],
  ["They Will Cower!", "Reyna"],
  ["The Hunt Begins!", "Reyna"],
  ["Fire In The Hole!", "Raze"],
  ["Here Comes The Party!", "Raze"],
  ["Face Your Fear!", "Fade"],
  ["Nightmare, Take Them!", "Fade"],
  ["My Territory, My Rules!", "Deadlock"],
  ["Pull Them To Their Grave!", "Deadlock"],
  ["I Suggest You Move!", "Harbor"],
  ["Let's Turn The Tide!", "Harbor"],
  ["Into The Deep!", "Harbor"],
  ["Let's Go!", "Breach"],
  ["Off Your Feet!", "Breach"],
  ["Initiated!", "Killjoy"],
  ["You Should Run!", "Killjoy"],
  ["Don't Get In My Way!", "Viper"],
  ["Welcome To My World!", "Viper"],
  ["You...Are...Powerless!", "KAY/O"],
  ["No One Walks Away!", "KAY/O"],
  ["Where Is Everyone Hiding!", "Cypher"],
  ["I Know Exactly Where You Are!", "Cypher"],
  ["You Are Divided!", "Astra"],
  ["World Divided!", "Astra"],
  ["Watch Them Run!", "Omen"],
  ["Scatter!", "Omen"],
  ["You Will Not Kill My Allies!", "Sage"],
  ["Your Duty Is Not Over!", "Sage"],
  ["Here We Go!", "Neon"],
  ["Hey! I'm Pissed!", "Neon"],
  ["Back, Like I Never Left!", "Clove"],
  ["You've Had Your Fun, My Turn!", "Clove"],
  ["This Is How It Ends!", "Tejo"],
  ["Go Ahead, Stand Your Ground!", "Tejo"],
  ["Line Them Up! I'm Going In!", "Waylay"],
  ["One! By! One!", "Waylay"],
  ["Turn It All To Dust!", "Veto"],
  ["Not Another Step!", "Veto"],
  ["Bring Me The Arsenal!", "Vyse"],
  ["Adapt, Or Die!", "Vyse"],
];

const UAS_ULTIMATE_VOICE_QUESTIONS = UAS_ULTIMATE_VOICE_LINES.map(
  ([line, answer]) => ({
    id: `voice-${slugId(answer)}-${slugId(line)}`,
    answer,
    group: "skill",
    points: 10,
  }),
);

const UAS_MAP_NAMES = [
  "Abyss",
  "Ascent",
  "Bind",
  "Breeze",
  "Corrode",
  "Fracture",
  "Haven",
  "Icebox",
  "Lotus",
  "Pearl",
  "Split",
  "Sunset",
];

const UAS_MAP_QUESTIONS = UAS_MAP_NAMES.map((name) => ({
  id: `map-${slugId(name)}-splash`,
  answer: name,
  group: "map",
  points: 10,
  variant: "splash",
}));

const UAS_MAP_GAMEPLAY_SCENES = {
  "Abyss": 10,
  "Ascent": 4,
  "Bind": 6,
  "Breeze": 16,
  "Corrode": 21,
  "Fracture": 8,
  "Haven": 4,
  "Icebox": 8,
  "Lotus": 7,
  "Pearl": 8,
  "Split": 4,
  "Sunset": 12,
};

const UAS_MAP_GAMEPLAY_QUESTIONS = Object.entries(UAS_MAP_GAMEPLAY_SCENES).flatMap(
  ([answer, count]) =>
    Array.from({ length: count }, (_, sceneIndex) => {
      const scene = String(sceneIndex + 1).padStart(2, "0");
      return {
        id: `map-gameplay-${slugId(answer)}-scene-${scene}`,
        answer,
        group: "map",
        points: 10,
        variant: "gameplay",
      };
    }),
);

const UAS_SKIN_WEAPON_SUFFIX =
  /\s+(Vandal|Phantom|Operator|Sheriff|Ghost|Spectre|Classic|Marshal|Outlaw|Guardian|Bulldog|Judge|Bucky|Shorty|Frenzy|Stinger|Ares|Odin)$/i;

const UAS_SKIN_QUESTIONS = [
  ["skin-exo-vandal", "EX.O Vandal"],
  ["skin-kuronami-vandal", "Kuronami Vandal"],
  ["skin-rgx-11z-pro-vandal", "RGX 11Z Pro Vandal"],
  ["skin-araxys-vandal", "Araxys Vandal"],
  ["skin-glitchpop-vandal", "Glitchpop Vandal"],
  ["skin-chronovoid-vandal", "ChronoVoid Vandal"],
  ["skin-prelude-to-chaos-vandal", "Prelude to Chaos Vandal"],
  ["skin-imperium-vandal", "Imperium Vandal"],
  ["skin-singularity-vandal", "Singularity Vandal"],
  ["skin-dolmirs-revenge-vandal", "Dolmir's Revenge Vandal"],
  ["skin-primordium-vandal", "Primordium Vandal"],
  ["skin-overdrive-vandal", "Overdrive Vandal"],
  ["skin-blackthorn-vandal", "Blackthorn Vandal"],
  ["skin-sentinels-of-light-vandal", "Sentinels of Light Vandal"],
  ["skin-mystbloom-vandal", "Mystbloom Vandal"],
  ["skin-cyrax-vandal", "CYRAX Vandal"],
  ["skin-champions-2025-vandal", "Champions 2025 Vandal"],
  ["skin-arcane-vandal", "Arcane Vandal"],
  ["skin-rogue-vandal", "Rogue Vandal"],
  ["skin-elderflame-vandal", "Elderflame Vandal"],
  ["skin-evori-dreamwings-vandal", "Evori Dreamwings Vandal"],
  ["skin-ora-by-onetap-vandal", "ORA by OneTap Vandal"],
  ["skin-neptune-vandal", "Neptune Vandal"],
  ["skin-gaias-vengeance-vandal", "Gaia's Vengeance Vandal"],
  ["skin-origin-vandal", "Origin Vandal"],
  ["skin-forsaken-vandal", "Forsaken Vandal"],
  ["skin-prime-vandal", "Prime Vandal"],
  ["skin-ion-vandal", "Ion Vandal"],
  ["skin-oni-vandal", "Oni Vandal"],
  ["skin-reaver-vandal", "Reaver Vandal"],
  ["skin-neptune-phantom", "Neptune Phantom"],
  ["skin-magepunk-phantom", "Magepunk Phantom"],
  ["skin-helix-phantom", "Helix Phantom"],
  ["skin-sovereign-phantom", "Sovereign Phantom"],
  ["skin-recon-phantom", "Recon Phantom"],
  ["skin-spectrum-phantom", "Spectrum Phantom"],
  ["skin-ayakashi-phantom", "Ayakashi Phantom"],
  ["skin-nocturnum-phantom", "Nocturnum Phantom"],
  ["skin-neo-frontier-phantom", "Neo Frontier Phantom"],
  ["skin-blastx-phantom", "BlastX Phantom"],
  ["skin-radiant-entertainment-system-phantom", "Radiant Entertainment System Phantom"],
  ["skin-radiant-entertainment-system-operator", "Radiant Entertainment System Operator"],
  ["skin-elderflame-operator", "Elderflame Operator"],
  ["skin-ora-by-onetap-operator", "ORA by OneTap Operator"],
  ["skin-kuronami-operator", "Kuronami Operator"],
  ["skin-rgx-11z-pro-operator", "RGX 11Z Pro Operator"],
  ["skin-divergence-operator", "Divergence Operator"],
  ["skin-araxys-operator", "Araxys Operator"],
  ["skin-glitchpop-operator", "Glitchpop Operator"],
  ["skin-prelude-to-chaos-operator", "Prelude to Chaos Operator"],
  ["skin-imperium-operator", "Imperium Operator"],
  ["skin-bubblegum-deathwish-operator", "Bubblegum Deathwish Operator"],
  ["skin-holo-meridian-operator", "Holo Meridian Operator"],
  ["skin-sentinels-of-light-operator", "Sentinels of Light Operator"],
  ["skin-mystbloom-operator", "Mystbloom Operator"],
  ["skin-splashx-operator", "SplashX Operator"],
  ["skin-arcane-sheriff", "Arcane Sheriff"],
  ["skin-neo-frontier-sheriff", "Neo Frontier Sheriff"],
  ["skin-kuronami-sheriff", "Kuronami Sheriff"],
  ["skin-ion-sheriff", "Ion Sheriff"],
  ["skin-reaver-sheriff", "Reaver Sheriff"],
  ["skin-singularity-sheriff", "Singularity Sheriff"],
  ["skin-araxys-sheriff", "Araxys Sheriff"],
  ["skin-mystbloom-sheriff", "Mystbloom Sheriff"],
  ["skin-imperium-sheriff", "Imperium Sheriff"],
  ["skin-magepunk-sheriff", "Magepunk Sheriff"],
  ["skin-protocol-781-a-sheriff", "Protocol 781-A Sheriff"],
  ["skin-sentinels-of-light-sheriff", "Sentinels of Light Sheriff"],
  ["skin-sovereign-ghost", "Sovereign Ghost"],
  ["skin-reaver-ghost", "Reaver Ghost"],
  ["skin-gaia-s-vengeance-ghost", "Gaia's Vengeance Ghost"],
  ["skin-magepunk-ghost", "Magepunk Ghost"],
  ["skin-evori-dreamwings-ghost", "Evori Dreamwings Ghost"],
  ["skin-radiant-entertainment-system-ghost", "Radiant Entertainment System Ghost"],
  ["skin-ruination-ghost", "Ruination Ghost"],
  ["skin-phaseguard-ghost", "Phaseguard Ghost"],
  ["skin-xerofang-ghost", "XEROFANG Ghost"],
  ["skin-prime-spectre", "Prime Spectre"],
  ["skin-rgx-11z-pro-spectre", "RGX 11Z Pro Spectre"],
  ["skin-reaver-spectre", "Reaver Spectre"],
  ["skin-kuronami-spectre", "Kuronami Spectre"],
  ["skin-protocol-781-a-spectre", "Protocol 781-A Spectre"],
  ["skin-magepunk-spectre", "Magepunk Spectre"],
  ["skin-recon-spectre", "Recon Spectre"],
  ["skin-singularity-spectre", "Singularity Spectre"],
  ["skin-blastx-spectre", "BlastX Spectre"],
  ["skin-prime-classic", "Prime Classic"],
  ["skin-rgx-11z-pro-classic", "RGX 11Z Pro Classic"],
  ["skin-spectrum-classic", "Spectrum Classic"],
  ["skin-glitchpop-classic", "Glitchpop Classic"],
  ["skin-forsaken-classic", "Forsaken Classic"],
  ["skin-kuronami-marshal", "Kuronami Marshal"],
  ["skin-neo-frontier-marshal", "Neo Frontier Marshal"],
  ["skin-sovereign-marshal", "Sovereign Marshal"],
  ["skin-gaia-s-vengeance-marshal", "Gaia's Vengeance Marshal"],
  ["skin-magepunk-marshal", "Magepunk Marshal"],
  ["skin-kuronami-no-yaiba", "Kuronami no Yaiba"],
  ["skin-reaver-karambit", "Reaver Karambit"],
  ["skin-rgx-11z-pro-firefly", "RGX 11Z Pro Firefly"],
  ["skin-rgx-11z-pro-karambit", "RGX 11Z Pro Karambit"],
  ["skin-rgx-11z-pro-blade", "RGX 11Z Pro Blade"],
  ["skin-champions-2021-karambit", "Champions 2021 Karambit"],
  ["skin-champions-2022-butterfly-knife", "Champions 2022 Butterfly Knife"],
  ["skin-champions-2023-kunai", "Champions 2023 Kunai"],
  ["skin-champions-2024-blade", "Champions 2024 Blade"],
  ["skin-champions-2025-butterfly-knife", "Champions 2025 Butterfly Knife"],
  ["skin-vct-2025-karambit", "VCT 2025 Karambit"],
  ["skin-arcane-gauntlets", "Arcane Gauntlets"],
  ["skin-ignite-fan", "Ignite Fan"],
  ["skin-xenohunter-knife", "Xenohunter Knife"],
  ["skin-recon-balisong", "Recon Balisong"],
  ["skin-onimaru-kunitsuna", "Onimaru Kunitsuna"],
  ["skin-singularity-butterfly-knife", "Singularity Butterfly Knife"],
  ["skin-cyrax-fanblade", "CYRAX Fanblade"],
  ["skin-prime-2-0-karambit", "Prime//2.0 Karambit"],
  ["skin-mystbloom-fanblade", "Mystbloom Fanblade"],
  ["skin-ex-o-outlaw", "EX.O Outlaw"],
  ["skin-rgx-11z-pro-outlaw", "RGX 11Z Pro Outlaw"],
  ["skin-prism-reloaded-outlaw", "Prism//Reloaded Outlaw"],
].map(([id, answer]) => ({
  id,
  answer: answer.replace(UAS_SKIN_WEAPON_SUFFIX, ""),
  group: "skin",
  points: 10,
}));

const UAS_RANK_QUESTIONS = [
  ["rank-iron-1", "Iron 1"],
  ["rank-iron-2", "Iron 2"],
  ["rank-iron-3", "Iron 3"],
  ["rank-bronze-1", "Bronze 1"],
  ["rank-bronze-2", "Bronze 2"],
  ["rank-bronze-3", "Bronze 3"],
  ["rank-silver-1", "Silver 1"],
  ["rank-silver-2", "Silver 2"],
  ["rank-silver-3", "Silver 3"],
  ["rank-gold-1", "Gold 1"],
  ["rank-gold-2", "Gold 2"],
  ["rank-gold-3", "Gold 3"],
  ["rank-platinum-1", "Platinum 1"],
  ["rank-platinum-2", "Platinum 2"],
  ["rank-platinum-3", "Platinum 3"],
  ["rank-diamond-1", "Diamond 1"],
  ["rank-diamond-2", "Diamond 2"],
  ["rank-diamond-3", "Diamond 3"],
  ["rank-ascendant-1", "Ascendant 1"],
  ["rank-ascendant-2", "Ascendant 2"],
  ["rank-ascendant-3", "Ascendant 3"],
  ["rank-immortal-1", "Immortal 1"],
  ["rank-immortal-2", "Immortal 2"],
  ["rank-immortal-3", "Immortal 3"],
  ["rank-radiant", "Radiant"],
].map(([id, answer]) => ({
  id,
  answer,
  group: "rank",
  points: 10,
}));

const UAS_AGENT_NAMES = [
  "Astra",
  "Breach",
  "Brimstone",
  "Chamber",
  "Clove",
  "Cypher",
  "Deadlock",
  "Fade",
  "Gekko",
  "Harbor",
  "Iso",
  "Jett",
  "KAY/O",
  "Killjoy",
  "Miks",
  "Neon",
  "Omen",
  "Phoenix",
  "Raze",
  "Reyna",
  "Sage",
  "Skye",
  "Sova",
  "Tejo",
  "Veto",
  "Viper",
  "Vyse",
  "Waylay",
  "Yoru",
];

const UAS_AGENT_TRAPS = [
  ["astra-phoenix", "Astra", "Phoenix"],
  ["clove-kayo", "Clove", "KAY/O"],
  ["killjoy-tejo", "Killjoy", "Tejo"],
  ["neon-gekko", "Neon", "Gekko"],
  ["omen-fade", "Omen", "Fade"],
  ["omen-jett", "Omen", "Jett"],
  ["raze-breach", "Raze", "Breach"],
  ["reyna-skye", "Reyna", "Skye"],
  ["sage-harbor", "Sage", "Harbor"],
  ["viper-brimstone", "Viper", "Brimstone"],
  ["yoru-vyse", "Yoru", "Vyse"],
];
const UAS_AGENT_TRAP_FAKE_BY_REAL = Object.fromEntries(
  UAS_AGENT_TRAPS.map(([, fakeAnswer, answer]) => [answer, fakeAnswer]),
);
const UAS_AGENT_NORMAL_IMAGES = [
  ["breach", "Breach"],
  ["brimstone", "Brimstone"],
  ["harbor", "Harbor"],
  ["jett", "Jett"],
  ["kayo", "KAY/O"],
  ["neon", "Neon"],
  ["phoenix", "Phoenix"],
  ["skye", "Skye"],
  ["tejo", "Tejo"],
  ["vyse", "Vyse"],
];

const UAS_AGENT_QUESTIONS = [
  ...UAS_AGENT_TRAPS.map(([slug, fakeAnswer, answer]) => ({
    id: `agent-trap-${slug}`,
    answer,
    fakeAnswer,
    group: "agent",
    points: 25,
    variant: "trap",
  })),
  ...UAS_AGENT_NORMAL_IMAGES.map(([, answer]) => ({
    id: `agent-normal-custom-${slugId(answer)}`,
    answer,
    fakeAnswer: UAS_AGENT_TRAP_FAKE_BY_REAL[answer],
    group: "agent",
    points: 25,
    variant: "normal",
  })),
  ...UAS_AGENT_NAMES.map((answer) => ({
    id: `agent-normal-full-${slugId(answer)}`,
    answer,
    fakeAnswer: UAS_AGENT_TRAP_FAKE_BY_REAL[answer],
    group: "agent",
    points: 25,
    variant: "normal",
  })),
];

export const UAS_QUESTION_BANK = [
  ...UAS_MAP_QUESTIONS,
  ...UAS_MAP_GAMEPLAY_QUESTIONS,
  ...UAS_SKILL_QUESTIONS,
  ...UAS_ULTIMATE_VOICE_QUESTIONS,
  ...UAS_RANK_QUESTIONS,
  { id: "map-bind", answer: "Bind", group: "map", points: 10 },
  { id: "sage-ulti", answer: "Resurrection", group: "skill", points: 10 },
  { id: "omen-skill-name", answer: "Dark Cover", group: "skill", points: 10 },
  { id: "jett-dash", answer: "Tailwind", group: "skill", points: 10 },
  { id: "sova-reveal", answer: "Recon Bolt", group: "skill", points: 10 },
  { id: "fade-haunt", answer: "Haunt", group: "skill", points: 10 },
  { id: "raze-bot", answer: "Boom Bot", group: "skill", points: 10 },
  { id: "viper-wall", answer: "Toxic Screen", group: "skill", points: 10 },
  { id: "reyna-dismiss", answer: "Dismiss", group: "skill", points: 10 },
  { id: "breach-flash", answer: "Flashpoint", group: "skill", points: 10 },
  { id: "weapon-vandal", answer: "Vandal", group: "weapon", points: 10 },
  { id: "weapon-phantom", answer: "Phantom", group: "weapon", points: 10 },
  { id: "weapon-operator", answer: "Operator", group: "weapon", points: 10 },
  { id: "weapon-ghost", answer: "Ghost", group: "weapon", points: 10 },
  { id: "weapon-spectre", answer: "Spectre", group: "weapon", points: 10 },
  { id: "weapon-bucky", answer: "Bucky", group: "weapon", points: 10 },
  { id: "weapon-ares", answer: "Ares", group: "weapon", points: 10 },
  { id: "weapon-odin", answer: "Odin", group: "weapon", points: 10 },
  { id: "trailblazer-owner", answer: "Skye", group: "skill", points: 10 },
  ...UAS_SKIN_QUESTIONS,
  { id: "voice-chamber", answer: "Chamber", group: "voice", points: 10 },
  ...UAS_AGENT_QUESTIONS,
];

export const UAS_QUESTIONS = selectUasQuestions("uas-default");
export const UAS_MAX_RAW_SCORE = getMaxRawScore(UAS_QUESTIONS);

export function getRank(score) {
  if (score >= 100) return "Radiant";
  if (score >= 95) return "Immortal";
  if (score >= 90) return "Ascendant";
  if (score >= 80) return "Diamond";
  if (score >= 70) return "Platinum";
  if (score >= 60) return "Gold";
  if (score >= 45) return "Silver";
  if (score >= 30) return "Bronze";
  return "Iron";
}

function seedFromString(value) {
  let hash = 2166136261;
  const text = String(value || "uas-default");

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRandom(seedText) {
  let seed = seedFromString(seedText);

  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed(items, seedText) {
  const random = createRandom(seedText);
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }

  return shuffled;
}

function pickQuestions(group, count, seedText, options = {}) {
  const pool = UAS_QUESTION_BANK.filter(
    (question) =>
      question.group === group &&
      (!options.variant || question.variant === options.variant) &&
      !(options.excludeAnswers || []).includes(question.answer),
  );
  const shuffled = shuffleWithSeed(
    pool,
    `${seedText}:${group}${options.variant ? `:${options.variant}` : ""}`,
  );

  if (!options.uniqueAnswer) return shuffled.slice(0, count);

  const picked = [];
  const seenAnswers = new Set();

  for (const question of shuffled) {
    if (seenAnswers.has(question.answer)) continue;
    picked.push(question);
    seenAnswers.add(question.answer);
    if (picked.length === count) break;
  }

  return picked;
}

export function selectUasQuestions(seedText) {
  const seed = seedText || "uas-default";
  const gameplayMapQuestions = pickQuestions("map", 1, seed, {
    uniqueAnswer: true,
    variant: "gameplay",
  });
  const splashMapQuestions = pickQuestions("map", 1, seed, {
    excludeAnswers: gameplayMapQuestions.map((question) => question.answer),
    uniqueAnswer: true,
    variant: "splash",
  });
  const basicQuestions = shuffleWithSeed(
    [
      ...pickQuestions("skill", 1, seed),
      ...gameplayMapQuestions,
      ...splashMapQuestions,
      ...pickQuestions("weapon", 1, seed),
      ...pickQuestions("skin", 2, seed, { uniqueAnswer: true }),
      ...pickQuestions("rank", 1, seed, { uniqueAnswer: true }),
    ],
    `${seed}:basic-order`,
  );
  const agentQuestions = shuffleWithSeed(
    [
      ...pickQuestions("agent", 2, seed, {
        uniqueAnswer: true,
        variant: "trap",
      }),
      ...pickQuestions("agent", 1, seed, {
        uniqueAnswer: true,
        variant: "normal",
      }),
    ],
    `${seed}:agent-order`,
  );

  return [...basicQuestions, ...agentQuestions];
}

function getMaxRawScore(questions) {
  return questions.reduce((total, question) => total + question.points, 0);
}

function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function gradeUasAnswers(answers, seedText) {
  const questions = selectUasQuestions(seedText);
  const maxRawScore = getMaxRawScore(questions);
  const safeAnswers = answers && typeof answers === "object" ? answers : {};
  let rawScore = 0;

  const detail = questions.map((question) => {
    const submitted = safeAnswers[question.id];
    const isCorrect =
      normalizeAnswer(submitted) === normalizeAnswer(question.answer);

    if (isCorrect) {
      rawScore += question.points;
    }

    return {
      id: question.id,
      answer: submitted || "",
      correctAnswer: question.answer,
      correct: isCorrect,
      points: isCorrect ? question.points : 0,
      maxPoints: question.points,
    };
  });

  const score = Math.round((rawScore / maxRawScore) * 100);

  return {
    detail,
    maxRawScore,
    rank: getRank(score),
    rawScore,
    score,
  };
}
