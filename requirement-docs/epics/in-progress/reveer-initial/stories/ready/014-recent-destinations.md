# 014: Recent Destinations — Quick Access on Home Screen

## User Story
As a daily commuter, I want to see my recently visited destinations on the home screen so that I can start a route to a frequent destination with a single tap instead of retyping it.

## Acceptance Criteria
1. The home screen displays a list of recently selected destinations below the search bar (visible without opening the search input).
2. Each recent destination entry shows a place name and a secondary address line.
3. Tapping a recent destination selects it immediately and begins route fetching — no further typing or confirmation is required.
4. Recent destinations are stored locally in localStorage and persist across sessions.
5. Recent destinations are stored separately from route history — clearing route history does not remove recent destinations.
6. The recent destinations list is distinct from route history: it records places visited, not the route polylines taken between them.

## PRD Reference
Section 4.6 — Origin and Destination Input; Section 5.3 — Key Screens (Home)

## Relevant ADRs
- ADR-003: localStorage Only — No Backend at v1 — recent destinations are stored in a separate localStorage key; no server call is made.
- ADR-009: No User Accounts or Cloud Sync at v1 — recent destinations are device-local and not synced across devices.

## Dependencies
- 001-home-screen-map-and-geolocation must be complete before this story begins
- 002-destination-search-autocomplete must be complete before this story begins (a selected destination via autocomplete is what populates the recents list)

## Notes
The recent destinations list is a separate localStorage key from route history (ADR-003 storage model). The PRD does not specify a maximum number of recent destinations to display; a reasonable default (e.g., 3–5 entries) should be chosen by the implementation and validated in acceptance tests. Clearing browser data resets both route history and recent destinations, as both live in localStorage.
