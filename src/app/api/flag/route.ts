import { NextResponse } from "next/server";

const ALLOWED = /^[a-z]{2}(-[a-z]{2,3})?$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") ?? "";
  const w = searchParams.get("w") ?? "80";

  if (!ALLOWED.test(code)) {
    return NextResponse.json({ error: "Invalid flag code" }, { status: 400 });
  }
  if (!/^\d{1,4}$/.test(w)) {
    return NextResponse.json({ error: "Invalid width" }, { status: 400 });
  }

  try {
    const upstream = await fetch(`https://flagcdn.com/w${w}/${code}.png`, {
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return new NextResponse(null, { status: upstream.status });
    }

    const body = await upstream.arrayBuffer();
    return new NextResponse(body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
