"use client";

import { useMemo, useState } from "react";
import Flag from "./Flag";
import type { Team } from "@/lib/types";

interface TeamSearchSheetProps {
  teams: Team[];
  onSelect: (teamId: number) => void;
  onClose: () => void;
}

export default function TeamSearchSheet({
  teams,
  onSelect,
  onClose,
}: TeamSearchSheetProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = Object.values(
      teams.reduce<Record<number, Team>>((acc, t) => {
        acc[t.id] = t;
        return acc;
      }, {})
    );
    if (!q) return list.sort((a, b) => a.name.localeCompare(b.name));
    return list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tla.toLowerCase().includes(q)
    );
  }, [teams, query]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
      <header className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams…"
            autoFocus
            className="tap-target h-12 flex-1 rounded-card border border-border bg-surface px-4 text-base text-white placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="tap-target px-2 text-base font-medium text-muted"
          >
            Done
          </button>
        </div>
      </header>
      <ul className="flex-1 overflow-y-auto px-4 py-2">
        {filtered.map((team, index) => (
          <li key={team.id}>
            <button
              type="button"
              onClick={() => {
                onSelect(team.id);
                onClose();
              }}
              className={`tap-target flex w-full items-center gap-4 border-b border-border py-3 text-left ${
                index % 2 === 1 ? "bg-row-alt" : ""
              }`}
            >
              <Flag team={team} size={36} />
              <span className="text-base text-white">{team.name}</span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-base text-muted">No teams found</p>
        )}
      </ul>
    </div>
  );
}
