import Flag from "./Flag";
import { gdString } from "@/lib/format";
import type { Group } from "@/lib/types";

interface GroupCardMobileProps {
  group: Group;
  onTeamClick: (teamId: number) => void;
  isFlashing?: boolean;
}

export default function GroupCardMobile({
  group,
  onTeamClick,
  isFlashing,
}: GroupCardMobileProps) {
  return (
    <div
      className={`surface-card w-full overflow-hidden p-0 ${
        isFlashing ? "animate-card-flash" : ""
      }`}
    >
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
            <th className="tabular-nums px-4 py-3 text-right font-normal">Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.table.map((row, index) => {
            const qualified = row.position <= 2;
            return (
              <tr
                key={row.team.id}
                className={`${index % 2 === 1 ? "bg-row-alt" : "bg-bg"} ${
                  isFlashing ? "animate-row-pop" : ""
                }`}
              >
                <td className="py-0">
                  <button
                    type="button"
                    onClick={() => onTeamClick(row.team.id)}
                    className={`tap-target-row flex w-full items-center gap-3 px-4 py-3 text-left ${
                      qualified ? "border-l-2 border-accent" : "border-l-2 border-transparent"
                    }`}
                  >
                    <Flag team={row.team} size={28} />
                    <span className="min-w-0 flex-1 truncate text-base text-white">
                      {row.team.name}
                    </span>
                  </button>
                </td>
                <td className="tabular-nums px-2 py-3 text-right text-white">{row.played}</td>
                <td className="tabular-nums px-2 py-3 text-right text-white">{row.won}</td>
                <td className="tabular-nums px-2 py-3 text-right text-white">{row.drawn}</td>
                <td className="tabular-nums px-2 py-3 text-right text-white">{row.lost}</td>
                <td className="tabular-nums px-2 py-3 text-right text-white">
                  {gdString(row.goalDifference)}
                </td>
                <td className="tabular-nums px-4 py-3 text-right font-medium text-white">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
