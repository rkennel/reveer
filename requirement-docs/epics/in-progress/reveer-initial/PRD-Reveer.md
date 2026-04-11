# Product Requirements Document
## Reveer — Veer Off Autopilot

**Version:** 1.4  
**Date:** April 9, 2026  
**Status:** Draft  

---

## 1. Overview

### 1.1 Product Summary

Reveer is a mobile web navigation application that gives daily commuters the most efficient route to their destination — with a deliberate, subtle variation from the last five routes taken between the same origin and destination. The core idea is simple: break the autopilot. By nudging drivers onto a slightly different path each trip, Reveer keeps the driver mentally engaged, reducing habituation and encouraging active awareness of their surroundings.

### 1.2 Problem Statement

Daily commuters who take the same route repeatedly tend to "zone out" — a well-documented phenomenon sometimes called highway hypnosis or passive driving. When a driver takes the exact same route every day, they stop actively processing the environment and rely almost entirely on muscle memory. This reduces reaction time, situational awareness, and overall engagement with the act of driving.

Existing navigation apps optimize exclusively for speed or traffic. None of them account for the psychological cost of route monotony.

### 1.3 Vision

To be the navigation app for people who want to arrive not just on time, but fully awake. Reveer — because every trip is a chance to veer off autopilot.

---

## 2. Goals and Success Metrics

### 2.1 Product Goals

- Provide reliable, efficient route selection powered by Google Maps, with navigation handed off directly to the Google Maps application
- Automatically ensure that no route suggested is identical to any of the last five routes taken between the same origin-destination pair
- Allow users to define their acceptable time tolerance for route variation (minimum 5 minutes), and select the most novel route that falls within that threshold
- Deliver a clean, familiar mobile web experience similar to Google Maps in UX patterns

### 2.2 Success Metrics (Launch)

| Metric | Target |
|--------|--------|
| Route variation rate | 100% of navigated trips vary from prior 5 trips |
| Time penalty from variation | Within user-defined tolerance (min: 5 minutes) |
| Session completion rate | > 80% of started navigations reach destination |
| 30-day user retention | > 40% of users return within 30 days |
| Mobile web load time | < 3 seconds on 4G connection |

---

## 3. Target Audience

### 3.1 Primary User

**Daily commuters** — people who travel the same origin-destination pair five or more times per week, typically for work. They are familiar with their route, comfortable with navigation apps, and often drive on "autopilot." They are not necessarily looking for adventure; they simply want to stay mentally present during a trip they take every day.

### 3.2 User Profile

- Age: 25–55
- Uses a smartphone as their primary device
- Already uses Google Maps or Waze regularly
- Commutes by car in an urban or suburban environment
- Drives the same 1–30 mile route repeatedly

### 3.3 Out of Scope at Launch

- Pedestrians and cyclists
- Long-haul or one-off travelers
- Delivery drivers or commercial fleet users (future consideration)

---

## 4. Core Features

### 4.1 Route Request and Display

The user enters (or voice-inputs) a destination. Reveer queries the Google Maps Directions API to retrieve multiple viable routes between the user's current location and the destination. The app displays the selected route on an embedded Google Maps JavaScript SDK map — showing map tiles, the current location indicator, and the proposed route polyline. Reveer's role is route selection; turn-by-turn navigation is handled entirely by the Google Maps application once the user taps "Start."

### 4.1a Time Tolerance Setting

Users can configure their **maximum acceptable time addition** for route variation. This setting is expressed in minutes and governs how much longer than the fastest available route Reveer is allowed to suggest.

- **Minimum value:** 5 minutes
- **Maximum value:** No upper cap (any valid positive integer)
- **Default value:** 10 minutes
- **Storage:** Persisted in browser localStorage alongside route history
- **Access:** Available via a settings icon on the home screen only; the route preview screen does not expose this control

The setting is presented as a simple numeric input with stepper controls (+ / −), labeled clearly: *"I'm okay adding up to X minutes to find a new route."*

### 4.2 Route History Tracking

