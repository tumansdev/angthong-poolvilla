import { Booking, Villa, DashboardStats } from "@/types";
import { addDays, format } from "date-fns";

// วิลล่าทั้ง 5 หลัง - เรียงจากถูกไปแพง
export const villasData: Villa[] = [
  {
    id: "villa-sirin",
    name: "สิรินธร วิลล่า",
    description:
      "วิลล่าสไตล์ไทยร่วมสมัย บรรยากาศอบอุ่นเป็นกันเอง พร้อมสระว่ายน้ำขนาดกำลังดี เหมาะสำหรับคู่รักและครอบครัวเล็ก ที่ต้องการความเป็นส่วนตัว",
    pricePerNight: 4500,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      "สระว่ายน้ำส่วนตัว",
      "เครื่องปรับอากาศ",
      "WiFi ฟรี",
      "ที่จอดรถ",
      "ครัวขนาดเล็ก",
      "Smart TV",
    ],
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    ],
    rules: [
      "เช็คอิน 14:00 น. / เช็คเอาท์ 12:00 น.",
      "ไม่อนุญาตให้จัดปาร์ตี้",
      "เงียบหลัง 22:00 น.",
      "ไม่อนุญาตสูบบุหรี่ภายในอาคาร",
    ],
  },
  {
    id: "villa-chandra",
    name: "จันทรา เรสซิเดนซ์",
    description:
      "วิลล่าหรูหรากลางสวน เงียบสงบเหมาะกับการพักผ่อน มีมุมนั่งเล่นในสวนและสระว่ายน้ำรูปทรงอิสระ พร้อมวิวสวนเขียวขจี",
    pricePerNight: 5900,
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      "สระว่ายน้ำส่วนตัว",
      "สวนส่วนตัว",
      "เครื่องปรับอากาศ",
      "WiFi ฟรี",
      "ที่จอดรถ",
      "ครัวพร้อมอุปกรณ์",
      "Smart TV",
      "เครื่องทำกาแฟ",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    rules: [
      "เช็คอิน 14:00 น. / เช็คเอาท์ 12:00 น.",
      "ไม่อนุญาตให้จัดปาร์ตี้หลัง 21:00 น.",
      "ไม่อนุญาตสูบบุหรี่ภายในอาคาร",
      "สัตว์เลี้ยงไม่อนุญาต",
    ],
  },
  {
    id: "villa-nakara",
    name: "นาครา พูลสวีท",
    description:
      "วิลล่าสไตล์โมเดิร์นลักซ์ชัวรี่ พร้อมสระว่ายน้ำขนาดใหญ่และจากุซซี่ ตกแต่งด้วยวัสดุพรีเมียม เหมาะสำหรับกลุ่มเพื่อนและครอบครัวขนาดกลาง",
    pricePerNight: 7500,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: [
      "สระว่ายน้ำส่วนตัว",
      "จากุซซี่",
      "เครื่องปรับอากาศ",
      "WiFi ฟรี",
      "ที่จอดรถ 2 คัน",
      "ครัวพร้อมอุปกรณ์",
      "เครื่องซักผ้า",
      "Smart TV 65 นิ้ว",
      "ลำโพง Bluetooth",
    ],
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    ],
    rules: [
      "เช็คอิน 14:00 น. / เช็คเอาท์ 12:00 น.",
      "ไม่อนุญาตให้ทำเสียงดังหลัง 22:00 น.",
      "ไม่อนุญาตสูบบุหรี่ภายในอาคาร",
      "สัตว์เลี้ยงไม่อนุญาต",
      "กรณียกเลิกต้องแจ้งล่วงหน้า 7 วัน",
    ],
  },
  {
    id: "villa-rattana",
    name: "รัตนา แกรนด์วิลล่า",
    description:
      "วิลล่าหรูระดับพรีเมียม พร้อมสระว่ายน้ำวิวภูเขา ห้องกว้างขวางตกแต่งอย่างประณีต มีศาลากลางน้ำและมุม BBQ ส่วนตัว",
    pricePerNight: 9500,
    maxGuests: 8,
    bedrooms: 3,
    bathrooms: 3,
    amenities: [
      "สระว่ายน้ำส่วนตัว",
      "วิวภูเขา",
      "จากุซซี่",
      "ศาลากลางน้ำ",
      "BBQ Zone",
      "เครื่องปรับอากาศ",
      "WiFi ฟรี",
      "ที่จอดรถ 2 คัน",
      "ครัวพร้อมอุปกรณ์",
      "เครื่องซักผ้า",
      "Smart TV",
      "Netflix",
    ],
    images: [
      "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    rules: [
      "เช็คอิน 14:00 น. / เช็คเอาท์ 12:00 น.",
      "ไม่อนุญาตให้จัดปาร์ตี้หลัง 22:00 น.",
      "ไม่อนุญาตสูบบุหรี่ภายในอาคาร",
      "สัตว์เลี้ยงไม่อนุญาต",
      "กรณียกเลิกต้องแจ้งล่วงหน้า 7 วัน",
    ],
  },
  {
    id: "villa-ayara",
    name: "อายาระ ลักซ์ชัวรี่ เอสเตท",
    description:
      "วิลล่าระดับสูงสุด Luxury Estate ริมทะเลอ่างทอง สระว่ายน้ำระบบเกลือวิวทะเลแบบอินฟินิตี้ พร้อมห้องสปาส่วนตัว บัตเลอร์เซอร์วิส และเชฟปรุงอาหารตามคำขอ",
    pricePerNight: 15000,
    maxGuests: 10,
    bedrooms: 4,
    bathrooms: 4,
    amenities: [
      "สระว่ายน้ำอินฟินิตี้",
      "วิวทะเล 180°",
      "จากุซซี่",
      "ห้องสปาส่วนตัว",
      "ห้องซาวน่า",
      "ศาลาริมสระ",
      "BBQ Zone",
      "บัตเลอร์เซอร์วิส",
      "เชฟส่วนตัว (ตามคำขอ)",
      "เครื่องปรับอากาศ",
      "WiFi ฟรี",
      "ที่จอดรถ 3 คัน",
      "ครัวพร้อมอุปกรณ์ครบ",
      "เครื่องซักผ้า-อบผ้า",
      "Smart TV 75 นิ้ว",
      "Netflix & Disney+",
      "ระบบเสียง Sonos",
    ],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800",
    ],
    rules: [
      "เช็คอิน 14:00 น. / เช็คเอาท์ 12:00 น.",
      "สามารถจัดปาร์ตี้ได้ (แจ้งล่วงหน้า)",
      "ไม่อนุญาตสูบบุหรี่ภายในอาคาร",
      "อนุญาตสัตว์เลี้ยงขนาดเล็ก (แจ้งล่วงหน้า)",
      "กรณียกเลิกต้องแจ้งล่วงหน้า 14 วัน",
    ],
  },
];

