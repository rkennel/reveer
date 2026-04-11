# Reveer — CLAUDE.md

## Project Summary

Reveer is a mobile web navigation app (PWA-compatible) that selects the most efficient route to the user's destination while ensuring it differs from the last 5 routes taken between the same origin-destination pair. The core concept: break the autopilot and keep commuters mentally present.

**Tagline:** Veer Off Autopilot

**PRD:** `requirement-docs/reveer-initial/PRD-Reveer.md` (v1.4, current)  
**ADRs:** `requirement-docs/adr/` — all architectural decisions are recorded here and are conformance requirements

---

## Tech Stack

- **Framework:** React (modern JS, TypeScript preferred)
- **Build Tool:** Vite
- **Linting:** ESLint with TypeScript rules (`@typescript-eslint`)
- **Formatting:** Prettier (enforced via ESLint plugin — single source of truth)
- **Hosting:** Google Cloud — Firebase Hosting (recommended for static/PWA)
- **Maps:** Google Maps JavaScript SDK (rendering), Google Routes API (route fetching — use Routes API, NOT the legacy Directions API)
- **Places:** Google Places Autocomplete API
- **Location:** Browser Geolocation API
- **Storage:** Browser localStorage (route history, time tolerance setting, recent destinations)
- **No backend at v1** — fully client-side, no user accounts

### Testing Stack

- **Unit tests:** Vitest + React Testing Library (RTL)
- **Functional/acceptance tests:** Playwright
- **Coverage target:** >90% unit test coverage — achieved naturally through TDD, not bolted on after

---

## Key Business Rules

- Routes are stored as encoded polyline fingerprints keyed by normalized origin+destination (lat/lng rounded to 3 decimal places, ~150m grid)
- Two routes are considered "the same" if spatial overlap ≥ 80%
- Route history: last 5 routes per origin-destination pair; newest at index 0
- Time tolerance: min 5 minutes, default 10 minutes; stored in localStorage
- Route history is committed to localStorage when user taps "Start" (not on trip completion — Reveer has no visibility into the trip after handoff)
- Navigation hands off to Google Maps via deep link: `https://www.google.com/maps/dir/?api=1&origin=...&destination=...&waypoints=...&travelmode=driving`

## Route Variation Algorithm

1. Fetch candidates from Google Routes API with `alternatives: true`
2. Score each by novelty (% spatial overlap with stored history — lower overlap = higher novelty)
3. Discard candidates that exceed fastest route time + user tolerance
4. Select highest-novelty candidate within tolerance
5. Edge case: if all candidates match prior routes, fall back to fastest route and show "Previously used route" badge

---

## Screens

| Screen | Notes |
|--------|-------|
| Home | Full-screen map, floating search bar, settings icon (top right) |
| Settings | Time tolerance stepper (min 5, default 10 min), route history visualization, clear history |
| Destination Search | Places Autocomplete + recent destinations |
| Route Preview | Selected route on map, trip stats, route status badge, "Start in Google Maps" (primary), "Try a different route" (secondary) |
| No Route Available | Amber warning, "Previously used route" badge, hint to increase tolerance |

The route status badge ("New route" / "Previously used route") is the **only** novelty signal shown to users — variation is otherwise silent and seamless.

---

## Out of Scope (v1)

- User accounts / cloud sync
- Turn-by-turn navigation (Google Maps handles this)
- Social/sharing features
- Offline maps / service workers
- Native iOS/Android apps
- Multi-stop routing
- Analytics or tracking

---

## Development Conventions

- Mobile-first: design for one-handed phone use, large tap targets, high contrast
- Performance target: route computation < 3 seconds; initial load < 3 seconds on 4G
- No analytics or tracking at launch; no data leaves the device
- The 80% polyline overlap threshold and 150m grid normalization are tunable constants — treat them as named constants, not magic numbers
- Enable billing on Google Cloud and set budget alerts before any API key is used in production

### Engineering Philosophy — XP / TDD

This project follows strict Extreme Programming (XP) practices. These are non-negotiable:

- **Test-Driven Development:** Write a failing test before writing any implementation code. Red → Green → Refactor. Never write implementation first.
- **Unit tests with React Testing Library:** Test behavior from the user's perspective, not implementation details. Avoid testing internal state, refs, or component internals. Follow Kent C. Dodds' RTL guidance: query by role, label, and text — not by class or test IDs unless unavoidable.
- **Playwright for acceptance tests:** Each user-facing acceptance criterion from the PRD should have a corresponding Playwright test. These are the authoritative definition of "done" for a feature.
- **Coverage is a byproduct, not a target:** >90% unit coverage is expected as a natural result of TDD. Do not write tests to hit a coverage number — write tests to drive design.
- **Clean, readable code:** Code should be self-explanatory. Prefer clarity over cleverness. Short functions with clear names. Refactor mercilessly once tests are green.
- **No untested code:** Do not write implementation code that isn't covered by a test written first.

### Code Quality — Linting and Formatting

- **ESLint** with `@typescript-eslint` for type-aware linting. All lint errors must be resolved before committing — no `// eslint-disable` suppressions without explicit justification.
- **Prettier** for formatting, enforced through `eslint-plugin-prettier` so `eslint --fix` handles both. No separate `prettier` script needed.
- **TypeScript strict mode** (`"strict": true` in tsconfig). No `any` types, no implicit `any`. Type everything explicitly or let inference do it — never suppress the type system.
- CI (when added) must run `eslint` and `tsc --noEmit` as required checks.
