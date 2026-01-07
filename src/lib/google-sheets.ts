import { google } from "googleapis";
import { Booking, BookingStatus } from "@/types";

// Google Sheets Authentication - ใช้ Service Account
function getAuthClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) {
    throw new Error("Missing Google Sheets credentials");
  }

  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const BOOKINGS_SHEET = "Bookings";
const VILLAS_SHEET = "Villas";

// Column mapping for Bookings sheet (A-R)
const BOOKING_COLUMNS = {
  id: 0,
  villaId: 1,
  guestName: 2,
  guestPhone: 3,
  guestEmail: 4,
  lineUserId: 5,
  lineDisplayName: 6,
  linePictureUrl: 7,
  checkIn: 8,
  checkOut: 9,
  nights: 10,
  guests: 11,
  totalPrice: 12,
  status: 13,
  notes: 14,
  createdAt: 15,
  updatedAt: 16,
};

// Convert row array to Booking object
function rowToBooking(row: string[]): Booking {
  return {
    id: row[BOOKING_COLUMNS.id] || "",
    villaId: row[BOOKING_COLUMNS.villaId] || "",
    guestName: row[BOOKING_COLUMNS.guestName] || "",
    guestPhone: row[BOOKING_COLUMNS.guestPhone] || "",
    guestEmail: row[BOOKING_COLUMNS.guestEmail] || undefined,
    lineUserId: row[BOOKING_COLUMNS.lineUserId] || "",
    lineDisplayName: row[BOOKING_COLUMNS.lineDisplayName] || "",
    linePictureUrl: row[BOOKING_COLUMNS.linePictureUrl] || undefined,
    checkIn: row[BOOKING_COLUMNS.checkIn] || "",
    checkOut: row[BOOKING_COLUMNS.checkOut] || "",
    nights: parseInt(row[BOOKING_COLUMNS.nights]) || 0,
    guests: parseInt(row[BOOKING_COLUMNS.guests]) || 0,
    totalPrice: parseFloat(row[BOOKING_COLUMNS.totalPrice]) || 0,
    status: (row[BOOKING_COLUMNS.status] as BookingStatus) || "pending",
    notes: row[BOOKING_COLUMNS.notes] || undefined,
    createdAt: row[BOOKING_COLUMNS.createdAt] || "",
    updatedAt: row[BOOKING_COLUMNS.updatedAt] || "",
  };
}

// Convert Booking object to row array
function bookingToRow(booking: Booking): string[] {
  const row: string[] = new Array(17).fill("");
  row[BOOKING_COLUMNS.id] = booking.id;
  row[BOOKING_COLUMNS.villaId] = booking.villaId;
  row[BOOKING_COLUMNS.guestName] = booking.guestName;
  row[BOOKING_COLUMNS.guestPhone] = booking.guestPhone;
  row[BOOKING_COLUMNS.guestEmail] = booking.guestEmail || "";
  row[BOOKING_COLUMNS.lineUserId] = booking.lineUserId;
  row[BOOKING_COLUMNS.lineDisplayName] = booking.lineDisplayName;
  row[BOOKING_COLUMNS.linePictureUrl] = booking.linePictureUrl || "";
  row[BOOKING_COLUMNS.checkIn] = booking.checkIn;
  row[BOOKING_COLUMNS.checkOut] = booking.checkOut;
  row[BOOKING_COLUMNS.nights] = booking.nights.toString();
  row[BOOKING_COLUMNS.guests] = booking.guests.toString();
  row[BOOKING_COLUMNS.totalPrice] = booking.totalPrice.toString();
  row[BOOKING_COLUMNS.status] = booking.status;
  row[BOOKING_COLUMNS.notes] = booking.notes || "";
  row[BOOKING_COLUMNS.createdAt] = booking.createdAt;
  row[BOOKING_COLUMNS.updatedAt] = booking.updatedAt;
  return row;
}

// ===== API Functions =====

