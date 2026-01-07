# 🚀 Google Sheets Setup Guide

## ขั้นตอนการเชื่อม Google Sheets

### Step 1: สร้าง Google Cloud Project

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com)
2. สร้าง Project ใหม่ หรือเลือก Project ที่มีอยู่
3. ไปที่ **APIs & Services** → **Enable APIs and Services**
4. ค้นหา "**Google Sheets API**" และกด **Enable**

### Step 2: สร้าง Service Account

1. ไปที่ **APIs & Services** → **Credentials**
2. กด **Create Credentials** → **Service Account**
3. ตั้งชื่อ (เช่น `poolvilla-sheets-service`)
4. กด **Create and Continue** → **Done**
5. คลิกที่ Service Account ที่สร้าง → **Keys** → **Add Key** → **Create new key**
6. เลือก **JSON** → **Create**
7. ไฟล์ JSON จะถูกดาวน์โหลด - เก็บไว้ให้ดี!

### Step 3: สร้าง Google Sheet

สร้าง Google Spreadsheet ใหม่ พร้อม Sheet ชื่อ "**Bookings**" โดยมี Header Row (แถวที่ 1):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| id | villaId | guestName | guestPhone | guestEmail | lineUserId | lineDisplayName | linePictureUrl | checkIn | checkOut | nights | guests | totalPrice | status | notes | createdAt | updatedAt |

### Step 4: Share Sheet กับ Service Account

1. เปิด Google Sheet ที่สร้าง
2. กดปุ่ม **Share** (แชร์)
3. Copy email ของ Service Account จากไฟล์ JSON (field: `client_email`)
4. วาง email นั้นลงไป และให้สิทธิ์ **Editor**
5. กด **Share**

### Step 5: ใส่ค่าใน `.env.local`

สร้างไฟล์ `.env.local` ในโปรเจค:

```bash
# LINE LIFF
NEXT_PUBLIC_LIFF_ID=your_liff_id_here

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here

# Owner Dashboard
OWNER_PASSWORD=your_secure_password
```

**วิธีหา Spreadsheet ID:**
จาก URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

**ข้อควรระวัง `GOOGLE_PRIVATE_KEY`:**
- Copy ทั้ง key รวม `-----BEGIN/END-----`
- แทน newline ด้วย `\n`
- ครอบด้วย double quotes `"..."`

### Step 6: ทดสอบ

```bash
npm run dev
```

เปิด http://localhost:3000 และลองจอง - ข้อมูลจะถูกบันทึกลง Google Sheet!

---

## 📋 Sheet Structure

### Bookings Sheet
| Column | Field | Type | Description |
|--------|-------|------|-------------|
| A | id | string | Booking ID (APV-XXXXX-XXXX) |
| B | villaId | string | Villa ID |
| C | guestName | string | ชื่อผู้จอง |
| D | guestPhone | string | เบอร์โทร |
| E | guestEmail | string | อีเมล (optional) |
| F | lineUserId | string | LINE User ID |
| G | lineDisplayName | string | LINE Display Name |
| H | linePictureUrl | string | LINE Profile Picture |
| I | checkIn | date | วันเช็คอิน (YYYY-MM-DD) |
| J | checkOut | date | วันเช็คเอาท์ (YYYY-MM-DD) |
| K | nights | number | จำนวนคืน |
| L | guests | number | จำนวนผู้เข้าพัก |
| M | totalPrice | number | ราคารวม |
| N | status | string | สถานะ (pending/confirmed/checked-in/completed/cancelled) |
| O | notes | string | หมายเหตุ |
| P | createdAt | datetime | วันที่สร้าง |
| Q | updatedAt | datetime | วันที่อัพเดท |

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | รายการจองทั้งหมด |
| GET | `/api/bookings?stats=true` | สถิติ Dashboard |
| POST | `/api/bookings` | สร้างการจองใหม่ |
| GET | `/api/bookings/[id]` | รายละเอียดการจอง |
| PATCH | `/api/bookings/[id]` | อัพเดทสถานะ |
| GET | `/api/bookings/user/[lineUserId]` | การจองของ user |
| GET | `/api/villas/[id]/blocked-dates` | วันที่ถูกจอง |
