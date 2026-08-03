export type NodeType = "hero" | "villain" | "team" | "event";
export type RegionId = "street" | "earth" | "cosmic" | "mutants";
/** Where this teaching node is grounded for newcomers. */
export type Canon = "mcu" | "comics" | "mixed";

export type UniverseNode = {
  id: string;
  label: string;
  type: NodeType;
  region: RegionId;
  /** MCU film/TV, comics-first, or intentionally mixed framing. */
  canon: Canon;
  /** Shown in the newcomer layer (~12 core). */
  core: boolean;
  position: { x: number; y: number };
  /** Plain-English who/what for beginners. */
  blurb: string;
  /** Why this node matters when starting Marvel. */
  whyItMatters: string;
  /** Marvel Comics API character id when enrichment applies. */
  marvelCharacterId?: number;
};

export type UniverseEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type RegionMeta = {
  id: RegionId;
  label: string;
  description: string;
  /** Approximate label anchor on the canvas. */
  position: { x: number; y: number };
};

export const canonLabels: Record<Canon, string> = {
  mcu: "MCU",
  comics: "Comics",
  mixed: "MCU + comics",
};

export const regions: RegionMeta[] = [
  {
    id: "street",
    label: "Street Level",
    description: "Neighborhood heroes who keep cities safe day to day.",
    position: { x: 40, y: 40 },
  },
  {
    id: "earth",
    label: "Earth's Mightiest",
    description: "The Avengers and the heroes who defend the planet.",
    position: { x: 420, y: 40 },
  },
  {
    id: "cosmic",
    label: "Cosmic",
    description: "Space, infinity stones, and threats bigger than Earth.",
    position: { x: 960, y: 40 },
  },
  {
    id: "mutants",
    label: "Mutants",
    description: "People born with powers — a different corner of Marvel.",
    position: { x: 40, y: 560 },
  },
];

/**
 * Curated teaching graph for MCU-first newcomers.
 * Positions are designed for constellation readability, not physics.
 *
 * Accuracy notes (spot-checked against MCU Wiki / Wikipedia):
 * - Original Avengers six: Iron Man, Cap, Thor, Hulk, Black Widow, Hawkeye
 * - Guardians founding five: Star-Lord, Gamora, Drax, Rocket, Groot
 * - Mutant nodes use canon "mixed" until a full MCU X-Men reboot lands
 */
