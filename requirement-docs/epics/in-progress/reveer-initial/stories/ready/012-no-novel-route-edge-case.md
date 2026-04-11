# 012: No Novel Route Found — Edge Case Screen State

## User Story
As a daily commuter, I want to be clearly informed when Reveer cannot find a route different from my recent trips so that I understand why I am seeing a familiar route and know what I can do about it.

## Acceptance Criteria
1. When all available route candidates match routes in the user's recent history (or all exceed the time tolerance), the route preview screen shows an amber warning banner with the message "No new route found. Showing fastest option instead."
2. The route polyline on the map is rendered in grey dashed styling (not the normal solid blue) to visually signal the fallback state.
3. The route status badge reads "Previously used route" (not "New route") on this screen.
4. A hint message is displayed below the "Start in Google Maps" button suggesting the user increase their time tolerance in settings.
5. The "Start in Google Maps" primary button remains available so the user can still begin navigation on the fallback route.
6. The "Try a different route" secondary button is not shown on this edge case screen state.

## PRD Reference
Section 4.3 — Route Variation Algorithm (Step 4 fallback); Section 5.3 — Key Screens (No Route Available); Section 7 — Constraints and Edge Cases (Only one route exists; All alternate routes exceed tolerance)

## Flow Reference
Edge Case — ! No Route Found (Branching Actions): replaces the normal route preview when all candidates match recent history. Flow shows grey dashed route polyline, amber warning banner, "Previously used route" badge in grey, "Start in Google Maps" button still present, and hint text to increase tolerance. The "Try a different route" button is absent in this state.

## Relevant ADRs
- ADR-004: Route History Committed at "Start" Tap, Not Trip Completion — even in the fallback state, history is written when "Start" is tapped.
- ADR-005: 80% Polyline Spatial Overlap Defines "Same Route" — the fallback is triggered when all candidates score above the 80% similarity threshold against stored history.

## Dependencies
- 005-route-preview-screen must be complete before this story begins
- 004-route-variation-algorithm must be complete before this story begins
- 007-route-history-storage must be complete before this story begins

## Notes
Two distinct scenarios both result in this screen: (1) all candidate routes overlap ≥ 80% with a stored history route, and (2) all candidates that differ from history exceed the user's configured time tolerance. The fallback route shown is the fastest available route (Section 4.3, Step 4). The hint to increase time tolerance links the user to a mental model for resolution without requiring in-context settings access.
