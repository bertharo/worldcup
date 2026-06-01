import Flag from "./Flag";
import MatchSlot from "./MatchSlot";
import type { KnockoutSlot, Team } from "@/lib/types";

interface KnockoutBracketProps {
  slots: KnockoutSlot[];
  onTeamClick: (teamId: number) => void;
  flashKeys?: string[];
}

const ROUND_ORDER = ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Final"];

function PendingSlot({
  home,
  away,
  onTeamClick,
  isFlashing,
}: {
  home: Team;
  away: Team;
  onTeamClick: (id: number) => void;
  isFlashing?: boolean;
}) {
  return (
    <div
      className={`glass-card p-2 transition-all duration-300 ease-in-out ${
        isFlashing ? "animate-card-flash ring-1 ring-amber-400/40" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onTeamClick(home.id)}
          className="flex flex-1 items-center gap-1.5 text-left text-xs transition-all duration-300 hover:text-gold"
        >
          <Flag team={home} size={18} />
          <span className="truncate">{home.name}</span>
        </button>
        <span className="min-w-[2.5rem] text-center font-display text-base font-bold text-zinc-500">
          TBD
        </span>
        <button
          type="button"
          onClick={() => onTeamClick(away.id)}
          className="flex flex-1 items-center justify-end gap-1.5 text-right text-xs transition-all duration-300 hover:text-gold"
        >
          <span className="truncate">{away.name}</span>
          <Flag team={away} size={18} />
        </button>
      </div>
    </div>
  );
}

export default function KnockoutBracket({
  slots,
  onTeamClick,
  flashKeys = [],
}: KnockoutBracketProps) {
  const rounds = ROUND_ORDER.map((round) => ({
    round,
    slots: slots.filter((s) => s.round === round),
  })).filter((r) => r.slots.length > 0);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-6">
        {rounds.map(({ round, slots: roundSlots }) => (
          <div key={round} className="flex w-56 flex-col gap-3">
            <h3 className="font-display text-sm uppercase tracking-[0.25em] text-electric">
              {round}
            </h3>
            {roundSlots.map((slot) => {
              const isFlashing = flashKeys.includes(slot.id);

              if (slot.match) {
                return (
                  <div
                    key={slot.id}
                    className={`relative ${isFlashing ? "animate-card-flash" : ""}`}
                  >
                    <MatchSlot
                      match={slot.match}
                      compact
                      onTeamClick={onTeamClick}
                      animateScore={isFlashing}
                    />
                    {slot.nextSlotId && (
                      <div className="absolute -right-3 top-1/2 hidden h-px w-3 bg-electric/40 lg:block" />
                    )}
                  </div>
                );
              }

              if (slot.homeTeam && slot.awayTeam) {
                return (
                  <div key={slot.id} className="relative">
                    <PendingSlot
                      home={slot.homeTeam}
                      away={slot.awayTeam}
                      onTeamClick={onTeamClick}
                      isFlashing={isFlashing}
                    />
                    {slot.nextSlotId && (
                      <div className="absolute -right-3 top-1/2 hidden h-px w-3 bg-electric/40 lg:block" />
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={slot.id}
                  className={`glass-card border-dashed p-3 text-center text-xs text-zinc-600 transition-all duration-300 ${
                    isFlashing ? "animate-card-flash border-amber-400/30" : ""
                  }`}
                >
                  TBD
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
