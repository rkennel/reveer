# ADR-009: No User Accounts or Cloud Sync at v1

**Status:** Accepted  
**Date:** 2026-04-11

## Context

User accounts would enable route history sync across devices, personalization, and future social features. However, they also introduce significant complexity: authentication flows, a backend service, a database, password/token management, and privacy/compliance considerations. At v1, the product needs to validate its core value proposition — route variation — before investing in an account infrastructure.

The no-account approach also strengthens the privacy story: no user data is collected, no login is required, and nothing leaves the device.

## Decision

Reveer v1 has **no user accounts, no authentication, and no cloud sync**.

## Consequences

- No login, signup, or account management screens exist at v1.
- No authentication libraries (Firebase Auth, Auth0, Clerk, etc.) are added to the project.
- No user identifiers, tokens, or session data are created or stored.
- Route history is device-local and lost if the user clears browser data. This is expected and documented.
- Any code that introduces authentication, user identity, or outbound data sync to a Reveer-owned service is out of scope and must be flagged as a BLOCKER.
- When user accounts are introduced (future ADR), the migration path from localStorage to cloud storage must be explicitly designed.
