import { NextResponse } from "next/server";
import { getTeamIntelligence } from "@/lib/team-intelligence";

export const revalidate = 86400; // refresh squad/intel data daily

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "Team id required" }, { status: 400 });
  }

  const intel = getTeamIntelligence(id);
  if (!intel) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json(intel);
}
