"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Waves,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  ChefHat,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVillaById } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

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

const amenityIcons: Record<string, React.ReactNode> = {
  "สระว่ายน้ำส่วนตัว": <Waves className="h-5 w-5 text-villa-500" />,
  "สระว่ายน้ำอินฟินิตี้": <Waves className="h-5 w-5 text-villa-500" />,
  "WiFi ฟรี": <Wifi className="h-5 w-5 text-villa-500" />,
  ที่จอดรถ: <Car className="h-5 w-5 text-villa-500" />,
  "ที่จอดรถ 2 คัน": <Car className="h-5 w-5 text-villa-500" />,
  "ที่จอดรถ 3 คัน": <Car className="h-5 w-5 text-villa-500" />,
  ครัวพร้อมอุปกรณ์: <ChefHat className="h-5 w-5 text-villa-500" />,
  "ครัวพร้อมอุปกรณ์ครบ": <ChefHat className="h-5 w-5 text-villa-500" />,
  ครัวขนาดเล็ก: <ChefHat className="h-5 w-5 text-villa-500" />,
};

export default function VillaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const villaId = params.id as string;
  const [currentImage, setCurrentImage] = useState(0);

  const villa = useMemo(() => getVillaById(villaId), [villaId]);

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

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % villa.images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + villa.images.length) % villa.images.length
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-24"
    >
      {/* Hero Image Carousel */}
      <motion.div variants={itemVariants} className="relative h-72 sm:h-96">
        <Image
          src={villa.images[currentImage]}
          alt={villa.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Back Button */}
        <Link
          href="/"
          className="absolute left-3 top-3 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        {/* Carousel Controls */}
        {villa.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-12 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 gap-1.5">
              {villa.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    idx === currentImage
                      ? "w-6 bg-white"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
            <span className="text-sm text-gold-400">Premium Villa</span>
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
            {villa.name}
          </h1>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Price Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-villa-200 bg-gradient-to-r from-villa-50 to-white">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">ราคาต่อคืน</p>
                <p className="text-2xl font-bold text-villa-600">
                  {formatPrice(villa.pricePerNight)}
                  <span className="text-base font-normal text-muted-foreground">
                    /คืน
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  รองรับ {villa.maxGuests} ท่าน
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-3"
        >
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <Bed className="h-6 w-6 text-villa-500" />
              <p className="mt-1 text-lg font-semibold">{villa.bedrooms}</p>
              <p className="text-xs text-muted-foreground">ห้องนอน</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <Bath className="h-6 w-6 text-villa-500" />
              <p className="mt-1 text-lg font-semibold">{villa.bathrooms}</p>
              <p className="text-xs text-muted-foreground">ห้องน้ำ</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <Users className="h-6 w-6 text-villa-500" />
              <p className="mt-1 text-lg font-semibold">{villa.maxGuests}</p>
              <p className="text-xs text-muted-foreground">ท่าน</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants}>
          <h2 className="mb-2 text-lg font-semibold">เกี่ยวกับที่พัก</h2>
          <p className="leading-relaxed text-muted-foreground">
            {villa.description}
          </p>
        </motion.div>

        {/* Amenities */}
        <motion.div variants={itemVariants}>
          <h2 className="mb-3 text-lg font-semibold">สิ่งอำนวยความสะดวก</h2>
          <div className="grid grid-cols-2 gap-2">
            {villa.amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-2 rounded-lg bg-villa-50 px-3 py-2"
              >
                {amenityIcons[amenity] || (
                  <Sparkles className="h-5 w-5 text-villa-500" />
                )}
                <span className="text-sm">{amenity}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rules */}
        <motion.div variants={itemVariants}>
          <h2 className="mb-3 text-lg font-semibold">กฎระเบียบ</h2>
          <ul className="space-y-2">
            {villa.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-villa-400" />
                <span className="text-muted-foreground">{rule}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Fixed Bottom CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 border-t bg-white/95 px-4 py-4 backdrop-blur-sm"
      >
        <Link href={`/book?villa=${villa.id}`}>
          <Button variant="villa" size="xl" className="w-full gap-2">
            <Calendar className="h-5 w-5" />
            จองเลย
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
