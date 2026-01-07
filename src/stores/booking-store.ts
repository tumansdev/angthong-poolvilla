import { create } from "zustand";
import { Booking, BookingFormData, BookingStatus } from "@/types";
import { mockBookings, getVillaById } from "@/lib/mock-data";
import { generateBookingId, calculateNights, calculateTotalPrice } from "@/lib/utils";
import { format } from "date-fns";

// Helper to check if API is available (env vars are set)
const isApiAvailable = () => {
  return typeof window !== "undefined"; // Always try API in browser
};

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBookings: () => Promise<void>;
  fetchBookingById: (id: string) => Promise<Booking | null>;
  fetchBookingsByLineUserId: (lineUserId: string) => Promise<Booking[]>;
  createBooking: (
    data: BookingFormData,
    villaId: string,
    lineUserId: string,
    lineDisplayName: string,
    linePictureUrl?: string
  ) => Promise<Booking>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  setSelectedBooking: (booking: Booking | null) => void;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      if (isApiAvailable()) {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            set({ bookings: data, isLoading: false });
            return;
          }
        }
      }
      // Fallback to mock data
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({ bookings: mockBookings, isLoading: false });
    } catch (error) {
      console.error("Fetch bookings error:", error);
      // Fallback to mock data on error
      set({ bookings: mockBookings, isLoading: false });
    }
  },

  fetchBookingById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      if (isApiAvailable()) {
        const res = await fetch(`/api/bookings/${id}`);
        if (res.ok) {
          const booking = await res.json();
          if (booking.id) {
            set({ selectedBooking: booking, isLoading: false });
            return booking;
          }
        }
      }
      // Fallback to mock data
      await new Promise((resolve) => setTimeout(resolve, 200));
      const booking = mockBookings.find((b) => b.id === id) || null;
      set({ selectedBooking: booking, isLoading: false });
      return booking;
    } catch (error) {
      console.error("Fetch booking error:", error);
      const booking = mockBookings.find((b) => b.id === id) || null;
      set({ selectedBooking: booking, isLoading: false });
      return booking;
    }
  },

  fetchBookingsByLineUserId: async (lineUserId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (isApiAvailable()) {
        const res = await fetch(`/api/bookings/user/${lineUserId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            set({ isLoading: false });
            return data;
          }
        }
      }
      // Fallback to mock data
      await new Promise((resolve) => setTimeout(resolve, 200));
      const userBookings = mockBookings.filter((b) => b.lineUserId === lineUserId);
      set({ isLoading: false });
      return userBookings;
    } catch (error) {
      console.error("Fetch user bookings error:", error);
      const userBookings = mockBookings.filter((b) => b.lineUserId === lineUserId);
      set({ isLoading: false });
      return userBookings;
    }
  },

  createBooking: async (data, villaId, lineUserId, lineDisplayName, linePictureUrl) => {
    set({ isLoading: true, error: null });
    try {
      const villa = getVillaById(villaId);
      if (!villa) {
        throw new Error("Villa not found");
      }

      const nights = calculateNights(data.checkIn, data.checkOut);
      const totalPrice = calculateTotalPrice(nights, villa.pricePerNight);
      const now = new Date().toISOString();

      const bookingPayload = {
        villaId,
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        guestEmail: data.guestEmail,
        checkIn: format(data.checkIn, "yyyy-MM-dd"),
        checkOut: format(data.checkOut, "yyyy-MM-dd"),
        guests: data.guests,
        notes: data.notes,
        lineUserId,
        lineDisplayName,
        linePictureUrl,
      };

      if (isApiAvailable()) {
        try {
          const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingPayload),
          });

          if (res.ok) {
            const newBooking = await res.json();
            set((state) => ({
              bookings: [...state.bookings, newBooking],
              selectedBooking: newBooking,
              isLoading: false,
            }));
            return newBooking;
          }
        } catch (apiError) {
          console.error("API create failed, using mock:", apiError);
        }
      }

      // Fallback to local mock creation
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newBooking: Booking = {
        id: generateBookingId(),
        villaId,
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        guestEmail: data.guestEmail,
        lineUserId,
        lineDisplayName,
        linePictureUrl,
        checkIn: format(data.checkIn, "yyyy-MM-dd"),
        checkOut: format(data.checkOut, "yyyy-MM-dd"),
        nights,
        guests: data.guests,
        totalPrice,
        status: "pending",
        notes: data.notes,
        createdAt: now,
        updatedAt: now,
      };

      set((state) => ({
        bookings: [...state.bookings, newBooking],
        selectedBooking: newBooking,
        isLoading: false,
      }));

      return newBooking;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create booking",
        isLoading: false,
      });
      throw error;
    }
  },

  updateBookingStatus: async (id: string, status: BookingStatus) => {
    set({ isLoading: true, error: null });
    try {
      if (isApiAvailable()) {
        try {
          const res = await fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          });

          if (res.ok) {
            const updated = await res.json();
            set((state) => ({
              bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
              selectedBooking:
                state.selectedBooking?.id === id ? updated : state.selectedBooking,
              isLoading: false,
            }));
            return;
          }
        } catch (apiError) {
          console.error("API update failed, using mock:", apiError);
        }
      }

      // Fallback to local mock update
      await new Promise((resolve) => setTimeout(resolve, 300));

      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id
            ? { ...b, status, updatedAt: new Date().toISOString() }
            : b
        ),
        selectedBooking:
          state.selectedBooking?.id === id
            ? { ...state.selectedBooking, status, updatedAt: new Date().toISOString() }
            : state.selectedBooking,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update booking",
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedBooking: (booking) => {
    set({ selectedBooking: booking });
  },

  clearError: () => {
    set({ error: null });
  },
}));
