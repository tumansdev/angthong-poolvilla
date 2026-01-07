import { LiffProvider } from "@/providers/liff-provider";

export default function LiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiffProvider>
      <div className="min-h-screen bg-gradient-to-b from-villa-50 to-white">
        {children}
      </div>
    </LiffProvider>
  );
}
