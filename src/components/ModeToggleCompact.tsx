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
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${isSimulate ? "bg-muted" : "bg-accent"}`}
          aria-hidden
        />
        <span className={`text-xs font-medium ${isSimulate ? "text-muted" : "text-accent"}`}>
          {isSimulate ? "SIM" : "LIVE"}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSimulate}
          className={`rounded-card border bg-surface px-3 py-2 text-sm font-medium transition-colors ${
            isSimulate ? "border-accent text-white" : "border-border text-muted"
          }`}
        >
          Simulate
        </button>
        <button
          type="button"
          onClick={onLive}
          className={`rounded-card border bg-surface px-3 py-2 text-sm font-medium transition-colors ${
            !isSimulate ? "border-accent text-white" : "border-border text-muted"
          }`}
        >
          Live Data
        </button>
      </div>
    </div>
  );
}
