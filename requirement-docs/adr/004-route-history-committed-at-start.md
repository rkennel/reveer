# ADR-004: Route History Committed at "Start" Tap, Not Trip Completion

**Status:** Accepted  
**Date:** 2026-04-11

## Context

Reveer has no visibility into what happens after the user taps "Start" and Google Maps opens. The app moves to the background and receives no signal when the trip completes, is cancelled, or is rerouted. Two options were considered: commit route history at "Start" tap, or attempt to track completion via some proxy signal.

## Decision

Route history is written to localStorage **at the moment the user taps "Start"** — immediately before the Google Maps deep link is opened.

## Consequences

- If a user taps "Start" and then immediately cancels the trip in Google Maps, the route is still recorded in history. This is an accepted limitation.
- No background tracking, geolocation polling, or service worker is needed to detect trip completion.
- The implementation of the "Start" button handler must write to localStorage as its first action, before opening the deep link.
- Code that writes route history at any other point in the flow (e.g., after navigation returns, on app resume) is incorrect and must be flagged as a BLOCKER.
