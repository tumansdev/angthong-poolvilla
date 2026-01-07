"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/stores/booking-store";
import { formatDate, formatPrice } from "@/lib/utils";
import { BOOKING_STATUS_LABELS, BookingStatus, Booking } from "@/types";

const statusFilters: { value: string; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: "รอยืนยัน" },
  { value: "confirmed", label: "ยืนยันแล้ว" },
  { value: "checked-in", label: "เช็คอินแล้ว" },
  { value: "completed", label: "เสร็จสิ้น" },
  { value: "cancelled", label: "ยกเลิก" },
];

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookings, fetchBookings, isLoading } = useBookingStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );

  useEffect(() => {
    const auth = sessionStorage.getItem("owner_auth");
    if (!auth) {
      router.push("/login");
      return;
    }
    fetchBookings();
  }, [router, fetchBookings]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      search === "" ||
      booking.guestName.toLowerCase().includes(search.toLowerCase()) ||
      booking.guestPhone.includes(search) ||
      booking.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">รายการจอง</h1>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredBookings.length} รายการ
          </Badge>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="ค้นหาชื่อ, เบอร์โทร, หมายเลขจอง..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(filter.value)}
                className="shrink-0"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-villa-500" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">ไม่พบรายการจอง</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking: Booking) => (
              <Link key={booking.id} href={`/bookings/${booking.id}`}>
                <Card className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-villa-100 text-lg font-medium text-villa-700">
                          {booking.guestName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{booking.guestName}</p>
                            <Badge variant={booking.status as BookingStatus}>
                              {BOOKING_STATUS_LABELS[booking.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {booking.guestPhone}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {formatDate(booking.checkIn)} -{" "}
                            {formatDate(booking.checkOut)}
                          </p>
                          <p className="text-sm">
                            {booking.nights} คืน · {booking.guests} ท่าน
                          </p>
                        </div>
                        <p className="text-lg font-bold text-villa-600">
                          {formatPrice(booking.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-villa-500" />
        </div>
      }
    >
      <BookingsContent />
    </Suspense>
  );
}
