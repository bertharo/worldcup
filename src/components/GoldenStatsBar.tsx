"use client";

import { useEffect, useState } from "react";
import Flag from "./Flag";
import type { GoldenStats } from "@/lib/types";
import { Skeleton } from "./Skeleton";

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return <>{count}</>;
}

interface GoldenStatsBarProps {
  stats: GoldenStats | null;
  loading: boolean;
  pulse?: boolean;
}

export default function GoldenStatsBar({ stats, loading, pulse }: GoldenStatsBarProps) {
  if (loading || !stats) {
    return (
      <aside className="flex w-full flex-col gap-4 lg:w-72 lg:shrink-0">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </aside>
    );
  }

  const items = [
    {
      label: "adidas Golden Boot",
      sub: "Top Goalscorer",
      player: stats.goldenBoot.player,
      team: stats.goldenBoot.team,
      stat: stats.goldenBoot.value,
      unit: "goals",
    },
    {
      label: "Playmaker Award",
      sub: "Most Assists",
      player: stats.goldenAssist.player,
      team: stats.goldenAssist.team,
      stat: stats.goldenAssist.value,
      unit: "assists",
    },
    {
      label: "adidas Golden Glove",
      sub: "Best Goalkeeper",
      player: stats.goldenGlove.player,
      team: stats.goldenGlove.team,
      stat: stats.goldenGlove.cleanSheets,
      unit: `${stats.goldenGlove.saves} saves`,
    },
    {
      label: "Disciplinary Watch",
      sub: "Most Bookings",
      player: stats.disciplinary.player,
      team: stats.disciplinary.team,
      stat: stats.disciplinary.yellowCards,
      unit: `🟨 ${stats.disciplinary.yellowCards} · 🟥 ${stats.disciplinary.redCards}`,
    },
  ];

  return (
    <aside className="flex w-full flex-col gap-3 lg:w-72 lg:shrink-0">
      {items.map((item) => (
        <div
          key={item.label}
          className={`glass-card p-4 transition-all duration-300 ease-in-out hover:glow-gold ${
            pulse ? "animate-stat-pulse" : ""
          }`}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-electric">{item.label}</p>
          <p className="text-[10px] text-zinc-500">{item.sub}</p>
          <div className="mt-3 flex items-center gap-3">
            <Flag team={item.team} size={32} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base tracking-wide text-white">
                {item.player}
              </p>
              <p className="text-xs text-zinc-400">{item.team.name}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl text-gold">
                <AnimatedCounter value={item.stat} />
              </p>
              <p className="text-[10px] text-zinc-500">{item.unit}</p>
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
}
