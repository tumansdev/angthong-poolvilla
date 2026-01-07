"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { format, addDays, isSameDay } from "date-fns";
import { th } from "date-fns/locale";
import { DayPicker, DateRange } from "react-day-picker";
import {
  ArrowLeft,
  Calendar,
  Users,
  Minus,
  Plus,
  Info,
  Building2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { villasData, getVillaById, blockedDatesByVilla } from "@/lib/mock-data";
import { formatPrice, calculateNights, calculateTotalPrice } from "@/lib/utils";
import "react-day-picker/dist/style.css";

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialVillaId = searchParams.get("villa") || villasData[0].id;

  const [selectedVillaId, setSelectedVillaId] = useState(initialVillaId);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);

  const villa = useMemo(() => getVillaById(selectedVillaId), [selectedVillaId]);
  const blockedDates = blockedDatesByVilla[selectedVillaId] || [];

  const today = new Date();
  const minDate = addDays(today, 1);
  const maxDate = addDays(today, 365);

  const nights = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return calculateNights(dateRange.from, dateRange.to);
    }
    return 0;
  }, [dateRange]);

  const totalPrice = useMemo(() => {
    if (!villa) return 0;
    return calculateTotalPrice(nights, villa.pricePerNight);
  }, [nights, villa]);

  const isDateBlocked = (date: Date) => {
    return blockedDates.some((blocked) => isSameDay(blocked, date));
  };

  const handleContinue = () => {
    if (!dateRange?.from || !dateRange?.to || !villa) return;

    const params = new URLSearchParams({
      villa: villa.id,
      checkIn: format(dateRange.from, "yyyy-MM-dd"),
      checkOut: format(dateRange.to, "yyyy-MM-dd"),
      guests: guests.toString(),
    });

    router.push(`/book/confirm?${params.toString()}`);
  };

  const canContinue = dateRange?.from && dateRange?.to && nights > 0 && villa;

  if (!villa) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">ไม่พบข้อมูลวิลล่า</p>
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
      className="min-h-screen pb-36"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href={`/villa/${villa.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">เลือกวันเข้าพัก</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Villa Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-5 w-5 text-villa-500" />
                เลือกวิลล่า
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {villasData.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVillaId(v.id);
                    setDateRange(undefined); // Reset dates when villa changes
                  }}
                  className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all ${
                    selectedVillaId === v.id
                      ? "border-villa-500 bg-villa-50 ring-2 ring-villa-200"
                      : "hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="font-medium">{v.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {v.bedrooms} ห้องนอน · สูงสุด {v.maxGuests} ท่าน
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-villa-600">
                      {formatPrice(v.pricePerNight)}
                    </p>
                    <p className="text-xs text-muted-foreground">/คืน</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5 text-villa-500" />
                เลือกวันที่
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                locale={th}
                disabled={[
                  { before: minDate },
                  { after: maxDate },
                  isDateBlocked,
                ]}
                modifiers={{
                  booked: blockedDates,
                }}
                modifiersStyles={{
                  booked: {
                    textDecoration: "line-through",
                    color: "#dc2626",
                  },
                }}
                numberOfMonths={1}
                showOutsideDays={false}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-start gap-2 rounded-lg bg-amber-50 p-3"
        >
          <Info className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            วันที่มีเส้นขีดทับหมายถึงวันที่มีการจองแล้ว ไม่สามารถจองได้
          </p>
        </motion.div>

        {/* Guest Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-villa-500" />
                <span className="font-medium">จำนวนผู้เข้าพัก</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-lg font-semibold">
                  {guests}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() =>
                    setGuests(Math.min(villa.maxGuests, guests + 1))
                  }
                  disabled={guests >= villa.maxGuests}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected Dates Summary */}
        {dateRange?.from && dateRange?.to && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-villa-200 bg-villa-50">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">วิลล่า</span>
                  <span className="font-medium">{villa.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">เช็คอิน</span>
                  <span className="font-medium">
                    {format(dateRange.from, "EEEE d MMMM yyyy", { locale: th })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">เช็คเอาท์</span>
                  <span className="font-medium">
                    {format(dateRange.to, "EEEE d MMMM yyyy", { locale: th })}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatPrice(villa.pricePerNight)} × {nights} คืน
                    </span>
                    <span className="font-medium">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 border-t bg-white/95 px-4 py-4 backdrop-blur-sm"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">ราคารวม</p>
            <p className="text-xl font-bold text-villa-600">
              {canContinue ? formatPrice(totalPrice) : "-"}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {canContinue ? `${nights} คืน · ${guests} ท่าน` : "เลือกวันที่"}
          </p>
        </div>
        <Button
          variant="villa"
          size="xl"
          className="w-full"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          ดำเนินการต่อ
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-villa-500" />
        </div>
      }
    >
      <BookContent />
    </Suspense>
  );
}
