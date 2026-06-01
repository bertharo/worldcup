import type { TeamIntelligence } from "./types";
import { buildSquad } from "./formation-layout";
import { getTeamSquad, SQUAD_DATA_UPDATED } from "./team-squads";
import {
  generateFormGuide,
  generateHeadToHead,
  GROUP_VENUES,
} from "./team-intel-generators";
import { getGroupLetter, getGroupOpponents, GROUP_KICKOFFS, OFFICIAL_GROUPS_2026 } from "./tournament-data";
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
  const venueInfo = GROUP_VENUES[letter] ?? { venue: "World Cup Stadium", city: "TBD" };
  return {
    home: ALL_TEAMS_BY_TLA[h],
    away: ALL_TEAMS_BY_TLA[aw],
    utcDate: base,
    group: `GROUP_${letter}`,
    venue: venueInfo.venue,
    city: venueInfo.city,
  };
}

export function getTeamIntelligence(
  teamId: number,
  options: { simulate?: boolean } = {}
): TeamIntelligence | null {
  const t = ALL_TEAMS_MAP[teamId];
  if (!t) return null;

  const simulate = options.simulate ?? false;
  const squadData = getTeamSquad(t.tla);
  const formation = squadData?.formation ?? t.formation;
  const manager = squadData?.manager ?? t.manager;
  const keyPlayer = squadData?.keyPlayer ?? { name: `${t.name} Captain`, goals: 0, assists: 0 };
  const lineup = squadData?.lineup ?? [];

  const team = { ...t, formation, manager };
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
          venue: next.venue,
          city: next.city,
        }
      : null,
    headToHead: generateHeadToHead(team),
    squad: lineup.length > 0 ? buildSquad(formation, lineup) : [],
    formGuide: generateFormGuide(team, simulate),
    keyPlayer: { ...keyPlayer, minutes: simulate ? 450 : 0 },
  };
}

export { SQUAD_DATA_UPDATED };
