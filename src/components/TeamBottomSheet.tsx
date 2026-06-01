"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Flag from "./Flag";
import PitchFormationMobile from "./PitchFormationMobile";
import { flagEmoji } from "@/lib/flags";
import { formatKickoff, formatScoreline, formatShortDate, isLive } from "@/lib/format";
import type { TeamIntelligence } from "@/lib/types";

interface TeamBottomSheetProps {
  intel: TeamIntelligence | null;
  loading: boolean;
  onClose: () => void;
}

const SECTIONS = ["Fixtures", "Form", "H2H", "Formation"] as const;

const FORM_PILL: Record<"W" | "D" | "L", string> = {
  W: "bg-[#22c55e] text-white",
  D: "bg-[#6B6B6B] text-white",
  L: "bg-[#ef4444] text-white",
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

  const fixture = intel?.nextFixture;
  const opponent = fixture
    ? fixture.homeTeam.id === intel!.team.id
      ? fixture.awayTeam
      : fixture.homeTeam
    : null;

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
              <div className="flex items-center gap-3">
                <Flag team={intel.team} size={32} />
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-white">
                    {intel.team.name}
                  </h2>
                  <p className="text-sm text-muted">{intel.team.manager}</p>
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
                    className={`tap-target shrink-0 pb-1 text-sm font-medium ${
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
              {/* Fixtures */}
              <section className="w-full shrink-0 snap-center snap-always p-4">
                {fixture && opponent ? (
                  <div className="py-2">
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-[32px] leading-none" role="img" aria-label={intel.team.name}>
                        {flagEmoji(intel.team.tla)}
                      </span>
                      <span className="text-sm text-muted">vs</span>
                      <span className="text-[32px] leading-none" role="img" aria-label={opponent.name}>
                        {flagEmoji(opponent.tla)}
                      </span>
                    </div>

                    <p className="mt-4 text-center text-[28px] font-bold leading-tight text-white">
                      {fixture.status === "FINISHED" &&
                      fixture.score.home !== null &&
                      fixture.score.away !== null
                        ? formatScoreline(fixture.score.home, fixture.score.away)
                        : isLive(fixture.status) &&
                            fixture.score.home !== null &&
                            fixture.score.away !== null
                          ? formatScoreline(fixture.score.home, fixture.score.away)
                          : formatKickoff(fixture.utcDate)}
                    </p>

                    {isLive(fixture.status) && (
                      <p className="mt-1 text-center text-xs font-medium text-accent">LIVE</p>
                    )}

                    {(fixture.venue || fixture.city) && (
                      <p className="mt-2 text-center text-sm text-muted">
                        {[fixture.venue, fixture.city].filter(Boolean).join(" · ")}
                      </p>
                    )}

                    <p className="mt-4 text-center text-base text-white">
                      {opponent.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-base text-muted">No upcoming fixture</p>
                )}

                <div className="mt-8 border-t border-border pt-4">
                  <p className="mb-2 text-xs text-muted">Key player</p>
                  <p className="text-base font-semibold text-white">{intel.keyPlayer.name}</p>
                  <div className="mt-2 flex gap-6 text-sm text-muted">
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

              {/* Form */}
              <section className="w-full shrink-0 snap-center snap-always p-4">
                {intel.formGuide.length === 0 ? (
                  <p className="text-base text-muted">No recent results</p>
                ) : (
                  <div className="divide-y divide-border">
                    {intel.formGuide.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 py-3"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${FORM_PILL[f.result]}`}
                        >
                          {f.result}
                        </span>
                        <Flag team={f.opponent} size={24} />
                        <span className="min-w-0 flex-1 truncate text-base text-white">
                          {f.opponent.name}
                        </span>
                        <span className="tabular-nums shrink-0 text-base font-medium text-white">
                          {f.score}
                        </span>
                        <span className="shrink-0 text-sm text-muted">{f.homeAway}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* H2H */}
              <section className="w-full shrink-0 snap-center snap-always p-4">
                <div className="divide-y divide-border">
                  {intel.headToHead.map((m, i) => {
                    const winner =
                      m.homeTeam.tla === intel.team.tla && m.result === "W"
                        ? m.homeTeam
                        : m.awayTeam.tla === intel.team.tla && m.result === "W"
                          ? m.awayTeam
                          : m.result === "D"
                            ? null
                            : m.homeTeam.tla === intel.team.tla
                              ? m.awayTeam
                              : m.homeTeam;

                    return (
                      <div key={i} className="py-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-muted">{formatShortDate(m.date)}</p>
                          {winner && <Flag team={winner} size={20} />}
                        </div>
                        <p className="tabular-nums mt-1 text-center text-lg font-bold text-white">
                          {m.score}
                        </p>
                        <p className="mt-0.5 text-center text-xs text-muted">{m.competition}</p>
                        <p className="mt-1 text-center text-xs text-muted">
                          {m.homeTeam.name} vs {m.awayTeam.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Formation */}
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
