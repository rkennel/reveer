# 010: Time Tolerance Setting — Persistence and Validation

## User Story
As a daily commuter, I want to configure how many extra minutes I am willing to add for a different route so that Reveer finds variations that fit my schedule.

## Acceptance Criteria
1. The time tolerance defaults to 10 minutes on first use (no stored setting present).
2. The stepper's − button does not allow the value to drop below 5 minutes; an inline validation message is shown if the user attempts to set a value below 5.
3. Tapping + increases the tolerance by 1 minute; tapping − decreases it by 1 minute (floor: 5 minutes).
4. The updated tolerance value is saved to localStorage immediately when the user adjusts it, without requiring a separate save action.
5. The persisted tolerance value is still present and correctly shown after the user closes and reopens the app.
6. Tapping "Clear route history" removes all stored route fingerprints from localStorage and resets the history count display to "0 / 5" without affecting the time tolerance value.

## PRD Reference
Section 4.1a — Time Tolerance Setting; Section 7 — Constraints and Edge Cases (User sets tolerance below 5 minutes)

## Relevant ADRs
- ADR-003: localStorage Only — No Backend at v1 — the tolerance is stored in a single localStorage key; no server call is made.
- ADR-009: No User Accounts or Cloud Sync at v1 — settings are device-local; clearing browser data resets them.

## Dependencies
- 009-settings-screen must be complete before this story begins

## Notes
The minimum value of 5 minutes is a hard floor enforced by the UI — the stepper must not allow values below 5. There is no upper cap (any positive integer is valid). The tolerance is read by the route variation algorithm (story 004) at route selection time. Clearing history (criterion 6) does not affect the tolerance because they are stored under separate localStorage keys.
