import type { FormResult, HeadToHeadMeeting, Team } from "./types";
import { ALL_TEAMS_BY_TLA } from "./mock-data";
import { getGroupOpponents, getTeamStrength } from "./tournament-data";

function seed(n: number): number {
  const x = Math.sin(n * 9999.971) * 10000;
  return x - Math.floor(x);
}

function simulateGoals(strength: number, rng: number): number {
  const lambda = 0.35 + (strength / 100) * 2;
  const roll = rng * 3;
  if (roll < lambda * 0.4) return 0;
  if (roll < lambda * 0.75) return 1;
  if (roll < lambda * 1.05) return 2;
  return 3;
}

function playMatch(
  homeTla: string,
  awayTla: string,
  seedKey: number
): { home: number; away: number } {
  const hStr = getTeamStrength(homeTla) + 2;
  const aStr = getTeamStrength(awayTla);
  let home = simulateGoals(hStr, seed(seedKey));
  let away = simulateGoals(aStr, seed(seedKey + 1));
  if (home === away && seed(seedKey + 2) > 0.3) {
    if (hStr >= aStr) home += 1;
    else away += 1;
  }
  return { home, away };
}

function resultForTeam(
  teamId: number,
  homeTeam: Team,
  awayTeam: Team,
  home: number,
  away: number
): "W" | "D" | "L" {
  const isHome = homeTeam.id === teamId;
  const gf = isHome ? home : away;
  const ga = isHome ? away : home;
  if (gf > ga) return "W";
  if (gf === ga) return "D";
  return "L";
}

const FORM_COMPETITIONS = [
  "FIFA World Cup 2026",
  "FIFA World Cup 2026",
  "World Cup Qualifier",
  "International Friendly",
  "CONCACAF Nations League",
];

export function generateFormGuide(team: Team, simulate: boolean): FormResult[] {
  if (!simulate) return [];

  const opponents = getGroupOpponents(team.tla);
  if (opponents.length === 0) return [];

  const pool = [...opponents, opponents[0], opponents[1]].slice(0, 5);

  return pool.map((oppTla, i) => {
    const opponent = ALL_TEAMS_BY_TLA[oppTla];
    const isHome = i % 2 === 0;
    const homeTeam = isHome ? team : opponent;
    const awayTeam = isHome ? opponent : team;
    const { home, away } = playMatch(homeTeam.tla, awayTeam.tla, team.id * 10 + i);
    const result = resultForTeam(team.id, homeTeam, awayTeam, home, away);

    return {
      result,
      score: `${home}–${away}`,
      opponent,
      homeAway: isHome ? ("H" as const) : ("A" as const),
      date: `2026-0${Math.min(6, 5 + i)}-${10 + i * 3}`,
      competition: FORM_COMPETITIONS[i] ?? "International Friendly",
    };
  });
}

const H2H_COMPETITIONS = [
  "FIFA World Cup 2018",
  "International Friendly",
  "FIFA World Cup 2022",
];

export function generateHeadToHead(team: Team): HeadToHeadMeeting[] {
  const opponents = getGroupOpponents(team.tla);

  return opponents.map((oppTla, i) => {
    const opponent = ALL_TEAMS_BY_TLA[oppTla];
    const isHome = i % 2 === 0;
    const homeTeam = isHome ? team : opponent;
    const awayTeam = isHome ? opponent : team;
    const { home, away } = playMatch(homeTeam.tla, awayTeam.tla, team.id * 100 + i);
    const result = resultForTeam(team.id, homeTeam, awayTeam, home, away);

    return {
      date: `${2018 + i * 2}-0${6 + i}-15`,
      score: `${home}–${away}`,
      competition: H2H_COMPETITIONS[i] ?? "International Friendly",
      result,
      homeTeam,
      awayTeam,
    };
  });
}

export const GROUP_VENUES: Record<string, { venue: string; city: string }> = {
  A: { venue: "Estadio Azteca", city: "Mexico City" },
  B: { venue: "BC Place", city: "Vancouver" },
  C: { venue: "MetLife Stadium", city: "East Rutherford, NJ" },
  D: { venue: "AT&T Stadium", city: "Arlington, TX" },
  E: { venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  F: { venue: "SoFi Stadium", city: "Los Angeles" },
  G: { venue: "Levi's Stadium", city: "Santa Clara, CA" },
  H: { venue: "Lumen Field", city: "Seattle" },
  I: { venue: "Gillette Stadium", city: "Foxborough, MA" },
  J: { venue: "Hard Rock Stadium", city: "Miami, FL" },
  K: { venue: "NRG Stadium", city: "Houston" },
  L: { venue: "Lincoln Financial Field", city: "Philadelphia" },
};
