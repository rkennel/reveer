# ADR-002: Use Google Routes API, Not Legacy Directions API

**Status:** Accepted  
**Date:** 2026-04-11

## Context

Google offers two APIs for fetching route data: the legacy Directions API and the newer Routes API. Both can return multiple route alternatives for a given origin-destination pair, but they differ in performance, response structure, and Google's support trajectory.

## Decision

Use the **Google Routes API** exclusively for all route fetching. The legacy Directions API is not used.

Reasons:
- Routes API is Google's current preferred product and will receive ongoing investment
- Routes API supports field masks, which reduce response payload size and minimize billable SKU usage
- Routes API offers better performance characteristics for the kind of multi-alternative queries Reveer needs

## Consequences

- All route fetching code must use the Routes API endpoint and request/response schema — not the Directions API.
- Field masks must be used on every Routes API request to request only the fields Reveer needs (encoded polyline, duration, distance). This is both a cost control and a performance requirement.
- If a developer is unfamiliar with the Routes API, they should consult the Google Maps Platform Routes API documentation rather than defaulting to Directions API examples.
- Code reviewer must flag any use of the Directions API (`/maps/api/directions/`) as a BLOCKER.
