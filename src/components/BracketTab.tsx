"use client";

import { useCallback, useState } from "react";
import MatchCardMobile from "./MatchCardMobile";
import Flag from "./Flag";
import { Skeleton } from "./Skeleton";
import type { Group, KnockoutSlot } from "@/lib/types";

const ROUNDS = [
  "Group Stage",
  "Round of 32",
  "Round of 16",
  "Quarter-finals",
  "Semi-finals",
  "Final",
] as const;

interface BracketTabProps {
  groups: Group[];
  slots: KnockoutSlot[];
  loading: boolean;
  onTeamClick: (teamId: number) => void;
  flashKeys?: string[];
}

export default function BracketTab({
  groups,
  slots,
  loading,
  onTeamClick,
  flashKeys = [],
}: BracketTabProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  const round = ROUNDS[roundIndex];

  const roundContent = useCallback(() => {
    if (round === "Group Stage") {
      const qualifiers = groups.flatMap((g) =>
        g.table.filter((r) => r.position <= 2).map((r) => r.team)
      );
      return (
        <div className="flex flex-col gap-6">
          <p className="text-base text-muted">Teams qualified for the knockout stage</p>
          <div className="grid grid-cols-2 gap-3">
            {qualifiers.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => onTeamClick(team.id)}
                className="tap-target surface-card flex items-center gap-3 text-left"
              >
                <Flag team={team} size={32} />
                <span className="text-base text-white">{team.name}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    const roundSlots = slots.filter((s) => s.round === round);
    if (roundSlots.length === 0) {
      return (
        <div className="surface-card flex min-h-[8rem] items-center justify-center">
          <p className="text-base text-muted">Bracket not yet set</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {roundSlots.map((slot) => (
          <div
            key={slot.id}
            className={flashKeys.includes(slot.id) ? "animate-card-flash rounded-card" : ""}
          >
            {slot.match ? (
              <MatchCardMobile
                match={slot.match}
                onTeamClick={onTeamClick}
                animateScore={flashKeys.includes(slot.id)}
              />
            ) : slot.homeTeam && slot.awayTeam ? (
              <MatchCardMobile
                home={slot.homeTeam}
                away={slot.awayTeam}
                onTeamClick={onTeamClick}
              />
            ) : (
              <div className="surface-card flex min-h-[5.5rem] items-center justify-center">
                <p className="text-base text-muted">Awaiting teams</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }, [round, groups, slots, onTeamClick, flashKeys]);

  if (loading) {
    return (
      <div className="px-4 pt-2">
        <Skeleton className="mb-6 h-11 w-full rounded-card" />
        <Skeleton className="h-40 w-full rounded-card" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-2">
      <div className="mb-6 flex gap-3 overflow-x-auto pb-1 scroll-smooth">
        {ROUNDS.map((r, i) => (
          <button
            key={r}
            type="button"
            onClick={() => setRoundIndex(i)}
            className={`tap-target shrink-0 rounded-card px-4 py-2 text-sm font-medium transition-colors ${
              i === roundIndex ? "text-accent" : "text-muted"
            }`}
          >
            {r === "Round of 32"
              ? "R32"
              : r === "Round of 16"
                ? "R16"
                : r === "Quarter-finals"
                  ? "QF"
                  : r === "Semi-finals"
                    ? "SF"
                    : r === "Group Stage"
                      ? "Groups"
                      : "Final"}
          </button>
        ))}
      </div>

      <div className="pb-2">{roundContent()}</div>
    </div>
  );
}
