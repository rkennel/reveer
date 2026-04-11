# ADR-003: localStorage Only — No Backend at v1

**Status:** Accepted  
**Date:** 2026-04-11

## Context

Reveer needs to persist route history, time tolerance settings, and recent destinations between sessions. The options are: a backend API with a database, a third-party sync service, or browser localStorage. At v1 the user base is small and unknown, and the privacy story is a product differentiator — no data leaving the device is a feature, not a constraint.

## Decision

All persistence at v1 uses **browser localStorage only**. There is no backend server, no database, no cloud sync, and no third-party data storage service.

Storage keys:
- Route history: keyed by normalized origin+destination string
- Time tolerance setting: single key
- Recent destinations: single key

## Consequences

- No network calls are made to any Reveer-owned server. The only outbound network calls are to Google Maps Platform APIs.
- No user authentication, sessions, or tokens exist at v1.
- Data is siloed per browser/device. If a user clears browser data, all history and settings reset — this is expected and documented in the PRD.
- Any code that introduces a `fetch()`, `axios`, or similar call to a non-Google endpoint is a BLOCKER in code review.
- Future migration to cloud sync (ADR to be written when that work begins) will need to handle the localStorage → server migration path.
