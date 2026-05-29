const API = {
  cancel: "/api/uas-cancel",
  leaderboard: "/api/uas-leaderboard",
  start: "/api/uas-start",
  status: "/api/uas-status",
  submit: "/api/uas-submit",
};

function slugId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const SKILL_SOURCE = {
  "Astra": ["Nova Pulse","Nebula  / Dissipate","Gravity Well","Astral Form / Cosmic Divide"],
  "Breach": ["Flashpoint","Fault Line","Aftershock","Rolling Thunder"],
  "Brimstone": ["Stim Beacon","Incendiary","Sky Smoke","Orbital Strike"],
  "Chamber": ["Rendezvous","Trademark","Headhunter","Tour De Force"],
  "Clove": ["Pick-me-up","Ruse","Not Dead Yet","Meddle"],
  "Cypher": ["Cyber Cage","Spycam","Trapwire","Neural Theft"],
  "Deadlock": ["Sonic Sensor","Barrier Mesh","GravNet","Annihilation"],
  "Fade": ["Seize","Haunt","Prowler","Nightfall"],
  "Gekko": ["Wingman","Dizzy","Mosh Pit","Thrash"],
  "Harbor": ["High Tide","Storm Surge","Cove","Reckoning"],
  "Iso": ["Undercut","Kill Contract","Double Tap","Contingency"],
  "Jett": ["Updraft","Tailwind","Cloudburst","Blade Storm"],
  "KAY/O": ["FRAG/ment","FLASH/drive","ZERO/point","NULL/cmd"],
  "Killjoy": ["Nanoswarm","ALARMBOT","TURRET","Lockdown"],
  "Miks": ["M-pulse","Waveform","Harmonize","Bassquake"],
  "Neon": ["High Gear","Relay Bolt","Fast Lane","Overdrive"],
  "Omen": ["Paranoia","Dark Cover","Shrouded Step","From the Shadows"],
  "Phoenix": ["Blaze","Hot Hands","Curveball","Run it Back"],
  "Raze": ["Blast Pack","Paint Shells","Boom Bot","Showstopper"],
  "Reyna": ["Devour","Dismiss","Leer","Empress"],
  "Sage": ["Slow Orb","Healing Orb","Barrier Orb","Resurrection"],
  "Skye": ["Trailblazer","Guiding Light","Regrowth","Seekers"],
  "Sova": ["Shock Bolt","Recon Bolt","Owl Drone","Hunter's Fury"],
  "Tejo": ["Guided Salvo","Special Delivery","Armageddon","Stealth Drone"],
  "Veto": ["Interceptor","Crosscut","Evolution","Chokehold"],
  "Viper": ["Poison Cloud","Toxic Screen","Snake Bite","Viper's Pit"],
  "Vyse": ["Shear","Arc Rose","Razorvine","Steel Garden"],
  "Waylay": ["Refract","Saturate","Lightspeed","Convergent Paths"],
  "Yoru": ["FAKEOUT","BLINDSIDE","GATECRASH","DIMENSIONAL DRIFT"],
};

const SKILL_AGENT_NAMES = Object.keys(SKILL_SOURCE);
const SKILL_QUESTIONS = Object.entries(SKILL_SOURCE).flatMap(
  ([agent, abilities]) =>
    abilities.map((ability) => ({
      id: `skill-${slugId(agent)}-${slugId(ability)}`,
      answer: agent,
      group: "skill",
      badge: "Skillnya Siapa",
      title: `"${ability}" itu skill agent siapa?`,
      choicePool: SKILL_AGENT_NAMES,
    })),
);

