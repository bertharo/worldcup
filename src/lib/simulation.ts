import type {
  DashboardData,
  GoldenStats,
  Group,
  KnockoutSlot,
  Match,
  TableRow,
  Team,
} from "./types";
import {
  GOLDEN_BOOT_CANDIDATES,
  GOLDEN_GLOVE_CANDIDATES,
  HOST_NATIONS,
  KEY_PLAYERS,
  getTeamStrength,
} from "./tournament-data";

export interface SimulationState {
  dashboard: DashboardData;
  step: number;
  phaseLabel: string;
  /** Keys like "GROUP_A" or "r32-0" that just updated */
  flashKeys: string[];
  complete: boolean;
}

const GROUP_LETTERS = "ABCDEFGHIJKL".split("");

/** Standard 4-team group round-robin by matchday */
const MATCHDAY_PAIRINGS = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];

const KNOCKOUT_ROUNDS = [
  "Round of 32",
  "Round of 16",
  "Quarter-finals",
  "Semi-finals",
  "Final",
] as const;

let simMatchId = 10_000;

/** Track simulated goal scorers for realistic stats */
const simScorerGoals: Map<string, { player: string; team: Team; goals: number }> = new Map();

function cloneTeam(t: Team): Team {
  return { ...t };
}

function blankRow(team: Team, pos: number): TableRow {
  return {
    position: pos,
    team: cloneTeam(team),
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

function sortTable(rows: TableRow[]): TableRow[] {
  const sorted = [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.name.localeCompare(b.team.name);
  });
  return sorted.map((r, i) => ({ ...r, position: i + 1 }));
}

function effectiveStrength(tla: string, isHome: boolean): number {
  let s = getTeamStrength(tla);
  if (isHome && HOST_NATIONS.has(tla)) s += 4;
  return s;
}

/** Poisson-ish goal sampling from strength differential */
function sampleGoals(strength: number): number {
  const lambda = 0.4 + (strength / 100) * 2.2;
  let goals = 0;
  const L = Math.exp(-lambda);
  let p = 1;
  do {
    goals++;
    p *= Math.random();
  } while (p > L);
  return goals - 1;
}

function simulateScore(homeTla: string, awayTla: string): { home: number; away: number; injuryTime?: number } {
  const homeStr = effectiveStrength(homeTla, true);
  const awayStr = effectiveStrength(awayTla, false);
  const diff = homeStr - awayStr;

  let home = sampleGoals(homeStr + diff * 0.08);
  let away = sampleGoals(awayStr - diff * 0.08);

  // Upsets are possible but rare for large gaps
  const upsetRoll = Math.random();
  const gap = Math.abs(diff);
  if (gap > 15 && upsetRoll > 0.92) {
    if (diff > 0) away += 1 + Math.floor(Math.random() * 2);
    else home += 1 + Math.floor(Math.random() * 2);
  }

  // Re-resolve draws with slight favourite edge (realistic WC draw rate ~25%)
  if (home === away && Math.random() > 0.28) {
    if (diff >= 0) home += 1;
    else away += 1;
  }

  return {
    home,
    away,
    injuryTime: Math.random() > 0.55 ? Math.floor(Math.random() * 5) + 1 : undefined,
  };
}

function recordGoals(home: Team, away: Team, hs: number, as: number) {
  const homePlayer = KEY_PLAYERS[home.tla]?.name ?? `${home.shortName} striker`;
  const awayPlayer = KEY_PLAYERS[away.tla]?.name ?? `${away.shortName} striker`;

  for (let i = 0; i < hs; i++) {
    const key = `${home.tla}:${homePlayer}`;
    const cur = simScorerGoals.get(key) ?? { player: homePlayer, team: home, goals: 0 };
    simScorerGoals.set(key, { ...cur, goals: cur.goals + 1 });
  }
  for (let i = 0; i < as; i++) {
    const key = `${away.tla}:${awayPlayer}`;
    const cur = simScorerGoals.get(key) ?? { player: awayPlayer, team: away, goals: 0 };
    simScorerGoals.set(key, { ...cur, goals: cur.goals + 1 });
  }
}

function applyResult(rows: TableRow[], homeId: number, awayId: number, hs: number, as: number): TableRow[] {
  const updated = rows.map((row) => {
    const isHome = row.team.id === homeId;
    const isAway = row.team.id === awayId;
    if (!isHome && !isAway) return { ...row };

    const won = (isHome && hs > as) || (isAway && as > hs);
    const drawn = hs === as;
    const lost = !won && !drawn;
    const gf = isHome ? hs : as;
    const ga = isHome ? as : hs;
    const result: "W" | "D" | "L" = won ? "W" : drawn ? "D" : "L";

    return {
      ...row,
      played: row.played + 1,
      won: row.won + (won ? 1 : 0),
      drawn: row.drawn + (drawn ? 1 : 0),
      lost: row.lost + (lost ? 1 : 0),
      goalsFor: row.goalsFor + gf,
      goalsAgainst: row.goalsAgainst + ga,
      goalDifference: row.goalsFor + gf - (row.goalsAgainst + ga),
      points: row.points + (won ? 3 : drawn ? 1 : 0),
      form: [result, ...row.form].slice(0, 5),
      yellowCards: row.yellowCards + (Math.random() > 0.65 ? 1 : 0),
    };
  });

  return sortTable(updated);
}

function makeSimMatch(
  home: Team,
  away: Team,
  hs: number | null,
  as: number | null,
  opts: Partial<Match> = {}
): Match {
  const finished = hs !== null && as !== null;
  return {
    id: simMatchId++,
    utcDate: opts.utcDate ?? new Date().toISOString(),
    status: opts.status ?? (finished ? "FINISHED" : "SCHEDULED"),
    stage: opts.stage ?? "GROUP_STAGE",
    group: opts.group,
    matchday: opts.matchday,
    homeTeam: cloneTeam(home),
    awayTeam: cloneTeam(away),
    score: {
      home: hs,
      away: as,
      injuryTime: opts.score?.injuryTime,
    },
    venue: opts.venue ?? "World Cup Stadium",
    city: opts.city ?? "TBD",
    competition: "FIFA World Cup 2026 (Simulation)",
  };
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

function emptyStats(teams: Record<number, Team>): GoldenStats {
  const first = Object.values(teams)[0];
  const boot = GOLDEN_BOOT_CANDIDATES[0];
  const bootTeam = Object.values(teams).find((t) => t.tla === boot.tla) ?? first;
  const glove = GOLDEN_GLOVE_CANDIDATES[0];
  const gloveTeam = Object.values(teams).find((t) => t.tla === glove.tla) ?? first;

  return {
    goldenBoot: { rank: 1, player: boot.player, team: bootTeam, value: 0 },
    goldenAssist: { rank: 1, player: "—", team: first, value: 0 },
    goldenGlove: { player: glove.player, team: gloveTeam, saves: 0, cleanSheets: 0 },
    disciplinary: { player: "—", team: first, yellowCards: 0, redCards: 0 },
  };
}

function deriveStats(groups: Group[], teams: Record<number, Team>): GoldenStats {
  let topBookings = { player: "—", team: Object.values(teams)[0], yellowCards: 0, redCards: 0 };

  groups.forEach((g) => {
    g.table.forEach((row) => {
      if (row.yellowCards > topBookings.yellowCards) {
        topBookings = {
          player: `${row.team.name} player`,
          team: row.team,
          yellowCards: row.yellowCards,
          redCards: row.redCards,
        };
      }
    });
  });

  const scorers = Array.from(simScorerGoals.values()).sort((a, b) => b.goals - a.goals);
  const top = scorers[0];
  const fallbackTeam = Object.values(teams)[0];

  if (!top) {
    return emptyStats(teams);
  }

  const assistCandidate = scorers[1] ?? top;

  return {
    goldenBoot: { rank: 1, player: top.player, team: top.team, value: top.goals },
    goldenAssist: {
      rank: 1,
      player: assistCandidate.player,
      team: assistCandidate.team,
      value: Math.max(1, Math.floor(assistCandidate.goals * 0.5)),
    },
    goldenGlove: {
      player: GOLDEN_GLOVE_CANDIDATES[0].player,
      team: Object.values(teams).find((t) => t.tla === "ARG") ?? top.team,
      saves: 8 + Math.floor(Math.random() * 12),
      cleanSheets: 1 + Math.floor(Math.random() * 3),
    },
    disciplinary: topBookings,
  };
}

export function createSimulationState(
  groupAssignments: Record<string, Team[]>,
  teams: Record<number, Team>
): SimulationState {
  simScorerGoals.clear();

  const groups: Group[] = GROUP_LETTERS.map((letter) => {
    const teamList = groupAssignments[letter] ?? [];
    const table = sortTable(teamList.map((t, i) => blankRow(t, i + 1)));
    return { letter, table, fixtures: [] };
  });

  return {
    dashboard: {
      groups,
      knockout: emptyKnockout(),
      stats: emptyStats(teams),
      teams,
      source: "simulation",
    },
    step: 0,
    phaseLabel: "Ready to simulate",
    flashKeys: [],
    complete: false,
  };
}

function simulateGroupMatchday(
  groups: Group[],
  matchdayIndex: number
): { groups: Group[]; flashKeys: string[]; fixtures: Match[] } {
  const flashKeys: string[] = [];
  const allFixtures: Match[] = [];

  const updated = groups.map((group) => {
    const pairings = MATCHDAY_PAIRINGS[matchdayIndex];
    let table = group.table;
    const fixtures: Match[] = [];

    pairings.forEach(([a, b]) => {
      const home = table[a]?.team;
      const away = table[b]?.team;
      if (!home || !away) return;

      const { home: hs, away: as, injuryTime } = simulateScore(home.tla, away.tla);
      recordGoals(home, away, hs, as);
      table = applyResult(table, home.id, away.id, hs, as);
      const match = makeSimMatch(home, away, hs, as, {
        group: `GROUP_${group.letter}`,
        matchday: matchdayIndex + 1,
        score: { home: hs, away: as, injuryTime },
      });
      fixtures.push(match);
    });

    flashKeys.push(`GROUP_${group.letter}`);
    allFixtures.push(...fixtures);

    return { ...group, table, fixtures: [...group.fixtures, ...fixtures] };
  });

  return { groups: updated, flashKeys, fixtures: allFixtures };
}

function getQualifiers(groups: Group[]): Team[] {
  const qualifiers: Team[] = [];
  groups.forEach((g) => {
    g.table.slice(0, 2).forEach((r) => qualifiers.push(r.team));
  });
  return qualifiers;
}

/** Seed R32 with group winners vs runners-up (simplified cross-group pairing) */
function seedKnockout(qualifiers: Team[]): KnockoutSlot[] {
  const slots = emptyKnockout();
  const winners = qualifiers.filter((_, i) => i % 2 === 0);
  const runners = qualifiers.filter((_, i) => i % 2 === 1);

  for (let i = 0; i < 8; i++) {
    const home = winners[i] ?? qualifiers[i * 2];
    const away = runners[i] ?? qualifiers[i * 2 + 1];
    if (!home || !away) continue;

    slots[i] = {
      ...slots[i],
      homeTeam: cloneTeam(home),
      awayTeam: cloneTeam(away),
      match: makeSimMatch(home, away, null, null, { stage: "LAST_32" }),
    };
  }

  return slots;
}

function simulateKnockoutRound(
  slots: KnockoutSlot[],
  round: string
): { slots: KnockoutSlot[]; flashKeys: string[] } {
  const flashKeys: string[] = [];
  const roundSlots = slots.filter((s) => s.round === round && s.homeTeam && s.awayTeam);

  roundSlots.forEach((slot) => {
    if (!slot.homeTeam || !slot.awayTeam) return;
    if (slot.match?.status === "FINISHED") return;

    let { home: hs, away: as, injuryTime } = simulateScore(slot.homeTeam.tla, slot.awayTeam.tla);
    recordGoals(slot.homeTeam, slot.awayTeam, hs, as);

    if (hs === as) {
      const homeStr = effectiveStrength(slot.homeTeam.tla, true);
      const awayStr = effectiveStrength(slot.awayTeam.tla, false);
      if (homeStr >= awayStr) hs += 1;
      else as += 1;
    }

    const winner = hs > as ? slot.homeTeam : slot.awayTeam;

    slot.match = makeSimMatch(slot.homeTeam, slot.awayTeam, hs, as, {
      stage: round === "Final" ? "FINAL" : "KNOCKOUT",
      score: { home: hs, away: as, injuryTime },
    });

    flashKeys.push(slot.id);

    if (slot.nextSlotId) {
      const next = slots.find((s) => s.id === slot.nextSlotId);
      if (next) {
        if (!next.homeTeam) next.homeTeam = cloneTeam(winner);
        else next.awayTeam = cloneTeam(winner);
      }
    }
  });

  return { slots: [...slots], flashKeys };
}

export const TOTAL_SIM_STEPS = 3 + 1 + KNOCKOUT_ROUNDS.length;

export function getPhaseLabel(step: number): string {
  if (step === 0) return "Tournament kick-off";
  if (step >= 1 && step <= 3) return `Group Stage — Matchday ${step}`;
  if (step === 4) return "Seeding Knockout Bracket";
  const koIndex = step - 5;
  if (koIndex >= 0 && koIndex < KNOCKOUT_ROUNDS.length) {
    return `Simulating ${KNOCKOUT_ROUNDS[koIndex]}`;
  }
  return "Simulation complete";
}

export function advanceSimulation(state: SimulationState): SimulationState {
  const { dashboard, step } = state;
  let { groups, knockout, stats } = dashboard;
  let flashKeys: string[] = [];

  if (step >= TOTAL_SIM_STEPS) {
    return { ...state, complete: true, phaseLabel: "Simulation complete" };
  }

  const nextStep = step + 1;

  if (nextStep >= 1 && nextStep <= 3) {
    const md = simulateGroupMatchday(groups, nextStep - 1);
    groups = md.groups;
    flashKeys = md.flashKeys;
    stats = deriveStats(groups, dashboard.teams);
  } else if (nextStep === 4) {
    const qualifiers = getQualifiers(groups);
    knockout = seedKnockout(qualifiers);
    flashKeys = knockout.slice(0, 8).map((s) => s.id);
  } else if (nextStep >= 5 && nextStep <= 9) {
    const roundIndex = nextStep - 5;
    const round = KNOCKOUT_ROUNDS[roundIndex];
    const result = simulateKnockoutRound(knockout, round);
    knockout = result.slots;
    flashKeys = result.flashKeys;
    stats = deriveStats(groups, dashboard.teams);
  }

  return {
    dashboard: {
      ...dashboard,
      groups,
      knockout,
      stats,
      source: "simulation",
    },
    step: nextStep,
    phaseLabel: getPhaseLabel(nextStep),
    flashKeys,
    complete: nextStep >= TOTAL_SIM_STEPS,
  };
}
