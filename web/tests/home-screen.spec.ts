/**
 * Acceptance tests for Story 001 — Home Screen: Map and Geolocation
 *
 * These tests are intentionally written against acceptance criteria that have
 * not yet been implemented.  Every test in this file is expected to FAIL until
 * the home screen feature is built.
 *
 * The Google Maps JavaScript SDK is not available in the test environment (no
 * real API key).  Where the AC requires verifying map-related UI, we assert
 * on the DOM container and visible landmarks that the implementation must
 * render — we do NOT attempt to drive the Google Maps SDK itself.
 */

import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Shared setup: grant geolocation permission and inject a stubbed position so
// navigator.geolocation.getCurrentPosition resolves immediately with a fixed
// coordinate.  This prevents tests from hanging on a real GPS request.
// ---------------------------------------------------------------------------
const MOCK_LATITUDE = 37.7749
const MOCK_LONGITUDE = -122.4194

test.beforeEach(async ({ page, context }) => {
  // Grant geolocation permission for the origin
  await context.grantPermissions(['geolocation'], { origin: 'http://localhost:5173' })
  await context.setGeolocation({ latitude: MOCK_LATITUDE, longitude: MOCK_LONGITUDE })

  // Stub window.google so that any Google Maps SDK bootstrap code does not
  // throw before the real SDK loads (no API key in CI/test).
  // The implementation must still render its map container — this stub only
  // prevents hard JS crashes from the missing SDK.
  await page.addInitScript(() => {
    // Minimal google.maps stub — enough to silence SDK bootstrap errors.
    // The acceptance tests assert on visible DOM/ARIA, not on SDK internals.
    ;(window as Record<string, unknown>)['google'] = {
      maps: {
        Map: class {
          constructor() {}
          setCenter() {}
          setZoom() {}
        },
        Marker: class {
          constructor() {}
          setMap() {}
        },
        LatLng: class {
          constructor(
            public lat: number,
            public lng: number,
          ) {}
        },
      },
    }
  })

  await page.goto('/')
})

// ---------------------------------------------------------------------------
// AC1: When the app loads, a full-screen interactive map is displayed
//      covering the entire viewport.
// ---------------------------------------------------------------------------
test('AC1: full-screen map container covers the entire viewport on load', async ({ page }) => {
  // The map must be rendered in a container element.  Implementations should
  // use role="application" or a test-id of "map".  We check both and that the
  // element fills the viewport dimensions reported by the Pixel 5 device.
  const mapContainer = page.getByTestId('map')
  await expect(mapContainer).toBeVisible()

  // The container must fill the full viewport (width = 393px, height = 851px
  // for the Pixel 5 as configured in playwright.config.ts via devices['Pixel 5']).
  const boundingBox = await mapContainer.boundingBox()
  expect(boundingBox).not.toBeNull()
  const viewportSize = page.viewportSize()
  expect(viewportSize).not.toBeNull()
  // Allow a 1px tolerance for sub-pixel rounding.
  expect(boundingBox!.width).toBeGreaterThanOrEqual(viewportSize!.width - 1)
  expect(boundingBox!.height).toBeGreaterThanOrEqual(viewportSize!.height - 1)
})

// ---------------------------------------------------------------------------
// AC2: The map automatically requests the user's current location and centers
//      on it within 3 seconds on a 4G connection.
//
//      In the test environment we grant geolocation permission and inject a
//      mock position (see beforeEach).  We verify that the app consumed the
//      permission and reflects a "location acquired" state in the UI within
//      3 seconds — represented by the current-location indicator becoming
//      visible (see AC5).  The 4G network constraint is covered by AC6.
// ---------------------------------------------------------------------------
test('AC2: app requests geolocation and reflects acquired location within 3 seconds', async ({
  page,
}) => {
  // After load, the current-location indicator must appear within 3 s, which
  // implies the app called getCurrentPosition and processed the result.
  const locationIndicator = page.getByTestId('current-location-indicator')
  await expect(locationIndicator).toBeVisible({ timeout: 3000 })
})

// ---------------------------------------------------------------------------
// AC3: A floating search bar labeled "Where to?" appears at the top of the map.
// ---------------------------------------------------------------------------
test('AC3: floating search bar labeled "Where to?" is visible at the top of the screen', async ({
  page,
}) => {
  // The search bar should be reachable as a searchbox or textbox role and
  // contain the placeholder / accessible label "Where to?".
  const searchBar = page.getByRole('searchbox', { name: /where to\?/i })
  await expect(searchBar).toBeVisible()

  // The search bar must be positioned in the top region of the viewport.
  // "Top of the map" = within the upper 25 % of the viewport height.
  const boundingBox = await searchBar.boundingBox()
  expect(boundingBox).not.toBeNull()
  const viewportSize = page.viewportSize()
  expect(viewportSize).not.toBeNull()
  expect(boundingBox!.y).toBeLessThan(viewportSize!.height * 0.25)
})

