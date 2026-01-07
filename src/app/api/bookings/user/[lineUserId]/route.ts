import { NextRequest, NextResponse } from "next/server";
import { getBookingsByLineUserId } from "@/lib/google-sheets";

// GET /api/bookings/user/[lineUserId]
export async function GET(
  request: NextRequest,
  { params }: { params: { lineUserId: string } }
) {
  try {
    const bookings = await getBookingsByLineUserId(params.lineUserId);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch user bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
