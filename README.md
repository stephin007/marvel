# Marvel Universe Map

An interactive **galaxy map** of Marvel heroes and connections, powered by **[Comic Vine](https://comicvine.gamespot.com/api/)**.

Galaxies and relationship links appear **only when Comic Vine returns real character data and connections**. Seeds in the repo only say *who to look up* and *where to place them* — not fake edges.

Live teaching idea: pick one galaxy → explore local Comic Vine links → optionally reveal bridges to other galaxies.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- React Flow canvas
- Comic Vine API (server-side graph builder)

## Setup

1. Get a free API key: [comicvine.gamespot.com/api](https://comicvine.gamespot.com/api/) (login required; **non-commercial** use only).
2. Configure env:

```bash
npm install
cp .env.example .env.local
```

```
COMIC_VINE_API_KEY=your_key_here
```

3. Run:

```bash
npm run dev
```

Open [http://localhost:3000/map](http://localhost:3000/map).

First load can take ~30–60s while we resolve characters and pace requests for Comic Vine rate limits. Results are cached.

Without a key, `/map` shows a setup message instead of galaxies.

## How the map teaches

1. **Overview** — galaxies that Comic Vine successfully populated  
2. **Enter a galaxy** — local heroes + **only Comic Vine–confirmed** teammate/ally/rival links  
3. **Links to other galaxies** — optional bridges when Vine links cross regions  
4. Seeds live in [`src/data/seeds.ts`](src/data/seeds.ts); graph builder in [`src/lib/build-graph.ts`](src/lib/build-graph.ts)

Shareable URLs: `/map?galaxy=earth`, `/map?galaxy=cosmic&bridges=1&focus=thanos`.

## Deploy on Vercel

1. Import the GitHub repo in Vercel  
2. Set `COMIC_VINE_API_KEY` in Project → Environment Variables  
3. Deploy  

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

## License

MIT — see [LICENSE](LICENSE). Marvel characters © Marvel. Comic data © Comic Vine / Fandom. This is an unofficial educational fan project.
