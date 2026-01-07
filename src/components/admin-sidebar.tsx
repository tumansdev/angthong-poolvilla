"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  CalendarDays,
  List,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Dashboard",
  },
  {
    href: "/bookings",
    icon: CalendarDays,
    label: "รายการจอง",
  },
  {
    href: "/villas",
    icon: Building2,
    label: "จัดการวิลล่า",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "ตั้งค่า",
  },
];

interface AdminSidebarProps {
  onLogout?: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem("owner_auth");
    onLogout?.();
    window.location.href = "/login";
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-villa-100">
          <Building2 className="h-5 w-5 text-villa-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-villa-700">Angthong</span>
          <span className="text-xs text-muted-foreground">Poolvilla</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-villa-100 text-villa-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-600 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-screen w-64 bg-white shadow-xl lg:hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
