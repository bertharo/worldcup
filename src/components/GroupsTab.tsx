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

  const goToGroup = (i: number) => {
    scrollRef.current?.scrollTo({
      left: i * (scrollRef.current?.clientWidth ?? 0),
      behavior: "smooth",
    });
    setActiveIndex(i);
  };

  if (loading) {
    return (
      <div className="px-4">
        <Skeleton className="mb-6 h-8 w-full" />
        <Skeleton className="h-[22rem] w-full rounded-card" />
      </div>
    );
  }

  return (
    <div>
      <div
        className="snap-carousel mb-6 flex gap-8 overflow-x-auto scroll-smooth px-4 pb-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {groups.map((g, i) => (
          <button
            key={g.letter}
            type="button"
            onClick={() => goToGroup(i)}
            className={`relative shrink-0 pb-2 text-sm font-medium transition-colors ${
              i === activeIndex ? "text-white" : "text-muted"
            }`}
          >
            {g.letter}
            {i === activeIndex && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="snap-carousel flex snap-x snap-mandatory overflow-x-auto scroll-smooth px-4"
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
