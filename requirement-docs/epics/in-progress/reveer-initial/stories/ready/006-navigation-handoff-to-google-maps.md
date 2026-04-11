# 006: Navigation Handoff to Google Maps

## User Story
As a daily commuter, I want tapping "Start in Google Maps" to immediately open Google Maps with my selected route pre-loaded so that I can begin turn-by-turn navigation without any extra steps.

## Acceptance Criteria
1. Tapping "Start in Google Maps" opens Google Maps (app or browser fallback) with the correct origin, destination, and waypoints pre-loaded.
2. The deep link URL uses the format: `https://www.google.com/maps/dir/?api=1&origin={lat,lng}&destination={lat,lng}&waypoints={waypoints}&travelmode=driving`.
3. Reveer moves to the background immediately after opening the deep link — the user does not remain on the Reveer route preview screen.
4. A transition state is shown (e.g., "Opening Google Maps… Route saved to history") while the handoff occurs.
5. If Google Maps is not installed on the device, the deep link opens Google Maps in the mobile browser instead.
6. Tapping "Start in Google Maps" does not open a new Reveer screen or navigate within the Reveer app.

## PRD Reference
Section 4.4 — Navigation Handoff to Google Maps; Section 5.3 — Key Screens (Handoff)

## Flow Reference
Screen 3 — Handoff (Primary Flow): full blue screen showing "Opening Google Maps… Route saved to history" transition state. The flow shows this as the terminal screen in the primary flow before Google Maps takes over.

## Relevant ADRs
- ADR-007: Navigation Handed Off to Google Maps via Deep Link — defines the exact deep link format and the two responsibilities of the "Start" button handler.
- ADR-004: Route History Committed at "Start" Tap, Not Trip Completion — history is written before the deep link is opened (covered in story 007; this story verifies the handoff behavior).

## Dependencies
- 005-route-preview-screen must be complete before this story begins
- 007-route-history-storage must be complete before this story begins

## Notes
Reveer has no visibility into the trip after handoff — no tracking, no completion signal. The waypoints encoded in the deep link are the key decision points of the selected route that differentiate it from the default fastest route (ADR-007). Turn-by-turn navigation is entirely Google Maps' responsibility — Reveer contains no navigation logic.