Reveer stores the last five routes taken between any given origin-destination pair locally on the user's device using browser localStorage. A "route" is defined as an ordered sequence of road segments (encoded polyline or waypoint set) returned by the Google Maps API.

**Storage model:**
- Key: a normalized string of origin + destination (rounded to ~100m grid to handle minor GPS drift)
- Value: an array of up to 5 route fingerprints (encoded polylines), ordered from most recent to oldest
- A new route is added to the front of the array on navigation start; the oldest is dropped when the array exceeds 5 entries

**Future consideration:** Migrate history to a cloud-synced user account when user authentication is introduced.

### 4.3 Route Variation Algorithm

This is the core differentiator of Reveer.

**Step 1 — Fetch candidates.** Query the Google Maps Directions API with `alternatives: true` to retrieve multiple route options (typically 2–4).

**Step 2 — Score for novelty.** Compare each candidate route against the last five stored routes using polyline similarity (e.g., percentage of shared road segments). Rank candidates by novelty score (least overlap = highest novelty).

**Step 3 — Apply time constraint.** Discard any candidate whose estimated travel time exceeds the fastest available route by more than the user's configured time tolerance (minimum 5 minutes, default 10 minutes).

**Step 4 — Select best candidate.** From the remaining candidates, select the one with the highest novelty score. If all candidates are identical to a prior route (rare edge case in areas with very limited road networks), fall back to the fastest route and log the constraint.

**Step 5 — Hand off to Google Maps.** Present the selected route to the user on the preview map. When the user taps "Start," Reveer opens Google Maps via a deep link pre-populated with the origin, destination, and selected waypoints. Google Maps handles all turn-by-turn navigation. Reveer records the route fingerprint to device history at the moment the user taps "Start."

### 4.4 Navigation Handoff to Google Maps

Reveer does not provide its own turn-by-turn navigation. Once the user selects a route and taps "Start," Reveer constructs a Google Maps deep link in the following format:

```
https://www.google.com/maps/dir/?api=1
  &origin={lat,lng}
  &destination={lat,lng}
  &waypoints={intermediate waypoints if needed}
  &travelmode=driving
```

On mobile, this link opens the Google Maps app directly (if installed) or falls back to Google Maps in the browser. The user completes their trip entirely within Google Maps. Reveer does not receive any signal when the trip ends; route history is committed at the moment "Start" is tapped.

### 4.5 Route Preview Screen

The route preview screen presents the selected route before the user commits to navigation. It displays:

- **Destination name and address**
- **Trip stats:** estimated drive time, distance, and arrival time
- **Route status badge:** a small indicator showing "New route" when Reveer has selected a path not in the user's recent history, or "Previously used route" when the edge case fallback applies (see Section 7). This is the only signal Reveer surfaces about route novelty — it is intentionally subtle.
- **"Start in Google Maps" button** (primary CTA): triggers the Google Maps deep link handoff
- **"Try a different route" button** (secondary action): re-runs the route variation algorithm to fetch the next best novel candidate within the user's tolerance. The map updates with the new route polyline and the stats refresh. This button does not alter the stored route history — history is only written when "Start" is tapped.

### 4.6 Origin and Destination Input

- Text search (Google Places Autocomplete)
- Current location auto-detected via browser Geolocation API
- Recent destinations stored locally for quick access (separate from route history)

---

## 5. User Experience

### 5.1 Core User Flow

```
Open App
  └─> Home screen: search bar + map centered on current location
        └─> (Optional) User adjusts time tolerance in Settings
              └─> User enters destination
                    └─> App fetches routes + scores for novelty
                          └─> App displays selected route on map with time/distance
                                └─> User taps "Start"
                                      └─> Route saved to device history
                                            └─> Google Maps opens with pre-loaded route
```

### 5.2 UI Design Principles

