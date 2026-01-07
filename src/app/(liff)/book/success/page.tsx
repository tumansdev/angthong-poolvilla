"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Share2, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingStore } from "@/stores/booking-store";
import { formatDate, formatPrice } from "@/lib/utils";
import { closeLiff, shareBookingConfirmation, isInLiff } from "@/lib/liff";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const { selectedBooking, fetchBookingById, isLoading } = useBookingStore();
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBookingById(bookingId);
    }
  }, [bookingId, fetchBookingById]);

  const handleShare = async () => {
    if (!selectedBooking) return;
    setIsSharing(true);
    await shareBookingConfirmation(
      selectedBooking.id,
      formatDate(selectedBooking.checkIn),
      formatDate(selectedBooking.checkOut)
    );
    setIsSharing(false);
  };

  const handleClose = () => {
    closeLiff();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-villa-500" />
      </div>
    );
  }

  if (!selectedBooking) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">ไม่พบข้อมูลการจอง</p>
            <Link href="/">
              <Button variant="villa" className="mt-4">
                กลับหน้าหลัก
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 py-8"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="flex flex-col items-center text-center mb-8"
      >
        <div className="relative mb-4">
          <div className="absolute -inset-4 rounded-full bg-green-100 animate-pulse" />
          <CheckCircle2 className="relative h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-green-600">จองสำเร็จ!</h1>
        <p className="mt-2 text-muted-foreground">
          ขอบคุณที่จอง Angthong Poolvilla
        </p>
      </motion.div>

      {/* Booking Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-villa-200">
          <CardContent className="p-6 space-y-4">
            {/* Booking ID */}
            <div className="rounded-lg bg-villa-50 p-4 text-center">
              <p className="text-sm text-muted-foreground">หมายเลขการจอง</p>
              <p className="mt-1 text-xl font-bold text-villa-700">
                {selectedBooking.id}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ชื่อผู้จอง</span>
                <span className="font-medium">{selectedBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">เบอร์โทร</span>
                <span className="font-medium">{selectedBooking.guestPhone}</span>
              </div>
              <div className="border-t pt-3" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">เช็คอิน</span>
                <span className="font-medium">
                  {formatDate(selectedBooking.checkIn, "d MMM yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">เช็คเอาท์</span>
                <span className="font-medium">
                  {formatDate(selectedBooking.checkOut, "d MMM yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">จำนวนคืน</span>
                <span className="font-medium">{selectedBooking.nights} คืน</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">จำนวนผู้เข้าพัก</span>
                <span className="font-medium">{selectedBooking.guests} ท่าน</span>
              </div>
              <div className="border-t pt-3" />
              <div className="flex justify-between">
                <span className="font-medium">ราคารวม</span>
                <span className="text-xl font-bold text-villa-600">
                  {formatPrice(selectedBooking.totalPrice)}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-lg bg-yellow-50 p-4 text-center">
              <p className="text-sm font-medium text-yellow-800">
                📞 กรุณารอการติดต่อกลับจากเจ้าของที่พัก
              </p>
              <p className="mt-1 text-xs text-yellow-600">
                เราจะติดต่อกลับภายใน 2-3 ชั่วโมง
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 space-y-3"
      >
        {isInLiff() && (
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2"
            onClick={handleShare}
            disabled={isSharing}
          >
            <Share2 className="h-5 w-5" />
            {isSharing ? "กำลังแชร์..." : "แชร์ให้เพื่อน"}
          </Button>
        )}

        <Link href="/status">
          <Button variant="outline" size="lg" className="w-full gap-2">
            <Calendar className="h-5 w-5" />
            ดูสถานะการจอง
          </Button>
        </Link>

        {isInLiff() ? (
          <Button variant="villa" size="lg" className="w-full gap-2" onClick={handleClose}>
            <Home className="h-5 w-5" />
            ปิด
          </Button>
        ) : (
          <Link href="/">
            <Button variant="villa" size="lg" className="w-full gap-2">
              <Home className="h-5 w-5" />
              กลับหน้าหลัก
            </Button>
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-villa-500" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
