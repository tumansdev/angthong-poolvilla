"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Users,
  Clock,
  Banknote,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/stores/booking-store";
import { mockDashboardStats, getVillaName } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/utils";
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

export default function DashboardPage() {
  const router = useRouter();
  const { bookings, fetchBookings, isLoading } = useBookingStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check auth
    const auth = sessionStorage.getItem("owner_auth");
    if (!auth) {
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);
    fetchBookings();
  }, [router, fetchBookings]);

  if (!isAuthenticated) {
    return null;
  }

  const stats = mockDashboardStats;
  const recentBookings = bookings.slice(0, 5);
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* Header */}
      <div className="border-b bg-white px-4 py-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            ยินดีต้อนรับกลับมา! นี่คือภาพรวมของการจองวันนี้
          </p>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4 md:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">จองวันนี้</p>
                <p className="text-2xl font-bold">{stats.todayBookings}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4 md:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">จองเดือนนี้</p>
                <p className="text-2xl font-bold">{stats.monthlyBookings}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4 md:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">รอยืนยัน</p>
                <p className="text-2xl font-bold">{stats.pendingBookings}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4 md:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-villa-100">
                <Banknote className="h-6 w-6 text-villa-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">รายได้เดือนนี้</p>
                <p className="text-2xl font-bold">
                  {formatPrice(stats.monthlyRevenue)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Bookings Alert */}
        {pendingBookings.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 shrink-0 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      มี {pendingBookings.length} รายการรอยืนยัน
                    </p>
                    <p className="text-sm text-yellow-700">
                      กรุณาตรวจสอบและยืนยันการจอง
                    </p>
                  </div>
                </div>
                <Link href="/bookings?status=pending">
                  <Button variant="outline" size="sm" className="w-full gap-1 sm:w-auto">
                    ดูรายการ
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Bookings */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">การจองล่าสุด</CardTitle>
              <Link href="/bookings">
                <Button variant="ghost" size="sm" className="gap-1 text-villa-600">
                  ดูทั้งหมด
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-lg bg-slate-200"
                    />
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  ยังไม่มีการจอง
                </p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((booking: Booking) => (
                    <Link key={booking.id} href={`/bookings/${booking.id}`}>
                      <div className="flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-villa-100 text-sm font-medium text-villa-700">
                            {booking.guestName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{booking.guestName}</p>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {getVillaName(booking.villaId)}
                              </span>
                              <span>•</span>
                              <span>
                                {formatDate(booking.checkIn)} -{" "}
                                {formatDate(booking.checkOut)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={booking.status as BookingStatus}>
                            {BOOKING_STATUS_LABELS[booking.status]}
                          </Badge>
                          <span className="font-medium text-villa-600">
                            {formatPrice(booking.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
