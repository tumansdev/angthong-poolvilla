# 📋 Project Summary

## Project Overview
- Name: Angthong Poolvilla Booking System
- Type: Booking & Accommodation (LINE LIFF)
- Tech Stack: Next.js 14, Tailwind CSS, shadcn/ui, Zustand, LINE LIFF, Google Sheets

## Completed Features
- ✅ LIFF Home Page (villa info, image carousel, amenities)
- ✅ Date Picker Page (calendar, guest count, price calculation)
- ✅ Booking Confirmation Page (guest form with validation)
- ✅ Booking Success Page (share to LINE, status link)
- ✅ Booking Status Page (view user's bookings)
- ✅ Owner Login Page (simple PIN authentication)
- ✅ Owner Dashboard (stats, pending alerts, recent bookings)
- ✅ Bookings List (search, filter by status)
- ✅ Booking Detail (guest info, status actions)

## Current State
UI & Logic complete with mock data, ready for Google Sheets integration

## Key Files
- `src/app/(liff)/` - Customer booking pages
- `src/app/(dashboard)/` - Owner admin pages
- `src/lib/liff.ts` - LINE LIFF SDK wrapper
- `src/stores/booking-store.ts` - Zustand booking state
- `src/lib/mock-data.ts` - Mock data with Thai names

## Important Notes
- Using Toh Framework v1.7.0
- Memory System is active
- Google Sheets as database (not Supabase)
- Demo password for owner: 1234

---
*Last updated: 2026-01-07*
