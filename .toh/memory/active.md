# 🔥 Active Task

## Current Focus
Angthong Poolvilla - Google Sheets Integration Complete

## In Progress
- (none)

## Just Completed
- ✅ Created `src/lib/google-sheets.ts` - Google Sheets API client
- ✅ Created API routes:
  - GET/POST `/api/bookings`
  - GET/PATCH `/api/bookings/[id]`
  - GET `/api/bookings/user/[lineUserId]`
  - GET `/api/villas/[id]/blocked-dates`
- ✅ Updated booking store to call API with mock fallback
- ✅ Updated `.env.example` with clear setup instructions

## Next Steps
1. **User Setup Required:**
   - Create Google Cloud Project + Service Account
   - Create Google Sheet + Share with Service Account
   - Add credentials to `.env.local`
2. Deploy to Vercel
3. Create LIFF App in LINE Developers Console

## Blockers / Issues
- Waiting for user to setup Google Sheets credentials

---
*Last updated: 2026-01-07*