export async function getAllBookings(): Promise<Booking[]> {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${BOOKINGS_SHEET}!A2:Q`, // Skip header row
    });

    const rows = response.data.values || [];
    return rows.map((row) => rowToBooking(row as string[]));
  } catch (error: unknown) {
    // Handle case where sheet doesn't exist or is empty
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("Unable to parse range") || 
        errorMessage.includes("notFound")) {
      console.warn("Bookings sheet not found or empty, returning empty array");
      return [];
    }
    throw error;
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const bookings = await getAllBookings();
  return bookings.find((b) => b.id === id) || null;
}

export async function getBookingsByLineUserId(
  lineUserId: string
): Promise<Booking[]> {
  const bookings = await getAllBookings();
  return bookings.filter((b) => b.lineUserId === lineUserId);
}

export async function getBookingsByVillaId(villaId: string): Promise<Booking[]> {
  const bookings = await getAllBookings();
  return bookings.filter((b) => b.villaId === villaId);
}

// Helper to ensure Bookings sheet exists with header row
async function ensureBookingsSheetExists(): Promise<void> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  try {
    // Try to get the sheet metadata
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetExists = spreadsheet.data.sheets?.some(
      (s) => s.properties?.title === BOOKINGS_SHEET
    );

    if (!sheetExists) {
      // Create the Bookings sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: BOOKINGS_SHEET,
                },
              },
            },
          ],
        },
      });

      // Add header row
      const headerRow = [
        "id", "villaId", "guestName", "guestPhone", "guestEmail",
        "lineUserId", "lineDisplayName", "linePictureUrl",
        "checkIn", "checkOut", "nights", "guests", "totalPrice",
        "status", "notes", "createdAt", "updatedAt"
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${BOOKINGS_SHEET}!A1:Q1`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [headerRow],
        },
      });

      console.log("Created Bookings sheet with header row");
    }
  } catch (error) {
    console.error("Error ensuring sheet exists:", error);
    throw error;
  }
}

export async function createBooking(booking: Booking): Promise<Booking> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  // Ensure the Bookings sheet exists before creating
  await ensureBookingsSheetExists();

  const row = bookingToRow(booking);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BOOKINGS_SHEET}!A:Q`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });

  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking | null> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  // First get all bookings to find the row number
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BOOKINGS_SHEET}!A:Q`,
  });

  const rows = response.data.values || [];
  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    // Skip header
    if (rows[i][BOOKING_COLUMNS.id] === id) {
      rowIndex = i + 1; // 1-indexed for Sheets API
      break;
    }
  }

  if (rowIndex === -1) {
    return null;
  }

  const now = new Date().toISOString();

  // Update status (column N) and updatedAt (column Q)
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: [
        {
          range: `${BOOKINGS_SHEET}!N${rowIndex}`, // status column
          values: [[status]],
        },
        {
          range: `${BOOKINGS_SHEET}!Q${rowIndex}`, // updatedAt column
          values: [[now]],
        },
      ],
    },
  });

  return getBookingById(id);
}

export async function getDashboardStats(): Promise<{
  todayBookings: number;
  monthlyBookings: number;
  pendingBookings: number;
  monthlyRevenue: number;
}> {
  const bookings = await getAllBookings();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const monthYear = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const todayBookings = bookings.filter((b) => b.checkIn === todayStr).length;

  const monthlyBookings = bookings.filter((b) =>
    b.checkIn.startsWith(monthYear)
  ).length;

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  const monthlyRevenue = bookings
    .filter((b) => b.createdAt.startsWith(monthYear))
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return {
    todayBookings,
    monthlyBookings,
    pendingBookings,
    monthlyRevenue,
  };
}

// ===== Helper to check blocked dates =====
export async function getBlockedDatesByVilla(
  villaId: string
): Promise<string[]> {
  const bookings = await getBookingsByVillaId(villaId);

  const blockedDates: string[] = [];

  for (const booking of bookings) {
    if (booking.status === "cancelled" || booking.status === "completed") {
      continue;
    }

    // Add all dates between checkIn and checkOut
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);

    for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
      blockedDates.push(d.toISOString().split("T")[0]);
    }
  }

  return blockedDates;
}
