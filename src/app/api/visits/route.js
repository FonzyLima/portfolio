import { NextResponse } from "next/server";
import { recordVisit } from "@/app/lib/visitors";

export const dynamic = "force-dynamic";

// One POST per browser session (components/footer/VisitorCounter.js) counts
// the visit and answers with the running totals. Never cached: every call
// is a new hit.
export async function POST() {
  try {
    const visit = await recordVisit();
    if (!visit)
      return NextResponse.json({ error: "not configured" }, { status: 404 });
    return NextResponse.json(visit, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[visits]", error.message);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
