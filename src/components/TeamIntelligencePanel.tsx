"use client";

import { useEffect, useCallback } from "react";
import Flag from "./Flag";
import PitchFormation from "./PitchFormation";
import { formatKickoff, formatShortDate } from "@/lib/format";
import type { TeamIntelligence } from "@/lib/types";

interface TeamIntelligencePanelProps {
  intel: TeamIntelligence | null;
  loading: boolean;
  onClose: () => void;
}

const RESULT_COLORS = {
  W: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  D: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  L: "bg-red-500/20 text-red-400 border-red-500/40",
};

export default function TeamIntelligencePanel({
  intel,
  loading,
  onClose,
}: TeamIntelligencePanelProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!intel && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-stretch">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-label="Close panel"
      />
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-y-auto bg-[#0d0d14] shadow-2xl transition-transform duration-300 ease-in-out sm:border-l sm:border-white/10">
        {loading || !intel ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric border-t-transparent" />
          </div>
        ) : (
          <>
            <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0d0d14]/95 p-6 backdrop-blur">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-white"
              >
                ✕
              </button>
              <div className="flex items-center gap-4">
                <Flag team={intel.team} size={48} />
                <div>
                  <h2 className="font-display text-2xl tracking-wider text-white">
                    {intel.team.name}
                  </h2>
                  <p className="text-sm text-zinc-500">Team Intelligence</p>
                </div>
              </div>
            </header>

            <div className="space-y-6 p-6">
              {intel.nextFixture && (
                <section className="glass-card p-4">
                  <h3 className="mb-3 text-xs uppercase tracking-widest text-electric">Next Fixture</h3>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Flag team={intel.team} size={28} />
                      <span className="font-display text-lg">vs</span>
                      <Flag team={intel.nextFixture.awayTeam.id === intel.team.id ? intel.nextFixture.homeTeam : intel.nextFixture.awayTeam} size={28} />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-white">
                    {intel.nextFixture.awayTeam.id === intel.team.id
                      ? intel.nextFixture.homeTeam.name
                      : intel.nextFixture.awayTeam.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {formatKickoff(intel.nextFixture.utcDate)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {[intel.nextFixture.venue, intel.nextFixture.city].filter(Boolean).join(" · ")}
                  </p>
                </section>
              )}

              <section className="glass-card p-4">
                <h3 className="mb-3 text-xs uppercase tracking-widest text-electric">
                  Head-to-Head — Last 5 Meetings
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {intel.headToHead.map((m, i) => (
                    <div
                      key={i}
                      className={`min-w-[7rem] shrink-0 rounded-lg border p-2 text-center ${RESULT_COLORS[m.result]}`}
                    >
                      <p className="text-[10px] text-zinc-400">{formatShortDate(m.date)}</p>
                      <p className="my-1 font-display text-sm font-bold">{m.score}</p>
                      <p className="truncate text-[9px]">{m.competition}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-card p-4">
                <PitchFormation
                  formation={intel.team.formation}
                  manager={intel.team.manager}
                  squad={intel.squad}
                />
              </section>

              <section className="glass-card p-4">
                <h3 className="mb-3 text-xs uppercase tracking-widest text-electric">Form Guide</h3>
                <div className="flex flex-wrap gap-2">
                  {intel.formGuide.map((f, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border px-3 py-2 text-center ${RESULT_COLORS[f.result]}`}
                    >
                      <span className="font-display text-lg font-bold">{f.result}</span>
                      <p className="text-xs font-bold">{f.score}</p>
                      <div className="mt-1 flex items-center justify-center gap-1">
                        <Flag team={f.opponent} size={14} />
                        <span className="text-[10px] text-zinc-400">{f.homeAway}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-card p-4">
                <h3 className="mb-3 text-xs uppercase tracking-widest text-electric">Key Player</h3>
                <p className="font-display text-xl text-white">{intel.keyPlayer.name}</p>
                <div className="mt-2 flex gap-4 text-sm text-zinc-400">
                  <span><strong className="text-gold">{intel.keyPlayer.goals}</strong> goals</span>
                  <span><strong className="text-gold">{intel.keyPlayer.assists}</strong> assists</span>
                  <span><strong className="text-gold">{intel.keyPlayer.minutes}</strong>&apos; played</span>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
