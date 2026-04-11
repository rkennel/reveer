# 009: Settings Screen

## User Story
As a daily commuter, I want to access a settings screen from the home screen so that I can review and adjust my time tolerance and route history before starting a trip.

## Acceptance Criteria
1. Tapping the gear icon on the home screen opens the Settings screen.
2. The Settings screen displays the current time tolerance value with a stepper control (− and + buttons) and the label "I'm okay adding up to X minutes to find a new route."
3. The Settings screen displays a route history section showing how many routes are stored (e.g., "3 / 5") for the current device.
4. The Settings screen includes a "Clear route history" button styled distinctly (e.g., red/danger styling) to indicate a destructive action.
5. The Settings screen includes an About section showing app version, storage type ("On-device"), and navigation provider ("Google Maps").
6. A back control on the Settings screen returns the user to the home screen without losing any changes made during the settings visit.

## PRD Reference
Section 4.1a — Time Tolerance Setting; Section 5.3 — Key Screens (Settings)

## Relevant ADRs
- ADR-001: Frontend Stack — React, TypeScript, Vite — the Settings screen is a React component.
- ADR-003: localStorage Only — No Backend at v1 — all settings and history data read by this screen come from localStorage; no server call is made.
- ADR-009: No User Accounts or Cloud Sync at v1 — no account or sync controls appear on this screen.

## Dependencies
- 001-home-screen-map-and-geolocation must be complete before this story begins (the gear icon lives on the home screen)
- 010-time-tolerance-setting must be complete before this story begins (the stepper reads and writes tolerance from localStorage)
- 007-route-history-storage must be complete before this story begins (the history count reads from localStorage)

## Notes
Settings are accessed from the home screen only. The time tolerance control is not exposed on the route preview screen (Section 4.1a and Flow design decisions). The "Clear route history" action is covered in story 010. The about section information is static display only.
