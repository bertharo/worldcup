import Flag from "./Flag";
import { gdString } from "@/lib/format";
import type { Group } from "@/lib/types";

interface GroupCardProps {
  group: Group;
  onTeamClick: (teamId: number) => void;
  isFlashing?: boolean;
}

export default function GroupCard({ group, onTeamClick, isFlashing }: GroupCardProps) {
  return (
    <div
      className={`glass-card p-3 transition-all duration-300 ease-in-out hover:glow-blue ${
        isFlashing ? "animate-card-flash ring-1 ring-amber-400/40" : ""
      }`}
    >
      <h3 className="mb-2 font-display text-lg tracking-widest text-gold">
        GROUP {group.letter}
      </h3>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-zinc-500 uppercase tracking-wider">
            <th className="pb-1 text-left font-normal">#</th>
            <th className="pb-1 text-left font-normal">Team</th>
            <th className="pb-1 text-center font-normal">P</th>
            <th className="pb-1 text-center font-normal">W</th>
            <th className="pb-1 text-center font-normal">D</th>
            <th className="pb-1 text-center font-normal">L</th>
            <th className="pb-1 text-center font-normal">GF</th>
            <th className="pb-1 text-center font-normal">GA</th>
            <th className="pb-1 text-center font-normal">GD</th>
            <th className="pb-1 text-center font-normal">Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.table.map((row) => {
            const qualified = row.position <= 2;
            return (
              <tr
                key={row.team.id}
                className={`border-t border-white/5 transition-all duration-300 ${
                  qualified ? "bg-gold/5" : ""
                } ${isFlashing ? "animate-row-pop" : ""}`}
              >
                <td className="py-1.5 text-zinc-400">{row.position}</td>
                <td className="py-1.5">
                  <button
                    type="button"
                    onClick={() => onTeamClick(row.team.id)}
                    className="flex items-center gap-1.5 transition-all duration-300 hover:text-gold"
                  >
                    <Flag team={row.team} size={16} />
                    <span className={`truncate max-w-[5rem] sm:max-w-none ${qualified ? "font-semibold text-gold" : ""}`}>
                      {row.team.tla}
                    </span>
                    {qualified && (
                      <span className="hidden text-[9px] uppercase text-gold/70 sm:inline">Q</span>
                    )}
                  </button>
                </td>
                <td className="py-1.5 text-center">{row.played}</td>
                <td className="py-1.5 text-center">{row.won}</td>
                <td className="py-1.5 text-center">{row.drawn}</td>
                <td className="py-1.5 text-center">{row.lost}</td>
                <td className="py-1.5 text-center">{row.goalsFor}</td>
                <td className="py-1.5 text-center">{row.goalsAgainst}</td>
                <td className="py-1.5 text-center">{gdString(row.goalDifference)}</td>
                <td className="py-1.5 text-center font-bold">
                  {row.points}
                  {(row.yellowCards > 0 || row.redCards > 0) && (
                    <span className="ml-1 text-[9px]">
                      {row.yellowCards > 0 && <span title="Yellow cards">🟨{row.yellowCards}</span>}
                      {row.redCards > 0 && <span title="Red cards">🟥{row.redCards}</span>}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