export const universeNodes: UniverseNode[] = [
  // —— Core ——
  {
    id: "spider-man",
    label: "Spider-Man",
    type: "hero",
    region: "street",
    canon: "mcu",
    core: true,
    position: { x: 80, y: 200 },
    blurb:
      "A friendly neighborhood hero with spider powers. Relatable, funny, and often the newcomer’s favorite entry point.",
    whyItMatters:
      "If you only watch one street-level story first, start here — smaller stakes, big heart.",
    marvelCharacterId: 1009610,
  },
  {
    id: "iron-man",
    label: "Iron Man",
    type: "hero",
    region: "earth",
    canon: "mcu",
    core: true,
    position: { x: 420, y: 160 },
    blurb:
      "Genius billionaire in a flying suit of armor. His 2008 film kicked off the modern Marvel Cinematic Universe.",
    whyItMatters:
      "He’s the gateway character — personality-first storytelling that defines the MCU tone.",
    marvelCharacterId: 1009368,
  },
  {
    id: "captain-america",
    label: "Captain America",
    type: "hero",
    region: "earth",
    canon: "mcu",
    core: true,
    position: { x: 640, y: 160 },
    blurb:
      "A WWII super-soldier frozen in time, woken up in the modern world. Moral compass of the team.",
    whyItMatters:
      "Shows how Marvel mixes history, politics, and heroism — not just punches.",
    marvelCharacterId: 1009220,
  },
  {
    id: "thor",
    label: "Thor",
    type: "hero",
    region: "earth",
    canon: "mcu",
    core: true,
    position: { x: 420, y: 440 },
    blurb:
      "A Norse god of thunder who learns humility on Earth. Bridges fantasy mythology with sci-fi Marvel.",
    whyItMatters:
      "Opens the door to Asgard and cosmic realms beyond New York street fights.",
    marvelCharacterId: 1009664,
  },
  {
    id: "hulk",
    label: "Hulk",
    type: "hero",
    region: "earth",
    canon: "mcu",
    core: true,
    position: { x: 640, y: 440 },
    blurb:
      "Scientist Bruce Banner transforms into a green rage monster when stressed.",
    whyItMatters:
      "Embodies Marvel’s theme: power is complicated — strength can be a burden.",
    marvelCharacterId: 1009351,
  },
  {
    id: "black-widow",
    label: "Black Widow",
    type: "hero",
    region: "earth",
    canon: "mcu",
    core: true,
    position: { x: 380, y: 560 },
    blurb:
      "A master spy and fighter with no superpowers — skill, wit, and a complicated past.",
    whyItMatters:
      "Proves Marvel heroes aren’t only about powers; character and loyalty matter.",
    marvelCharacterId: 1009189,
  },
  {
    id: "avengers",
    label: "The Avengers",
    type: "team",
    region: "earth",
    canon: "mcu",
    core: true,
    position: { x: 530, y: 300 },
    blurb:
      "Earth’s mightiest heroes. The original six: Iron Man, Captain America, Thor, Hulk, Black Widow, and Hawkeye.",
    whyItMatters:
      "This is the big idea of Marvel movies: solo stories that collide into shared adventures.",
  },
  {
    id: "doctor-strange",
    label: "Doctor Strange",
    type: "hero",
    region: "cosmic",
    canon: "mcu",
    core: true,
    position: { x: 960, y: 160 },
    blurb:
      "A surgeon who becomes a sorcerer guarding Earth from mystical threats.",
    whyItMatters:
      "Introduces magic and the multiverse — the “what if?” side of Marvel.",
    marvelCharacterId: 1009282,
  },
  {
    id: "guardians",
    label: "Guardians of the Galaxy",
    type: "team",
    region: "cosmic",
    canon: "mcu",
    core: true,
    position: { x: 1340, y: 300 },
    blurb:
      "A ragtag space crew founded by Star-Lord, Gamora, Drax, Rocket, and Groot. Funny, found-family vibes.",
    whyItMatters:
      "Shows Marvel isn’t only Earth — the universe is weird, colorful, and emotional.",
  },
  {
    id: "thanos",
    label: "Thanos",
    type: "villain",
    region: "cosmic",
    canon: "mcu",
    core: true,
    position: { x: 1120, y: 460 },
    blurb:
      "A cosmic warlord obsessed with “balance” — the main villain of the Infinity Saga.",
    whyItMatters:
      "He’s why so many heroes’ stories eventually connect: one threat, one climax.",
    marvelCharacterId: 1009652,
  },
  {
    id: "infinity-saga",
    label: "Infinity Saga",
    type: "event",
    region: "cosmic",
    canon: "mcu",
    core: true,
    position: { x: 1120, y: 300 },
    blurb:
      "The long MCU arc from Iron Man (2008) through Endgame (2019): Infinity Stones, Thanos, and the Snap.",
    whyItMatters:
      "This is the backbone newcomers hear about — years of setup paying off in one story.",
  },
  {
    id: "x-men",
    label: "X-Men",
    type: "team",
    region: "mutants",
    canon: "mixed",
    core: true,
    position: { x: 200, y: 720 },
    blurb:
      "Mutants fighting for a world that fears them. Huge in comics and Fox films; a full MCU reboot is still rolling out.",
    whyItMatters:
      "A major Marvel family that newcomers hear about — often parallel to the Avengers, not the same timeline yet.",
  },

  // —— Secondary (reveal more) ——
  {
    id: "hawkeye",
    label: "Hawkeye",
    type: "hero",
    region: "earth",
    canon: "mcu",
    core: false,
    position: { x: 680, y: 560 },
    blurb:
      "Clint Barton — master archer and S.H.I.E.L.D. agent. One of the original six Avengers, with no superpowers.",
    whyItMatters:
      "Completes the founding team picture — skill and heart beside gods and suits.",
    marvelCharacterId: 1009338,
  },
  {
    id: "drax",
    label: "Drax",
    type: "hero",
    region: "cosmic",
    canon: "mcu",
    core: false,
    position: { x: 1340, y: 560 },
    blurb:
      "Drax the Destroyer — a literal-minded warrior seeking vengeance, and a founding Guardian of the Galaxy.",
    whyItMatters:
      "Rounds out the Guardians’ founding five and shows Marvel’s gift for oddball comedy.",
    marvelCharacterId: 1010735,
  },
  {
    id: "black-panther",
    label: "Black Panther",
    type: "hero",
    region: "earth",
    canon: "mcu",
    core: false,
    position: { x: 760, y: 300 },
    blurb:
      "King of Wakanda — a hidden, highly advanced African nation — and its protector.",
    whyItMatters:
      "Expands Marvel beyond U.S. cities into culture, nationhood, and legacy.",
    marvelCharacterId: 1009187,
  },
  {
    id: "scarlet-witch",
    label: "Scarlet Witch",
    type: "hero",
    region: "earth",
    canon: "mcu",
    core: false,
    position: { x: 460, y: 680 },
    blurb:
      "Wanda Maximoff wields chaos magic powerful enough to rewrite reality.",
    whyItMatters:
      "Bridge from Avengers team-ups into darker, more personal multiverse stories.",
    marvelCharacterId: 1009562,
  },
  {
    id: "vision",
    label: "Vision",
    type: "hero",
    region: "earth",
    canon: "mcu",
    core: false,
    position: { x: 640, y: 680 },
    blurb:
      "An android created with an Infinity Stone — curious about humanity and love.",
    whyItMatters:
      "Shows Marvel asking “what makes someone human?” alongside the action.",
    marvelCharacterId: 1009697,
  },
  {
    id: "loki",
    label: "Loki",
    type: "villain",
    region: "cosmic",
    canon: "mcu",
    core: false,
    position: { x: 960, y: 40 },
    blurb:
      "Thor’s adoptive brother — a trickster who begins as a villain and grows into an anti-hero.",
    whyItMatters:
      "Marvel loves complicated antagonists; Loki is the template for redemption arcs.",
    marvelCharacterId: 1009407,
  },
  {
    id: "star-lord",
    label: "Star-Lord",
    type: "hero",
    region: "cosmic",
    canon: "mcu",
    core: false,
    position: { x: 1280, y: 160 },
    blurb:
      "Peter Quill — half-human leader of the Guardians with a mixtape and a mouth.",
    whyItMatters: "The face of Marvel’s cosmic comedy-adventure tone.",
    marvelCharacterId: 1010761,
  },
  {
    id: "gamora",
    label: "Gamora",
    type: "hero",
    region: "cosmic",
    canon: "mcu",
    core: false,
    position: { x: 1280, y: 440 },
    blurb:
      "Adopted daughter of Thanos; deadly assassin who chooses her own family.",
    whyItMatters:
      "Personalizes the cosmic war — villains have children and regrets.",
    marvelCharacterId: 1010763,
  },
  {
    id: "groot",
    label: "Groot",
    type: "hero",
    region: "cosmic",
    canon: "mcu",
    core: false,
    position: { x: 1400, y: 440 },
    blurb:
      "A tree-like being who mostly says “I am Groot” — and somehow says everything.",
    whyItMatters: "Proof Marvel can be silly and still emotionally land.",
    marvelCharacterId: 1010743,
  },
  {
    id: "rocket",
    label: "Rocket",
    type: "hero",
    region: "cosmic",
    canon: "mcu",
    core: false,
    position: { x: 1400, y: 160 },
    blurb:
      "A genetically engineered raccoon genius with anger issues and loyalty issues.",
    whyItMatters:
      "Comedy on the surface, found-family trauma underneath — classic Marvel.",
    marvelCharacterId: 1010744,
  },
  {
    id: "wolverine",
    label: "Wolverine",
    type: "hero",
    region: "mutants",
    canon: "mixed",
    core: false,
    position: { x: 80, y: 800 },
    blurb:
      "Adamantium claws, healing factor, short temper — the breakout X-Men icon (comics/Fox; MCU crossovers evolving).",
    whyItMatters:
      "If you know one mutant, it’s probably him — a bridge into X-Men stories.",
    marvelCharacterId: 1009718,
  },
  {
    id: "professor-x",
    label: "Professor X",
    type: "hero",
    region: "mutants",
    canon: "mixed",
    core: false,
    position: { x: 80, y: 640 },
    blurb:
      "Telepathic founder of the X-Men school; believes humans and mutants can coexist.",
    whyItMatters:
      "Defines the hopeful side of mutant stories — education over war.",
    marvelCharacterId: 1009504,
  },
  {
    id: "storm",
    label: "Storm",
    type: "hero",
    region: "mutants",
    canon: "mixed",
    core: false,
    position: { x: 320, y: 800 },
    blurb: "Weather-controlling mutant and frequent X-Men leader.",
    whyItMatters:
      "Shows the breadth of mutant powers and leadership beyond Wolverine.",
    marvelCharacterId: 1009629,
  },
  {
    id: "ant-man",
    label: "Ant-Man",
    type: "hero",
    region: "street",
    canon: "mcu",
    core: false,
    position: { x: 80, y: 380 },
    blurb:
      "Scott Lang shrinks (and grows) using Pym Particles — heist energy meets science.",
    whyItMatters: "A lighter, smaller-scale path into the Avengers world.",
    marvelCharacterId: 1010801,
  },
  {
    id: "infinity-war",
    label: "Infinity War",
    type: "event",
    region: "cosmic",
    canon: "mcu",
    core: false,
    position: { x: 1120, y: 620 },
    blurb: "The 2018 film where nearly every hero faces Thanos — and many lose.",
    whyItMatters:
      "The payoff moment that makes years of separate movies feel like one universe.",
  },
  {
    id: "civil-war",
    label: "Civil War",
    type: "event",
    region: "earth",
    canon: "mcu",
    core: false,
    position: { x: 530, y: 800 },
    blurb:
      "Heroes split over government oversight — Cap vs Iron Man, friends turned rivals.",
    whyItMatters:
      "Shows Marvel conflict isn’t only good vs evil — sometimes it’s values vs values.",
  },
];

