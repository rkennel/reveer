# ADR-007: Navigation Handed Off to Google Maps via Deep Link

**Status:** Accepted  
**Date:** 2026-04-11

## Context

Reveer's role is route selection, not turn-by-turn navigation. Building in-app navigation would require significant complexity (real-time GPS tracking, voice guidance, rerouting logic, map interaction during driving) that is out of scope for v1 and would compete with Google Maps rather than complement it.

## Decision

Once a user taps "Start," Reveer opens **Google Maps via deep link** with the selected route pre-loaded. Reveer does not provide any turn-by-turn navigation.

The deep link format is:
```
https://www.google.com/maps/dir/?api=1&origin={lat,lng}&destination={lat,lng}&waypoints={waypoints}&travelmode=driving
```

On mobile, this opens the Google Maps app directly if installed, or falls back to Google Maps in the browser.

## Consequences

- Reveer contains no turn-by-turn navigation code, no real-time GPS tracking during a trip, and no rerouting logic.
- The "Start" button handler has two responsibilities only: write route history to localStorage, then open the Google Maps deep link.
- Waypoints in the deep link must encode the key decision points of the selected route that differentiate it from the default fastest route. This is how the selected route is communicated to Google Maps.
- Any code that attempts to implement in-app navigation, track the user's position mid-trip, or intercept the navigation handoff is out of scope and must be flagged as a BLOCKER.
- Code reviewer must verify the deep link URL matches the specified format.
