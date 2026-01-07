"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { User, LogIn, Calendar, ChevronRight, Phone, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLiff } from "@/providers/liff-provider";

export default function ProfilePage() {
  const { isReady, isLoggedIn, profile, login, isInLiff } = useLiff();

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

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-villa-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen pb-24"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-villa-600 to-villa-800 px-4 py-8 text-white">
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center"
        >
          {isLoggedIn && profile ? (
            <>
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white/30">
                {profile.pictureUrl ? (
                  <Image
                    src={profile.pictureUrl}
                    alt={profile.displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-villa-400">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>
              <h1 className="mt-3 text-xl font-bold">{profile.displayName}</h1>
              <p className="text-sm text-white/80">เชื่อมต่อกับ LINE แล้ว</p>
            </>
          ) : (
            <>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <User className="h-10 w-10 text-white" />
              </div>
              <h1 className="mt-3 text-xl font-bold">ยังไม่ได้เข้าสู่ระบบ</h1>
              <p className="text-sm text-white/80">เข้าสู่ระบบเพื่อดูประวัติการจอง</p>
            </>
          )}
        </motion.div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Login Button (if not logged in) */}
        {!isLoggedIn && (
          <motion.div variants={itemVariants}>
            <Button
              variant="villa"
              size="xl"
              className="w-full gap-2"
              onClick={login}
            >
              <LogIn className="h-5 w-5" />
              เข้าสู่ระบบด้วย LINE
            </Button>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {isInLiff
                ? "กดปุ่มด้านบนเพื่อเข้าสู่ระบบ"
                : "กรุณาเปิดใน LINE เพื่อเข้าสู่ระบบ"}
            </p>
          </motion.div>
        )}

        {/* Menu Items */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">เมนู</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-0">
              <Link href="/status">
                <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-villa-500" />
                    <span>ประวัติการจอง</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
              <div className="mx-6 border-t" />
              <a href="tel:+66812345678">
                <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-villa-500" />
                    <span>ติดต่อเจ้าของ</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </a>
              <div className="mx-6 border-t" />
              <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-villa-500" />
                  <span>ช่วยเหลือ</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Angthong Info */}
        <motion.div variants={itemVariants}>
          <Card className="border-villa-200 bg-villa-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                🏠 Angthong Poolvilla
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                พูลวิลล่าหรูหรา จังหวัดอ่างทอง
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