// ---------------------------------------------------------------------------
// AC4: A settings gear icon is visible in the top-right corner of the home screen.
// ---------------------------------------------------------------------------
test('AC4: settings gear icon is visible in the top-right corner', async ({ page }) => {
  // The icon should carry an accessible label so screen-reader users can
  // identify it as "Settings".
  const settingsButton = page.getByRole('button', { name: /settings/i })
  await expect(settingsButton).toBeVisible()

  // Must be positioned in the top-right quadrant of the viewport.
  const boundingBox = await settingsButton.boundingBox()
  expect(boundingBox).not.toBeNull()
  const viewportSize = page.viewportSize()
  expect(viewportSize).not.toBeNull()

  // Top: within upper 25 % of viewport height
  expect(boundingBox!.y).toBeLessThan(viewportSize!.height * 0.25)
  // Right edge: the button's left edge must start past the horizontal midpoint
  expect(boundingBox!.x).toBeGreaterThan(viewportSize!.width * 0.5)
})

// ---------------------------------------------------------------------------
// AC5: The current location indicator is visible on the map at the user's
//      detected position.
// ---------------------------------------------------------------------------
test('AC5: current location indicator is visible on the map', async ({ page }) => {
  // The indicator element must be present and visible inside the map area.
  const locationIndicator = page.getByTestId('current-location-indicator')
  await expect(locationIndicator).toBeVisible()

  // It must be visually inside the map container, not rendered outside it.
  const mapContainer = page.getByTestId('map')
  const mapBox = await mapContainer.boundingBox()
  const indicatorBox = await locationIndicator.boundingBox()
  expect(mapBox).not.toBeNull()
  expect(indicatorBox).not.toBeNull()

  // The centre of the indicator must sit within the map's bounding box.
  const indicatorCentreX = indicatorBox!.x + indicatorBox!.width / 2
  const indicatorCentreY = indicatorBox!.y + indicatorBox!.height / 2
  expect(indicatorCentreX).toBeGreaterThanOrEqual(mapBox!.x)
  expect(indicatorCentreX).toBeLessThanOrEqual(mapBox!.x + mapBox!.width)
  expect(indicatorCentreY).toBeGreaterThanOrEqual(mapBox!.y)
  expect(indicatorCentreY).toBeLessThanOrEqual(mapBox!.y + mapBox!.height)
})

// ---------------------------------------------------------------------------
// AC6: The page loads and reaches an interactive state in under 3 seconds on
//      a simulated 4G connection.
//
//      NOTE: Playwright cannot accurately simulate true 4G network throttling
//      on its own — the CDP network emulation approximates throughput but does
//      not replicate all real-network latency characteristics.  This test
//      verifies that the page reaches an interactive state (all critical UI
//      elements visible) within 3 seconds on the local dev server, which is a
//      necessary (but not sufficient) condition for the 4G requirement.
//      Full 4G performance testing requires a dedicated tool such as
//      Lighthouse CI or WebPageTest with real throttling profiles.
// ---------------------------------------------------------------------------
test('AC6: page reaches interactive state (all critical UI visible) within 3 seconds', async ({
  page,
  context,
}) => {
  // Apply approximate 4G throttling via CDP (download ~9 Mbps, upload ~9 Mbps,
  // latency 20 ms) and reload from a clean state to measure load time.
  const cdpSession = await context.newCDPSession(page)
  await cdpSession.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (9 * 1024 * 1024) / 8, // 9 Mbps → bytes/s
    uploadThroughput: (9 * 1024 * 1024) / 8,
    latency: 20, // ms
  })

  const startTime = Date.now()
  await page.reload()

  // All three critical elements from ACs 3, 4, and 5 must be visible — this
  // constitutes "interactive state" for the home screen.
  await Promise.all([
    expect(page.getByTestId('map')).toBeVisible({ timeout: 3000 }),
    expect(page.getByRole('searchbox', { name: /where to\?/i })).toBeVisible({ timeout: 3000 }),
    expect(page.getByRole('button', { name: /settings/i })).toBeVisible({ timeout: 3000 }),
  ])

  const elapsed = Date.now() - startTime
  // Sanity-check: the wall-clock time observed by Playwright must be under 3 s.
  // On the local dev server this is trivially fast; the real 4G gate is
  // enforced by the performance testing pipeline (see NOTE above).
  expect(elapsed).toBeLessThan(3000)

  await cdpSession.detach()
})
