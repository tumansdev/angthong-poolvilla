import { NextRequest, NextResponse } from "next/server";
import { getBookingById, updateBookingStatus } from "@/lib/google-sheets";
import { BookingStatus } from "@/types";

// GET /api/bookings/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await getBookingById(params.id);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Failed to fetch booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/[id] - Update booking status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    const validStatuses: BookingStatus[] = [
      "pending",
      "confirmed",
      "checked-in",
      "completed",
      "cancelled",
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await updateBookingStatus(params.id, status);

    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