// Default villa for backward compatibility
export const villaData: Villa = villasData[2]; // นาครา พูลสวีท

// Mock Bookings
const today = new Date();

export const mockBookings: Booking[] = [
  {
    id: "APV-ABC123-XY1Z",
    villaId: "villa-nakara",
    guestName: "สมชาย ใจดี",
    guestPhone: "081-234-5678",
    guestEmail: "somchai@email.com",
    lineUserId: "Uf1234567890",
    lineDisplayName: "สมชาย",
    checkIn: format(addDays(today, 2), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 4), "yyyy-MM-dd"),
    nights: 2,
    guests: 4,
    totalPrice: 15000,
    status: "confirmed",
    createdAt: format(addDays(today, -3), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(addDays(today, -2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "APV-DEF456-AB2C",
    villaId: "villa-ayara",
    guestName: "มานี รักเรียน",
    guestPhone: "089-876-5432",
    guestEmail: "manee@email.com",
    lineUserId: "Uf0987654321",
    lineDisplayName: "Manee",
    checkIn: format(addDays(today, 7), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 10), "yyyy-MM-dd"),
    nights: 3,
    guests: 6,
    totalPrice: 45000,
    status: "pending",
    notes: "ต้องการเชฟปรุงอาหารเย็นวันแรก",
    createdAt: format(addDays(today, -1), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(addDays(today, -1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "APV-GHI789-CD3E",
    villaId: "villa-sirin",
    guestName: "วิชัย สุขสันต์",
    guestPhone: "082-345-6789",
    lineUserId: "Uf1122334455",
    lineDisplayName: "Wichai",
    checkIn: format(addDays(today, -5), "yyyy-MM-dd"),
    checkOut: format(addDays(today, -3), "yyyy-MM-dd"),
    nights: 2,
    guests: 2,
    totalPrice: 9000,
    status: "completed",
    createdAt: format(addDays(today, -10), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(addDays(today, -3), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "APV-JKL012-EF4G",
    villaId: "villa-rattana",
    guestName: "ปิยะ มั่นคง",
    guestPhone: "086-111-2222",
    guestEmail: "piya@email.com",
    lineUserId: "Uf5566778899",
    lineDisplayName: "ปิยะ",
    checkIn: format(today, "yyyy-MM-dd"),
    checkOut: format(addDays(today, 2), "yyyy-MM-dd"),
    nights: 2,
    guests: 5,
    totalPrice: 19000,
    status: "checked-in",
    createdAt: format(addDays(today, -7), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(today, "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "APV-MNO345-GH5I",
    villaId: "villa-chandra",
    guestName: "นิธิ ศิริมงคล",
    guestPhone: "083-999-8888",
    guestEmail: "nithi@email.com",
    lineUserId: "Uf9988776655",
    lineDisplayName: "Nithi",
    checkIn: format(addDays(today, 5), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 7), "yyyy-MM-dd"),
    nights: 2,
    guests: 4,
    totalPrice: 11800,
    status: "confirmed",
    createdAt: format(addDays(today, -2), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(addDays(today, -1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  todayBookings: 1,
  monthlyBookings: 15,
  pendingBookings: 2,
  monthlyRevenue: 185000,
};

// Blocked dates per villa
export const blockedDatesByVilla: Record<string, Date[]> = {
  "villa-sirin": [addDays(today, 3), addDays(today, 4)],
  "villa-chandra": [addDays(today, 5), addDays(today, 6)],
  "villa-nakara": [addDays(today, 2), addDays(today, 3)],
  "villa-rattana": [addDays(today, 0), addDays(today, 1)],
  "villa-ayara": [addDays(today, 7), addDays(today, 8), addDays(today, 9)],
};

// For backward compatibility
export const blockedDates: Date[] = blockedDatesByVilla["villa-nakara"];

// Helper to get villa by ID
export function getVillaById(id: string): Villa | undefined {
  return villasData.find((v) => v.id === id);
}

// Helper to get villa name by ID
export function getVillaName(id: string): string {
  return villasData.find((v) => v.id === id)?.name || "Unknown Villa";
}
