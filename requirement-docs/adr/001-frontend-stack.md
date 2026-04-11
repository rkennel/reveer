# ADR-001: Frontend Stack — React, TypeScript, Vite

**Status:** Accepted  
**Date:** 2026-04-11

## Context

Reveer is a mobile web application with no backend at v1. It needs a modern, component-based UI framework with strong TypeScript support, fast local development tooling, and a broad ecosystem for testing.

## Decision

- **React** as the UI framework
- **TypeScript** in strict mode (`"strict": true`) throughout — no `any` types, no type suppressions
- **Vite** as the build tool and dev server

## Consequences

- TypeScript strict mode is non-negotiable. All code must satisfy the compiler with no suppressions.
- No other UI frameworks (Vue, Svelte, Angular) are introduced — React is the single choice.
- Vite is the only build tool. Webpack, Parcel, or other bundlers are not added.
- All new source files use `.ts` or `.tsx` extensions. No plain `.js` or `.jsx` files in `web/src/`.
