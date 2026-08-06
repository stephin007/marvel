import type { RegionId } from "@/data/universe";

export type GalaxyMeta = {
  id: RegionId;
  label: string;
  description: string;
  hubPosition: { x: number; y: number };
  labelPosition: { x: number; y: number };
};

export const galaxyMeta: GalaxyMeta[] = [
  {
    id: "street",
    label: "Street Level",
    description: "Neighborhood heroes who keep cities safe day to day.",
    hubPosition: { x: 120, y: 220 },
    labelPosition: { x: 40, y: 40 },
  },
  {
    id: "earth",
    label: "Earth's Mightiest",
    description: "The Avengers and the heroes who defend the planet.",
    hubPosition: { x: 520, y: 140 },
    labelPosition: { x: 420, y: 40 },
  },
  {
    id: "cosmic",
    label: "Cosmic",
    description: "Space, infinity stones, and threats bigger than Earth.",
    hubPosition: { x: 920, y: 220 },
    labelPosition: { x: 960, y: 40 },
  },
  {
    id: "mutants",
    label: "Mutants",
    description: "People born with powers — a different corner of Marvel.",
    hubPosition: { x: 520, y: 420 },
    labelPosition: { x: 40, y: 560 },
  },
];
