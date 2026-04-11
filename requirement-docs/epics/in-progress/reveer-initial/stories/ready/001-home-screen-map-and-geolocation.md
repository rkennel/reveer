# 001: Home Screen — Map and Geolocation

## User Story
As a daily commuter, I want to open Reveer and immediately see a full-screen map centered on my current location so that I can quickly orient myself and start planning a route.

## Acceptance Criteria
1. When the app loads, a full-screen interactive map is displayed covering the entire viewport.
2. The map automatically requests the user's current location and centers on it within 3 seconds on a 4G connection.
3. A floating search bar labeled "Where to?" appears at the top of the map.
4. A settings gear icon is visible in the top-right corner of the home screen.
5. The current location indicator is visible on the map at the user's detected position.
6. The page loads and reaches an interactive state in under 3 seconds on a simulated 4G connection.

## PRD Reference
Section 4.1 — Route Request and Display; Section 5.3 — Key Screens (Home)

## Relevant ADRs
- ADR-001: Frontend Stack — React, TypeScript, Vite — the home screen is implemented as a React component with TypeScript.
- ADR-008: No PWA Service Worker at v1 — the app requires an active internet connection; no offline fallback exists.
- ADR-009: No User Accounts or Cloud Sync at v1 — no login or account state affects the home screen.

## Dependencies
- None

## Notes
The map is rendered via the Google Maps JavaScript SDK. If geolocation permission is denied or GPS is unavailable, the app should prompt the user to enter their origin manually — this edge case is covered in story 013. The settings icon navigates to the Settings screen (story 009).
