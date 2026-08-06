import type { RegionId } from "@/data/universe";

/**
 * Minimal seeds — we only ask Comic Vine about these names.
 * Galaxies/edges on the map appear only when Comic Vine returns real data + links.
 */
export type CharacterSeed = {
  id: string;
  /** Name used for Comic Vine search */
  searchName: string;
  galaxy: RegionId;
  core: boolean;
  /** Preferred layout position inside the galaxy */
  position: { x: number; y: number };
  /** Short newcomer line (teaching); bio/deck comes from Comic Vine */
  whyItMatters: string;
  role?: "hero" | "villain";
};

export const characterSeeds: CharacterSeed[] = [
  {
    id: "iron-man",
    searchName: "Iron Man",
    galaxy: "earth",
    core: true,
    position: { x: 420, y: 160 },
    whyItMatters: "Gateway into modern Marvel storytelling.",
  },
  {
    id: "captain-america",
    searchName: "Captain America",
    galaxy: "earth",
    core: true,
    position: { x: 640, y: 160 },
    whyItMatters: "The moral compass of Earth’s heroes.",
  },
  {
    id: "thor",
    searchName: "Thor",
    galaxy: "earth",
    core: true,
    position: { x: 420, y: 440 },
    whyItMatters: "Connects Earth heroics to mythic/cosmic realms.",
  },
  {
    id: "hulk",
    searchName: "Hulk",
    galaxy: "earth",
    core: true,
    position: { x: 640, y: 440 },
    whyItMatters: "Power as both gift and burden.",
  },
  {
    id: "black-widow",
    searchName: "Black Widow",
    galaxy: "earth",
    core: true,
    position: { x: 380, y: 560 },
    whyItMatters: "Skill and loyalty without superpowers.",
  },
  {
    id: "hawkeye",
    searchName: "Hawkeye",
    galaxy: "earth",
    core: false,
    position: { x: 680, y: 560 },
    whyItMatters: "Completes the classic Earth team picture.",
  },
  {
    id: "black-panther",
    searchName: "Black Panther",
    galaxy: "earth",
    core: false,
    position: { x: 760, y: 300 },
    whyItMatters: "Nationhood and legacy beyond US street stories.",
  },
  {
    id: "spider-man",
    searchName: "Spider-Man",
    galaxy: "street",
    core: true,
    position: { x: 80, y: 200 },
    whyItMatters: "The friendliest on-ramp for newcomers.",
  },
  {
    id: "ant-man",
    searchName: "Ant-Man",
    galaxy: "street",
    core: false,
    position: { x: 80, y: 380 },
    whyItMatters: "Smaller-scale path into bigger teams.",
  },
  {
    id: "doctor-strange",
    searchName: "Doctor Strange",
    galaxy: "cosmic",
    core: true,
    position: { x: 960, y: 160 },
    whyItMatters: "Magic and multiverse stakes.",
  },
  {
    id: "thanos",
    searchName: "Thanos",
    galaxy: "cosmic",
    core: true,
    position: { x: 1120, y: 460 },
    whyItMatters: "The threat that pulls many heroes together.",
    role: "villain",
  },
  {
    id: "star-lord",
    searchName: "Star-Lord",
    galaxy: "cosmic",
    core: false,
    position: { x: 1280, y: 160 },
    whyItMatters: "Face of Marvel’s cosmic found-family tone.",
  },
  {
    id: "gamora",
    searchName: "Gamora",
    galaxy: "cosmic",
    core: false,
    position: { x: 1280, y: 440 },
    whyItMatters: "Personal stakes inside cosmic war.",
  },
  {
    id: "groot",
    searchName: "Groot",
    galaxy: "cosmic",
    core: false,
    position: { x: 1400, y: 440 },
    whyItMatters: "Proof Marvel can be silly and emotional.",
  },
  {
    id: "rocket",
    searchName: "Rocket Raccoon",
    galaxy: "cosmic",
    core: false,
    position: { x: 1400, y: 160 },
    whyItMatters: "Comedy with real found-family weight.",
  },
  {
    id: "drax",
    searchName: "Drax",
    galaxy: "cosmic",
    core: false,
    position: { x: 1340, y: 560 },
    whyItMatters: "Rounds out the Guardians crew.",
  },
  {
    id: "loki",
    searchName: "Loki",
    galaxy: "cosmic",
    core: false,
    position: { x: 960, y: 40 },
    whyItMatters: "Complicated antagonist / anti-hero template.",
    role: "villain",
  },
  {
    id: "wolverine",
    searchName: "Wolverine",
    galaxy: "mutants",
    core: true,
    position: { x: 420, y: 160 },
    whyItMatters: "The mutant most newcomers already recognize.",
  },
  {
    id: "professor-x",
    searchName: "Professor X",
    galaxy: "mutants",
    core: true,
    position: { x: 640, y: 160 },
    whyItMatters: "Hopeful leadership of mutant stories.",
  },
  {
    id: "storm",
    searchName: "Storm",
    galaxy: "mutants",
    core: true,
    position: { x: 530, y: 360 },
    whyItMatters: "Leadership beyond the usual breakout icons.",
  },
];
