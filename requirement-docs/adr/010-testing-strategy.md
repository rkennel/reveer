# ADR-010: Testing Strategy — Vitest + RTL for Unit Tests, Playwright for Acceptance Tests

**Status:** Accepted  
**Date:** 2026-04-11

## Context

Reveer follows strict Test-Driven Development (XP/TDD). The testing stack needs to support: fast unit tests that drive design, and functional acceptance tests that verify user-facing behavior against PRD requirements.

## Decision

**Unit tests:** Vitest + React Testing Library (RTL)
- Test files live alongside source files in `web/src/` using the `*.test.ts` / `*.test.tsx` naming convention
- RTL queries use role, label, and visible text — never class names, test IDs, or component internals
- Coverage threshold: ≥ 90% lines, functions, branches, and statements (enforced by Vitest coverage configuration)
- Tests are written before implementation code (TDD)

**Acceptance tests:** Playwright
- Test files live in `web/tests/` using the `*.spec.ts` naming convention
- Tests run against mobile device profiles: Pixel 5 (Mobile Chrome) and iPhone 13 (Mobile Safari)
- Each test maps to a named PRD acceptance criterion, referenced in a comment
- Playwright tests are written before implementation begins for each feature (acceptance-test-driven development)

**Linting and type checking:**
- ESLint with `@typescript-eslint` (strict type-aware rules) + `eslint-plugin-prettier`
- `tsc --noEmit` as a required check
- All four gates — unit tests, Playwright, lint, typecheck — must pass before any feature is considered done

## Consequences

- No other test frameworks (Jest, Cypress, Testing Library for other frameworks) are introduced.
- `describe`/`it`/`expect` from Vitest are used for unit tests; `test`/`expect` from `@playwright/test` for acceptance tests. They must not be mixed.
- Unit test files in `web/src/` are excluded from Playwright's test runner; Playwright test files in `web/tests/` are excluded from Vitest's runner.
- Code reviewer must verify: unit tests exist for all new code, RTL query style is correct, and Playwright tests reference PRD criteria.
- The 90% coverage threshold is enforced by CI. Falling below it blocks the build.
