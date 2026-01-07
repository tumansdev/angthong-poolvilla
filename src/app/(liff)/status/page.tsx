"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Home, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLiff } from "@/providers/liff-provider";
import { useBookingStore } from "@/stores/booking-store";
import { formatDate, formatPrice } from "@/lib/utils";
import { BOOKING_STATUS_LABELS, BookingStatus, Booking } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function StatusPage() {
  const { profile, isLoggedIn, isReady } = useLiff();
  const { bookings, fetchBookingsByLineUserId, isLoading } = useBookingStore();

  useEffect(() => {
    if (isReady && profile?.userId) {
      fetchBookingsByLineUserId(profile.userId);
    }
  }, [isReady, profile, fetchBookingsByLineUserId]);

  // For demo, show mock user bookings
  const userBookings = bookings.length > 0 ? bookings.slice(0, 3) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-24"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">สถานะการจอง</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* User Info */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3"
          >
            {profile.pictureUrl && (
              <img
                src={profile.pictureUrl}
                alt={profile.displayName}
                className="h-12 w-12 rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{profile.displayName}</p>
              <p className="text-sm text-muted-foreground">
                การจองทั้งหมด {userBookings.length} รายการ
              </p>
            </div>
          </motion.div>
        )}

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : userBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-medium">ยังไม่มีการจอง</h2>
            <p className="mt-2 text-muted-foreground">
              เริ่มต้นจองที่พักของคุณวันนี้
            </p>
            <Link href="/">
              <Button variant="villa" className="mt-6">
                จองเลย
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {userBookings.map((booking: Booking) => (
              <motion.div key={booking.id} variants={itemVariants}>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Status Header */}
                    <div
                      className={`px-4 py-2 ${
                        booking.status === "confirmed" || booking.status === "checked-in"
                          ? "bg-green-50"
                          : booking.status === "pending"
                          ? "bg-yellow-50"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={booking.status as BookingStatus}
                        >
                          {BOOKING_STATUS_LABELS[booking.status]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {booking.id}
                        </span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-villa-500" />
                        <span>
                          {formatDate(booking.checkIn)} -{" "}
                          {formatDate(booking.checkOut)}
                        </span>
                        <span className="text-muted-foreground">
                          ({booking.nights} คืน)
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">ราคารวม</span>
                        <span className="text-lg font-bold text-villa-600">
                          {formatPrice(booking.totalPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        จองเมื่อ {formatDate(booking.createdAt, "d MMM yyyy HH:mm")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 border-t bg-white/95 px-4 py-4 backdrop-blur-sm"
      >
        <Link href="/">
          <Button variant="villa" size="lg" className="w-full gap-2">
            <Home className="h-5 w-5" />
            จองเพิ่ม
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
