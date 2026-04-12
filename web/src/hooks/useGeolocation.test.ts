/**
 * Unit tests for useGeolocation hook.
 *
 * Tests are isolated: they stub navigator.geolocation directly without
 * rendering any component.
 */

import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useGeolocation } from './useGeolocation'

const MOCK_LATITUDE = 51.5074
const MOCK_LONGITUDE = -0.1278

// ---------------------------------------------------------------------------
// Success path
// ---------------------------------------------------------------------------
describe('useGeolocation — success path', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: vi.fn((successCb: PositionCallback) => {
          successCb({
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
        }),
      },
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null position before geolocation resolves', () => {
    // Override with a no-op so position stays null during render
    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition: vi.fn() },
      configurable: true,
      writable: true,
    })
    const { result } = renderHook(() => useGeolocation())
    expect(result.current.position).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('sets position when geolocation resolves', () => {
    const { result } = renderHook(() => useGeolocation())
    expect(result.current.position).toEqual({
      latitude: MOCK_LATITUDE,
      longitude: MOCK_LONGITUDE,
    })
    expect(result.current.error).toBeNull()
  })

  it('calls navigator.geolocation.getCurrentPosition once on mount', () => {
    const spy = vi.fn((successCb: PositionCallback) => {
      successCb({
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
    })
    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition: spy },
      configurable: true,
      writable: true,
    })
    renderHook(() => useGeolocation())
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

// ---------------------------------------------------------------------------
// Error path
// ---------------------------------------------------------------------------
describe('useGeolocation — error path', () => {
  const mockError: GeolocationPositionError = {
    code: 1,
    message: 'Permission denied',
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  }

  beforeEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: vi.fn(
          (_successCb: PositionCallback, errorCb?: PositionErrorCallback | null) => {
            errorCb?.(mockError)
          },
        ),
      },
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sets error when geolocation rejects', () => {
    const { result } = renderHook(() => useGeolocation())
    expect(result.current.position).toBeNull()
    expect(result.current.error).toBe(mockError)
  })
})

// ---------------------------------------------------------------------------
// Guard: missing navigator.geolocation
// ---------------------------------------------------------------------------
describe('useGeolocation — missing geolocation API', () => {
  let originalGeolocation: Geolocation

  beforeEach(() => {
    originalGeolocation = navigator.geolocation
    // Remove the property to simulate environments without geolocation support
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: originalGeolocation,
      configurable: true,
      writable: true,
    })
  })

  it('does not throw when navigator.geolocation is absent', () => {
    expect(() => renderHook(() => useGeolocation())).not.toThrow()
  })

  it('returns null position and null error when geolocation is unavailable', () => {
    const { result } = renderHook(() => useGeolocation())
    expect(result.current.position).toBeNull()
    expect(result.current.error).toBeNull()
  })
})
