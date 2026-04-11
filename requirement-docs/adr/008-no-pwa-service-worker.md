# ADR-008: No PWA Service Worker at v1

**Status:** Accepted  
**Date:** 2026-04-11

## Context

Progressive Web App (PWA) service workers add offline capability and app installability to web applications. For Reveer, the question was whether a service worker is needed at v1 to deliver the core product experience.

Reveer's core flow requires: geolocation (device, not cacheable), Google Routes API calls (real-time traffic data, not cacheable), and Google Maps deep link handoff (requires active connectivity). None of these work offline in any meaningful way.

## Decision

Reveer v1 is a **standard mobile web application with no service worker**. It is not a PWA at launch.

The app is hosted on Firebase Hosting and delivered as a standard static web app.

## Consequences

- No `service-worker.ts`, no `manifest.json`, and no Workbox configuration is added to the project at v1.
- The app requires an active internet connection to function. No offline fallback is provided.
- Users cannot "install" the app to their home screen via PWA install prompt at v1.
- Any code that registers a service worker or introduces a PWA manifest is out of scope and must be flagged as a BLOCKER in code review.
- PWA support is a future roadmap item and will be addressed in a new ADR when that work begins.
