"use client";

import { useState } from "react";
import { flagUrl } from "@/lib/flags";
import type { Team } from "@/lib/types";

interface FlagProps {
  team: Team;
  size?: number;
  className?: string;
}

export default function Flag({ team, size = 24, className = "" }: FlagProps) {
  const [failed, setFailed] = useState(false);
  const height = Math.round(size * 0.67);

  if (failed) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-sm border border-border bg-surface text-[10px] font-medium text-muted ${className}`}
        style={{ width: size, height }}
        aria-label={`${team.name} flag`}
      >
        {team.tla}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagUrl(team.tla, size * 2)}
      alt={`${team.name} flag`}
      width={size}
      height={height}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`inline-block shrink-0 rounded-sm object-cover ${className}`}
    />
  );
}
