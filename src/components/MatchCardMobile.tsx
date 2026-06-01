import Flag from "./Flag";
import {
  formatKickoff,
  formatMatchMinute,
  formatScoreline,
  isLive,
  statusLabel,
} from "@/lib/format";
import type { Match, Team } from "@/lib/types";

interface MatchCardMobileProps {
  match?: Match;
  home?: Team | null;
  away?: Team | null;
  onTeamClick?: (teamId: number) => void;
  animateScore?: boolean;
}

export default function MatchCardMobile({
  match,
  home,
  away,
  onTeamClick,
  animateScore,
}: MatchCardMobileProps) {
  const homeTeam = match?.homeTeam ?? home;
  const awayTeam = match?.awayTeam ?? away;

  if (!homeTeam || !awayTeam) {
    return (
      <div className="surface-card flex min-h-[5.5rem] items-center justify-center">
        <p className="text-base text-muted">Awaiting teams</p>
      </div>
    );
  }

  const live = match ? isLive(match.status) : false;
  const label = match ? statusLabel(match.status) : null;
  const minute = match
    ? formatMatchMinute(match.status, match.minute, match.score.injuryTime)
    : "";
  const hasScore =
    match && match.score.home !== null && match.score.away !== null;

  return (
    <div className="surface-card">
      {(live || label) && (
        <div className="mb-3 flex items-center gap-2">
          {live && (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              <span className="text-xs font-medium text-accent">LIVE</span>
              {minute && <span className="text-xs text-muted">{minute}</span>}
            </>
          )}
          {!live && label && (
            <span className="text-sm text-muted">{label}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onTeamClick?.(homeTeam.id)}
          className="tap-target flex flex-1 flex-col items-center gap-2 text-center"
        >
          <Flag team={homeTeam} size={40} />
          <span className="line-clamp-2 text-base text-white">
            {homeTeam.name}
          </span>
        </button>

        <span
          className={`tabular-nums min-w-[4rem] text-center text-2xl font-semibold tracking-tight text-white ${
            animateScore ? "animate-score-pop" : ""
          }`}
        >
          {hasScore ? formatScoreline(match!.score.home, match!.score.away) : "–"}
        </span>

        <button
          type="button"
          onClick={() => onTeamClick?.(awayTeam.id)}
          className="tap-target flex flex-1 flex-col items-center gap-2 text-center"
        >
          <Flag team={awayTeam} size={40} />
          <span className="line-clamp-2 text-base text-white">
            {awayTeam.name}
          </span>
        </button>
      </div>

      {match && (
        <p className="mt-4 text-center text-sm text-muted">
          {match.status === "SCHEDULED"
            ? formatKickoff(match.utcDate)
            : [match.venue, match.city].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}
