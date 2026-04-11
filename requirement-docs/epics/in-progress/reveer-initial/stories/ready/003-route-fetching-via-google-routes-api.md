# 003: Route Fetching via Google Routes API

## User Story
As a daily commuter, I want the app to automatically fetch multiple route options after I select a destination so that I have a set of route candidates to choose from without any manual action.

## Acceptance Criteria
1. After the user selects a destination, the app fetches multiple route alternatives from the Google Routes API without any additional user action.
2. The fetch request includes the user's current location as the origin and the selected destination.
3. The fetch returns at least one route result before the route preview screen is shown.
4. Route fetching completes and the route preview screen is shown within 3 seconds of destination selection on a simulated 4G connection.
5. If the API returns an error (e.g., quota exceeded), an error message is shown with a retry option — the user is not shown an empty or broken screen.
6. Each fetched route includes encoded polyline, estimated duration, and distance.

## PRD Reference
Section 4.1 — Route Request and Display; Section 4.3 — Route Variation Algorithm (Step 1); Section 7 — Constraints and Edge Cases (Google Maps API quota exceeded)

## Relevant ADRs
- ADR-002: Use Google Routes API, Not Legacy Directions API — this story implements the Routes API call with field masks for polyline, duration, and distance.
- ADR-003: localStorage Only — No Backend at v1 — the only outbound network call is to Google; no Reveer backend is involved.

## Dependencies
- 002-destination-search-autocomplete must be complete before this story begins

## Notes
The Routes API must be called with `computeAlternativeRoutes: true` to retrieve multiple candidates. Field masks must be used on every request to limit the response to polyline, duration, and distance fields. The API quota exceeded error case (Section 7) is a key edge case — users should see an actionable error, not a blank screen.
