import type { SquadPlayer } from "@/lib/types";

interface PitchFormationProps {
  formation: string;
  manager: string;
  squad: SquadPlayer[];
}

export default function PitchFormation({ formation, manager, squad }: PitchFormationProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="font-display text-lg text-gold">{formation}</p>
        <p className="text-xs text-zinc-500">Manager: {manager}</p>
      </div>
      <div className="pitch relative aspect-[3/4] w-full overflow-hidden rounded-xl">
        <div className="absolute inset-4 border border-white/30 rounded-sm" />
        <div className="absolute left-4 right-4 top-1/2 h-px bg-white/30" />
        <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-white/30" />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />

        {squad.map((p) => (
          <div
            key={p.number}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className="flex flex-col items-center">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-electric/90 text-[10px] font-bold text-white shadow-lg">
                {p.number}
              </span>
              <span className="mt-0.5 max-w-[4rem] truncate text-[9px] font-medium text-white drop-shadow">
                {p.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
