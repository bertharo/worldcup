import { flagEmoji } from "@/lib/flags";
import type { Team } from "@/lib/types";

interface FlagProps {
  team: Team;
  size?: number;
  className?: string;
}

export default function Flag({ team, size = 24, className = "" }: FlagProps) {
  return (
    <span
      className={`inline-block shrink-0 leading-none ${className}`}
      style={{ fontSize: size }}
      aria-label={`${team.name} flag`}
      role="img"
    >
      {flagEmoji(team.tla)}
    </span>
  );
}
