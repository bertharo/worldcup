import type { DashboardData, Group, KnockoutSlot, Match, Team } from "./types";
import { getMockDashboard, ALL_TEAMS_BY_TLA } from "./mock-data";
import { COUNTRY_META, flagUrl, fifaName, kitColors } from "./flags";
import {
  DATA_VERSION,
  DRAW_DATE,
  OFFICIAL_GROUPS_2026,
  enrichTeamMeta,
  normalizeTla,
} from "./tournament-data";

const BASE = "https://api.football-data.org/v4";
/** Server-side cache: refresh from API at least daily */
const REVALIDATE_SECONDS = 86400;

async function fdFetch<T>(path: string): Promise<T | null> {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "X-Auth-Token": key },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

interface FDTeam {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}

interface FDStandingRow {
  position: number;
  team: FDTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface FDStandingsResponse {
  standings?: {
    group?: string;
    table: FDStandingRow[];
  }[];
}

interface FDMatch {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  group?: string;
  matchday?: number;
  homeTeam: FDTeam;
  awayTeam: FDTeam;
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime?: { home: number | null; away: number | null };
  };
  venue?: string;
  minute?: number;
  injuryTime?: number;
}

interface FDMatchesResponse {
  matches?: FDMatch[];
}

interface FDScorer {
  player: { name: string };
  team: FDTeam;
  goals: number;
  assists?: number;
  penalties?: number;
}

interface FDScorersResponse {
  scorers?: FDScorer[];
}

function mapTeam(fd: FDTeam, teamsByTla: Record<string, Team>): Team {
  const rawTla = fd.tla ?? "UNK";
  const tla = normalizeTla(rawTla);
  const meta = enrichTeamMeta(tla);
  const colors = kitColors(tla);
  const curated = teamsByTla[tla];

  const team: Team = {
    id: fd.id,
    name: fifaName(tla, fd.name),
    shortName: fd.shortName ?? fifaName(tla, fd.name),
    tla,
    crest: flagUrl(tla, 80),
    flagCode: COUNTRY_META[tla]?.flagCode ?? tla.toLowerCase(),
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    manager: meta.manager,
    formation: meta.formation,
  };

  if (curated && curated.id !== fd.id) {
    return { ...team, id: curated.id };
  }

  return team;
}

function mapStatus(s: string): Match["status"] {
  const map: Record<string, Match["status"]> = {
    SCHEDULED: "SCHEDULED",
    TIMED: "SCHEDULED",
    IN_PLAY: "IN_PLAY",
    LIVE: "LIVE",
    PAUSED: "PAUSED",
    HALFTIME: "HALFTIME",
    FINISHED: "FINISHED",
    EXTRA_TIME: "EXTRA_TIME",
    PENALTY_SHOOTOUT: "PENALTY_SHOOTOUT",
    POSTPONED: "POSTPONED",
  };
  return map[s] ?? "SCHEDULED";
}

function mapMatch(m: FDMatch, teams: Record<number, Team>, teamsByTla: Record<string, Team>): Match {
  const home = teams[m.homeTeam.id] ?? mapTeam(m.homeTeam, teamsByTla);
  const away = teams[m.awayTeam.id] ?? mapTeam(m.awayTeam, teamsByTla);
  teams[home.id] = home;
  teams[away.id] = away;

  return {
    id: m.id,
    utcDate: m.utcDate,
    status: mapStatus(m.status),
    stage: m.stage,
    group: m.group ?? undefined,
    matchday: m.matchday,
    homeTeam: home,
    awayTeam: away,
    score: {
      home: m.score.fullTime.home,
      away: m.score.fullTime.away,
      homeHalftime: m.score.halfTime?.home,
      awayHalftime: m.score.halfTime?.away,
      injuryTime: m.injuryTime ?? null,
    },
    venue: m.venue,
    competition: "FIFA World Cup 2026",
    minute: m.minute,
  };
}

function mergeWithOfficialDraw(apiGroups: Group[], mock: DashboardData): Group[] {
  const mockByLetter = Object.fromEntries(mock.groups.map((g) => [g.letter, g]));

  return Object.keys(OFFICIAL_GROUPS_2026).map((letter) => {
    const apiGroup = apiGroups.find((g) => g.letter === letter);
    const mockGroup = mockByLetter[letter];
    if (!apiGroup) return mockGroup;

    const officialTlas = OFFICIAL_GROUPS_2026[letter];
    const tableByTla = Object.fromEntries(apiGroup.table.map((r) => [r.team.tla, r]));

    const table = officialTlas.map((tla, i) => {
      const row = tableByTla[tla];
      if (row) return { ...row, position: i + 1 };
      return mockGroup.table.find((r) => r.team.tla === tla) ?? mockGroup.table[i];
    });

    const fixtures =
      apiGroup.fixtures.length > 0 ? apiGroup.fixtures : mockGroup.fixtures;

    return { letter, table, fixtures };
  });
}

