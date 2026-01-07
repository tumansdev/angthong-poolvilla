// Booking Types for Angthong Poolvilla

export type BookingStatus = 
  | "pending" 
  | "confirmed" 
  | "checked-in" 
  | "completed" 
  | "cancelled";

export interface Booking {
  id: string;
  villaId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  lineUserId: string;
  lineDisplayName: string;
  linePictureUrl?: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  notes?: string;
}

export interface Villa {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  rules: string[];
}

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface DashboardStats {
  todayBookings: number;
  monthlyBookings: number;
  pendingBookings: number;
  monthlyRevenue: number;
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "รอยืนยัน",
  confirmed: "ยืนยันแล้ว",
  "checked-in": "เช็คอินแล้ว",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  "checked-in": "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};
