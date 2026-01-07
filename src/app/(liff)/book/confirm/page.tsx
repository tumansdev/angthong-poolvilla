"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import { ArrowLeft, User, Phone, Mail, MessageSquare, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLiff } from "@/providers/liff-provider";
import { useBookingStore } from "@/stores/booking-store";
import { getVillaById } from "@/lib/mock-data";
import { formatPrice, calculateNights, calculateTotalPrice } from "@/lib/utils";

const formSchema = z.object({
  guestName: z.string().min(2, "กรุณากรอกชื่อ-นามสกุล"),
  guestPhone: z
    .string()
    .min(10, "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง")
    .regex(/^[0-9-]+$/, "กรุณากรอกเฉพาะตัวเลข"),
  guestEmail: z.string().email("รูปแบบอีเมลไม่ถูกต้อง").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useLiff();
  const { createBooking, isLoading } = useBookingStore();

  const villaId = searchParams.get("villa");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = parseInt(searchParams.get("guests") || "2");

  const villa = villaId ? getVillaById(villaId) : null;
  const checkInDate = checkIn ? parseISO(checkIn) : null;
  const checkOutDate = checkOut ? parseISO(checkOut) : null;
  const nights =
    checkInDate && checkOutDate
      ? calculateNights(checkInDate, checkOutDate)
      : 0;
  const totalPrice = villa ? calculateTotalPrice(nights, villa.pricePerNight) : 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: profile?.displayName || "",
      guestPhone: "",
      guestEmail: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!checkInDate || !checkOutDate || !villa) return;

    try {
      const booking = await createBooking(
        {
          guestName: data.guestName,
          guestPhone: data.guestPhone,
          guestEmail: data.guestEmail || undefined,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests,
          notes: data.notes || undefined,
        },
        villa.id,
        profile?.userId || "demo-user",
        profile?.displayName || data.guestName,
        profile?.pictureUrl
      );

      router.push(`/book/success?id=${booking.id}`);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  if (!villa || !checkIn || !checkOut) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">ไม่พบข้อมูลการจอง</p>
            <Link href="/book">
              <Button variant="villa" className="mt-4">
                เลือกวันใหม่
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
      <div className="sticky top-0 z-10 border-b bg-white/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href={`/book?villa=${villa.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">ข้อมูลผู้จอง</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Booking Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-villa-200 bg-villa-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">สรุปการจอง</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  วิลล่า
                </span>
                <span className="font-medium">{villa.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">เช็คอิน</span>
                <span className="font-medium">
                  {checkInDate &&
                    format(checkInDate, "d MMM yyyy", { locale: th })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">เช็คเอาท์</span>
                <span className="font-medium">
                  {checkOutDate &&
                    format(checkOutDate, "d MMM yyyy", { locale: th })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">จำนวนคืน</span>
                <span className="font-medium">{nights} คืน</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">จำนวนผู้เข้าพัก</span>
                <span className="font-medium">{guests} ท่าน</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="font-medium">ราคารวม</span>
                  <span className="text-lg font-bold text-villa-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guest Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">ข้อมูลติดต่อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    ชื่อ-นามสกุล *
                  </Label>
                  <Input
                    id="guestName"
                    placeholder="สมชาย ใจดี"
                    {...register("guestName")}
                  />
                  {errors.guestName && (
                    <p className="text-sm text-red-500">
                      {errors.guestName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestPhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    เบอร์โทรศัพท์ *
                  </Label>
                  <Input
                    id="guestPhone"
                    placeholder="081-234-5678"
                    type="tel"
                    {...register("guestPhone")}
                  />
                  {errors.guestPhone && (
                    <p className="text-sm text-red-500">
                      {errors.guestPhone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestEmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    อีเมล (ไม่บังคับ)
                  </Label>
                  <Input
                    id="guestEmail"
                    placeholder="email@example.com"
                    type="email"
                    {...register("guestEmail")}
                  />
                  {errors.guestEmail && (
                    <p className="text-sm text-red-500">
                      {errors.guestEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    หมายเหตุ (ไม่บังคับ)
                  </Label>
                  <Input
                    id="notes"
                    placeholder="ต้องการเตียงเสริม, มาถึงหลัง 18:00 น. ฯลฯ"
                    {...register("notes")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Fixed Bottom */}
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="fixed bottom-0 left-0 right-0 border-t bg-white/95 px-4 py-4 backdrop-blur-sm"
            >
              <Button
                type="submit"
                variant="villa"
                size="xl"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    กำลังจอง...
                  </>
                ) : (
                  "ยืนยันการจอง"
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-villa-500" />
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
