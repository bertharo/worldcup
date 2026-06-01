"use client";

export type TabId = "groups" | "bracket" | "stats" | "search";

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "groups", label: "Groups" },
  { id: "bracket", label: "Bracket" },
  { id: "stats", label: "Stats" },
];

function TabIcon({ id, active }: { id: TabId; active: boolean }) {
  const color = active ? "#2563EB" : "#6B6B6B";
  if (id === "groups") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  if (id === "bracket") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 6h6v4H8v8H4V6z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 6h6v6h-4v6h-2V6z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === "stats") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 19V9M12 19V5M19 19v-7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6" stroke={color} strokeWidth="1.5" />
      <path d="M16 16l4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`tap-target flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
              active === tab.id ? "text-accent" : "text-muted"
            }`}
          >
            <TabIcon id={tab.id} active={active === tab.id} />
            {tab.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange("search")}
          className={`tap-target flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
            active === "search" ? "text-accent" : "text-muted"
          }`}
          aria-label="Search teams"
        >
          <TabIcon id="search" active={active === "search"} />
          Search
        </button>
      </div>
    </nav>
  );
}
