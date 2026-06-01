import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/football-data";
import { getMockDashboard } from "@/lib/mock-data";

export const revalidate = 86400;

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json({ ...data, fetchedAt: Date.now() });
  } catch {
    return NextResponse.json({ ...getMockDashboard(), fetchedAt: Date.now() });
  }
}