export const universeEdges: UniverseEdge[] = [
  // Original six Avengers (founding)
  { id: "e-im-av", source: "iron-man", target: "avengers", label: "founding" },
  { id: "e-cap-av", source: "captain-america", target: "avengers", label: "founding" },
  { id: "e-thor-av", source: "thor", target: "avengers", label: "founding" },
  { id: "e-hulk-av", source: "hulk", target: "avengers", label: "founding" },
  { id: "e-bw-av", source: "black-widow", target: "avengers", label: "founding" },
  { id: "e-hawk-av", source: "hawkeye", target: "avengers", label: "founding" },

  // Later Avengers links
  { id: "e-bp-av", source: "black-panther", target: "avengers", label: "ally" },
  { id: "e-sw-av", source: "scarlet-witch", target: "avengers", label: "member" },
  { id: "e-vis-av", source: "vision", target: "avengers", label: "member" },
  { id: "e-am-av", source: "ant-man", target: "avengers", label: "ally" },
  { id: "e-sp-av", source: "spider-man", target: "avengers", label: "recruits" },

  // Guardians founding five
  { id: "e-sl-g", source: "star-lord", target: "guardians", label: "founding" },
  { id: "e-gam-g", source: "gamora", target: "guardians", label: "founding" },
  { id: "e-drax-g", source: "drax", target: "guardians", label: "founding" },
  { id: "e-groot-g", source: "groot", target: "guardians", label: "founding" },
  { id: "e-rocket-g", source: "rocket", target: "guardians", label: "founding" },

  // Cosmic saga
  { id: "e-g-saga", source: "guardians", target: "infinity-saga", label: "key to" },
  { id: "e-thanos-saga", source: "thanos", target: "infinity-saga", label: "antagonist" },
  { id: "e-gam-thanos", source: "gamora", target: "thanos", label: "raised by" },
  { id: "e-ds-saga", source: "doctor-strange", target: "infinity-saga", label: "defends" },
  { id: "e-av-saga", source: "avengers", target: "infinity-saga", label: "climax of" },
  { id: "e-saga-iw", source: "infinity-saga", target: "infinity-war", label: "includes" },
  { id: "e-loki-thor", source: "loki", target: "thor", label: "brother" },
  { id: "e-loki-av", source: "loki", target: "avengers", label: "first foe" },

  // Events
  { id: "e-cw-cap", source: "civil-war", target: "captain-america", label: "divides" },
  { id: "e-cw-im", source: "civil-war", target: "iron-man", label: "divides" },
  { id: "e-sw-vis", source: "scarlet-witch", target: "vision", label: "partners" },

  // Mutants
  { id: "e-px-xm", source: "professor-x", target: "x-men", label: "founded" },
  { id: "e-wol-xm", source: "wolverine", target: "x-men", label: "member" },
  { id: "e-storm-xm", source: "storm", target: "x-men", label: "leader" },

  // Strange / street
  { id: "e-ds-av", source: "doctor-strange", target: "avengers", label: "ally" },
  { id: "e-am-street", source: "ant-man", target: "spider-man", label: "street scale" },
];
