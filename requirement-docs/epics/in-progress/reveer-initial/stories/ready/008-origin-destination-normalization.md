# 008: Origin/Destination Grid Normalization

## User Story
As a daily commuter, I want the app to recognize that I am starting from the same place even when my GPS reading varies slightly from day to day so that my route history is accurately associated across trips.

## Acceptance Criteria
1. Origin and destination coordinates are rounded to 3 decimal places (~150m grid) before being used to construct any localStorage key.
2. Two GPS readings for the same physical location that differ by up to ~100m are stored under the same localStorage key.
3. Two GPS readings for locations more than ~150m apart are stored under different localStorage keys.
4. The localStorage key format is: `{origin_lat},{origin_lng}→{destination_lat},{destination_lng}` using the rounded values.
5. Route history fetched for a given commute pair correctly retrieves history recorded under the normalized key, regardless of minor GPS drift between sessions.

## PRD Reference
Section 4.2 — Route History Tracking (Storage model); Section 10 — Open Questions (Q3: grid normalization)

## Relevant ADRs
- ADR-006: 150m Grid Normalization for Origin/Destination Keys — defines the 3-decimal-place rounding and the exact key format used in this story.
- ADR-003: localStorage Only — No Backend at v1 — normalization applies only to localStorage keys; no server-side key management exists.

## Dependencies
- 001-home-screen-map-and-geolocation must be complete before this story begins

## Notes
The rounding constant `COORDINATE_PRECISION = 3` must be used throughout — no hardcoded `toFixed(3)` calls per ADR-006. This story is foundational for route history (story 007) and the variation algorithm (story 004), both of which depend on consistent key construction.
