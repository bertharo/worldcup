import type { MatchStatus } from "./types";

export function formatScoreline(home: number | null, away: number | null): string {
  if (home === null || away === null) return "–";
  return `${home}–${away}`;
}

export function formatAggregate(
  home: number | null,
  away: number | null,
  aggHome?: number | null,
  aggAway?: number | null
): string | null {
  if (aggHome == null || aggAway == null) return null;
  const leg = formatScoreline(home, away);
  return `${leg} (${aggHome}–${aggAway} agg.)`;
}

export function formatMatchMinute(
  status: MatchStatus,
  minute?: number,
  injuryTime?: number | null
): string {
  if (status === "HALFTIME") return "HT";
  if (status === "FINISHED") return "FT";
  if (status === "EXTRA_TIME") return injuryTime ? `AET ${90 + injuryTime}'` : "AET";
  if (status === "PENALTY_SHOOTOUT") return "PSO";
  if (status === "SCHEDULED" || status === "POSTPONED") return "";

  if (minute == null) return "";

  if (minute <= 45 && injuryTime) return `45+${injuryTime}'`;
  if (minute > 45 && minute <= 90 && injuryTime) return `90+${injuryTime}'`;
  return `${minute}'`;
}

export function statusLabel(status: MatchStatus): string | null {
  if (status === "LIVE" || status === "IN_PLAY" || status === "PAUSED") return "LIVE";
  if (status === "HALFTIME") return "HT";
  if (status === "FINISHED") return "FT";
  if (status === "EXTRA_TIME") return "AET";
  if (status === "PENALTY_SHOOTOUT") return "PSO";
  return null;
}

export function formatKickoff(utcDate: string, locale?: string): string {
  const date = new Date(utcDate);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function formatShortDate(utcDate: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(utcDate));
}

export function isLive(status: MatchStatus): boolean {
  return ["LIVE", "IN_PLAY", "PAUSED", "HALFTIME", "EXTRA_TIME"].includes(status);
}

export function gdString(gd: number): string {
  return gd > 0 ? `+${gd}` : `${gd}`;
}
