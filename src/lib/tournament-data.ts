/**
 * Official FIFA World Cup 2026 final draw (5 December 2025, Washington DC).
 * Strength ratings derived from FIFA/Coca-Cola World Ranking (November 2025).
 */

import { TEAM_SQUADS, SQUAD_DATA_UPDATED } from "./team-squads";

export const DRAW_DATE = "2025-12-05";
export const DATA_VERSION = `2026-squads-${SQUAD_DATA_UPDATED}`;

/** Official group stage draw — 12 groups × 4 teams (48 nations). */
export const OFFICIAL_GROUPS_2026: Record<string, string[]> = {
  A: ["MEX", "RSA", "KOR", "CZE"],
  B: ["CAN", "BIH", "QAT", "SUI"],
  C: ["BRA", "MAR", "HAI", "SCO"],
  D: ["USA", "PAR", "AUS", "TUR"],
  E: ["GER", "CUW", "CIV", "ECU"],
  F: ["NED", "JPN", "SWE", "TUN"],
  G: ["BEL", "EGY", "IRN", "NZL"],
  H: ["ESP", "CPV", "SAU", "URU"],
  I: ["FRA", "SEN", "IRQ", "NOR"],
  J: ["ARG", "ALG", "AUT", "JOR"],
  K: ["POR", "COD", "UZB", "COL"],
  L: ["ENG", "CRO", "GHA", "PAN"],
};

/** FIFA ranking Nov 2025 → simulation strength (higher = stronger). */
export const TEAM_STRENGTH: Record<string, number> = {
  ESP: 94, ARG: 93, FRA: 92, ENG: 91, BRA: 90, POR: 89, NED: 88, BEL: 87,
  GER: 86, CRO: 85, MAR: 84, COL: 83, URU: 82, SUI: 81, JPN: 80, SEN: 79,
  IRN: 78, KOR: 77, ECU: 76, AUT: 75, AUS: 74, NOR: 73, MEX: 72, USA: 72,
  CAN: 71, PAR: 70, TUN: 69, CIV: 68, UZB: 67, QAT: 66, SAU: 65, RSA: 64,
  JOR: 63, CPV: 62, GHA: 61, CUW: 58, HAI: 57, NZL: 56, IRQ: 55, COD: 54,
  BIH: 53, CZE: 52, TUR: 51, ALG: 50, SCO: 49, PAN: 48, EGY: 47, SWE: 46,
};

export const HOST_NATIONS = new Set(["MEX", "CAN", "USA"]);

export const MANAGERS: Record<string, string> = Object.fromEntries(
  Object.entries(TEAM_SQUADS).map(([tla, d]) => [tla, d.manager])
);

export const FORMATIONS: Record<string, string> = Object.fromEntries(
  Object.entries(TEAM_SQUADS).map(([tla, d]) => [tla, d.formation])
);

export const KEY_PLAYERS: Record<string, { name: string; goals: number; assists: number }> =
  Object.fromEntries(
    Object.entries(TEAM_SQUADS).map(([tla, d]) => [tla, d.keyPlayer])
  );

export const GOLDEN_BOOT_CANDIDATES = [
  { player: "Kylian Mbappé", tla: "FRA" },
  { player: "Lionel Messi", tla: "ARG" },
  { player: "Harry Kane", tla: "ENG" },
  { player: "Lamine Yamal", tla: "ESP" },
  { player: "Vinícius Júnior", tla: "BRA" },
  { player: "Cristiano Ronaldo", tla: "POR" },
  { player: "Jamal Musiala", tla: "GER" },
  { player: "Son Heung-min", tla: "KOR" },
];

export const GOLDEN_GLOVE_CANDIDATES = [
  { player: "Emiliano Martínez", tla: "ARG" },
  { player: "Thibaut Courtois", tla: "BEL" },
  { player: "Jordan Pickford", tla: "ENG" },
  { player: "Gianluigi Donnarumma", tla: "FRA" },
];

/** Map football-data.org TLA → our canonical TLA */
export const FD_TLA_MAP: Record<string, string> = {
  CZE: "CZE", CIV: "CIV", COD: "COD", CPV: "CPV", IRN: "IRN",
  KOR: "KOR", RSA: "RSA", TUR: "TUR", BIH: "BIH", ALG: "ALG",
  IRQ: "IRQ", HAI: "HAI", SCO: "SCO", SWE: "SWE",
};

export function getTeamStrength(tla: string): number {
  return TEAM_STRENGTH[tla] ?? 45;
}

export function normalizeTla(tla: string): string {
  return FD_TLA_MAP[tla] ?? tla;
}

export function getGroupOpponents(tla: string): string[] {
  for (const teams of Object.values(OFFICIAL_GROUPS_2026)) {
    if (teams.includes(tla)) {
      return teams.filter((t) => t !== tla);
    }
  }
  return [];
}

export function getGroupLetter(tla: string): string | null {
  for (const [letter, teams] of Object.entries(OFFICIAL_GROUPS_2026)) {
    if (teams.includes(tla)) return letter;
  }
  return null;
}

/** Base kickoff per group (matchday 1). */
export const GROUP_KICKOFFS: Record<string, string> = {
  A: "2026-06-11T19:00:00Z",
  B: "2026-06-12T19:00:00Z",
  C: "2026-06-13T19:00:00Z",
  D: "2026-06-12T22:00:00Z",
  E: "2026-06-13T16:00:00Z",
  F: "2026-06-14T16:00:00Z",
  G: "2026-06-14T19:00:00Z",
  H: "2026-06-15T16:00:00Z",
  I: "2026-06-16T19:00:00Z",
  J: "2026-06-16T22:00:00Z",
  K: "2026-06-17T19:00:00Z",
  L: "2026-06-17T16:00:00Z",
};

export function enrichTeamMeta(tla: string): { manager: string; formation: string } {
  return {
    manager: MANAGERS[tla] ?? "TBD",
    formation: FORMATIONS[tla] ?? "4-3-3",
  };
}
