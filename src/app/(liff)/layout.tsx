import { LiffProvider } from "@/providers/liff-provider";
import { CustomerNav } from "@/components/customer-nav";

export default function LiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiffProvider>
      <div className="min-h-screen bg-gradient-to-b from-villa-50 to-white">
        {children}
        <CustomerNav />
      </div>
    </LiffProvider>
  );
}