function buildKnockoutFromMatches(
  matches: Match[],
  mockKnockout: KnockoutSlot[]
): KnockoutSlot[] {
  const koMatches = matches.filter((m) => m.stage !== "GROUP_STAGE" && m.stage !== "GROUP");
  if (koMatches.length === 0) return mockKnockout;

  const roundMap: Record<string, string> = {
    LAST_32: "Round of 32",
    LAST_16: "Round of 16",
    QUARTER_FINALS: "Quarter-finals",
    SEMI_FINALS: "Semi-finals",
    FINAL: "Final",
    THIRD_PLACE: "Third place",
  };

  const slots: KnockoutSlot[] = [];
  const byRound = new Map<string, Match[]>();

  koMatches.forEach((m) => {
    const round = roundMap[m.stage] ?? m.stage;
    const list = byRound.get(round) ?? [];
    list.push(m);
    byRound.set(round, list);
  });

  const roundOrder = ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Final"];
  roundOrder.forEach((round, ri) => {
    const roundMatches = byRound.get(round) ?? [];
    roundMatches.forEach((m, i) => {
      const nextRound = roundOrder[ri + 1];
      const nextId =
        round === "Round of 32"
          ? `r16-${Math.floor(i / 2)}`
          : round === "Round of 16"
            ? `qf-${Math.floor(i / 2)}`
            : round === "Quarter-finals"
              ? `sf-${Math.floor(i / 2)}`
              : round === "Semi-finals"
                ? "final"
                : undefined;

      slots.push({
        id: `${round.toLowerCase().replace(/\s+/g, "-")}-${i}`,
        round,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        match: m,
        nextSlotId: nextId,
      });
    });
  });

  return slots.length > 0 ? slots : mockKnockout;
}

export async function fetchLiveDashboard(): Promise<DashboardData | null> {
  const mock = getMockDashboard();
  const teamsByTla = ALL_TEAMS_BY_TLA;

  const [standingsRes, matchesRes, scorersRes] = await Promise.all([
    fdFetch<FDStandingsResponse>("/competitions/WC/standings?season=2026"),
    fdFetch<FDMatchesResponse>("/competitions/WC/matches?season=2026"),
    fdFetch<FDScorersResponse>("/competitions/WC/scorers?season=2026&limit=20"),
  ]);

  if (!standingsRes?.standings?.length && !matchesRes?.matches?.length) {
    return null;
  }

  const teams: Record<number, Team> = { ...mock.teams };
  let apiGroups: Group[] = [];

  if (standingsRes?.standings?.length) {
    apiGroups = standingsRes.standings
      .filter((s) => s.group)
      .map((s) => {
        const letter = (s.group ?? "").replace("GROUP_", "");
        const table = s.table.map((row) => {
          const t = mapTeam(row.team, teamsByTla);
          teams[t.id] = t;
          return {
            position: row.position,
            team: t,
            played: row.playedGames,
            won: row.won,
            drawn: row.draw,
            lost: row.lost,
            goalsFor: row.goalsFor,
            goalsAgainst: row.goalsAgainst,
            goalDifference: row.goalDifference,
            points: row.points,
            form: [] as ("W" | "D" | "L")[],
            yellowCards: 0,
            redCards: 0,
          };
        });

        return { letter, table, fixtures: [] as Match[] };
      });
  }

  const allMatches = (matchesRes?.matches ?? []).map((m) => mapMatch(m, teams, teamsByTla));

  if (apiGroups.length > 0) {
    apiGroups.forEach((g) => {
      g.fixtures = allMatches.filter((m) => m.group === `GROUP_${g.letter}`);
    });
  }

  const groups =
    apiGroups.length > 0 ? mergeWithOfficialDraw(apiGroups, mock) : mock.groups;

  if (apiGroups.length === 0 && allMatches.length > 0) {
    groups.forEach((g) => {
      g.fixtures = allMatches.filter((m) => m.group === `GROUP_${g.letter}`);
    });
  }

  const topScorer = scorersRes?.scorers?.[0];
  const topAssist = scorersRes?.scorers?.find((s) => (s.assists ?? 0) > 0);

  return {
    groups,
    knockout: buildKnockoutFromMatches(allMatches, mock.knockout),
    stats: {
      goldenBoot: topScorer
        ? {
            rank: 1,
            player: topScorer.player.name,
            team: teams[topScorer.team.id] ?? mapTeam(topScorer.team, teamsByTla),
            value: topScorer.goals,
          }
        : mock.stats.goldenBoot,
      goldenAssist: topAssist
        ? {
            rank: 1,
            player: topAssist.player.name,
            team: teams[topAssist.team.id] ?? mapTeam(topAssist.team, teamsByTla),
            value: topAssist.assists ?? 0,
          }
        : mock.stats.goldenAssist,
      goldenGlove: mock.stats.goldenGlove,
      disciplinary: mock.stats.disciplinary,
    },
    teams,
    source: "live",
    dataUpdatedAt: new Date().toISOString(),
    drawDate: DRAW_DATE,
    dataVersion: DATA_VERSION,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const live = await fetchLiveDashboard();
  return live ?? getMockDashboard();
}