const ULTIMATE_VOICE_LINES = [
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

const ULTIMATE_VOICE_QUESTIONS = ULTIMATE_VOICE_LINES.map(([line, answer]) => ({
  id: `voice-${slugId(answer)}-${slugId(line)}`,
  answer,
  group: "skill",
  badge: "Voice Line Ulti",
  title: `"${line}" itu ulti siapa?`,
  choicePool: SKILL_AGENT_NAMES,
}));

const MAP_NAMES = [
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

const MAP_QUESTIONS = MAP_NAMES.map((name, index) => ({
  id: `map-${slugId(name)}-splash`,
  answer: name,
  group: "map",
  variant: "splash",
  type: "image",
  badge: "Tebak Map",
  title: "Map apa ini?",
  image: `/uas/map/${slugId(name)}.webp`,
  imageClass: `crop-map crop-map-${(index % 4) + 1}`,
  choicePool: MAP_NAMES,
}));

const MAP_GAMEPLAY_SCENES = {
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

const MAP_GAMEPLAY_QUESTIONS = Object.entries(MAP_GAMEPLAY_SCENES).flatMap(
  ([answer, count], mapIndex) =>
    Array.from({ length: count }, (_, sceneIndex) => {
      const scene = String(sceneIndex + 1).padStart(2, "0");
      const slug = `${slugId(answer)}-scene-${scene}`;
      return {
        id: `map-gameplay-${slug}`,
        answer,
        group: "map",
        variant: "gameplay",
        type: "image",
        badge: "Tebak Map",
        title: "Map apa ini?",
        image: `/uas/map/gameplay/${slug}.webp`,
        revealImage: `/uas/map/gameplay/${slug}.webp`,
        imageClass: `crop-map-gameplay crop-map-gameplay-${((mapIndex + sceneIndex) % 4) + 1}`,
        choicePool: MAP_NAMES,
      };
    }),
);

const SKIN_WEAPON_SUFFIX =
  /\s+(Vandal|Phantom|Operator|Sheriff|Ghost|Spectre|Classic|Marshal|Outlaw|Guardian|Bulldog|Judge|Bucky|Shorty|Frenzy|Stinger|Ares|Odin)$/i;

const SKIN_QUESTIONS = [
  ["skin-exo-vandal", "EX.O Vandal", "exo-vandal"],
  ["skin-kuronami-vandal", "Kuronami Vandal", "kuronami-vandal"],
  ["skin-rgx-11z-pro-vandal", "RGX 11Z Pro Vandal", "rgx-11z-pro-vandal"],
  ["skin-araxys-vandal", "Araxys Vandal", "araxys-vandal"],
  ["skin-glitchpop-vandal", "Glitchpop Vandal", "glitchpop-vandal"],
  ["skin-chronovoid-vandal", "ChronoVoid Vandal", "chronovoid-vandal"],
  ["skin-prelude-to-chaos-vandal", "Prelude to Chaos Vandal", "prelude-to-chaos-vandal"],
  ["skin-imperium-vandal", "Imperium Vandal", "imperium-vandal"],
  ["skin-singularity-vandal", "Singularity Vandal", "singularity-vandal"],
  ["skin-dolmirs-revenge-vandal", "Dolmir's Revenge Vandal", "dolmirs-revenge-vandal"],
  ["skin-primordium-vandal", "Primordium Vandal", "primordium-vandal"],
  ["skin-overdrive-vandal", "Overdrive Vandal", "overdrive-vandal"],
  ["skin-blackthorn-vandal", "Blackthorn Vandal", "blackthorn-vandal"],
  ["skin-sentinels-of-light-vandal", "Sentinels of Light Vandal", "sentinels-of-light-vandal"],
  ["skin-mystbloom-vandal", "Mystbloom Vandal", "mystbloom-vandal"],
  ["skin-cyrax-vandal", "CYRAX Vandal", "cyrax-vandal"],
  ["skin-champions-2025-vandal", "Champions 2025 Vandal", "champions-2025-vandal"],
  ["skin-arcane-vandal", "Arcane Vandal", "arcane-vandal"],
  ["skin-rogue-vandal", "Rogue Vandal", "rogue-vandal"],
  ["skin-elderflame-vandal", "Elderflame Vandal", "elderflame-vandal"],
  ["skin-evori-dreamwings-vandal", "Evori Dreamwings Vandal", "evori-dreamwings-vandal"],
  ["skin-ora-by-onetap-vandal", "ORA by OneTap Vandal", "ora-by-onetap-vandal"],
  ["skin-neptune-vandal", "Neptune Vandal", "neptune-vandal"],
  ["skin-gaias-vengeance-vandal", "Gaia's Vengeance Vandal", "gaias-vengeance-vandal"],
  ["skin-origin-vandal", "Origin Vandal", "origin-vandal"],
  ["skin-forsaken-vandal", "Forsaken Vandal", "forsaken-vandal"],
  ["skin-prime-vandal", "Prime Vandal", "prime-vandal"],
  ["skin-ion-vandal", "Ion Vandal", "ion-vandal"],
  ["skin-oni-vandal", "Oni Vandal", "oni-vandal"],
  ["skin-reaver-vandal", "Reaver Vandal", "reaver-vandal"],
  ["skin-neptune-phantom", "Neptune Phantom", "neptune-phantom"],
  ["skin-magepunk-phantom", "Magepunk Phantom", "magepunk-phantom"],
  ["skin-helix-phantom", "Helix Phantom", "helix-phantom"],
  ["skin-sovereign-phantom", "Sovereign Phantom", "sovereign-phantom"],
  ["skin-recon-phantom", "Recon Phantom", "recon-phantom"],
  ["skin-spectrum-phantom", "Spectrum Phantom", "spectrum-phantom"],
  ["skin-ayakashi-phantom", "Ayakashi Phantom", "ayakashi-phantom"],
  ["skin-nocturnum-phantom", "Nocturnum Phantom", "nocturnum-phantom"],
  ["skin-neo-frontier-phantom", "Neo Frontier Phantom", "neo-frontier-phantom"],
  ["skin-blastx-phantom", "BlastX Phantom", "blastx-phantom"],
  ["skin-radiant-entertainment-system-phantom", "Radiant Entertainment System Phantom", "radiant-entertainment-system-phantom"],
  ["skin-radiant-entertainment-system-operator", "Radiant Entertainment System Operator", "radiant-entertainment-system-operator"],
  ["skin-elderflame-operator", "Elderflame Operator", "elderflame-operator"],
  ["skin-ora-by-onetap-operator", "ORA by OneTap Operator", "ora-by-onetap-operator"],
  ["skin-kuronami-operator", "Kuronami Operator", "kuronami-operator"],
  ["skin-rgx-11z-pro-operator", "RGX 11Z Pro Operator", "rgx-11z-pro-operator"],
  ["skin-divergence-operator", "Divergence Operator", "divergence-operator"],
  ["skin-araxys-operator", "Araxys Operator", "araxys-operator"],
  ["skin-glitchpop-operator", "Glitchpop Operator", "glitchpop-operator"],
  ["skin-prelude-to-chaos-operator", "Prelude to Chaos Operator", "prelude-to-chaos-operator"],
  ["skin-imperium-operator", "Imperium Operator", "imperium-operator"],
  ["skin-bubblegum-deathwish-operator", "Bubblegum Deathwish Operator", "bubblegum-deathwish-operator"],
  ["skin-holo-meridian-operator", "Holo Meridian Operator", "holo-meridian-operator"],
  ["skin-sentinels-of-light-operator", "Sentinels of Light Operator", "sentinels-of-light-operator"],
  ["skin-mystbloom-operator", "Mystbloom Operator", "mystbloom-operator"],
  ["skin-splashx-operator", "SplashX Operator", "splashx-operator"],
  ["skin-arcane-sheriff", "Arcane Sheriff", "arcane-sheriff"],
  ["skin-neo-frontier-sheriff", "Neo Frontier Sheriff", "neo-frontier-sheriff"],
  ["skin-kuronami-sheriff", "Kuronami Sheriff", "kuronami-sheriff"],
  ["skin-ion-sheriff", "Ion Sheriff", "ion-sheriff"],
  ["skin-reaver-sheriff", "Reaver Sheriff", "reaver-sheriff"],
  ["skin-singularity-sheriff", "Singularity Sheriff", "singularity-sheriff"],
  ["skin-araxys-sheriff", "Araxys Sheriff", "araxys-sheriff"],
  ["skin-mystbloom-sheriff", "Mystbloom Sheriff", "mystbloom-sheriff"],
  ["skin-imperium-sheriff", "Imperium Sheriff", "imperium-sheriff"],
  ["skin-magepunk-sheriff", "Magepunk Sheriff", "magepunk-sheriff"],
  ["skin-protocol-781-a-sheriff", "Protocol 781-A Sheriff", "protocol-781-a-sheriff"],
  ["skin-sentinels-of-light-sheriff", "Sentinels of Light Sheriff", "sentinels-of-light-sheriff"],
  ["skin-sovereign-ghost", "Sovereign Ghost", "sovereign-ghost"],
  ["skin-reaver-ghost", "Reaver Ghost", "reaver-ghost"],
  ["skin-gaia-s-vengeance-ghost", "Gaia's Vengeance Ghost", "gaia-s-vengeance-ghost"],
  ["skin-magepunk-ghost", "Magepunk Ghost", "magepunk-ghost"],
  ["skin-evori-dreamwings-ghost", "Evori Dreamwings Ghost", "evori-dreamwings-ghost"],
  ["skin-radiant-entertainment-system-ghost", "Radiant Entertainment System Ghost", "radiant-entertainment-system-ghost"],
  ["skin-ruination-ghost", "Ruination Ghost", "ruination-ghost"],
  ["skin-phaseguard-ghost", "Phaseguard Ghost", "phaseguard-ghost"],
  ["skin-xerofang-ghost", "XEROFANG Ghost", "xerofang-ghost"],
  ["skin-prime-spectre", "Prime Spectre", "prime-spectre"],
  ["skin-rgx-11z-pro-spectre", "RGX 11Z Pro Spectre", "rgx-11z-pro-spectre"],
  ["skin-reaver-spectre", "Reaver Spectre", "reaver-spectre"],
  ["skin-kuronami-spectre", "Kuronami Spectre", "kuronami-spectre"],
  ["skin-protocol-781-a-spectre", "Protocol 781-A Spectre", "protocol-781-a-spectre"],
  ["skin-magepunk-spectre", "Magepunk Spectre", "magepunk-spectre"],
  ["skin-recon-spectre", "Recon Spectre", "recon-spectre"],
  ["skin-singularity-spectre", "Singularity Spectre", "singularity-spectre"],
  ["skin-blastx-spectre", "BlastX Spectre", "blastx-spectre"],
  ["skin-prime-classic", "Prime Classic", "prime-classic"],
  ["skin-rgx-11z-pro-classic", "RGX 11Z Pro Classic", "rgx-11z-pro-classic"],
  ["skin-spectrum-classic", "Spectrum Classic", "spectrum-classic"],
  ["skin-glitchpop-classic", "Glitchpop Classic", "glitchpop-classic"],
  ["skin-forsaken-classic", "Forsaken Classic", "forsaken-classic"],
  ["skin-kuronami-marshal", "Kuronami Marshal", "kuronami-marshal"],
  ["skin-neo-frontier-marshal", "Neo Frontier Marshal", "neo-frontier-marshal"],
  ["skin-sovereign-marshal", "Sovereign Marshal", "sovereign-marshal"],
  ["skin-gaia-s-vengeance-marshal", "Gaia's Vengeance Marshal", "gaia-s-vengeance-marshal"],
  ["skin-magepunk-marshal", "Magepunk Marshal", "magepunk-marshal"],
  ["skin-kuronami-no-yaiba", "Kuronami no Yaiba", "kuronami-no-yaiba"],
  ["skin-reaver-karambit", "Reaver Karambit", "reaver-karambit"],
  ["skin-rgx-11z-pro-firefly", "RGX 11Z Pro Firefly", "rgx-11z-pro-firefly"],
  ["skin-rgx-11z-pro-karambit", "RGX 11Z Pro Karambit", "rgx-11z-pro-karambit"],
  ["skin-rgx-11z-pro-blade", "RGX 11Z Pro Blade", "rgx-11z-pro-blade"],
  ["skin-champions-2021-karambit", "Champions 2021 Karambit", "champions-2021-karambit"],
  ["skin-champions-2022-butterfly-knife", "Champions 2022 Butterfly Knife", "champions-2022-butterfly-knife"],
  ["skin-champions-2023-kunai", "Champions 2023 Kunai", "champions-2023-kunai"],
  ["skin-champions-2024-blade", "Champions 2024 Blade", "champions-2024-blade"],
  ["skin-champions-2025-butterfly-knife", "Champions 2025 Butterfly Knife", "champions-2025-butterfly-knife"],
  ["skin-vct-2025-karambit", "VCT 2025 Karambit", "vct-2025-karambit"],
  ["skin-arcane-gauntlets", "Arcane Gauntlets", "arcane-gauntlets"],
  ["skin-ignite-fan", "Ignite Fan", "ignite-fan"],
  ["skin-xenohunter-knife", "Xenohunter Knife", "xenohunter-knife"],
  ["skin-recon-balisong", "Recon Balisong", "recon-balisong"],
  ["skin-onimaru-kunitsuna", "Onimaru Kunitsuna", "onimaru-kunitsuna"],
  ["skin-singularity-butterfly-knife", "Singularity Butterfly Knife", "singularity-butterfly-knife"],
  ["skin-cyrax-fanblade", "CYRAX Fanblade", "cyrax-fanblade"],
  ["skin-prime-2-0-karambit", "Prime//2.0 Karambit", "prime-2-0-karambit"],
  ["skin-mystbloom-fanblade", "Mystbloom Fanblade", "mystbloom-fanblade"],
  ["skin-ex-o-outlaw", "EX.O Outlaw", "ex-o-outlaw"],
  ["skin-rgx-11z-pro-outlaw", "RGX 11Z Pro Outlaw", "rgx-11z-pro-outlaw"],
  ["skin-prism-reloaded-outlaw", "Prism//Reloaded Outlaw", "prism-reloaded-outlaw"],
].map(([id, answer, slug]) => ({
  id,
  answer: answer.replace(SKIN_WEAPON_SUFFIX, ""),
  group: "skin",
  type: "image",
  badge: "Tebak Skin",
  title: "Skin apa ini?",
  image: `/uas/skin/${slug}.webp`,
  imageClass: "crop-skin",
}));

const RANK_NAMES = [
  "Iron 1",
  "Iron 2",
  "Iron 3",
  "Bronze 1",
  "Bronze 2",
  "Bronze 3",
  "Silver 1",
  "Silver 2",
  "Silver 3",
  "Gold 1",
  "Gold 2",
  "Gold 3",
  "Platinum 1",
  "Platinum 2",
  "Platinum 3",
  "Diamond 1",
  "Diamond 2",
  "Diamond 3",
  "Ascendant 1",
  "Ascendant 2",
  "Ascendant 3",
  "Immortal 1",
  "Immortal 2",
  "Immortal 3",
  "Radiant",
];

const RANK_QUESTIONS = [
  ["rank-iron-1", "Iron 1", "3624-valorant-iron-1"],
  ["rank-iron-2", "Iron 2", "7351-valorant-iron-2"],
  ["rank-iron-3", "Iron 3", "1854-valorant-iron-3"],
  ["rank-bronze-1", "Bronze 1", "4159-valorant-bronze-1"],
  ["rank-bronze-2", "Bronze 2", "4376-valorant-bronze-2"],
  ["rank-bronze-3", "Bronze 3", "4590-valorant-bronze-3"],
  ["rank-silver-1", "Silver 1", "6335-valorant-silver-1"],
  ["rank-silver-2", "Silver 2", "8138-valorant-silver-2"],
  ["rank-silver-3", "Silver 3", "3293-valorant-silver-3"],
  ["rank-gold-1", "Gold 1", "5533-valorant-gold-1"],
  ["rank-gold-2", "Gold 2", "2060-valorant-gold-2"],
  ["rank-gold-3", "Gold 3", "3293-valorant-gold-3"],
  ["rank-platinum-1", "Platinum 1", "4590-valorant-platinum-1"],
  ["rank-platinum-2", "Platinum 2", "3255-valorant-platinum-2"],
  ["rank-platinum-3", "Platinum 3", "5816-valorant-platinum-3"],
  ["rank-diamond-1", "Diamond 1", "4590-valorant-diamond-1"],
  ["rank-diamond-2", "Diamond 2", "3939-valorant-diamond-2"],
  ["rank-diamond-3", "Diamond 3", "6354-valorant-diamond-3"],
  ["rank-ascendant-1", "Ascendant 1", "4590-valorant-ascendant-1"],
  ["rank-ascendant-2", "Ascendant 2", "8376-valorant-ascendant-2"],
  ["rank-ascendant-3", "Ascendant 3", "2309-valorant-ascendant-3"],
  ["rank-immortal-1", "Immortal 1", "1518-valorant-immortal-1"],
  ["rank-immortal-2", "Immortal 2", "1775-valorant-immortal-2"],
  ["rank-immortal-3", "Immortal 3", "5979-valorant-immortal-3"],
  ["rank-radiant", "Radiant", "5979-valorant-radiant"],
].map(([id, answer, icon]) => ({
  id,
  answer,
  group: "rank",
  type: "image",
  badge: "Tebak Rank",
  title: "Rank apa ini?",
  image: `/uas/icon/${icon}.webp`,
  imageClass: "rank-icon",
  choicePool: RANK_NAMES,
}));

const AGENT_FULL_BODY = {
  Astra: "Astra_-_Full_body.webp",
  Breach: "Breach_-_Full_body.webp",
  Brimstone: "Brimstone_-_Full_body.webp",
  Chamber: "Chamber_-_Full_body.webp",
  Clove: "Clove_-_Full_body.webp",
  Cypher: "Cypher_-_Full_body.webp",
  Deadlock: "Deadlock_-_Full_body.webp",
  Fade: "Fade_-_Full_Body.webp",
  Gekko: "Gekko_-_Full_body.webp",
  Harbor: "Harbor_-_Full_body.webp",
  Iso: "Iso_-_Full_body.webp",
  Jett: "Jett_-_Full_body.webp",
  "KAY/O": "KAY_O_-_Full_body.webp",
  Killjoy: "Killjoy_-_Full_body.webp",
  Miks: "Miks_-_Full_body.webp",
  Neon: "Neon_-_Full_body.webp",
  Omen: "Omen_-_Full_body.webp",
  Phoenix: "Phoenix_-_Full_body.webp",
  Raze: "Raze_-_Full_body.webp",
  Reyna: "Reyna_-_Full_body.webp",
  Sage: "Sage_-_Full_body.webp",
  Skye: "Skye_-_Full_body.webp",
  Sova: "Sova_-_Full_body.webp",
  Tejo: "Tejo_-_Full_body.webp",
  Veto: "Veto_-_Full_body.webp",
  Viper: "Viper_-_Full_body.webp",
  Vyse: "Vyse_-_Full_body.webp",
  Waylay: "Waylay_-_Full_body.webp",
  Yoru: "Yoru_-_Full_body.webp",
};

const AGENT_NAMES = Object.keys(AGENT_FULL_BODY);
const AGENT_TRAPS = [
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
const AGENT_TRAP_FAKE_BY_REAL = Object.fromEntries(
  AGENT_TRAPS.map(([, fakeAnswer, answer]) => [answer, fakeAnswer]),
);
const AGENT_NORMAL_IMAGES = [
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

const AGENT_QUESTIONS = [
  ...AGENT_TRAPS.map(([slug, fakeAnswer, answer]) => {
    const revealSlug = slug.split("-").at(-1);

    return {
      id: `agent-trap-${slug}`,
      answer,
      fakeAnswer,
      group: "agent",
      variant: "trap",
      type: "image",
      badge: "Tebak Agent",
      title: "Agent apa dari potongan gambar ini?",
      image: `/uas/agent/${slug}.webp`,
      revealImage: `/uas/agent/${revealSlug}.webp`,
      imageClass: "crop-agent crop-agent-trap",
      points: 25,
      choicePool: AGENT_NAMES,
    };
  }),
  ...AGENT_NORMAL_IMAGES.map(([slug, answer]) => ({
    id: `agent-normal-custom-${slugId(answer)}`,
    answer,
    fakeAnswer: AGENT_TRAP_FAKE_BY_REAL[answer],
    group: "agent",
    variant: "normal",
    type: "image",
    badge: "Tebak Agent",
    title: "Agent apa dari potongan gambar ini?",
    image: `/uas/agent/${slug}.webp`,
    revealImage: `/uas/agent/${slug}.webp`,
    imageClass: "crop-agent crop-agent-normal bg-agent-normal",
    points: 25,
    choicePool: AGENT_NAMES,
  })),
  ...AGENT_NAMES.map((answer) => ({
    id: `agent-normal-full-${slugId(answer)}`,
    answer,
    fakeAnswer: AGENT_TRAP_FAKE_BY_REAL[answer],
    group: "agent",
    variant: "normal",
    type: "image",
    badge: "Tebak Agent",
    title: "Agent apa dari potongan gambar ini?",
    image: `/uas/agent/${AGENT_FULL_BODY[answer]}`,
    revealImage: `/uas/agent/${AGENT_FULL_BODY[answer]}`,
    imageClass: "crop-agent crop-agent-normal bg-agent-normal",
    points: 25,
    choicePool: AGENT_NAMES,
  })),
];

// Edit stok soal di sini. Kalau jawaban benar diubah, samakan juga di
// /server/uas-quiz.mjs supaya scoring server tetap benar.
const QUESTION_BANK = [
  ...MAP_QUESTIONS,
  ...MAP_GAMEPLAY_QUESTIONS,
  ...SKILL_QUESTIONS,
  ...ULTIMATE_VOICE_QUESTIONS,
  ...RANK_QUESTIONS,
  {
    id: "map-bind",
    answer: "Bind",
    group: "map",
    type: "image",
    badge: "Tebak Map",
    title: "Map apa ini dari potongan screenshot?",
    image: "/img/bind.avif",
    imageClass: "crop-map",
    choices: ["Bind", "Haven", "Abyss", "Sunset"],
  },
  {
    id: "sage-ulti",
    answer: "Resurrection",
    group: "skill",
    badge: "Tebak Skill",
    title: "Skill ultimate Sage yang bisa balikin teman hidup namanya apa?",
    choices: ["Resurrection", "Healing Orb", "Barrier Orb", "Slow Orb"],
  },
  {
    id: "omen-skill-name",
    answer: "Dark Cover",
    group: "skill",
    badge: "Nama Skill",
    title: "Smoke bulat milik Omen itu nama skill-nya apa?",
    choices: ["Dark Cover", "Paranoia", "Shrouded Step", "From the Shadows"],
  },
  {
    id: "jett-dash",
    answer: "Tailwind",
    group: "skill",
    badge: "Tebak Skill",
    title: "Skill dash Jett namanya apa?",
    choices: ["Tailwind", "Cloudburst", "Updraft", "Blade Storm"],
  },
  {
    id: "sova-reveal",
    answer: "Recon Bolt",
    group: "skill",
    badge: "Nama Skill",
    title: "Panah Sova yang bisa reveal posisi musuh namanya apa?",
    choices: ["Recon Bolt", "Shock Bolt", "Owl Drone", "Hunter's Fury"],
  },
  {
    id: "fade-haunt",
    answer: "Haunt",
    group: "skill",
    badge: "Nama Skill",
    title: "Skill Fade yang dilempar untuk reveal musuh namanya apa?",
    choices: ["Haunt", "Seize", "Prowler", "Nightfall"],
  },
  {
    id: "raze-bot",
    answer: "Boom Bot",
    group: "skill",
    badge: "Tebak Skill",
    title: "Robot kecil Raze yang ngejar musuh namanya apa?",
    choices: ["Boom Bot", "Paint Shells", "Blast Pack", "Showstopper"],
  },
  {
    id: "viper-wall",
    answer: "Toxic Screen",
    group: "skill",
    badge: "Nama Skill",
    title: "Dinding racun panjang milik Viper namanya apa?",
    choices: ["Toxic Screen", "Poison Cloud", "Snake Bite", "Viper's Pit"],
  },
  {
    id: "reyna-dismiss",
    answer: "Dismiss",
    group: "skill",
    badge: "Tebak Skill",
    title: "Skill Reyna untuk menghilang setelah ambil orb namanya apa?",
    choices: ["Dismiss", "Devour", "Leer", "Empress"],
  },
  {
    id: "breach-flash",
    answer: "Flashpoint",
    group: "skill",
    badge: "Nama Skill",
    title: "Flash milik Breach yang ditembak lewat tembok namanya apa?",
    choices: ["Flashpoint", "Fault Line", "Aftershock", "Rolling Thunder"],
  },
  {
    id: "weapon-vandal",
    answer: "Vandal",
    group: "weapon",
    type: "image",
    badge: "Tebak Senjata",
    title: "Senjata apa dari potongan gambar ini?",
    image: "/img/vandal.avif",
    imageClass: "crop-weapon",
    choices: ["Vandal", "Phantom", "Bulldog", "Guardian"],
  },
  {
    id: "weapon-phantom",
    answer: "Phantom",
    group: "weapon",
    type: "image",
    badge: "Tebak Senjata",
    title: "Senjata apa dari potongan gambar ini?",
    image: "/img/phantom.avif",
    imageClass: "crop-weapon",
    choices: ["Phantom", "Vandal", "Spectre", "Guardian"],
  },
  {
    id: "weapon-operator",
    answer: "Operator",
    group: "weapon",
    type: "image",
    badge: "Tebak Senjata",
    title: "Senjata apa dari potongan gambar ini?",
    image: "/img/operator.avif",
    imageClass: "crop-weapon",
    choices: ["Operator", "Marshal", "Outlaw", "Guardian"],
  },
  {
    id: "weapon-ghost",
    answer: "Ghost",
    group: "weapon",
    type: "image",
    badge: "Tebak Senjata",
    title: "Senjata apa dari potongan gambar ini?",
    image: "/img/ghost.avif",
    imageClass: "crop-weapon",
    choices: ["Ghost", "Classic", "Sheriff", "Frenzy"],
  },
  {
    id: "weapon-spectre",
    answer: "Spectre",
    group: "weapon",
    type: "image",
    badge: "Tebak Senjata",
    title: "Senjata apa dari potongan gambar ini?",
    image: "/img/spectre.avif",
    imageClass: "crop-weapon",
    choices: ["Spectre", "Stinger", "Bulldog", "Ares"],
  },
  {
    id: "weapon-bucky",
    answer: "Bucky",
    group: "weapon",
    type: "image",
    badge: "Tebak Senjata",
    title: "Senjata apa dari potongan gambar ini?",
    image: "/img/bucky.avif",
    imageClass: "crop-weapon",
    choices: ["Bucky", "Judge", "Shorty", "Ares"],
  },
  {
    id: "weapon-ares",
    answer: "Ares",
    group: "weapon",
    type: "image",
    badge: "Tebak Senjata",
    title: "Senjata apa dari potongan gambar ini?",
    image: "/img/ares.avif",
    imageClass: "crop-weapon",
    choices: ["Ares", "Odin", "Spectre", "Bulldog"],
  },
  {
    id: "weapon-odin",
    answer: "Odin",
    group: "weapon",
    type: "image",
    badge: "Tebak Senjata",
    title: "Senjata apa dari potongan gambar ini?",
    image: "/img/odin.avif",
    imageClass: "crop-weapon",
    choices: ["Odin", "Ares", "Operator", "Guardian"],
  },
  {
    id: "trailblazer-owner",
    answer: "Skye",
    group: "skill",
    badge: "Skillnya Siapa",
    title: "Trailblazer itu skill milik agent siapa?",
    choices: ["Skye", "Fade", "Gekko", "Breach"],
  },
  ...SKIN_QUESTIONS,
  {
    id: "voice-chamber",
    answer: "Chamber",
    group: "voice",
    badge: "Voice Line",
    title: "\"You want to play? Let's play.\" Itu ulti siapa?",
    choices: ["Chamber", "Jett", "Reyna", "Phoenix"],
  },
  ...AGENT_QUESTIONS,
  {
    id: "blend-yoru",
    answer: "Yoru",
    group: "agent",
    type: "image",
    badge: "Tebak Agent",
    title: "Agent apa dari potongan gambar ini?",
    image: "/img/yoru.avif",
    imageClass: "crop-agent crop-agent-left",
    points: 25,
    choices: ["Yoru", "Omen", "Sage", "Iso"],
  },
  {
    id: "blend-clove",
    answer: "Clove",
    group: "agent",
    type: "image",
    badge: "Tebak Agent",
    title: "Agent apa dari potongan gambar ini?",
    image: "/img/clove.avif",
    imageClass: "crop-agent crop-agent-center",
    points: 25,
    choices: ["Clove", "Viper", "Killjoy", "Fade"],
  },
  {
    id: "blend-gekko",
    answer: "Gekko",
    group: "agent",
    type: "image",
    badge: "Tebak Agent",
    title: "Agent apa dari potongan gambar ini?",
    image: "/img/gekko.avif",
    imageClass: "crop-agent crop-agent-right",
    points: 25,
    choices: ["Gekko", "Raze", "Neon", "Phoenix"],
  },
  {
    id: "agent-reyna",
    answer: "Reyna",
    group: "agent",
    type: "image",
    badge: "Tebak Agent",
    title: "Agent apa dari potongan gambar ini?",
    image: "/img/reyna.avif",
    imageClass: "crop-agent crop-agent-center",
    points: 25,
    choices: ["Reyna", "Fade", "Viper", "Neon"],
  },
  {
    id: "agent-iso",
    answer: "Iso",
    group: "agent",
    type: "image",
    badge: "Tebak Agent",
    title: "Agent apa dari potongan gambar ini?",
    image: "/img/iso.avif",
    imageClass: "crop-agent crop-agent-left",
    points: 25,
    choices: ["Iso", "Yoru", "Omen", "Chamber"],
  },
  {
    id: "agent-raze",
    answer: "Raze",
    group: "agent",
    type: "image",
    badge: "Tebak Agent",
    title: "Agent apa dari potongan gambar ini?",
    image: "/img/raze.avif",
    imageClass: "crop-agent crop-agent-right",
    points: 25,
    choices: ["Raze", "Neon", "Phoenix", "Killjoy"],
  },
  {
    id: "agent-fade",
    answer: "Fade",
    group: "agent",
    type: "image",
    badge: "Tebak Agent",
    title: "Agent apa dari potongan gambar ini?",
    image: "/img/fade.avif",
    imageClass: "crop-agent crop-agent-center",
    points: 25,
    choices: ["Fade", "Reyna", "Clove", "Sage"],
  },
  {
    id: "agent-omen",
    answer: "Omen",
    group: "agent",
    type: "image",
    badge: "Tebak Agent",
    title: "Agent apa dari potongan gambar ini?",
    image: "/img/omen.avif",
    imageClass: "crop-agent crop-agent-left",
    points: 25,
    choices: ["Omen", "Yoru", "Brimstone", "Sova"],
  },
];

let QUIZ_QUESTIONS = [];

const SAMPLE_LEADERBOARD = [
  {
    name: "cokelatmanis",
    score: 97,
    rank: "Immortal",
    duration_seconds: 352,
  },
  {
    name: "yoru enjoyer",
    score: 89,
    rank: "Diamond",
    duration_seconds: 420,
  },
  {
    name: "flash sendiri",
    score: 63,
    rank: "Gold",
    duration_seconds: 510,
  },
];

const RANK_ICONS = {
  ascendant: "2309-valorant-ascendant-3",
  bronze: "4590-valorant-bronze-3",
  diamond: "6354-valorant-diamond-3",
  gold: "3293-valorant-gold-3",
  immortal: "5979-valorant-immortal-3",
  iron: "1854-valorant-iron-3",
  platinum: "5816-valorant-platinum-3",
  radiant: "5979-valorant-radiant",
  silver: "3293-valorant-silver-3",
};

const state = {
  amount: 0,
  answers: {},
  answerTimer: null,
  channel: "",
  isAdvancing: false,
  isLocalPreview: false,
  leaderboard: SAMPLE_LEADERBOARD,
  current: 0,
  email: "",
  orderId: "",
  payment: null,
  paymentPollAttempts: 0,
  paymentPollInFlight: false,
  paymentPollTimer: null,
  quizToken: "",
  visualSeed: "",
};

const elements = {
  amountInput: document.getElementById("amountInput"),
  amountPresets: document.querySelectorAll(".amount-presets button"),
  changePayment: document.getElementById("changePayment"),
  checkPayment: document.getElementById("checkPayment"),
  emailInput: document.getElementById("emailInput"),
  examPanel: document.getElementById("examPanel"),
  introPanel: document.getElementById("introPanel"),
  leaderboard: document.getElementById("leaderboard"),
  leaderboardPanel: document.getElementById("leaderboardPanel"),
  localPreview: document.getElementById("localPreview"),
  nameInput: document.getElementById("nameInput"),
  openStart: document.getElementById("openStart"),
  paymentInstructions: document.getElementById("paymentInstructions"),
  paymentMessage: document.getElementById("paymentMessage"),
  paymentPanel: document.getElementById("paymentPanel"),
  paymentStatus: document.getElementById("paymentStatus"),
  progressPill: document.getElementById("progressPill"),
  questionCard: document.getElementById("questionCard"),
  refreshLeaderboard: document.getElementById("refreshLeaderboard"),
  resultPanel: document.getElementById("resultPanel"),
  startForm: document.getElementById("startForm"),
  startMessage: document.getElementById("startMessage"),
  startPanel: document.getElementById("startForm"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function rankKey(rank) {
  const key = String(rank || "Iron").toLowerCase();
  return [
    "iron",
    "bronze",
    "silver",
    "gold",
    "platinum",
    "diamond",
    "ascendant",
    "immortal",
    "radiant",
  ].includes(key)
    ? key
    : "iron";
}

function renderRankEmblem(rank, size = "") {
  const safeRank = escapeHtml(rank || "Iron");
  const key = rankKey(rank);
  const icon = RANK_ICONS[key] || RANK_ICONS.iron;
  const classes = ["rank-emblem", `rank-${rankKey(rank)}`, size]
    .filter(Boolean)
    .join(" ");

  return `
    <span class="${classes}" aria-label="Rank ${safeRank}" title="${safeRank}">
      <picture>
        <source srcset="/uas/icon/${icon}.webp" type="image/webp" />
        <img src="/uas/icon/${icon}.png" alt="${safeRank}" decoding="async" loading="lazy" />
      </picture>
    </span>
  `;
}

function getLocalRank(score) {
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
  const pool = QUESTION_BANK.filter(
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

function prepareQuestion(question, seedText) {
  const fallbackPool = [
    ...new Set(
      QUESTION_BANK.filter(
        (candidate) =>
          candidate.group === question.group &&
          candidate.answer !== question.answer,
      ).map((candidate) => candidate.answer),
    ),
  ];
  const answerPool = (question.choicePool || fallbackPool).filter(
    (answer) => answer !== question.answer,
  );
  const requiredChoices = [
    question.answer,
    question.fakeAnswer,
  ].filter((answer, index, list) => answer && list.indexOf(answer) === index);
  const choices = question.choices?.length
    ? question.choices
    : [
        ...requiredChoices,
        ...shuffleWithSeed(
          answerPool.filter((answer) => !requiredChoices.includes(answer)),
          `${seedText}:${question.id}:pool`,
        ).slice(0, 4 - requiredChoices.length),
      ];

  return {
    ...question,
    choices: shuffleWithSeed(choices, `${seedText}:${question.id}:choices`),
  };
}

function randomBetween(random, min, max) {
  return min + random() * (max - min);
}

function jitter(value, random, amount, min, max) {
  return Math.max(min, Math.min(max, value + randomBetween(random, -amount, amount)));
}

const MAP_FOCUS_POINTS = [
  [50, 50],
  [28, 30],
  [72, 32],
  [30, 72],
  [70, 70],
  [50, 22],
  [50, 78],
  [18, 50],
  [82, 50],
  [24, 18],
  [76, 82],
];

const AGENT_NORMAL_FOCUS_POINTS = [
  [50, 24],
  [50, 34],
  [48, 44],
  [52, 54],
  [47, 64],
  [53, 70],
];

function questionImageStyle(question, answered) {
  if (answered) return "";

  const random = createRandom(`${state.visualSeed}:${question.id}:visual`);

  if (question.group === "map") {
    const [baseX, baseY] =
      MAP_FOCUS_POINTS[Math.floor(random() * MAP_FOCUS_POINTS.length)];
    const x = jitter(baseX, random, 8, 12, 88);
    const y = jitter(baseY, random, 8, 12, 88);
    const scale = randomBetween(random, 2.55, 3.25);

    return [
      `object-position:${x.toFixed(1)}% ${y.toFixed(1)}%`,
      `transform:scale(${scale.toFixed(2)})`,
      `transform-origin:${x.toFixed(1)}% ${y.toFixed(1)}%`,
    ].join(";");
  }

  if (question.group === "agent" && question.variant === "normal") {
    const [baseX, baseY] =
      AGENT_NORMAL_FOCUS_POINTS[
        Math.floor(random() * AGENT_NORMAL_FOCUS_POINTS.length)
      ];
    const x = jitter(baseX, random, 4, 42, 58);
    const y = jitter(baseY, random, 6, 18, 78);
    const scale = randomBetween(random, 4.2, 4.85);

    return [
      `object-position:${x.toFixed(1)}% ${y.toFixed(1)}%`,
      `transform:scale(${scale.toFixed(2)})`,
      `transform-origin:${x.toFixed(1)}% ${y.toFixed(1)}%`,
    ].join(";");
  }

  return "";
}

function selectQuizQuestions(seedText) {
  const seed = seedText || "local-preview";
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

  return [...basicQuestions, ...agentQuestions].map((question) =>
    prepareQuestion(question, seed),
  );
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatDuration(seconds) {
  if (!seconds) return "-";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function isLocalPreview() {
  return ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
}

async function readResponseJson(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: response.ok
        ? ""
        : "API backend belum aktif di server ini. Di Vercel akan aktif setelah env var diisi.",
    };
  }
}

function renderLeaderboard(rows = SAMPLE_LEADERBOARD) {
  const list = rows.length ? rows : SAMPLE_LEADERBOARD;
  state.leaderboard = list;

  elements.leaderboard.innerHTML = list
    .map(
      (row, index) => `
        <div class="leaderboard-row">
          <div class="leaderboard-position">${index + 1}</div>
          <div class="leaderboard-rank">${renderRankEmblem(row.rank)}</div>
          <div class="leaderboard-name">
            <strong>${escapeHtml(row.name || "Anonim")}</strong>
            <span>${escapeHtml(row.rank || "Iron")} • ${formatDuration(row.duration_seconds)}</span>
          </div>
          <div class="leaderboard-score">
            <strong>${row.score || 0}</strong>
            <span>nilai</span>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderLeaderboardList(rows = state.leaderboard, limit = 5) {
  const list = (rows.length ? rows : SAMPLE_LEADERBOARD).slice(0, limit);

  return list
    .map(
      (row, index) => `
        <div class="leaderboard-row compact">
          <div class="leaderboard-position">${index + 1}</div>
          <div class="leaderboard-rank">${renderRankEmblem(row.rank)}</div>
          <div class="leaderboard-name">
            <strong>${escapeHtml(row.name || "Anonim")}</strong>
            <span>${escapeHtml(row.rank || "Iron")}</span>
          </div>
          <div class="leaderboard-score">
            <strong>${row.score || 0}</strong>
            <span>nilai</span>
          </div>
        </div>
      `,
    )
    .join("");
}

async function loadLeaderboard() {
  elements.leaderboard.innerHTML = '<div class="loading-row">Memuat highscore...</div>';

  try {
    const response = await fetch(API.leaderboard);
    const data = await readResponseJson(response);

    if (!response.ok) throw new Error(data.message || "Gagal memuat highscore");

    renderLeaderboard(data.leaderboard);
  } catch {
    renderLeaderboard(SAMPLE_LEADERBOARD);
  }
}

function selectedChannel() {
  return new FormData(elements.startForm).get("channel") || "qris";
}

function preloadQuizImages(questions) {
  const sources = [
    ...new Set(
      questions
        .flatMap((question) => [question.image, question.revealImage])
        .filter(Boolean),
    ),
  ];

  sources.forEach((source) => {
    const image = new Image();
    image.decoding = "async";
    image.src = source;
  });
}

function syncAmountPreset() {
  const amount = Number(elements.amountInput.value || 0);

  elements.amountPresets.forEach((button) => {
    button.classList.toggle(
      "is-selected",
      Number(button.dataset.amount) === amount,
    );
  });
}

function setStartMessage(text, isError = false) {
  elements.startMessage.textContent = text;
  elements.startMessage.style.color = isError ? "#d92d67" : "";
}

function setPaymentMessage(text, isError = false) {
  elements.paymentMessage.textContent = text;
  elements.paymentMessage.style.color = isError ? "#d92d67" : "";
}

const CHECKOUT_STORAGE_KEY = "uas-checkout-session-v2";
const FINAL_PAYMENT_STATUSES = new Set(["cancel", "deny", "expire", "failure"]);

function readCheckoutSession() {
  try {
    return JSON.parse(window.localStorage?.getItem(CHECKOUT_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function saveCheckoutSession(extra = {}) {
  if (!state.orderId || !state.email) return;

  try {
    window.localStorage?.setItem(
      CHECKOUT_STORAGE_KEY,
      JSON.stringify({
        amount: state.amount,
        channel: state.channel,
        email: state.email,
        orderId: state.orderId,
        payment: state.payment,
        savedAt: Date.now(),
        status: elements.paymentStatus.textContent || "pending",
        ...extra,
      }),
    );
  } catch {
    // localStorage can be unavailable in private modes; checkout still works.
  }
}

function clearCheckoutSession() {
  try {
    window.localStorage?.removeItem(CHECKOUT_STORAGE_KEY);
  } catch {
    // no-op
  }
}

function resetCheckoutState() {
  state.orderId = "";
  state.payment = null;
  state.paymentPollAttempts = 0;
  state.paymentPollInFlight = false;
  state.quizToken = "";
}

function returnToStartForPaymentChange(message) {
  stopAutoStatusCheck();
  clearCheckoutSession();
  resetCheckoutState();

  elements.paymentPanel.classList.add("hidden");
  elements.examPanel.classList.add("hidden");
  elements.resultPanel.classList.add("hidden");
  elements.startPanel.classList.remove("hidden");
  elements.localPreview.classList.add("hidden");
  elements.paymentStatus.textContent = "Pending";
  elements.paymentInstructions.innerHTML = "";
  setPaymentMessage("Ujian otomatis terbuka setelah pembayaran sukses.");
  setStartMessage(message || "Silakan pilih metode pembayaran baru.");
  syncAmountPreset();
  elements.startPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function qrisProxyUrl() {
  if (!state.orderId || !state.email) return "";

  return `/api/uas-qris?orderId=${encodeURIComponent(
    state.orderId,
  )}&email=${encodeURIComponent(state.email)}`;
}

async function copyText(value, button) {
  const text = String(value || "");
  if (!text) return;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const input = document.createElement("textarea");
      input.value = text;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    if (button) {
      const previous = button.innerHTML;
      button.innerHTML = button.classList.contains("payment-code-button")
        ? `<span>${escapeHtml(text)}</span><small>Tersalin</small>`
        : "Tersalin";
      window.setTimeout(() => {
        button.innerHTML = previous;
      }, 1200);
    }
  } catch {
    if (button) button.innerHTML = "Gagal";
  }
}

function bindPaymentCopies() {
  elements.paymentInstructions.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => {
      copyText(button.dataset.copy, button);
    });
  });
}

function bindPaymentImages() {
  elements.paymentInstructions.querySelectorAll("[data-qr-fallback]").forEach((image) => {
    image.addEventListener("error", () => {
      const target = document.getElementById(image.dataset.qrFallback);
      image.closest(".payment-qr")?.classList.add("hidden");
      target?.classList.remove("hidden");
    });
  });
}

function paymentField(payment, ...keys) {
  for (const key of keys) {
    if (payment?.[key] !== undefined && payment[key] !== null) {
      return payment[key];
    }
  }

  return "";
}

function isQrisPayment(payment = {}) {
  const paymentType = String(
    paymentField(payment, "paymentType", "payment_type"),
  ).toLowerCase();

  return (
    paymentType === "qris" ||
    state.channel === "qris" ||
    Boolean(
      paymentField(
        payment,
        "qrImageUrl",
        "qr_image_url",
        "qrCodeUrl",
        "qr_code_url",
      ) || paymentField(payment, "qrString", "qr_string"),
    )
  );
}

function renderPayment(payment = {}, amount = 0) {
  const isQris = isQrisPayment(payment);
  const acquirer = paymentField(payment, "acquirer", "bank");
  const orderId = paymentField(payment, "orderId", "order_id") || state.orderId;
  const qrImageUrl = paymentField(
    payment,
    "qrImageUrl",
    "qr_image_url",
    "qrCodeUrl",
    "qr_code_url",
  );
  const qrStringValue = paymentField(payment, "qrString", "qr_string");
  const vaNumber = paymentField(
    payment,
    "vaNumber",
    "va_number",
    "permataVaNumber",
    "permata_va_number",
  );
  const qrSrc = isQris
    ? qrisProxyUrl() || qrImageUrl || ""
    : "";
  const qr = qrSrc
    ? `
      <div class="payment-qr">
        <img
          src="${escapeHtml(qrSrc)}"
          alt="QRIS pembayaran UAS Valorant"
          data-qr-fallback="qrisFallback"
          decoding="async"
          loading="eager"
        />
      </div>
    `
    : isQris
      ? `
        <div class="payment-qr-fallback" id="qrisFallback">
          QRIS belum mengirim gambar. Pilih VA kalau ingin kode bayar yang bisa disalin.
        </div>
      `
    : "";
  const qrFallback = qrSrc && isQris
    ? `
      <div class="payment-qr-fallback hidden" id="qrisFallback">
        Barcode QRIS belum bisa dimuat dari Midtrans. Coba refresh checkout ini, atau pilih metode VA.
      </div>
    `
    : "";
  const qrString = qrStringValue
    ? `
      <div class="payment-line">
        <div class="payment-line-main">
          <span>QR string</span>
          <strong>Siap disalin kalau QR tidak tampil.</strong>
        </div>
        <button class="payment-copy" data-copy="${escapeHtml(qrStringValue)}" type="button">Salin</button>
      </div>
    `
    : "";

  const va = vaNumber
    ? `
      <div class="payment-line payment-line-va">
        <div class="payment-line-main">
          <span>${escapeHtml((acquirer || "VA").toUpperCase())} Virtual Account</span>
          <button class="payment-code-button" data-copy="${escapeHtml(vaNumber)}" type="button">
            <span>${escapeHtml(vaNumber)}</span>
            <small>tap untuk salin</small>
          </button>
        </div>
        <button class="payment-copy" data-copy="${escapeHtml(vaNumber)}" type="button">Salin</button>
      </div>
    `
    : "";
  const helper = isQris
    ? "Scan QRIS dinamis ini dari e-wallet atau mobile banking."
    : "Tap nomor VA atau tombol Salin, lalu bayar sesuai bank yang dipilih.";

  elements.paymentInstructions.innerHTML = `
    <div class="payment-box">
      <p class="payment-helper">${helper}</p>
      ${qr}
      ${qrFallback}
      ${qrString}
      ${va}
      <div class="payment-line">
        <div class="payment-line-main">
          <span>Order ID</span>
          <button class="payment-order-button" data-copy="${escapeHtml(orderId)}" type="button">
            ${escapeHtml(orderId)}
          </button>
        </div>
        <button class="payment-copy" data-copy="${escapeHtml(orderId)}" type="button">Salin</button>
      </div>
      <div class="payment-line">
        <div class="payment-line-main">
          <span>Nominal</span>
          <strong>${formatRupiah(amount)}</strong>
        </div>
      </div>
    </div>
  `;
  bindPaymentCopies();
  bindPaymentImages();
}

elements.startForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = elements.nameInput.value.trim();
  const email = elements.emailInput.value.trim();
  const amount = Number(elements.amountInput.value || 0);
  const channel = selectedChannel();

  if (!name || !email || amount < 10000) {
    setStartMessage("Nama, email, dan donasi minimal 10k wajib diisi.", true);
    return;
  }

  const submitButton = elements.startForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  setStartMessage("Membuat checkout...");

  try {
    const response = await fetch(API.start, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        channel,
        email,
        name,
      }),
    });
    const data = await readResponseJson(response);

    if (!response.ok) throw new Error(data.message || "Checkout gagal dibuat");

    state.amount = amount;
    state.channel = channel;
    state.email = email;
    state.orderId = data.orderId;
    state.payment = data.payment || {};
    elements.startPanel.classList.add("hidden");
    elements.paymentPanel.classList.remove("hidden");
    elements.paymentStatus.textContent = data.status || "pending";
    renderPayment(state.payment, amount);
    saveCheckoutSession({ status: data.status || "pending" });
    setStartMessage("Checkout siap. Selesaikan pembayaran dulu ya.");
    setPaymentMessage("Menunggu pembayaran. Halaman akan cek otomatis.");
    startAutoStatusCheck();
    checkPaymentStatus({ auto: true, silent: true });
    elements.paymentPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    setStartMessage(error.message, true);

    if (isLocalPreview()) {
      elements.startPanel.classList.add("hidden");
      elements.paymentPanel.classList.remove("hidden");
      elements.localPreview.classList.remove("hidden");
      elements.paymentInstructions.innerHTML = `
        <div class="payment-box">
          <div class="payment-line">
            <span>Preview lokal</span>
            <strong>API Vercel belum aktif di server lokal ini.</strong>
          </div>
        </div>
      `;
      setPaymentMessage("Mode preview hanya muncul di localhost supaya layout kuis bisa dicek.", true);
    }
  } finally {
    submitButton.disabled = false;
  }
});

function stopAutoStatusCheck() {
  if (!state.paymentPollTimer) return;
  window.clearTimeout(state.paymentPollTimer);
  state.paymentPollTimer = null;
}

function startAutoStatusCheck() {
  stopAutoStatusCheck();
  state.paymentPollAttempts = 0;

  const tick = async () => {
    if (!state.orderId || elements.paymentPanel.classList.contains("hidden")) {
      stopAutoStatusCheck();
      return;
    }

    state.paymentPollAttempts += 1;
    await checkPaymentStatus({ auto: true, silent: true });

    if (!state.orderId || state.paymentPollAttempts >= 240) {
      stopAutoStatusCheck();
      return;
    }

    state.paymentPollTimer = window.setTimeout(tick, 3000);
  };

  state.paymentPollTimer = window.setTimeout(tick, 1200);
}

function statusLabel(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "settlement" || normalized === "capture") return "Lunas";
  if (normalized === "pending" || normalized === "created") return "Pending";
  if (normalized === "expire") return "Expired";
  return status || "Pending";
}

async function checkPaymentStatus(options = {}) {
  const silent = Boolean(options.silent);
  const auto = Boolean(options.auto);

  if (state.paymentPollInFlight) return;

  if (!state.orderId || !state.email) {
    if (!silent) setPaymentMessage("Order belum dibuat.", true);
    return;
  }

  state.paymentPollInFlight = true;

  if (auto) {
    setPaymentMessage("Mengecek pembayaran otomatis...");
  } else {
    elements.checkPayment.disabled = true;
    setPaymentMessage("Mengecek status pembayaran...");
  }

  try {
    const response = await fetch(API.status, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: state.email,
        orderId: state.orderId,
      }),
    });
    const data = await readResponseJson(response);

    if (!response.ok) throw new Error(data.message || "Status belum bisa dicek");

    elements.paymentStatus.textContent = statusLabel(data.status);
    saveCheckoutSession({ status: data.status });

    if (data.paid && data.quizToken) {
      stopAutoStatusCheck();
      saveCheckoutSession({ quizToken: data.quizToken, status: data.status });
      setPaymentMessage("Pembayaran sukses. Membuka ujian...");
      unlockQuiz(data.quizToken);
      return;
    }

    if (data.submitted) {
      clearCheckoutSession();
      stopAutoStatusCheck();
      setPaymentMessage("Ujian dari pembayaran ini sudah pernah disubmit.", true);
      return;
    }

    if (FINAL_PAYMENT_STATUSES.has(data.status)) {
      clearCheckoutSession();
      stopAutoStatusCheck();
      setPaymentMessage("Checkout sudah tidak aktif. Buat checkout baru ya.", true);
      return;
    }

    setPaymentMessage(
      auto
        ? "Belum lunas. Auto cek tetap berjalan."
        : "Belum lunas. Kalau baru bayar, tunggu beberapa detik lalu cek lagi.",
    );
  } catch (error) {
    setPaymentMessage(
      auto
        ? "Auto cek belum berhasil. Tetap akan dicoba lagi."
        : error.message,
      !auto,
    );
  } finally {
    state.paymentPollInFlight = false;
    if (!auto) elements.checkPayment.disabled = false;
  }
}

elements.checkPayment.addEventListener("click", () => checkPaymentStatus());

elements.changePayment.addEventListener("click", async () => {
  if (!state.orderId || !state.email || state.isLocalPreview) {
    returnToStartForPaymentChange("Silakan pilih metode pembayaran baru.");
    return;
  }

  const previousLabel = elements.changePayment.innerHTML;
  stopAutoStatusCheck();
  elements.changePayment.disabled = true;
  elements.checkPayment.disabled = true;
  setPaymentMessage("Membatalkan checkout lama...");

  try {
    const response = await fetch(API.cancel, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: state.email,
        orderId: state.orderId,
      }),
    });
    const data = await readResponseJson(response);

    if (response.status === 409 && data.submitted) {
      setPaymentMessage("Ujian dari pembayaran ini sudah pernah disubmit.", true);
      clearCheckoutSession();
      return;
    }

    if (response.status === 409 && data.paid && data.quizToken) {
      setPaymentMessage("Pembayaran sudah sukses. Membuka ujian...");
      unlockQuiz(data.quizToken);
      return;
    }

    if (!response.ok) {
      throw new Error(data.message || "Metode belum bisa diganti");
    }

    if (data.paid && data.quizToken) {
      setPaymentMessage("Pembayaran sudah sukses. Membuka ujian...");
      unlockQuiz(data.quizToken);
      return;
    }

    returnToStartForPaymentChange("Checkout lama dibatalkan. Pilih metode baru ya.");
  } catch (error) {
    setPaymentMessage(error.message, true);
    startAutoStatusCheck();
  } finally {
    elements.changePayment.disabled = false;
    elements.checkPayment.disabled = false;
    elements.changePayment.innerHTML = previousLabel;
  }
});

elements.localPreview.addEventListener("click", () => {
  unlockQuiz(`local-preview-${Date.now()}`, true);
});

elements.openStart.addEventListener("click", () => {
  elements.introPanel.classList.add("hidden");
  elements.leaderboardPanel.classList.add("hidden");
  elements.startPanel.classList.remove("hidden");
  elements.nameInput.focus();
  elements.startPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

elements.amountPresets.forEach((button) => {
  button.addEventListener("click", () => {
    elements.amountInput.value = button.dataset.amount;
    syncAmountPreset();
  });
});

elements.amountInput.addEventListener("input", syncAmountPreset);

function restoreCheckoutSession() {
  const saved = readCheckoutSession();
  if (!saved?.orderId || !saved?.email) return;

  state.amount = Number(saved.amount || 0);
  state.channel = saved.channel || "";
  state.email = saved.email;
  state.orderId = saved.orderId;
  state.payment = saved.payment || null;

  elements.introPanel.classList.add("hidden");
  elements.leaderboardPanel.classList.add("hidden");
  elements.startPanel.classList.add("hidden");
  elements.paymentPanel.classList.remove("hidden");
  elements.paymentStatus.textContent = statusLabel(saved.status);

  if (state.payment) {
    renderPayment(state.payment, state.amount);
  } else {
    elements.paymentInstructions.innerHTML = `
      <div class="payment-box">
        <div class="payment-line">
          <div class="payment-line-main">
            <span>Order ID</span>
            <button class="payment-order-button" data-copy="${escapeHtml(state.orderId)}" type="button">
              ${escapeHtml(state.orderId)}
            </button>
          </div>
          <button class="payment-copy" data-copy="${escapeHtml(state.orderId)}" type="button">Salin</button>
        </div>
      </div>
    `;
    bindPaymentCopies();
  }

  setPaymentMessage("Melanjutkan checkout tersimpan. Halaman akan cek otomatis.");
  startAutoStatusCheck();
  checkPaymentStatus({ auto: true, silent: true });
}

window.addEventListener("focus", () => {
  if (state.orderId && !elements.paymentPanel.classList.contains("hidden")) {
    checkPaymentStatus({ auto: true, silent: true });
  }
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && state.orderId && !elements.paymentPanel.classList.contains("hidden")) {
    checkPaymentStatus({ auto: true, silent: true });
  }
});

function questionMedia(question, answered) {
  if (!question.type) return "";

  const mediaClass = [
    question.group ? `is-${question.group}` : "",
    question.imageClass?.includes("bg-agent-normal") ? "is-agent-normal" : "",
  ].filter(Boolean).join(" ");
  const revealedClass = answered ? "is-revealed" : "";
  const imageClass = answered ? "" : question.imageClass || "";
  const imageSrc = answered && question.revealImage ? question.revealImage : question.image;
  const imageStyle = questionImageStyle(question, answered);
  const imageStyleAttr = imageStyle ? ` style="${imageStyle}"` : "";
  const loading = answered ? "lazy" : "eager";
  const fetchPriority = answered ? "auto" : "high";

  return `
    <div class="question-media ${mediaClass} ${revealedClass}">
      <img class="${imageClass}" src="${imageSrc}" alt="" decoding="async" loading="${loading}" fetchpriority="${fetchPriority}"${imageStyleAttr} />
    </div>
  `;
}

function renderQuestion() {
  const question = QUIZ_QUESTIONS[state.current];
  const selected = state.answers[question.id];
  const answered = Boolean(selected);

  elements.progressPill.textContent = `${state.current + 1}/${QUIZ_QUESTIONS.length}`;
  elements.questionCard.innerHTML = `
    ${questionMedia(question, answered)}
    <p class="question-meta">${question.badge}</p>
    <h3 class="question-title">${question.title}</h3>
    <div class="choice-list">
      ${question.choices
        .map(
          (choice) => `
            <button class="choice-button ${choice === selected ? "is-selected" : ""}" data-answer="${escapeHtml(choice)}" ${state.isAdvancing ? "disabled" : ""} type="button">
              ${escapeHtml(choice)}
            </button>
          `,
        )
        .join("")}
    </div>
  `;

  elements.questionCard.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => {
      handleAnswer(question, button.dataset.answer);
    });
  });
}

function handleAnswer(question, answer) {
  if (state.isAdvancing) return;

  state.answers[question.id] = answer;
  state.isAdvancing = true;
  renderQuestion();

  window.clearTimeout(state.answerTimer);
  state.answerTimer = window.setTimeout(() => {
    if (state.current === QUIZ_QUESTIONS.length - 1) {
      submitExam();
      return;
    }

    state.current += 1;
    state.isAdvancing = false;
    renderQuestion();
    elements.examPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 2000);
}

function unlockQuiz(token, isLocalPreview = false) {
  state.quizToken = token;
  state.answers = {};
  state.current = 0;
  state.isAdvancing = false;
  state.isLocalPreview = isLocalPreview;
  state.visualSeed = `${Date.now()}:${Math.random()}`;
  QUIZ_QUESTIONS = selectQuizQuestions(token);
  preloadQuizImages(QUIZ_QUESTIONS);
  elements.startPanel.classList.add("hidden");
  elements.paymentPanel.classList.add("hidden");
  elements.examPanel.classList.remove("hidden");
  renderQuestion();
  elements.examPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderResult(result) {
  const rank = result.rank || "Iron";
  const shareText = `Aku dapat rank ${rank} dengan nilai ${result.score} di UAS Valorant.`;

  elements.examPanel.classList.add("hidden");
  elements.resultPanel.classList.remove("hidden");
  elements.resultPanel.innerHTML = `
    <div class="result-hero">
      ${renderRankEmblem(rank, "rank-emblem-large")}
      <p class="eyebrow">Hasil UAS</p>
      <h2>${escapeHtml(rank)}</h2>
      <div class="result-score">
        <span>nilai</span>
        <strong>${result.score}</strong>
      </div>
      <p class="result-copy">${formatDuration(result.durationSeconds)}</p>
      </div>

    <div class="result-actions">
      <button class="primary-button" id="shareResult" type="button">
        <i class="ri-share-forward-line"></i>
        Bagikan
      </button>
      <button class="ghost-button" id="restartUas" type="button">
        <i class="ri-restart-line"></i>
        Main lagi
      </button>
    </div>

    <div class="result-leaderboard">
      <div class="section-head compact-head">
        <div>
          <p class="eyebrow">Highscore</p>
        </div>
      </div>
      <div class="leaderboard">
        ${renderLeaderboardList(state.leaderboard, 5)}
      </div>
    </div>
  `;

  document.getElementById("shareResult").addEventListener("click", async () => {
    if (navigator.share) {
      await navigator.share({
        text: shareText,
        title: "UAS Valorant",
        url: window.location.origin + "/uas/",
      });
      return;
    }

    await navigator.clipboard.writeText(`${shareText} ${window.location.origin}/uas/`);
    document.getElementById("shareResult").innerHTML =
      '<i class="ri-check-line"></i> Tersalin';
  });

  document.getElementById("restartUas").addEventListener("click", () => {
    window.location.href = "/uas/";
  });

  elements.resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function submitExam() {
  if (Object.keys(state.answers).length !== QUIZ_QUESTIONS.length) {
    return;
  }

  elements.questionCard.innerHTML = `
    <div class="submit-state">
      <div class="submit-spinner"></div>
      <strong>Mengirim hasil...</strong>
    </div>
  `;

  if (state.isLocalPreview) {
    let rawScore = 0;
    let maxRawScore = 0;
    QUIZ_QUESTIONS.forEach((question) => {
      const maxPoints = question.points || 10;
      maxRawScore += maxPoints;
      const correct = state.answers[question.id] === question.answer;
      rawScore += correct ? maxPoints : 0;
    });
    const score = Math.round((rawScore / maxRawScore) * 100);
    renderResult({
      durationSeconds: 1,
      maxRawScore,
      rank: getLocalRank(score),
      rawScore,
      score,
    });
    return;
  }

  try {
    const response = await fetch(API.submit, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: state.answers,
        quizToken: state.quizToken,
      }),
    });
    const data = await readResponseJson(response);

    if (!response.ok) throw new Error(data.message || "Submit gagal");

    await loadLeaderboard();
    clearCheckoutSession();
    stopAutoStatusCheck();
    renderResult(data);
  } catch (error) {
    state.isAdvancing = false;
    renderQuestion();
    alert(error.message);
  }
}

elements.refreshLeaderboard.addEventListener("click", loadLeaderboard);

loadLeaderboard();
restoreCheckoutSession();
