"use client";

import { useCallback, useEffect, useState } from "react";
import { getMockDashboard } from "@/lib/mock-data";
import type { DashboardData } from "@/lib/types";

const POLL_MS = 3_600_000;

function fallbackData(): DashboardData & { fetchedAt: number } {
  return { ...getMockDashboard(), fetchedAt: Date.now() };
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.groups?.length) throw new Error("Empty dashboard");
      setData(json);
      setFetchedAt(json.fetchedAt ?? Date.now());
    } catch {
      const mock = fallbackData();
      setData(mock);
      setFetchedAt(mock.fetchedAt);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const poll = setInterval(fetchData, POLL_MS);
    return () => clearInterval(poll);
  }, [fetchData]);

  useEffect(() => {
    if (!fetchedAt) return;
    const tick = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - fetchedAt) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [fetchedAt]);

  return { data, loading, secondsAgo, refresh: fetchData };
}
