import { flagUrl } from "@/lib/flags";
import type { Team } from "@/lib/types";

interface FlagProps {
  team: Team;
  size?: number;
  className?: string;
}

export default function Flag({ team, size = 24, className = "" }: FlagProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagUrl(team.tla, size * 2)}
      alt=""
      width={size}
      height={Math.round(size * 0.67)}
      className={`inline-block rounded-sm object-cover ${className}`}
    />
  );
}
