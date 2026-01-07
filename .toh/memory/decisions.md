# 🧠 Key Decisions

## Architecture Decisions
| Date | Decision | Reason |
|------|----------|--------|
| 2026-01-07 | Use Toh Framework | AI-Orchestration Driven Development |
| 2026-01-07 | Use Google Sheets as database | User requirement - ต้องการเชื่อมต่อ Google Sheets |
| 2026-01-07 | Use LINE LIFF for booking | User requirement - จองผ่านไลน์ |
| 2026-01-07 | Simple PIN login for owner | ไม่ต้องใช้ระบบ auth ซับซ้อน สำหรับเจ้าของคนเดียว |

## Design Decisions
| Date | Decision | Reason |
|------|----------|--------|
| 2026-01-07 | Mobile-first LIFF pages | ลูกค้าใช้ผ่าน LINE บนมือถือ |
| 2026-01-07 | Desktop-optimized dashboard | เจ้าของใช้บนคอมพิวเตอร์ |

## Business Logic
| Date | Decision | Reason |
|------|----------|--------|
| 2026-01-07 | Booking status: pending → confirmed → checked-in → completed | Standard booking workflow |

## Rejected Ideas
| Date | Idea | Why Rejected |
|------|------|--------------|
| 2026-01-07 | Supabase database | User specifically requested Google Sheets |

---
*Last updated: 2026-01-07*
