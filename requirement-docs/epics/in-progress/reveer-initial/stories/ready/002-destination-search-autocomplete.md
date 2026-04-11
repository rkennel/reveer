# 002: Destination Search with Places Autocomplete

## User Story
As a daily commuter, I want to type a destination into a search bar and see autocomplete suggestions so that I can quickly find and select my destination without typing the full address.

## Acceptance Criteria
1. Tapping the "Where to?" search bar opens a destination search input and brings up the device keyboard.
2. As the user types at least one character, a list of autocomplete suggestions appears beneath the search input, sourced from Google Places Autocomplete.
3. Each suggestion displays a place name and a secondary address line.
4. Tapping a suggestion selects it as the destination and closes the search input.
5. After a destination is selected, the app begins fetching routes (transitions to the route preview flow).
6. The search input can be cleared or dismissed to return to the home screen without selecting a destination.

## PRD Reference
Section 4.6 — Origin and Destination Input; Section 5.3 — Key Screens (Destination Search)

## Relevant ADRs
- ADR-002: Use Google Routes API, Not Legacy Directions API — destination selection feeds into the Routes API call; Places Autocomplete is the input mechanism.
- ADR-003: localStorage Only — No Backend at v1 — no Reveer-owned server is called; only Google APIs are used.

## Dependencies
- 001-home-screen-map-and-geolocation must be complete before this story begins

## Notes
The origin is the user's current geolocation detected on the home screen. Places Autocomplete is powered by the Google Places Autocomplete API. Voice input is mentioned in Section 4.1 but is not called out as a testable acceptance criterion in the PRD and is deferred; this story covers text search only.
