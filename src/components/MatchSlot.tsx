import Flag from "./Flag";
import {
  formatKickoff,
  formatMatchMinute,
  formatScoreline,
  isLive,
  statusLabel,
} from "@/lib/format";
import type { Match } from "@/lib/types";

interface MatchSlotProps {
  match: Match;
  compact?: boolean;
  onTeamClick?: (teamId: number) => void;
  animateScore?: boolean;
}

export default function MatchSlot({
  match,
  compact,
  onTeamClick,
  animateScore,
}: MatchSlotProps) {
  const live = isLive(match.status);
  const label = statusLabel(match.status);
  const minute = formatMatchMinute(match.status, match.minute, match.score.injuryTime);
  const hasScore = match.score.home !== null && match.score.away !== null;

  return (
    <div
      className={`glass-card transition-all duration-300 ease-in-out hover:glow-blue ${compact ? "p-2" : "p-3"}`}
    >
      {live && (
        <div className="mb-2 flex items-center gap-1.5">
          <span className="live-badge">LIVE</span>
          {minute && <span className="text-xs text-red-400">{minute}</span>}
        </div>
      )}
      {!live && label && (
        <div className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">{label}</div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onTeamClick?.(match.homeTeam.id)}
          className="flex flex-1 items-center gap-2 text-left transition-all duration-300 hover:text-gold"
        >
          <Flag team={match.homeTeam} size={compact ? 18 : 22} />
          <span className={`truncate ${compact ? "text-xs" : "text-sm"}`}>{match.homeTeam.name}</span>
        </button>
        <span
          className={`min-w-[3rem] text-center font-display text-lg font-bold tracking-wide text-white ${
            animateScore ? "animate-score-pop" : ""
          }`}
        >
          {hasScore ? formatScoreline(match.score.home, match.score.away) : "TBD"}
        </span>
        <button
          type="button"
          onClick={() => onTeamClick?.(match.awayTeam.id)}
          className="flex flex-1 items-center justify-end gap-2 text-right transition-all duration-300 hover:text-gold"
        >
          <span className={`truncate ${compact ? "text-xs" : "text-sm"}`}>{match.awayTeam.name}</span>
          <Flag team={match.awayTeam} size={compact ? 18 : 22} />
        </button>
      </div>

      {!compact && (
        <p className="mt-2 text-[10px] text-zinc-500">
          {match.status === "SCHEDULED"
            ? formatKickoff(match.utcDate)
            : [match.venue, match.city].filter(Boolean).join(", ")}
        </p>
      )}
    </div>
  );
}
