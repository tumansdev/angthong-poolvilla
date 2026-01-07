import { NextRequest, NextResponse } from "next/server";
import { getBlockedDatesByVilla } from "@/lib/google-sheets";

// GET /api/villas/[id]/blocked-dates
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blockedDates = await getBlockedDatesByVilla(params.id);
    return NextResponse.json({ blockedDates });
  } catch (error) {
    console.error("Failed to fetch blocked dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocked dates" },
      { status: 500 }
    );
  }
}
