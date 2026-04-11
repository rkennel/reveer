# ADR-006: 150m Grid Normalization for Origin/Destination Keys

**Status:** Accepted  
**Date:** 2026-04-11

## Context

GPS readings for the same physical location (e.g., a home address or office parking lot) can vary by 10–50m between sessions due to GPS drift. Without normalization, the same commute pair would be stored under dozens of slightly different localStorage keys, making route history comparison useless.

A normalization grid needed to be fine enough to distinguish genuinely different nearby origins, but coarse enough to absorb typical GPS drift.

## Decision

Origin and destination coordinates are **rounded to 3 decimal places** (~150m grid, approximately 0.0015° lat/lng) before being used to construct localStorage keys.

This rounding value is a **named constant** in the codebase:

```typescript
export const COORDINATE_PRECISION = 3
```

The storage key format is:
```
`${origin.lat.toFixed(COORDINATE_PRECISION)},${origin.lng.toFixed(COORDINATE_PRECISION)}→${destination.lat.toFixed(COORDINATE_PRECISION)},${destination.lng.toFixed(COORDINATE_PRECISION)}`
```

## Consequences

- All origin/destination normalization must use `COORDINATE_PRECISION`. No hardcoded `3` or `toFixed(3)` calls in key construction logic.
- Two locations within ~150m of each other will be treated as the same origin or destination. This is intentional and expected.
- Two locations more than ~150m apart will be treated as different origins. This distinguishes, for example, two office buildings on opposite ends of a block.
- Code reviewer must verify the constant is used and the key construction matches the specified format.
