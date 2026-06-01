export type MatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "IN_PLAY"
  | "PAUSED"
  | "HALFTIME"
  | "FINISHED"
  | "EXTRA_TIME"
  | "PENALTY_SHOOTOUT"
  | "POSTPONED";

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  flagCode: string;
  primaryColor: string;
  secondaryColor: string;
  manager: string;
  formation: string;
}

export interface TableRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ("W" | "D" | "L")[];
  yellowCards: number;
  redCards: number;
}

export interface Group {
  letter: string;
  table: TableRow[];
  fixtures: Match[];
}

export interface MatchScore {
  home: number | null;
  away: number | null;
  homeHalftime?: number | null;
  awayHalftime?: number | null;
  injuryTime?: number | null;
  aggregateHome?: number | null;
  aggregateAway?: number | null;
}

export interface Match {
  id: number;
  utcDate: string;
  status: MatchStatus;
  stage: string;
  group?: string;
  matchday?: number;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  venue?: string;
  city?: string;
  competition?: string;
  minute?: number;
}

export interface KnockoutSlot {
  id: string;
  round: string;
  match?: Match;
  homeTeam?: Team | null;
  awayTeam?: Team | null;
  nextSlotId?: string;
}

export interface GoldenBootEntry {
  rank: number;
  player: string;
  team: Team;
  value: number;
  photo?: string;
}

export interface GoldenStats {
  goldenBoot: GoldenBootEntry;
  goldenAssist: GoldenBootEntry;
  goldenGlove: {
    player: string;
    team: Team;
    saves: number;
    cleanSheets: number;
    photo?: string;
  };
  disciplinary: {
    player: string;
    team: Team;
    yellowCards: number;
    redCards: number;
  };
}

export interface FormResult {
  result: "W" | "D" | "L";
  score: string;
  opponent: Team;
  homeAway: "H" | "A";
  date: string;
  competition: string;
}

export interface HeadToHeadMeeting {
  date: string;
  score: string;
  competition: string;
  result: "W" | "D" | "L";
  homeTeam: Team;
  awayTeam: Team;
}

export interface SquadPlayer {
  name: string;
  number: number;
  position: "GK" | "DF" | "MF" | "FW";
  x: number;
  y: number;
}

export interface TeamIntelligence {
  team: Team;
  nextFixture: Match | null;
  headToHead: HeadToHeadMeeting[];
  squad: SquadPlayer[];
  formGuide: FormResult[];
  keyPlayer: {
    name: string;
    goals: number;
    assists: number;
    minutes: number;
    photo?: string;
  };
}

export interface DashboardData {
  groups: Group[];
  knockout: KnockoutSlot[];
  stats: GoldenStats;
  teams: Record<number, Team>;
  source: "live" | "mock" | "simulation";
  /** ISO timestamp when underlying data was last refreshed */
  dataUpdatedAt?: string;
  drawDate?: string;
  dataVersion?: string;
}
