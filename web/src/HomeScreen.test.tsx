/**
 * Unit tests for Story 001 — Home Screen: Map and Geolocation
 *
 * TDD: tests are written before implementation. Each test drives one unit of
 * behaviour. Queries use role, label, and visible text only (RTL rules).
 * data-testid is NOT used here — it is reserved for Playwright acceptance tests.
 *
 * SDK constructor-call assertions (MockMap, MockMarker) belong in
 * useGoogleMap.test.ts, not here.
 */

import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HomeScreen from './HomeScreen'

// ---------------------------------------------------------------------------
// Google Maps SDK stub — prevents crashes when the SDK is absent.
// ---------------------------------------------------------------------------
function setupGoogleMock() {
  ;(window as Record<string, unknown>)['google'] = {
    maps: {
      Map: vi.fn().mockImplementation(() => ({ setCenter: vi.fn(), setZoom: vi.fn() })),
      Marker: vi.fn().mockImplementation(() => ({ setMap: vi.fn() })),
      LatLng: class {
        constructor(
          public lat: number,
          public lng: number,
        ) {}
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Geolocation mock
// ---------------------------------------------------------------------------
const MOCK_LATITUDE = 37.7749
const MOCK_LONGITUDE = -122.4194

function setupGeolocationMock(succeed = true) {
  const mockGetCurrentPosition = vi.fn(
    (successCallback: PositionCallback, errorCallback?: PositionErrorCallback | null) => {
      if (succeed) {
        successCallback({
          coords: {
            latitude: MOCK_LATITUDE,
            longitude: MOCK_LONGITUDE,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        })
      } else {
        errorCallback?.({
          code: 1,
          message: 'Permission denied',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        })
      }
    },
  )

  Object.defineProperty(navigator, 'geolocation', {
    value: { getCurrentPosition: mockGetCurrentPosition },
    configurable: true,
    writable: true,
  })

  return mockGetCurrentPosition
}

beforeEach(() => {
  setupGoogleMock()
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// 1. Map container is rendered
// ---------------------------------------------------------------------------
describe('HomeScreen map container', () => {
  it('renders a map container element', () => {
    setupGeolocationMock()
    render(<HomeScreen />)
    const mapContainer = screen.getByRole('application', { name: /map/i })
    expect(mapContainer).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 2. Search bar
// ---------------------------------------------------------------------------
describe('HomeScreen search bar', () => {
  it('renders a searchbox labeled "Where to?"', () => {
    setupGeolocationMock()
    render(<HomeScreen />)
    const searchBar = screen.getByRole('searchbox', { name: /where to\?/i })
    expect(searchBar).toBeInTheDocument()
  })

  it('renders the search bar with placeholder text "Where to?"', () => {
    setupGeolocationMock()
    render(<HomeScreen />)
    const searchBar = screen.getByPlaceholderText(/where to\?/i)
    expect(searchBar).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 3. Settings button
// ---------------------------------------------------------------------------
describe('HomeScreen settings button', () => {
  it('renders a Settings button', () => {
    setupGeolocationMock()
    render(<HomeScreen />)
    const settingsButton = screen.getByRole('button', { name: /settings/i })
    expect(settingsButton).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 4. Geolocation — happy path (user-visible behaviour only)
// ---------------------------------------------------------------------------
describe('HomeScreen geolocation', () => {
  it('calls navigator.geolocation.getCurrentPosition on mount', () => {
    const mockGetCurrentPosition = setupGeolocationMock()
    render(<HomeScreen />)
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
  })

  it('shows a visible current-location indicator after geolocation succeeds', () => {
    setupGeolocationMock()
    act(() => {
      render(<HomeScreen />)
    })
    // The indicator must be present and have an accessible name for screen readers
    const indicator = screen.getByTitle(/current location/i)
    expect(indicator).toBeInTheDocument()
  })

  it('hides the current-location indicator when geolocation has not yet resolved', () => {
    // Override with a no-op so position never arrives
    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition: vi.fn() },
      configurable: true,
      writable: true,
    })
    render(<HomeScreen />)
    expect(screen.queryByTitle(/current location/i)).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 5. Geolocation — error state renders gracefully
// ---------------------------------------------------------------------------
describe('HomeScreen geolocation error state', () => {
  it('does not show the current-location indicator when geolocation fails', () => {
    setupGeolocationMock(false)
    act(() => {
      render(<HomeScreen />)
    })
    expect(screen.queryByTitle(/current location/i)).not.toBeInTheDocument()
  })

  it('still renders the map container and UI when geolocation fails', () => {
    setupGeolocationMock(false)
    act(() => {
      render(<HomeScreen />)
    })
    expect(screen.getByRole('application', { name: /map/i })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: /where to\?/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 6. Graceful degradation — API key absent / SDK unavailable
// ---------------------------------------------------------------------------
describe('HomeScreen without Google Maps SDK', () => {
  it('still renders the map container when google is undefined', () => {
    setupGeolocationMock()
    delete (window as Record<string, unknown>)['google']
    render(<HomeScreen />)
    const mapContainer = screen.getByRole('application', { name: /map/i })
    expect(mapContainer).toBeInTheDocument()
  })
})
