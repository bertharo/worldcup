"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Flag from "./Flag";
import PitchFormationMobile from "./PitchFormationMobile";
import { formatKickoff, formatShortDate } from "@/lib/format";
import type { TeamIntelligence } from "@/lib/types";

interface TeamBottomSheetProps {
  intel: TeamIntelligence | null;
  loading: boolean;
  onClose: () => void;
}

const SECTIONS = ["Fixtures", "Form", "H2H", "Formation"] as const;

const RESULT_STYLES = {
  W: "border-border text-white",
  D: "border-border text-muted",
  L: "border-border text-muted",
};

export default function TeamBottomSheet({
  intel,
  loading,
  onClose,
}: TeamBottomSheetProps) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const onSectionScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setSectionIndex(Math.min(Math.max(index, 0), SECTIONS.length - 1));
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - dragStartY.current;
    if (delta > 80) onClose();
    dragStartY.current = null;
  };

  if (!intel && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="relative z-10 max-h-[88vh] rounded-t-xl border-t border-border bg-surface animate-sheet-up"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-center py-3">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        {loading || !intel ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border border-border border-t-accent" />
          </div>
        ) : (
          <>
            <header className="border-b border-border px-4 pb-4">
              <div className="flex items-center gap-4">
                <Flag team={intel.team} size={44} />
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-white">
                    {intel.team.name}
                  </h2>
                  <p className="text-base text-muted">{intel.team.manager}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {SECTIONS.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      scrollRef.current?.scrollTo({
                        left: i * (scrollRef.current?.clientWidth ?? 0),
                        behavior: "smooth",
                      });
                      setSectionIndex(i);
                    }}
                    className={`tap-target shrink-0 rounded-card px-4 py-2 text-sm font-medium ${
                      i === sectionIndex ? "text-accent" : "text-muted"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </header>

            <div
              ref={scrollRef}
              onScroll={onSectionScroll}
              className="snap-carousel flex max-h-[60vh] snap-x snap-mandatory overflow-x-auto overflow-y-auto scroll-smooth"
            >
              <section className="w-full shrink-0 snap-center snap-always p-4">
                {intel.nextFixture ? (
                  <div className="surface-card">
                    <p className="section-label mb-4">Next fixture</p>
                    <div className="flex items-center justify-center gap-6 py-2">
                      <Flag team={intel.team} size={44} />
                      <span className="text-base text-muted">vs</span>
                      <Flag
                        team={
                          intel.nextFixture.awayTeam.id === intel.team.id
                            ? intel.nextFixture.homeTeam
                            : intel.nextFixture.awayTeam
                        }
                        size={44}
                      />
                    </div>
                    <p className="mt-4 text-center text-base font-medium text-white">
                      {intel.nextFixture.awayTeam.id === intel.team.id
                        ? intel.nextFixture.homeTeam.name
                        : intel.nextFixture.awayTeam.name}
                    </p>
                    <p className="mt-2 text-center text-base text-muted">
                      {formatKickoff(intel.nextFixture.utcDate)}
                    </p>
                  </div>
                ) : (
                  <p className="text-base text-muted">No upcoming fixture</p>
                )}
                <div className="mt-6 surface-card">
                  <p className="section-label mb-3">Key player</p>
                  <p className="text-base font-semibold text-white">{intel.keyPlayer.name}</p>
                  <div className="mt-3 flex gap-6 text-base text-muted">
                    <span>
                      <strong className="tabular-nums text-white">{intel.keyPlayer.goals}</strong> goals
                    </span>
                    <span>
                      <strong className="tabular-nums text-white">{intel.keyPlayer.assists}</strong> assists
                    </span>
                    <span>
                      <strong className="tabular-nums text-white">{intel.keyPlayer.minutes}</strong>&apos;
                    </span>
                  </div>
                </div>
              </section>

              <section className="w-full shrink-0 snap-center snap-always p-4">
                <p className="section-label mb-4">Form guide</p>
                {intel.formGuide.length === 0 ? (
                  <p className="text-base text-muted">No recent results</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {intel.formGuide.map((f, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-card border p-4 ${RESULT_STYLES[f.result]}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base font-semibold">{f.result}</span>
                          <Flag team={f.opponent} size={28} />
                          <span className="text-base">{f.opponent.tla}</span>
                        </div>
                        <div className="text-right">
                          <p className="tabular-nums text-base font-medium">{f.score}</p>
                          <p className="text-sm text-muted">
                            {f.homeAway} · {f.competition}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="w-full shrink-0 snap-center snap-always p-4">
                <p className="section-label mb-4">Head-to-head</p>
                <div className="flex flex-col gap-3">
                  {intel.headToHead.map((m, i) => (
                    <div
                      key={i}
                      className={`rounded-card border p-4 ${RESULT_STYLES[m.result]}`}
                    >
                      <p className="text-sm text-muted">{formatShortDate(m.date)}</p>
                      <p className="tabular-nums my-2 text-xl font-semibold tracking-tight">
                        {m.score}
                      </p>
                      <p className="text-base text-muted">{m.competition}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="w-full shrink-0 snap-center snap-always p-4">
                <PitchFormationMobile
                  formation={intel.team.formation}
                  manager={intel.team.manager}
                  squad={intel.squad}
                />
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
