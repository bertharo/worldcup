import GroupCard from "./GroupCard";
import { SkeletonCard } from "./Skeleton";
import type { Group } from "@/lib/types";

interface BracketPanelProps {
  groups: Group[];
  loading: boolean;
  onTeamClick: (teamId: number) => void;
  title: string;
  flashKeys?: string[];
}

export default function BracketPanel({
  groups,
  loading,
  onTeamClick,
  title,
  flashKeys = [],
}: BracketPanelProps) {
  if (loading) {
    return (
      <section className="space-y-3">
        <h2 className="font-display text-xl tracking-widest text-white">{title}</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl tracking-widest text-white">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => (
          <GroupCard
            key={g.letter}
            group={g}
            onTeamClick={onTeamClick}
            isFlashing={flashKeys.includes(`GROUP_${g.letter}`)}
          />
        ))}
      </div>
    </section>
  );
}
