# World Cup 2026 — Live Bracket & Intelligence Dashboard

Premium mobile-first dashboard for the FIFA World Cup 2026: bottom-tab navigation, swipeable groups, bracket rounds, stats feed, and team intelligence bottom sheets.

## Setup

```bash
npm install
cp .env.example .env.local
# Optional: add FOOTBALL_DATA_API_KEY from https://www.football-data.org/
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Live Bracket** — Groups A–L with full mini-tables (P W D L GF GA GD Pts), knockout tree, match slots with flags and local kickoff times
- **Golden Stats Bar** — adidas Golden Boot, Playmaker (assists), Golden Glove, disciplinary watch with animated counters
- **Team Intelligence Panel** — Next fixture, H2H timeline, pitch formation, form guide, key player stats
- **Simulate mode** — Default on first load. Pill toggle (⚡ Simulate / 🔴 Live) runs a full tournament simulation with animated results round-by-round. Banner reads "Simulation Mode — Not Real Results." Hit **Return to Live Data** to reset to the API.
- **Design** — Dark broadcast UI (#0a0a0f), electric blue + gold, glassmorphism, Bebas Neue typography

## Football terminology

Uses proper football language throughout: match, fixture, nil, table, manager, kit, matchday, extra time, 90+3' stoppage time, FIFA country names.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- [football-data.org](https://www.football-data.org/) API
- [flagcdn.com](https://flagcdn.com/) for flags
