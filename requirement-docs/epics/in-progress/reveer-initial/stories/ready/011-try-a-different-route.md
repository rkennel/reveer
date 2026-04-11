# 011: Try a Different Route — Secondary Action

## User Story
As a daily commuter, I want to request a different route from the preview screen without committing to navigation so that I can see another novel option before I start my trip.

## Acceptance Criteria
1. Tapping "Try a different route" on the route preview screen re-runs the route variation algorithm and updates the displayed route polyline on the map.
2. The trip stats (time, distance, arrival) refresh to reflect the newly selected candidate route.
3. The route status badge ("New route" or "Previously used route") updates to reflect the novelty status of the new selection.
4. Tapping "Try a different route" does not write anything to localStorage route history.
5. The "Try a different route" button remains available after re-running, allowing the user to request additional alternatives.
6. If no further distinct candidates are available, the button still functions and may re-present a previously shown candidate without error.

## PRD Reference
Section 4.5 — Route Preview Screen; Section 5.3 — Key Screens (Route Preview); Flow design decisions ("History commits at Start")

## Flow Reference
Screen 2 — Route Preview (Primary Flow): the "Try a different route" secondary button sits below the "Start in Google Maps" primary button in the bottom sheet. The flow design decisions section explicitly states history is only committed at "Start" tap, not on alternate route requests.

## Relevant ADRs
- ADR-004: Route History Committed at "Start" Tap, Not Trip Completion — history is not written when "Try a different route" is tapped; only "Start" triggers a write.
- ADR-005: 80% Polyline Spatial Overlap Defines "Same Route" — the re-run uses the same similarity threshold to score the next candidate.

## Dependencies
- 005-route-preview-screen must be complete before this story begins
- 004-route-variation-algorithm must be complete before this story begins

## Notes
"Try a different route" re-runs the same algorithm against the same set of candidates already returned by the API — it does not make a new API call unless no further candidates remain. Route history is only ever written at the moment "Start in Google Maps" is tapped (ADR-004). This button intentionally does not appear on the no-novel-route edge case variant of the screen (story 012).
