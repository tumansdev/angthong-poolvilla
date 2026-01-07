import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin-sidebar";

export const metadata: Metadata = {
  title: "Dashboard | Angthong Poolvilla",
  description: "ระบบจัดการการจองสำหรับเจ้าของ",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      {/* Main Content - with left margin on desktop */}
      <main className="lg:ml-64">
        {children}
      </main>
    </div>
  );
}
