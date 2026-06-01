"use client";

import type { DashboardMode } from "@/hooks/useSimulationMode";

interface ModeToggleProps {
  mode: DashboardMode;
  onSimulate: () => void;
  onLive: () => void;
}

export default function ModeToggle({ mode, onSimulate, onLive }: ModeToggleProps) {
  const isSimulate = mode === "simulate";

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-[10px] uppercase tracking-widest text-zinc-500 sm:inline">
        Data Mode
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isSimulate}
        aria-label={isSimulate ? "Simulation mode active" : "Live data mode active"}
        onClick={() => (isSimulate ? onLive() : onSimulate())}
        className={`relative flex h-10 w-[11.5rem] items-center rounded-full border p-1 transition-all duration-300 ease-in-out ${
          isSimulate
            ? "border-amber-500/40 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            : "border-red-500/30 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.12)]"
        }`}
      >
        <span
          className={`absolute top-1 h-8 w-[5.25rem] rounded-full transition-all duration-300 ease-in-out ${
            isSimulate
              ? "left-1 bg-amber-500/25"
              : "left-[calc(100%-5.25rem-0.25rem)] bg-red-500/20"
          }`}
        />
        <span
          className={`relative z-10 flex flex-1 items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
            isSimulate ? "text-amber-300" : "text-zinc-500"
          }`}
        >
          <span aria-hidden>⚡</span>
          Simulate
        </span>
        <span
          className={`relative z-10 flex flex-1 items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
            !isSimulate ? "text-red-400" : "text-zinc-500"
          }`}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden />
          Live
        </span>
      </button>
    </div>
  );
}
