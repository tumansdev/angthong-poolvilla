"use client";

import liff from "@line/liff";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || "";

export async function initializeLiff(): Promise<boolean> {
  if (!LIFF_ID) {
    console.warn("LIFF ID not configured");
    return false;
  }

  try {
    await liff.init({ liffId: LIFF_ID });
    return true;
  } catch (error) {
    console.error("LIFF init failed:", error);
    return false;
  }
}

export function isInLiff(): boolean {
  try {
    return liff.isInClient();
  } catch {
    return false;
  }
}

export function isLoggedIn(): boolean {
  try {
    return liff.isLoggedIn();
  } catch {
    return false;
  }
}

export async function login(): Promise<void> {
  if (!isLoggedIn()) {
    liff.login();
  }
}

export async function logout(): Promise<void> {
  if (isLoggedIn()) {
    liff.logout();
    window.location.reload();
  }
}

export async function getProfile() {
  if (!isLoggedIn()) return null;
  
  try {
    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };
  } catch (error) {
    console.error("Failed to get profile:", error);
    return null;
  }
}

export function getAccessToken(): string | null {
  try {
    return liff.getAccessToken();
  } catch {
    return null;
  }
}

export async function sendMessage(text: string): Promise<boolean> {
  if (!isInLiff()) return false;

  try {
    await liff.sendMessages([{ type: "text", text }]);
    return true;
  } catch (error) {
    console.error("Failed to send message:", error);
    return false;
  }
}

// Send booking notification to OA (this appears in the chat)
export async function sendBookingNotification(
  bookingId: string,
  villaName: string,
  guestName: string,
  guestPhone: string,
  checkIn: string,
  checkOut: string,
  nights: number,
  guests: number,
  totalPrice: string
): Promise<boolean> {
  if (!isInLiff()) {
    console.warn("Not in LIFF, cannot send booking notification");
    return false;
  }

  try {
    await liff.sendMessages([
      {
        type: "flex",
        altText: `📌 การจองใหม่: ${villaName} - ${guestName}`,
        contents: {
          type: "bubble",
          size: "mega",
          header: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#0EA5E9",
            paddingAll: "15px",
            contents: [
              {
                type: "text",
                text: "📌 การจองใหม่",
                color: "#FFFFFF",
                weight: "bold",
                size: "lg",
              },
              {
                type: "text",
                text: bookingId,
                color: "#E0F2FE",
                size: "xs",
                margin: "xs",
              },
            ],
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "md",
            paddingAll: "15px",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "🏠 วิลล่า", size: "sm", color: "#666666", flex: 3 },
                  { type: "text", text: villaName, size: "sm", weight: "bold", flex: 5, wrap: true },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "👤 ชื่อ", size: "sm", color: "#666666", flex: 3 },
                  { type: "text", text: guestName, size: "sm", weight: "bold", flex: 5, wrap: true },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "📞 เบอร์", size: "sm", color: "#666666", flex: 3 },
                  { type: "text", text: guestPhone, size: "sm", weight: "bold", flex: 5 },
                ],
              },
              { type: "separator", margin: "md" },
              {
                type: "box",
                layout: "horizontal",
                margin: "md",
                contents: [
                  { type: "text", text: "📅 เช็คอิน", size: "sm", color: "#666666", flex: 3 },
                  { type: "text", text: checkIn, size: "sm", flex: 5 },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "📅 เช็คเอาท์", size: "sm", color: "#666666", flex: 3 },
                  { type: "text", text: checkOut, size: "sm", flex: 5 },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "🌙 จำนวน", size: "sm", color: "#666666", flex: 3 },
                  { type: "text", text: `${nights} คืน / ${guests} ท่าน`, size: "sm", flex: 5 },
                ],
              },
              { type: "separator", margin: "md" },
              {
                type: "box",
                layout: "horizontal",
                margin: "md",
                contents: [
                  { type: "text", text: "💰 ราคารวม", size: "md", color: "#0EA5E9", weight: "bold", flex: 3 },
                  { type: "text", text: totalPrice, size: "md", color: "#0EA5E9", weight: "bold", flex: 5, align: "end" },
                ],
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#FEF9C3",
            paddingAll: "10px",
            contents: [
              {
                type: "text",
                text: "⏳ รอการยืนยันจากเจ้าของ",
                size: "sm",
                color: "#854D0E",
                align: "center",
                weight: "bold",
              },
            ],
          },
        },
      },
    ]);
    return true;
  } catch (error) {
    console.error("Failed to send booking notification:", error);
    return false;
  }
}

export function closeLiff(): void {
  if (isInLiff()) {
    liff.closeWindow();
  }
}

export async function shareBookingConfirmation(
  bookingId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  if (!liff.isApiAvailable("shareTargetPicker")) return false;

  try {
    await liff.shareTargetPicker([
      {
        type: "flex",
        altText: `การจอง ${bookingId} - Angthong Poolvilla`,
        contents: {
          type: "bubble",
          hero: {
            type: "image",
            url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
            size: "full",
            aspectRatio: "20:13",
            aspectMode: "cover",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "Angthong Poolvilla",
                weight: "bold",
                size: "xl",
              },
              {
                type: "text",
                text: `หมายเลขจอง: ${bookingId}`,
                size: "sm",
                color: "#999999",
                margin: "md",
              },
              {
                type: "box",
                layout: "vertical",
                margin: "lg",
                spacing: "sm",
                contents: [
                  {
                    type: "box",
                    layout: "baseline",
                    spacing: "sm",
                    contents: [
                      { type: "text", text: "เช็คอิน", color: "#aaaaaa", size: "sm", flex: 2 },
                      { type: "text", text: checkIn, wrap: true, color: "#666666", size: "sm", flex: 4 },
                    ],
                  },
                  {
                    type: "box",
                    layout: "baseline",
                    spacing: "sm",
                    contents: [
                      { type: "text", text: "เช็คเอาท์", color: "#aaaaaa", size: "sm", flex: 2 },
                      { type: "text", text: checkOut, wrap: true, color: "#666666", size: "sm", flex: 4 },
                    ],
                  },
                ],
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "text",
                text: "✅ จองสำเร็จแล้ว",
                color: "#22c55e",
                align: "center",
                weight: "bold",
              },
            ],
          },
        },
      },
    ]);
    return true;
  } catch (error) {
    console.error("Failed to share:", error);
    return false;
  }
}
