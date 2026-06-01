"use client";

import { useEffect, useState } from "react";
import Flag from "./Flag";
import type { GoldenStats } from "@/lib/types";
import { Skeleton } from "./Skeleton";

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1000, 1);
      setCount(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <>{count}</>;
}

interface StatsTabProps {
  stats: GoldenStats | null;
  loading: boolean;
  pulse?: boolean;
}

export default function StatsTab({ stats, loading }: StatsTabProps) {
  if (loading || !stats) {
    return (
      <div className="flex flex-col gap-6 px-4 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-card" />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Golden Boot",
      player: stats.goldenBoot.player,
      team: stats.goldenBoot.team,
      value: stats.goldenBoot.value,
      unit: "goals",
    },
    {
      label: "Playmaker",
      player: stats.goldenAssist.player,
      team: stats.goldenAssist.team,
      value: stats.goldenAssist.value,
      unit: "assists",
    },
    {
      label: "Golden Glove",
      player: stats.goldenGlove.player,
      team: stats.goldenGlove.team,
      value: stats.goldenGlove.cleanSheets,
      unit: "clean sheets",
    },
    {
      label: "Disciplinary",
      player: stats.disciplinary.player,
      team: stats.disciplinary.team,
      value: stats.disciplinary.yellowCards,
      unit: "bookings",
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-4 pt-2 pb-4">
      {items.map((item) => (
        <article key={item.label} className="surface-card">
          <p className="section-label mb-4">{item.label}</p>
          <div className="flex items-center gap-4">
            <Flag team={item.team} size={48} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold tracking-tight text-white">
                {item.player}
              </p>
              <p className="text-base text-muted">{item.team.name}</p>
            </div>
            <div className="text-right">
              <p className="tabular-nums text-3xl font-semibold tracking-tight text-white">
                <AnimatedCounter value={item.value} />
              </p>
              <p className="mt-1 text-sm text-muted">{item.unit}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
