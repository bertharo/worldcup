"use client";

import { useCallback, useState } from "react";
import BottomNav, { type TabId } from "@/components/BottomNav";
import BracketTab from "@/components/BracketTab";
import GroupsTab from "@/components/GroupsTab";
import ModeToggleCompact from "@/components/ModeToggleCompact";
import StatsTab from "@/components/StatsTab";
import TeamBottomSheet from "@/components/TeamBottomSheet";
import TeamSearchSheet from "@/components/TeamSearchSheet";
import { useDashboard } from "@/hooks/useDashboard";
import { useSimulationMode } from "@/hooks/useSimulationMode";
import type { TeamIntelligence } from "@/lib/types";

export default function Dashboard() {
  const { data: liveData, loading, secondsAgo } = useDashboard();
  const {
    mode,
    displayData,
    activeFlashKeys,
    enterSimulate,
    returnToLive,
  } = useSimulationMode(liveData);

  const [tab, setTab] = useState<TabId>("groups");
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [intel, setIntel] = useState<TeamIntelligence | null>(null);
  const [intelLoading, setIntelLoading] = useState(false);

  const isSimulate = mode === "simulate";
  const data = displayData;
  const isLoading = loading && !data;

  const handleTeamClick = useCallback(
    async (teamId: number) => {
      setSelectedTeamId(teamId);
      setIntelLoading(true);
      try {
        const res = await fetch(
          `/api/team?id=${teamId}&simulate=${isSimulate ? "1" : "0"}`
        );
        setIntel(await res.json());
      } finally {
        setIntelLoading(false);
      }
    },
    [isSimulate]
  );

  const handleCloseSheet = useCallback(() => {
    setSelectedTeamId(null);
    setIntel(null);
  }, []);

  const teams = data ? Object.values(data.teams) : [];

  return (
    <div className="flex min-h-screen flex-col bg-bg pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-30 border-b border-border bg-bg px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="section-label">World Cup 2026</p>
            <h1 className="truncate text-xl font-semibold tracking-tight text-white">
              Live Bracket
            </h1>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <ModeToggleCompact
              mode={mode}
              onSimulate={enterSimulate}
              onLive={returnToLive}
            />
            {!isSimulate && (
              <p className="text-sm text-muted">
                Updated {secondsAgo}s ago
                {liveData?.drawDate && (
                  <span className="block text-xs text-muted/80">
                    Draw {liveData.drawDate}
                    {liveData.dataUpdatedAt && (
                      <> · Squads {liveData.dataUpdatedAt.slice(0, 10)}</>
                    )}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="py-6 pb-4">
        {tab === "groups" && (
          <GroupsTab
            groups={data?.groups ?? []}
            loading={isLoading}
            onTeamClick={handleTeamClick}
            flashKeys={activeFlashKeys}
          />
        )}
        {tab === "bracket" && (
          <BracketTab
            groups={data?.groups ?? []}
            slots={data?.knockout ?? []}
            loading={isLoading}
            onTeamClick={handleTeamClick}
            flashKeys={activeFlashKeys}
          />
        )}
        {tab === "stats" && (
          <StatsTab stats={data?.stats ?? null} loading={isLoading} />
        )}
        {tab === "search" && (
          <TeamSearchSheet
            teams={teams}
            onSelect={handleTeamClick}
            onClose={() => setTab("groups")}
          />
        )}
      </main>

      <BottomNav
        active={tab === "search" ? "search" : tab}
        onChange={(t) => setTab(t)}
      />

      {selectedTeamId !== null && (
        <TeamBottomSheet
          intel={intel}
          loading={intelLoading}
          onClose={handleCloseSheet}
        />
      )}
    </div>
  );
}
