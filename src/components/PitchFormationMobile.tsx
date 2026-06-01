import type { SquadPlayer } from "@/lib/types";

interface PitchFormationMobileProps {
  formation: string;
  manager: string;
  squad: SquadPlayer[];
}

function surname(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

export default function PitchFormationMobile({
  formation,
  manager,
  squad,
}: PitchFormationMobileProps) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm text-muted">{formation}</p>
        <p className="text-sm text-muted">{manager}</p>
      </div>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-card">
        <svg
          viewBox="0 0 100 140"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <rect width="100" height="140" fill="#1e4620" />
          {/* Pitch outline */}
          <rect
            x="5"
            y="5"
            width="90"
            height="130"
            fill="none"
            stroke="white"
            strokeWidth="0.4"
            opacity="0.85"
          />
          {/* Halfway line */}
          <line x1="5" y1="70" x2="95" y2="70" stroke="white" strokeWidth="0.35" opacity="0.85" />
          {/* Centre circle */}
          <circle cx="50" cy="70" r="10" fill="none" stroke="white" strokeWidth="0.35" opacity="0.85" />
          <circle cx="50" cy="70" r="0.6" fill="white" opacity="0.85" />
          {/* Top penalty area */}
          <rect x="22" y="5" width="56" height="22" fill="none" stroke="white" strokeWidth="0.35" opacity="0.85" />
          <rect x="34" y="5" width="32" height="8" fill="none" stroke="white" strokeWidth="0.35" opacity="0.85" />
          <rect x="44" y="5" width="12" height="3" fill="none" stroke="white" strokeWidth="0.35" opacity="0.85" />
          {/* Bottom penalty area */}
          <rect x="22" y="113" width="56" height="22" fill="none" stroke="white" strokeWidth="0.35" opacity="0.85" />
          <rect x="34" y="127" width="32" height="8" fill="none" stroke="white" strokeWidth="0.35" opacity="0.85" />
          <rect x="44" y="132" width="12" height="3" fill="none" stroke="white" strokeWidth="0.35" opacity="0.85" />
          {/* Penalty spots */}
          <circle cx="50" cy="18" r="0.5" fill="white" opacity="0.85" />
          <circle cx="50" cy="122" r="0.5" fill="white" opacity="0.85" />
        </svg>

        {squad.map((p, i) => (
          <div
            key={`${p.number}-${p.name}-${i}`}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className="h-5 w-5 shrink-0 rounded-full bg-white" />
            <span className="mt-0.5 max-w-[4.5rem] truncate text-center text-[13px] leading-tight text-white">
              {surname(p.name)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
