# ADR-005: 80% Polyline Spatial Overlap Defines "Same Route"

**Status:** Accepted  
**Date:** 2026-04-11

## Context

Reveer must determine whether a candidate route is "the same" as a previously taken route. Route comparison is done by decoding encoded polylines into lat/lng point arrays and measuring spatial overlap. The threshold for classifying two routes as identical needed to be set at a level that correctly identifies functionally duplicate routes without false positives on genuinely different routes in dense urban grids.

A 70% threshold was considered and rejected: in dense urban areas where streets are close together, 70% risks flagging genuinely different routes as duplicates. 80% was selected as the safer floor.

## Decision

Two routes are classified as **"the same"** if **≥ 80% of road segments spatially overlap** (i.e., ≥ 80% of decoded polyline points from one route fall within N meters of a point in the comparison route).

This threshold is a **named constant** in the codebase, not a magic number.

```typescript
export const ROUTE_SIMILARITY_THRESHOLD = 0.8
```

## Consequences

- The 80% threshold must be implemented as the named constant `ROUTE_SIMILARITY_THRESHOLD`. Any hardcoded `0.8` or `80` in similarity comparison logic is a code review violation.
- The threshold is intentionally tunable. Engineering should validate it against real commute pairs during development and adjust the constant if empirical testing shows it is too aggressive or too lenient.
- If the threshold is changed, a new ADR superseding this one should be written documenting why.
- Code reviewer must verify the constant name is used, not a magic number.
