import type {
  DashboardData,
  Group,
  KnockoutSlot,
  Match,
  Team,
  TableRow,
} from "./types";
import { COUNTRY_META, flagUrl, fifaName, kitColors } from "./flags";
import { getTeamSquad, SQUAD_DATA_UPDATED } from "./team-squads";
import {
  DATA_VERSION,
  DRAW_DATE,
  GOLDEN_BOOT_CANDIDATES,
  GOLDEN_GLOVE_CANDIDATES,
  GROUP_KICKOFFS,
  OFFICIAL_GROUPS_2026,
  enrichTeamMeta,
} from "./tournament-data";

let teamIdCounter = 1;

function buildTeam(tla: string): Team {
  const colors = kitColors(tla);
  const name = fifaName(tla, tla);
  const squad = getTeamSquad(tla);
  const meta = enrichTeamMeta(tla);
  return {
    id: teamIdCounter++,
    name,
    shortName: name,
    tla,
    crest: flagUrl(tla, 80),
    flagCode: COUNTRY_META[tla]?.flagCode ?? tla.toLowerCase(),
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    manager: squad?.manager ?? meta.manager,
    formation: squad?.formation ?? meta.formation,
  };
}

const ALL_TEAMS_MAP: Record<number, Team> = {};
const ALL_TEAMS_BY_TLA: Record<string, Team> = {};

Object.values(OFFICIAL_GROUPS_2026)
  .flat()
  .forEach((tla) => {
    if (!ALL_TEAMS_BY_TLA[tla]) {
      const t = buildTeam(tla);
      ALL_TEAMS_BY_TLA[tla] = t;
      ALL_TEAMS_MAP[t.id] = t;
    }
  });

function blankRow(tla: string, pos: number): TableRow {
  const t = ALL_TEAMS_BY_TLA[tla];
  return {
    position: pos,
    team: t,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    form: [],
    yellowCards: 0,
    redCards: 0,
  };
}

/** Standard 4-team round-robin by matchday */
const MATCHDAY_PAIRINGS = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];

let matchId = 1;

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

function makeMatch(
  home: string,
  away: string,
  utcDate: string,
  status: Match["status"],
  homeScore: number | null,
  awayScore: number | null,
  opts: Partial<Match> = {}
): Match {
  return {
    id: matchId++,
    utcDate,
    status,
    stage: opts.stage ?? "GROUP_STAGE",
    group: opts.group,
    matchday: opts.matchday,
    homeTeam: ALL_TEAMS_BY_TLA[home],
    awayTeam: ALL_TEAMS_BY_TLA[away],
    score: {
      home: homeScore,
      away: awayScore,
      injuryTime: opts.score?.injuryTime,
    },
    venue: opts.venue,
    city: opts.city,
    competition: "FIFA World Cup 2026",
    minute: opts.minute,
  };
}

function buildGroupFixtures(letter: string, tlas: string[]): Match[] {
  const base = GROUP_KICKOFFS[letter] ?? "2026-06-11T19:00:00Z";
  const fixtures: Match[] = [];

  MATCHDAY_PAIRINGS.forEach((pairings, mdIndex) => {
    pairings.forEach(([a, b], pairIndex) => {
      const home = tlas[a];
      const away = tlas[b];
      const dayOffset = mdIndex * 4 + pairIndex;
      fixtures.push(
        makeMatch(home, away, addDays(base, dayOffset), "SCHEDULED", null, null, {
          group: `GROUP_${letter}`,
          matchday: mdIndex + 1,
          venue: "World Cup Stadium",
          city: "TBD",
        })
      );
    });
  });

  return fixtures;
}

function buildGroups(): Group[] {
  return Object.entries(OFFICIAL_GROUPS_2026).map(([letter, tlas]) => ({
    letter,
    table: tlas.map((tla, i) => blankRow(tla, i + 1)),
    fixtures: buildGroupFixtures(letter, tlas),
  }));
}

function emptyKnockout(): KnockoutSlot[] {
  const slots: KnockoutSlot[] = [];
  for (let i = 0; i < 8; i++) {
    slots.push({
      id: `r32-${i}`,
      round: "Round of 32",
      homeTeam: null,
      awayTeam: null,
      nextSlotId: `r16-${Math.floor(i / 2)}`,
    });
  }
  for (let i = 0; i < 4; i++) {
    slots.push({
      id: `r16-${i}`,
      round: "Round of 16",
      homeTeam: null,
      awayTeam: null,
      nextSlotId: `qf-${Math.floor(i / 2)}`,
    });
  }
  slots.push(
    { id: "qf-0", round: "Quarter-finals", homeTeam: null, awayTeam: null, nextSlotId: "sf-0" },
    { id: "qf-1", round: "Quarter-finals", homeTeam: null, awayTeam: null, nextSlotId: "sf-1" },
    { id: "sf-0", round: "Semi-finals", homeTeam: null, awayTeam: null, nextSlotId: "final" },
    { id: "sf-1", round: "Semi-finals", homeTeam: null, awayTeam: null, nextSlotId: "final" },
    { id: "final", round: "Final", homeTeam: null, awayTeam: null }
  );
  return slots;
}

function preTournamentStats(): DashboardData["stats"] {
  const bootCandidate = GOLDEN_BOOT_CANDIDATES[0];
  const gloveCandidate = GOLDEN_GLOVE_CANDIDATES[0];
  const bootTeam = ALL_TEAMS_BY_TLA[bootCandidate.tla];
  const gloveTeam = ALL_TEAMS_BY_TLA[gloveCandidate.tla];

  return {
    goldenBoot: { rank: 1, player: bootCandidate.player, team: bootTeam, value: 0 },
    goldenAssist: {
      rank: 1,
      player: GOLDEN_BOOT_CANDIDATES[3].player,
      team: ALL_TEAMS_BY_TLA[GOLDEN_BOOT_CANDIDATES[3].tla],
      value: 0,
    },
    goldenGlove: { player: gloveCandidate.player, team: gloveTeam, saves: 0, cleanSheets: 0 },
    disciplinary: { player: "—", team: bootTeam, yellowCards: 0, redCards: 0 },
  };
}

export function getMockDashboard(): DashboardData {
  return {
    groups: buildGroups(),
    knockout: emptyKnockout(),
    stats: preTournamentStats(),
    teams: ALL_TEAMS_MAP,
    source: "mock",
    dataUpdatedAt: `${SQUAD_DATA_UPDATED}T12:00:00Z`,
    drawDate: DRAW_DATE,
    dataVersion: DATA_VERSION,
  };
}

export { ALL_TEAMS_MAP, ALL_TEAMS_BY_TLA };

export function getGroupTeamAssignments(): Record<string, Team[]> {
  return Object.fromEntries(
    Object.entries(OFFICIAL_GROUPS_2026).map(([letter, tlas]) => [
      letter,
      tlas.map((tla) => ALL_TEAMS_BY_TLA[tla]),
    ])
  );
}
