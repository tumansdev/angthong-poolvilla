"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarCheck, User } from "lucide-react";
import { motion } from "framer-motion";
import { useLiff } from "@/providers/liff-provider";

const navItems = [
  {
    href: "/",
    label: "หน้าหลัก",
    icon: Home,
  },
  {
    href: "/status",
    label: "การจองของฉัน",
    icon: CalendarCheck,
  },
  {
    href: "/profile",
    label: "โปรไฟล์",
    icon: User,
  },
];

export function CustomerNav() {
  const pathname = usePathname();
  const { isLoggedIn, profile } = useLiff();

  // Don't show nav on booking flow pages
  const hideOnPaths = ["/book", "/villa"];
  const shouldHide = hideOnPaths.some((path) => pathname.startsWith(path));

  if (shouldHide) return null;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive
                  ? "text-villa-600"
                  : "text-slate-500 hover:text-villa-500"
              }`}
            >
              <div className="relative">
                <Icon className={`h-6 w-6 ${isActive ? "fill-villa-100" : ""}`} />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-2 rounded-xl bg-villa-100"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </motion.nav>
  );
}