- **Familiar:** The map interface mirrors Google Maps conventions. Users should feel immediately at home.
- **Minimal chrome:** No explanation of why the route is different is shown. The variation is silent and seamless. Users who notice it may be curious; that curiosity is part of the experience.
- **Mobile-first:** Designed for one-handed use on a phone mounted in a car. Large tap targets, high-contrast text, and a minimal UI during active navigation.
- **Fast:** The home screen and route selection must load quickly. Route computation should complete within 3 seconds of destination entry.

### 5.3 Key Screens

| Screen | Description |
|--------|-------------|
| Home | Full-screen map, floating search bar at top, current location centered, settings icon (top right) |
| Settings | Time tolerance stepper (min 5 min, default 10 min), route history visualization, clear history option, about info |
| Destination Search | Autocomplete search with recent destinations |
| Route Preview | Map with selected route drawn, trip time/distance/arrival shown, route status badge, "Start in Google Maps" primary button, "Try a different route" secondary button |
| No Route Available | Route preview variant: amber warning banner, greyed dashed route line, "Previously used route" badge, hint to increase time tolerance in settings |
| Handoff | Tapping "Start in Google Maps" deep-links into Google Maps with route pre-loaded; Reveer moves to background |

### 5.4 What the App Does and Does NOT Show

Reveer does not explain that it is avoiding prior paths, does not display a novelty score, and does not announce that a different route was found. The variation is silent and seamless.

The one exception is the **route status badge** on the Route Preview screen. This small label — "New route" or "Previously used route" — gives the user just enough signal to understand what Reveer has done without over-explaining it. Users who notice it may be curious; that curiosity is part of the experience. Users who ignore it are unaffected.

---

## 6. Technical Architecture

### 6.1 Platform

- **Launch:** Mobile web application (PWA-compatible)
- **Framework:** React (or equivalent modern JS framework)
- **Hosting:** Google Cloud (Firebase Hosting or Cloud Run recommended for static/PWA delivery)
- **Future:** Native iOS and Android apps using the same core logic

### 6.2 Key Integrations

| Integration | Purpose |
|-------------|---------|
| Google Maps JavaScript SDK | Map rendering on home and route preview screens |
| Google Maps Directions API | Route fetching with alternatives |
| Google Maps Deep Link (`maps/dir/`) | Handoff to Google Maps app for turn-by-turn navigation |
| Google Places Autocomplete API | Destination search |
| Browser Geolocation API | Current location detection |
| Browser localStorage | Route history, recent destinations, and time tolerance setting |
| Google Cloud (Firebase Hosting or Cloud Run) | App hosting and delivery |

### 6.3 Route Fingerprinting

Each route returned by the Directions API includes an encoded polyline. Reveer will use this polyline as the route's fingerprint for comparison purposes. Similarity between two routes will be computed by decoding both polylines into lat/lng point arrays and measuring spatial overlap (e.g., percentage of points within N meters of a point in the comparison route). A threshold of ~70% overlap will classify two routes as "the same."

### 6.4 Privacy

- No user account or login required at launch
- No data leaves the device (all history stored in localStorage)
- Location data is used in-session only and not persisted beyond what is needed to compute routes
- No analytics or tracking at launch

---

## 7. Constraints and Edge Cases

| Scenario | Handling |
|----------|----------|
| Only one route exists between A and B | Use the single available route; no variation possible |
| All alternate routes exceed user's time tolerance | Select the least-recently-used prior route (best available); notify user no novel route was found within their tolerance |
| User sets tolerance below 5 minutes | Input rejected; floor enforced at 5 minutes with inline validation message |
| User clears browser data | Route history and settings reset; app behaves as if first use |
| GPS unavailable | Prompt user to enter origin manually |
| Google Maps API quota exceeded | Show error message with option to retry |
| Very short trips (< 0.5 miles) | Variation may not be possible; use direct route |
| Google Maps app not installed on device | Deep link falls back to Google Maps in the mobile browser |

---

## 8. Out of Scope for v1.0

The following features are explicitly excluded from the initial launch to maintain focus:

- User accounts and cloud-synced history
- Social or sharing features
- Route rating or feedback mechanism
- Preferences for route types (e.g., avoid highways, prefer scenic routes)
- Offline maps
- Native iOS / Android apps
- Business model / monetization
- Multi-stop routing
- Integration with calendar or commute prediction

