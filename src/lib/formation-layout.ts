import type { SquadPlayer } from "./types";

export interface LineupPlayer {
  name: string;
  number: number;
  position: "GK" | "DF" | "MF" | "FW";
}

function lineCoords(count: number, y: number): { x: number; y: number }[] {
  const margin = 14;
  if (count <= 0) return [];
  if (count === 1) return [{ x: 50, y }];
  const step = (100 - 2 * margin) / (count - 1);
  return Array.from({ length: count }, (_, i) => ({ x: margin + i * step, y }));
}

/** Map formation string → pitch coordinates (GK excluded). */
function formationCoords(formation: string): { x: number; y: number }[] {
  const lines = formation.split("-").map((n) => parseInt(n, 10));
  const depth = lines.length;
  const yStart = 78;
  const yEnd = 20;
  const yStep = depth > 1 ? (yStart - yEnd) / (depth - 1) : 0;

  const coords: { x: number; y: number }[] = [{ x: 50, y: 92 }];
  lines.forEach((count, i) => {
    const y = Math.round(yStart - i * yStep);
    lineCoords(count, y).forEach((c) => coords.push(c));
  });
  return coords;
}

/** Build positioned squad from formation + ordered XI (GK first, back to front). */
export function buildSquad(formation: string, lineup: LineupPlayer[]): SquadPlayer[] {
  const coords = formationCoords(formation);
  return lineup.slice(0, 11).map((p, i) => ({
    name: p.name,
    number: p.number,
    position: p.position,
    x: coords[i]?.x ?? 50,
    y: coords[i]?.y ?? 50,
  }));
}
