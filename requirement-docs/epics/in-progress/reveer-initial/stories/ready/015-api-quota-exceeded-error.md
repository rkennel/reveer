# 015: API Quota Exceeded — Error State and Retry

## User Story
As a daily commuter, I want to see a clear error message with a retry option when the Google Maps API is unavailable so that I am not left on a broken or blank screen and know I can try again.

## Acceptance Criteria
1. If the Google Routes API call fails due to a quota-exceeded error, a user-readable error message is displayed explaining that the route could not be loaded.
2. A "Retry" button is shown alongside the error message that re-triggers the route fetch without requiring the user to re-enter their destination.
3. The error state is displayed in place of the route preview — no partial or broken UI is shown.
4. If the retry succeeds, the route preview screen loads normally and the error state is dismissed.
5. If the retry also fails, the same error message and retry button remain visible; the user is not shown a different or more confusing screen.

## PRD Reference
Section 7 — Constraints and Edge Cases (Google Maps API quota exceeded); Section 2.2 — Success Metrics (Mobile web load time)

## Relevant ADRs
- ADR-002: Use Google Routes API, Not Legacy Directions API — the error originates from the Routes API; this story covers the user-facing recovery flow.
- ADR-003: localStorage Only — No Backend at v1 — there is no Reveer backend to absorb or cache API failures; errors reach the user directly.

## Dependencies
- 003-route-fetching-via-google-routes-api must be complete before this story begins

## Notes
The quota-exceeded case is one of several API error types (network error, bad response, etc.) but is called out explicitly in Section 7. The retry action should re-use the already-selected destination and current location without returning the user to the home screen. Other API error conditions (e.g., no results for the given origin/destination pair) may share this same error presentation pattern.