---

## 9. Future Roadmap Considerations

These are not committed features, but natural extensions of the v1.0 foundation:

- **User accounts:** Sync route history across devices; enable personalization
- **Commute intelligence:** Learn the user's regular commute pairs and proactively suggest variations
- **Novelty dial:** Let users control how different they want their route to be
- **Streak tracking:** Show users how many consecutive trips have been varied (gamification)
- **Native apps:** iOS and Android for richer navigation integration and background capabilities
- **Scenic mode:** Prefer routes with parks, waterfronts, or lower traffic density

---

## 10. Open Questions

All open questions have been resolved. Decisions are documented below for engineering reference.

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | What is the minimum viable polyline similarity threshold for classifying two routes as "the same"? | **≥ 80% spatial overlap = same route** | A 70% threshold risks flagging genuinely different routes as duplicates in dense urban grids where many streets are close together. 80% is a safer floor — two routes sharing 80%+ of their road segments are functionally identical to the driver. Engineering should treat this as a tunable constant and validate against real commute pairs during development. |
| 2 | How should the app handle re-routing mid-trip? | **No action — route history is locked at "Start" tap** | Once the user taps "Start" and hands off to Google Maps, Reveer has no visibility into the trip. The route fingerprint is committed to history at that moment, and no mid-trip events update it. |
| 3 | Should the app normalize origin/destination to a fixed grid, and at what resolution? | **Yes — snap to a ~150m grid** | GPS readings for the same physical location (e.g., a home address or parking lot) can vary by 10–50m between sessions. Without normalization, the same commute pair would be stored as dozens of different keys, making history comparison useless. A 150m grid (~0.0015° lat/lng) is fine enough to distinguish different origins while coarse enough to absorb typical GPS drift. Engineering should round lat/lng to 3 decimal places before constructing the storage key. |
| 4 | What Google Maps API plan is needed? | **Pay-as-you-go via Google Cloud; monitor against free tier caps** | As of 2026, Google Maps Platform uses SKU-based pricing with free monthly usage caps — 10,000 events/month for Essentials SKUs (which covers basic Directions/Routes requests) and 5,000/month for Pro SKUs. At launch with a small user base, Reveer will likely stay within free tier limits. Engineering should enable billing on the Google Cloud project and set budget alerts. If usage grows, the Starter plan ($100/month, 50,000 combined calls) is the natural next step. The modern **Routes API** (not the legacy Directions API) is recommended — it is Google's current preferred product, offers better performance, and uses field masks to minimize response size and cost. |
| 5 | Is a PWA service worker needed at v1? | **No — standard web app is sufficient** | A service worker adds offline capability and app-installability, neither of which are required for v1. Since navigation hands off to Google Maps, Reveer does not need to function offline. A standard mobile web app served from Google Cloud (Firebase Hosting) is the right scope for launch. PWA features can be added in a future release if user demand warrants it. |

---

## 11. Assumptions

The following assumptions were made in writing this PRD and should be validated before development begins:

- The Google Maps Routes API reliably returns 2+ route alternatives for typical urban commute distances
- Browser localStorage is sufficient for storing 5 route fingerprints per origin-destination pair without performance concerns
- A default time tolerance of 10 minutes is acceptable to most daily commuters; this should be validated with user research
- The Google Maps deep link URL scheme (`maps/dir/`) reliably opens the Google Maps app on iOS and Android with the correct route pre-loaded
- Committing route history at "Start" tap (rather than trip completion) is acceptable given Reveer has no visibility into trip completion events
- An 80% polyline overlap threshold correctly identifies "same" routes across real commute pairs; this should be tested empirically during development
- Rounding lat/lng to 3 decimal places (~150m grid) provides sufficient GPS normalization without incorrectly merging distinct nearby origins

---

*Document owner: TBD*  
*Last updated: April 9, 2026 — v1.4: app renamed to Reveer*
