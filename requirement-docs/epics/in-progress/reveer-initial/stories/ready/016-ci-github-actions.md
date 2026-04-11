# 016: CI Pipeline — GitHub Actions

## User Story
As a developer, I want a GitHub Actions workflow that runs on every push and pull request so that linting, unit test coverage, and acceptance tests are verified automatically before code is merged.

## Acceptance Criteria
1. The workflow triggers on every push to any branch and on every pull request targeting any branch.
2. The workflow runs lint and Prettier checks first — if lint fails the workflow exits immediately with a failure status.
3. After lint passes, the workflow runs all unit tests with coverage — if any test fails the workflow exits immediately with a failure status.
4. If unit tests pass but coverage is below 90% (lines, functions, branches, or statements), the workflow exits with a failure status.
5. After unit tests and coverage pass, the workflow runs all Playwright tests against Mobile Chrome — if any test fails the workflow exits with a failure status.
6. If all steps pass the workflow completes with a success status.

## PRD Reference
Section 6.1 — Platform (quality and delivery standards implied by the tech stack decisions)

## Relevant ADRs
- ADR-001: Frontend Stack — workflow must use the same toolchain (Vite, Vitest, Playwright, ESLint, TypeScript)
- ADR-010: Testing Strategy — the three quality gates (lint, unit+coverage, Playwright) match the four required checks

## Dependencies
- None — this story can be developed independently of all other stories

## Notes
- Steps must be sequential and fail-fast: lint → unit tests + coverage → Playwright. Do not run later steps if an earlier step fails.
- TypeScript type checking (`tsc --noEmit`) should be included alongside lint as part of the first step.
- Playwright tests run in headless Chromium. The workflow must install Playwright browser dependencies (`npx playwright install --with-deps chromium`) before running tests.
- Node.js version should match the development environment (v24).
- The workflow file lives at `.github/workflows/ci.yml`.
