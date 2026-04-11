# 005: Route Preview Screen — Normal State

## User Story
As a daily commuter, I want to see the selected route displayed on a map with trip stats before I commit to navigating so that I can confirm the destination, estimated time, and distance before handing off to Google Maps.

## Acceptance Criteria
1. The route preview screen displays the destination name and address.
2. The route preview screen displays three trip stats: estimated drive time (in minutes), distance (in miles), and estimated arrival time.
3. The selected route is drawn as a polyline on the embedded map.
4. A "New route" badge is visible on the screen when the selected route does not match any route in the user's recent history.
5. A "Start in Google Maps" primary button and a "Try a different route" secondary button are both visible and tappable.
6. The time tolerance settings control is not present on the route preview screen.

## PRD Reference
Section 4.5 — Route Preview Screen; Section 5.3 — Key Screens (Route Preview); Section 5.4 — What the App Does and Does NOT Show

## Relevant ADRs
- ADR-001: Frontend Stack — React, TypeScript, Vite — the preview screen is a React component.
- ADR-007: Navigation Handed Off to Google Maps via Deep Link — the "Start in Google Maps" button is the primary CTA; it triggers the deep link handoff (story 006).

## Dependencies
- 003-route-fetching-via-google-routes-api must be complete before this story begins
- 004-route-variation-algorithm must be complete before this story begins

## Notes
The route status badge is the only explicit novelty signal shown to the user — no explanation of why the route differs is given (Section 5.4). The "Try a different route" button behavior (re-running the algorithm without writing history) is covered in story 011. The edge case variant of this screen (no novel route found) is covered in story 012.
