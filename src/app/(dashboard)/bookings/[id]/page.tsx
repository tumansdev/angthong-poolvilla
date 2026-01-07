"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  Banknote,
  Clock,
  MessageSquare,
  Loader2,
  CheckCircle,
  XCircle,
  LogIn,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/stores/booking-store";
import { formatDate, formatPrice, formatPhoneNumber } from "@/lib/utils";
import { BOOKING_STATUS_LABELS, BookingStatus } from "@/types";

const statusActions: {
  from: BookingStatus;
  to: BookingStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    from: "pending",
    to: "confirmed",
    label: "ยืนยันการจอง",
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    from: "pending",
    to: "cancelled",
    label: "ยกเลิก",
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-red-600 hover:bg-red-700",
  },
  {
    from: "confirmed",
    to: "checked-in",
    label: "เช็คอิน",
    icon: <LogIn className="h-4 w-4" />,
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    from: "checked-in",
    to: "completed",
    label: "เสร็จสิ้น",
    icon: <CheckCheck className="h-4 w-4" />,
    color: "bg-gray-600 hover:bg-gray-700",
  },
];

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const { selectedBooking, fetchBookingById, updateBookingStatus, isLoading } =
    useBookingStore();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("owner_auth");
    if (!auth) {
      router.push("/login");
      return;
    }
    if (bookingId) {
      fetchBookingById(bookingId);
    }
  }, [router, bookingId, fetchBookingById]);

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (!selectedBooking) return;
    setIsUpdating(true);
    await updateBookingStatus(selectedBooking.id, newStatus);
    setIsUpdating(false);
  };

  const availableActions = statusActions.filter(
    (action) => action.from === selectedBooking?.status
  );

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
            <Link href="/bookings">
              <Button variant="villa" className="mt-4">
                กลับไปรายการจอง
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
      className="min-h-screen pb-32"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/bookings">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">รายละเอียดการจอง</h1>
              <p className="text-sm text-muted-foreground">{selectedBooking.id}</p>
            </div>
          </div>
          <Badge variant={selectedBooking.status as BookingStatus} className="text-sm">
            {BOOKING_STATUS_LABELS[selectedBooking.status]}
          </Badge>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Guest Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-villa-500" />
                ข้อมูลผู้จอง
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-villa-100 text-xl font-bold text-villa-700">
                  {selectedBooking.guestName.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-medium">{selectedBooking.guestName}</p>
                  <p className="text-sm text-muted-foreground">
                    LINE: {selectedBooking.lineDisplayName}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${selectedBooking.guestPhone}`}
                    className="text-villa-600 hover:underline"
                  >
                    {formatPhoneNumber(selectedBooking.guestPhone)}
                  </a>
                </div>
                {selectedBooking.guestEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${selectedBooking.guestEmail}`}
                      className="text-villa-600 hover:underline"
                    >
                      {selectedBooking.guestEmail}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5 text-villa-500" />
                รายละเอียดการเข้าพัก
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">เช็คอิน</p>
                  <p className="font-medium">
                    {formatDate(selectedBooking.checkIn, "EEEE d MMM yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">14:00 น.</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">เช็คเอาท์</p>
                  <p className="font-medium">
                    {formatDate(selectedBooking.checkOut, "EEEE d MMM yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">12:00 น.</p>
                </div>
              </div>

              <div className="flex justify-between border-t pt-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedBooking.nights} คืน</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedBooking.guests} ท่าน</span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4" />
                    หมายเหตุ
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-villa-200 bg-villa-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Banknote className="h-5 w-5 text-villa-500" />
                ยอดชำระ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  ฿8,500 × {selectedBooking.nights} คืน
                </span>
                <span className="text-2xl font-bold text-villa-600">
                  {formatPrice(selectedBooking.totalPrice)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-villa-500" />
                ประวัติ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ทำรายการจอง</span>
                  <span>{formatDate(selectedBooking.createdAt, "d MMM yyyy HH:mm")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">อัพเดทล่าสุด</span>
                  <span>{formatDate(selectedBooking.updatedAt, "d MMM yyyy HH:mm")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Status Actions */}
      {availableActions.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 border-t bg-white px-4 py-4"
        >
          <div className="flex gap-3">
            {availableActions.map((action) => (
              <Button
                key={action.to}
                className={`flex-1 gap-2 text-white ${action.color}`}
                size="lg"
                onClick={() => handleStatusChange(action.to)}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  action.icon
                )}
                {action.label}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
