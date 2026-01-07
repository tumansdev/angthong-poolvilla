import { NextRequest, NextResponse } from "next/server";
import {
  getAllBookings,
  createBooking,
  getDashboardStats,
} from "@/lib/google-sheets";
import { Booking } from "@/types";
import { generateBookingId, calculateNights, calculateTotalPrice } from "@/lib/utils";
import { getVillaById } from "@/lib/mock-data";

// GET /api/bookings - Get all bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stats = searchParams.get("stats");

    if (stats === "true") {
      const dashboardStats = await getDashboardStats();
      return NextResponse.json(dashboardStats);
    }

    const bookings = await getAllBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      villaId,
      guestName,
      guestPhone,
      guestEmail,
      checkIn,
      checkOut,
      guests,
      notes,
      lineUserId,
      lineDisplayName,
      linePictureUrl,
    } = body;

    // Validate required fields
    if (!villaId || !guestName || !guestPhone || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get villa info
    const villa = getVillaById(villaId);
    if (!villa) {
      return NextResponse.json({ error: "Villa not found" }, { status: 404 });
    }

    // Calculate price
    const nights = calculateNights(new Date(checkIn), new Date(checkOut));
    const totalPrice = calculateTotalPrice(nights, villa.pricePerNight);
    const now = new Date().toISOString();

    const newBooking: Booking = {
      id: generateBookingId(),
      villaId,
      guestName,
      guestPhone,
      guestEmail: guestEmail || undefined,
      lineUserId: lineUserId || "web-user",
      lineDisplayName: lineDisplayName || guestName,
      linePictureUrl: linePictureUrl || undefined,
      checkIn,
      checkOut,
      nights,
      guests: guests || 1,
      totalPrice,
      status: "pending",
      notes: notes || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const created = await createBooking(newBooking);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
