"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simple password check (in real app, this would be API call)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Demo password is "1234"
    if (password === "1234") {
      // Store auth in sessionStorage
      sessionStorage.setItem("owner_auth", "true");
      router.push("/dashboard");
    } else {
      setError("รหัสผ่านไม่ถูกต้อง");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-villa-100 to-villa-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Card className="border-villa-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-villa-100">
              <Lock className="h-8 w-8 text-villa-600" />
            </div>
            <CardTitle className="text-xl">เข้าสู่ระบบ</CardTitle>
            <p className="text-sm text-muted-foreground">
              สำหรับเจ้าของ Angthong Poolvilla
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่าน"
                    className="pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="villa"
                size="lg"
                className="w-full"
                disabled={isLoading || !password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                รหัสผ่านสำหรับ Demo: 1234
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
