"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Waves,
  Users,
  Bed,
  Bath,
  ChevronRight,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { villasData } from "@/lib/mock-data";
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

export default function LiffHomePage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative h-48 overflow-hidden bg-gradient-to-br from-villa-600 to-villa-800"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-3 flex items-center gap-2"
          >
            <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
            <span className="text-sm font-medium text-gold-400">Premium Collection</span>
            <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
          </motion.div>
          <h1 className="text-2xl font-bold drop-shadow-lg sm:text-3xl">
            Angthong Poolvilla
          </h1>
          <p className="mt-2 flex items-center gap-2 text-white/90">
            <Sparkles className="h-4 w-4" />
            เลือกวิลล่าที่ใช่สำหรับคุณ
          </p>
        </div>
      </motion.div>

      {/* Villa Cards */}
      <div className="px-4 py-6 space-y-4">
        <motion.h2 variants={itemVariants} className="text-lg font-semibold">
          วิลล่าทั้งหมด ({villasData.length} หลัง)
        </motion.h2>

        {villasData.map((villa, index) => (
          <motion.div key={villa.id} variants={itemVariants}>
            <Link href={`/villa/${villa.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-lg active:scale-[0.98]">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative h-48 sm:h-auto sm:w-48 md:w-56">
                    <Image
                      src={villa.images[0]}
                      alt={villa.name}
                      fill
                      className="object-cover"
                    />
                    {/* Price Badge */}
                    <div className="absolute right-2 top-2">
                      {index === 0 && (
                        <Badge className="bg-green-500 text-white">
                          คุ้มค่าที่สุด
                        </Badge>
                      )}
                      {index === villasData.length - 1 && (
                        <Badge className="bg-gold-500 text-white">
                          หรูหราที่สุด
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {villa.name}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {villa.description}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                      </div>

                      {/* Features */}
                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Bed className="h-4 w-4" />
                          {villa.bedrooms} ห้องนอน
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <Bath className="h-4 w-4" />
                          {villa.bathrooms} ห้องน้ำ
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <Users className="h-4 w-4" />
                          สูงสุด {villa.maxGuests} ท่าน
                        </span>
                      </div>

                      {/* Amenities Preview */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {villa.amenities.slice(0, 3).map((amenity) => (
                          <Badge
                            key={amenity}
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {amenity}
                          </Badge>
                        ))}
                        {villa.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs font-normal">
                            +{villa.amenities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-4 flex items-center justify-between border-t pt-3">
                      <div>
                        <span className="text-xl font-bold text-villa-600">
                          {formatPrice(villa.pricePerNight)}
                        </span>
                        <span className="text-sm text-muted-foreground">/คืน</span>
                      </div>
                      <Button variant="villa" size="sm" className="gap-1">
                        เลือกวิลล่านี้
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
