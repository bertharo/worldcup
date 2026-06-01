import Flag from "./Flag";
import {
  formatKickoff,
  formatScoreline,
  gdString,
  isLive,
} from "@/lib/format";
import type { Group, Match } from "@/lib/types";
import { Fragment, type ReactNode } from "react";

interface GroupCardMobileProps {
  group: Group;
  onTeamClick: (teamId: number) => void;
  isFlashing?: boolean;
}

function FixtureRow({ match }: { match: Match }) {
  const live = isLive(match.status);
  const finished = match.status === "FINISHED";
  const hasScore = match.score.home !== null && match.score.away !== null;

  let center: ReactNode;
  if (live && hasScore) {
    center = (
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs font-medium text-accent">LIVE</span>
        <span className="tabular-nums text-base text-white">
          {formatScoreline(match.score.home, match.score.away)}
        </span>
      </div>
    );
  } else if (finished && hasScore) {
    center = (
      <span className="tabular-nums text-base text-white">
        {formatScoreline(match.score.home, match.score.away)}
      </span>
    );
  } else {
    center = (
      <span className="text-sm text-muted">{formatKickoff(match.utcDate)}</span>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Flag team={match.homeTeam} size={24} />
        <span className="truncate text-base text-white">{match.homeTeam.name}</span>
      </div>
      <div className="shrink-0 px-2 text-center">{center}</div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <span className="truncate text-right text-base text-white">
          {match.awayTeam.name}
        </span>
        <Flag team={match.awayTeam} size={24} />
      </div>
    </div>
  );
}

export default function GroupCardMobile({
  group,
  onTeamClick,
  isFlashing,
}: GroupCardMobileProps) {
  const fixtures = [...group.fixtures].sort(
    (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
  );

  return (
    <div className={isFlashing ? "animate-card-flash rounded-card" : ""}>
      <div className="surface-card w-full overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold tracking-tight text-white">
            Group {group.letter}
          </h3>
        </div>

        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-border text-sm text-muted">
              <th className="px-4 py-3 text-left font-normal">Team</th>
              <th className="tabular-nums px-2 py-3 text-right font-normal">P</th>
              <th className="tabular-nums px-2 py-3 text-right font-normal">W</th>
              <th className="tabular-nums px-2 py-3 text-right font-normal">D</th>
              <th className="tabular-nums px-2 py-3 text-right font-normal">L</th>
              <th className="tabular-nums px-2 py-3 text-right font-normal">GD</th>
              <th className="tabular-nums px-3 py-3 text-right font-normal">Pts</th>
              <th className="w-6" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {group.table.map((row, index) => (
              <Fragment key={row.team.id}>
                <tr
                  onClick={() => onTeamClick(row.team.id)}
                  className={`cursor-pointer ${index % 2 === 1 ? "bg-row-alt" : "bg-bg"} ${
                    isFlashing ? "animate-row-pop" : ""
                  }`}
                >
                  <td className="py-0">
                    <div className="tap-target-row flex items-center gap-2 px-4 py-3">
                      <Flag team={row.team} size={24} />
                      <span className="min-w-0 flex-1 truncate text-base text-white">
                        {row.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="tabular-nums px-2 py-3 text-right text-white">{row.played}</td>
                  <td className="tabular-nums px-2 py-3 text-right text-white">{row.won}</td>
                  <td className="tabular-nums px-2 py-3 text-right text-white">{row.drawn}</td>
                  <td className="tabular-nums px-2 py-3 text-right text-white">{row.lost}</td>
                  <td className="tabular-nums px-2 py-3 text-right text-white">
                    {gdString(row.goalDifference)}
                  </td>
                  <td className="tabular-nums px-3 py-3 text-right font-medium text-white">
                    {row.points}
                  </td>
                  <td className="px-2 py-3 text-right text-muted">›</td>
                </tr>
                {row.position === 2 && (
                  <tr aria-hidden>
                    <td colSpan={8} className="p-0">
                      <div className="h-px bg-border" />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {fixtures.length > 0 && (
        <section className="mt-6">
          <h4 className="mb-3 px-4 text-xs font-medium text-muted">Fixtures</h4>
          <div className="divide-y divide-border">
            {fixtures.map((match) => (
              <FixtureRow key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
