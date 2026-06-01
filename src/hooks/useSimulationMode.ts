"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getGroupTeamAssignments } from "@/lib/mock-data";
import {
  advanceSimulation,
  createSimulationState,
  TOTAL_SIM_STEPS,
  type SimulationState,
} from "@/lib/simulation";
import type { DashboardData } from "@/lib/types";

export type DashboardMode = "simulate" | "live";

const STEP_DELAY_MS = 2200;
const FLASH_DURATION_MS = 900;

export function useSimulationMode(liveData: DashboardData | null) {
  const [mode, setMode] = useState<DashboardMode>("simulate");
  const [simState, setSimState] = useState<SimulationState | null>(null);
  const [activeFlashKeys, setActiveFlashKeys] = useState<string[]>([]);
  const initializedRef = useRef(false);

  const initSimulation = useCallback(() => {
    const assignments = getGroupTeamAssignments();
    const teams =
      liveData?.teams ??
      Object.fromEntries(
        Object.values(assignments)
          .flat()
          .map((t) => [t.id, t])
      );
    setSimState(createSimulationState(assignments, teams));
    setActiveFlashKeys([]);
  }, [liveData]);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initSimulation();
    }
  }, [initSimulation]);

  const simStep = simState?.step ?? 0;
  const simComplete = simState?.complete ?? false;

  useEffect(() => {
    if (mode !== "simulate" || !simState || simComplete) return;

    const timer = setTimeout(() => {
      setSimState((prev) => {
        if (!prev || prev.complete) return prev;
        const next = advanceSimulation(prev);
        setActiveFlashKeys(next.flashKeys);
        setTimeout(() => setActiveFlashKeys([]), FLASH_DURATION_MS);
        return next;
      });
    }, STEP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [mode, simStep, simComplete, simState]);

  const enterSimulate = useCallback(() => {
    initSimulation();
    setMode("simulate");
  }, [initSimulation]);

  const returnToLive = useCallback(() => {
    setMode("live");
    setActiveFlashKeys([]);
  }, []);

  const displayData: DashboardData | null =
    mode === "live" ? liveData : simState?.dashboard ?? liveData;

  const simProgress = simState
    ? Math.min(100, Math.round((simState.step / TOTAL_SIM_STEPS) * 100))
    : 0;

  return {
    mode,
    displayData,
    simState,
    activeFlashKeys,
    simProgress,
    enterSimulate,
    returnToLive,
  };
}
