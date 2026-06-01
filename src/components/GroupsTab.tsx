"use client";

import { useCallback, useRef, useState } from "react";
import GroupCardMobile from "./GroupCardMobile";
import { Skeleton } from "./Skeleton";
import type { Group } from "@/lib/types";

interface GroupsTabProps {
  groups: Group[];
  loading: boolean;
  onTeamClick: (teamId: number) => void;
  flashKeys?: string[];
}

export default function GroupsTab({
  groups,
  loading,
  onTeamClick,
  flashKeys = [],
}: GroupsTabProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || groups.length === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(Math.min(Math.max(index, 0), groups.length - 1));
  }, [groups.length]);

  if (loading) {
    return (
      <div className="px-4 pt-2">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-[22rem] w-full rounded-card" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-2">
      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {groups.map((g, i) => (
          <button
            key={g.letter}
            type="button"
            onClick={() => {
              scrollRef.current?.scrollTo({
                left: i * scrollRef.current.clientWidth,
                behavior: "smooth",
              });
              setActiveIndex(i);
            }}
            className={`tap-target min-h-[44px] min-w-[44px] rounded-card px-4 text-sm font-medium transition-colors ${
              i === activeIndex ? "text-accent" : "text-muted"
            }`}
          >
            {g.letter}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="snap-carousel flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {groups.map((group) => (
          <div
            key={group.letter}
            className="w-full shrink-0 snap-center snap-always"
          >
            <GroupCardMobile
              group={group}
              onTeamClick={onTeamClick}
              isFlashing={flashKeys.includes(`GROUP_${group.letter}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
