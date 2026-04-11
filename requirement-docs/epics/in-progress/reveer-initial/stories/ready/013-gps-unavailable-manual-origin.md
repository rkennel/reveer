# 013: GPS Unavailable — Manual Origin Entry

## User Story
As a daily commuter, I want to be prompted to enter my starting location manually when the app cannot detect my GPS position so that I can still use Reveer even when automatic location detection fails.

## Acceptance Criteria
1. If the browser Geolocation API returns an error or the user denies location permission, the app displays a prompt asking the user to enter their origin manually instead of showing a location error and stopping.
2. The manual origin input field uses Google Places Autocomplete to suggest addresses as the user types.
3. After the user selects a manual origin, the map centers on that location and the app proceeds normally to destination selection.
4. The manual origin prompt is shown in place of the automatic geolocation step — the user is not taken to an error screen from which they cannot recover.
5. If the user grants location permission after initially denying it, the app can be refreshed to re-attempt automatic geolocation.

## PRD Reference
Section 4.6 — Origin and Destination Input; Section 7 — Constraints and Edge Cases (GPS unavailable)

## Relevant ADRs
- ADR-003: localStorage Only — No Backend at v1 — manual origin entry uses Google Places Autocomplete; no Reveer server is involved.
- ADR-006: 150m Grid Normalization for Origin/Destination Keys — the manually entered origin is normalized the same way as a GPS-detected origin before constructing the localStorage key.

## Dependencies
- 001-home-screen-map-and-geolocation must be complete before this story begins
- 002-destination-search-autocomplete must be complete before this story begins (same Places Autocomplete component is reused for origin)

## Notes
GPS unavailability can result from the user denying permission, the device having location services disabled, or a timeout waiting for a GPS fix. All three conditions should trigger the manual entry prompt. This story covers the recovery path only — it does not cover the normal geolocation flow (story 001).
