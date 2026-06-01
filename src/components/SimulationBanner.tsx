"use client";

interface SimulationBannerProps {
  phaseLabel: string;
  progress: number;
  onReturnToLive: () => void;
}

export default function SimulationBanner({
  phaseLabel,
  progress,
  onReturnToLive,
}: SimulationBannerProps) {
  return (
    <div className="border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent px-4 py-3">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="shrink-0 text-lg" aria-hidden>
            ⚡
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm tracking-widest text-amber-300 sm:text-base">
              Simulation Mode — Not Real Results
            </p>
            <p className="truncate text-xs text-amber-200/60">{phaseLabel}</p>
          </div>
          <div className="hidden h-1.5 flex-1 max-w-[8rem] overflow-hidden rounded-full bg-amber-900/40 sm:block">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onReturnToLive}
          className="shrink-0 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 ease-in-out hover:border-electric/50 hover:bg-electric/10 hover:shadow-[0_0_16px_rgba(0,180,255,0.2)]"
        >
          Return to Live Data
        </button>
      </div>
    </div>
  );
}
