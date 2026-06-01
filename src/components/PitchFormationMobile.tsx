import type { SquadPlayer } from "@/lib/types";

interface PitchFormationMobileProps {
  formation: string;
  manager: string;
  squad: SquadPlayer[];
}

export default function PitchFormationMobile({
  formation,
  manager,
  squad,
}: PitchFormationMobileProps) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <p className="text-xl font-semibold tracking-tight text-white">{formation}</p>
        <p className="text-sm text-muted">{manager}</p>
      </div>
      <div className="pitch relative aspect-[3/4] w-full overflow-hidden rounded-card">
        <div className="absolute inset-3 rounded-lg border border-border" />
        <div className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-border" />
        <div className="absolute bottom-3 top-3 left-1/2 w-px -translate-x-1/2 bg-border" />
        <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border" />

        {squad.map((p, i) => (
          <div
            key={`${p.number}-${p.name}-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span className="block max-w-[5rem] truncate text-center text-sm text-white">
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
