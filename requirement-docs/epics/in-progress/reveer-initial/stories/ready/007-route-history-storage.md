# 007: Route History Storage and Persistence

## User Story
As a daily commuter, I want the app to remember the routes I have taken so that future trips can be compared against my recent history and offer me something different.

## Acceptance Criteria
1. When the user taps "Start in Google Maps," the selected route's encoded polyline is saved to localStorage before the deep link is opened.
2. Route history is stored per origin-destination pair, holding up to five route fingerprints ordered from most recent to oldest.
3. When a sixth route is added to a pair's history, the oldest entry is dropped so the list never exceeds five entries.
4. Route history persists across browser sessions — closing and reopening the app does not clear stored history.
5. Tapping "Try a different route" does not write anything to history; history is only written when "Start in Google Maps" is tapped.
6. If the user clears browser data, all route history is reset and the app behaves as on first use.

## PRD Reference
Section 4.2 — Route History Tracking; Section 4.3 — Route Variation Algorithm (Step 5)

## Relevant ADRs
- ADR-003: localStorage Only — No Backend at v1 — all history is stored in browser localStorage with no cloud sync.
- ADR-004: Route History Committed at "Start" Tap, Not Trip Completion — history write happens as the first action of the "Start" button handler.
- ADR-006: 150m Grid Normalization for Origin/Destination Keys — the localStorage key uses rounded coordinates to absorb GPS drift.

## Dependencies
- 002-destination-search-autocomplete must be complete before this story begins
- 008-origin-destination-normalization must be complete before this story begins (normalization determines the storage key)

## Notes
The storage key is a normalized string derived from the rounded origin and destination coordinates (see story 008 and ADR-006). The value is an array of up to five encoded polyline strings. Clearing browser data resetting history is expected behavior, not a bug (Section 7, PRD).
