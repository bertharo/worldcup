import type { TeamIntelligence } from "./types";
import { buildSquad } from "./formation-layout";
import { getTeamSquad, SQUAD_DATA_UPDATED } from "./team-squads";
import { getGroupOpponents, getGroupLetter, GROUP_KICKOFFS, OFFICIAL_GROUPS_2026 } from "./tournament-data";
import { ALL_TEAMS_BY_TLA, ALL_TEAMS_MAP } from "./mock-data";

const MATCHDAY_PAIRINGS = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];

function findNextGroupFixtureTla(tla: string) {
  const letter = getGroupLetter(tla);
  if (!letter) return null;
  const tlas = OFFICIAL_GROUPS_2026[letter];
  const base = GROUP_KICKOFFS[letter] ?? "2026-06-11T19:00:00Z";
  const [a, b] = MATCHDAY_PAIRINGS[0][0];
  const home = tlas[a];
  const away = tlas[b];
  const involves = home === tla || away === tla;
  const h = involves ? home : tlas[MATCHDAY_PAIRINGS[0][1][0]];
  const aw = involves ? away : tlas[MATCHDAY_PAIRINGS[0][1][1]];
  return {
    home: ALL_TEAMS_BY_TLA[h],
    away: ALL_TEAMS_BY_TLA[aw],
    utcDate: base,
    group: `GROUP_${letter}`,
  };
}

export function getTeamIntelligence(teamId: number): TeamIntelligence | null {
  const t = ALL_TEAMS_MAP[teamId];
  if (!t) return null;

  const squadData = getTeamSquad(t.tla);
  const formation = squadData?.formation ?? t.formation;
  const manager = squadData?.manager ?? t.manager;
  const keyPlayer = squadData?.keyPlayer ?? { name: `${t.name} Captain`, goals: 0, assists: 0 };
  const lineup = squadData?.lineup ?? [];

  const team = { ...t, formation, manager };
  const opponents = getGroupOpponents(t.tla);
  const next = findNextGroupFixtureTla(t.tla);

  return {
    team,
    nextFixture: next
      ? {
          id: teamId * 100,
          utcDate: next.utcDate,
          status: "SCHEDULED",
          stage: "GROUP_STAGE",
          group: next.group,
          matchday: 1,
          homeTeam: next.home,
          awayTeam: next.away,
          score: { home: null, away: null },
          competition: "FIFA World Cup 2026",
        }
      : null,
    headToHead: opponents.slice(0, 3).map((opp, i) => ({
      date: `202${4 + i}-0${i + 3}-15`,
      score: "—",
      competition: "International Friendly",
      result: "D" as const,
      homeTeam: i % 2 === 0 ? team : ALL_TEAMS_BY_TLA[opp],
      awayTeam: i % 2 === 0 ? ALL_TEAMS_BY_TLA[opp] : team,
    })),
    squad: lineup.length > 0 ? buildSquad(formation, lineup) : [],
    formGuide: [],
    keyPlayer: { ...keyPlayer, minutes: 0 },
  };
}

export { SQUAD_DATA_UPDATED };
