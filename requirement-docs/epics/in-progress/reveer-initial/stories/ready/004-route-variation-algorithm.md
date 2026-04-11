# 004: Route Variation Algorithm — Novelty Scoring and Selection

## User Story
As a daily commuter, I want the app to automatically select a route that is different from my recent trips so that I avoid falling into the same autopilot pattern every day.

## Acceptance Criteria
1. Given multiple route candidates from the API, the app scores each candidate for novelty by comparing it against the stored history for the same origin-destination pair.
2. A candidate route is classified as "the same" as a stored route when 80% or more of its decoded polyline points fall within a spatial proximity of a point in the stored route.
3. The app selects the candidate with the highest novelty score (least overlap with history) that does not exceed the user's configured time tolerance above the fastest available route.
4. If all candidates fall within the time tolerance but all match a route in the user's history, the app falls back to the least-recently-used route from history and marks it as "Previously used route."
5. If all candidate routes exceed the time tolerance, the app falls back to the fastest available route and marks it as "Previously used route."
6. The selected route is presented on the route preview screen within 3 seconds of route candidates being returned.

## PRD Reference
Section 4.3 — Route Variation Algorithm; Section 6.3 — Route Fingerprinting; Section 10 — Open Questions (Q1: 80% threshold)

## Relevant ADRs
- ADR-005: 80% Polyline Spatial Overlap Defines "Same Route" — the classification threshold used in criterion 2.
- ADR-003: localStorage Only — No Backend at v1 — route history for comparison is read from localStorage.
- ADR-006: 150m Grid Normalization for Origin/Destination Keys — history is looked up using normalized origin/destination coordinates.

## Dependencies
- 003-route-fetching-via-google-routes-api must be complete before this story begins
- 007-route-history-storage must be complete before this story begins (algorithm requires stored history to compare against)

## Notes
When no history exists (first use), all routes have equal novelty; the algorithm should select the fastest route. The 80% threshold is a named constant `ROUTE_SIMILARITY_THRESHOLD` — hardcoded magic numbers are a code review violation per ADR-005. The time tolerance defaults to 10 minutes; it is read from localStorage. This is the highest-risk algorithm in the product and should be validated against real commute pairs.
