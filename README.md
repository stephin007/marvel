# Marvel Universe Map

An interactive constellation map that helps newcomers understand how Marvel heroes, teams, and events connect — built for Vercel.

Live teaching idea: start with a small core of characters and teams, then reveal more. Tap any node for a plain-English explainer and related jumps. Share focused links like `/map?focus=avengers`.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- React Flow for the curated universe canvas
- Framer Motion for landing/map motion
- Marvel Comics API (server-side enrichment only)

## Setup

```bash
npm install
cp .env.example .env.local
```

Add your Marvel API keys from [developer.marvel.com](https://developer.marvel.com) to `.env.local`:

```
MARVEL_PUBLIC_KEY=your_public_key
MARVEL_PRIVATE_KEY=your_private_key
```

The map works without keys (curated blurbs still show). Character thumbnails and official descriptions appear when keys are set.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How the map teaches

The teaching layer lives in [`src/data/universe.ts`](src/data/universe.ts): node positions, beginner blurbs, regions (Street Level, Earth's Mightiest, Cosmic, Mutants), and edges. Data is **static and curated** (not scraped). Each node has a `canon` field: `mcu`, `comics`, or `mixed`.

To add someone: append a node to `universeNodes`, add edges in `universeEdges`, set `core: false` unless they belong on the newcomer layer, and verify MCU vs comics framing before shipping.

The Marvel API only enriches nodes that have a `marvelCharacterId` (optional; the map works without keys).

- **Core layer** — ~12 nodes shown by default
- **Reveal more** — secondary heroes and events (Hawkeye, Drax, etc.)
- **Focus URLs** — `/map?focus=iron-man` highlights and centers a node

## Deploy on Vercel

1. Push this repo and import the project in Vercel (framework: Next.js).
2. Set `MARVEL_PUBLIC_KEY` and `MARVEL_PRIVATE_KEY` in Project → Settings → Environment Variables.
3. Deploy.

Optional config: [`vercel.ts`](vercel.ts).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Local development server |
| `npm run build`| Production build         |
| `npm run start`| Run production build     |
| `npm run lint` | ESLint                   |

## License

MIT — see [LICENSE](LICENSE). Marvel characters and artwork © Marvel. This is an unofficial fan project.
