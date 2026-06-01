"use client";

import type { DashboardMode } from "@/hooks/useSimulationMode";

interface ModeToggleCompactProps {
  mode: DashboardMode;
  onSimulate: () => void;
  onLive: () => void;
}

export default function ModeToggleCompact({
  mode,
  onSimulate,
  onLive,
}: ModeToggleCompactProps) {
  const isSimulate = mode === "simulate";

  return (
    <div
      className="flex overflow-hidden rounded-full border border-accent"
      role="group"
      aria-label="Data mode"
    >
      <button
        type="button"
        onClick={onSimulate}
        className={`tap-target px-4 py-2 text-sm font-medium transition-colors ${
          isSimulate ? "bg-accent text-white" : "bg-transparent text-muted"
        }`}
      >
        Sim
      </button>
      <button
        type="button"
        onClick={onLive}
        className={`tap-target px-4 py-2 text-sm font-medium transition-colors ${
          !isSimulate ? "bg-accent text-white" : "bg-transparent text-muted"
        }`}
      >
        Live
      </button>
    </div>
  );
}
