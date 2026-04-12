/**
 * Unit tests for useGoogleMap hook.
 *
 * Exercises the hook in isolation by stubbing window.google and a container
 * ref. Assertions target observable side-effects (SDK calls) — which is the
 * correct layer for SDK wiring; HomeScreen tests must NOT duplicate these.
 */

import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useGoogleMap } from './useGoogleMap'
import type { GeolocationPosition } from './useGeolocation'

// ---------------------------------------------------------------------------
// Shared mock helpers
// ---------------------------------------------------------------------------
const mockSetCenter = vi.fn()
const mockSetZoom = vi.fn()
const mockSetMap = vi.fn()

class MockMapInstance {
  setCenter = mockSetCenter
  setZoom = mockSetZoom
}
const MockMapConstructor = vi.fn().mockImplementation(() => new MockMapInstance())

class MockMarkerInstance {
  setMap = mockSetMap
}
const MockMarkerConstructor = vi.fn().mockImplementation(() => new MockMarkerInstance())

class MockLatLng {
  constructor(
    public lat: number,
    public lng: number,
  ) {}
}

function installGoogleMock() {
  ;(window as Record<string, unknown>)['google'] = {
    maps: {
      Map: MockMapConstructor,
      Marker: MockMarkerConstructor,
      LatLng: MockLatLng,
    },
  }
}

function removeGoogleMock() {
  delete (window as Record<string, unknown>)['google']
}

/** Build a ref whose .current points at a real (jsdom) div element. */
function makeDivRef() {
  const ref = { current: document.createElement('div') }
  return ref
}

const POSITION_A: GeolocationPosition = { latitude: 37.7749, longitude: -122.4194 }
const POSITION_B: GeolocationPosition = { latitude: 48.8566, longitude: 2.3522 }

beforeEach(() => {
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// Guard: window.google absent
// ---------------------------------------------------------------------------
describe('useGoogleMap — window.google absent', () => {
  beforeEach(removeGoogleMock)
  afterEach(installGoogleMock)

  it('skips map initialisation when window.google is absent', () => {
    const containerRef = makeDivRef()
    renderHook(() => useGoogleMap(containerRef, null))
    expect(MockMapConstructor).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Guard: containerRef.current is null
// ---------------------------------------------------------------------------
describe('useGoogleMap — containerRef.current is null', () => {
  beforeEach(installGoogleMock)

  it('skips map initialisation when containerRef.current is null', () => {
    const nullRef = { current: null }
    renderHook(() => useGoogleMap(nullRef, null))
    expect(MockMapConstructor).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// First render: creates map with correct position
// ---------------------------------------------------------------------------
describe('useGoogleMap — first render', () => {
  beforeEach(installGoogleMock)

  it('creates a Map instance on first call when container and google are present', () => {
    const containerRef = makeDivRef()
    renderHook(() => useGoogleMap(containerRef, null))
    expect(MockMapConstructor).toHaveBeenCalledTimes(1)
    expect(MockMapConstructor).toHaveBeenCalledWith(
      containerRef.current,
      expect.objectContaining({ zoom: expect.any(Number) as unknown }),
    )
  })

  it('centres the map on the provided position when first rendered', () => {
    const containerRef = makeDivRef()
    renderHook(() => useGoogleMap(containerRef, POSITION_A))
    expect(MockMapConstructor).toHaveBeenCalledWith(
      containerRef.current,
      expect.objectContaining({
        center: { lat: POSITION_A.latitude, lng: POSITION_A.longitude },
      }),
    )
  })

  it('places a marker at the provided position on first render', () => {
    const containerRef = makeDivRef()
    renderHook(() => useGoogleMap(containerRef, POSITION_A))
    expect(MockMarkerConstructor).toHaveBeenCalledTimes(1)
    expect(MockMarkerConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        position: { lat: POSITION_A.latitude, lng: POSITION_A.longitude },
      }),
    )
  })

  it('does not place a marker when position is null', () => {
    const containerRef = makeDivRef()
    renderHook(() => useGoogleMap(containerRef, null))
    expect(MockMarkerConstructor).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Subsequent renders: calls setCenter instead of constructing a new Map
// ---------------------------------------------------------------------------
describe('useGoogleMap — subsequent renders', () => {
  beforeEach(installGoogleMock)

  it('calls setCenter on re-render with a new position instead of constructing a new Map', () => {
    const containerRef = makeDivRef()
    const { rerender } = renderHook(
      ({ pos }: { pos: GeolocationPosition | null }) => useGoogleMap(containerRef, pos),
      { initialProps: { pos: POSITION_A } },
    )

    // First render: map constructed
    expect(MockMapConstructor).toHaveBeenCalledTimes(1)

    // Second render with new position
    rerender({ pos: POSITION_B })

    // Map must NOT be re-constructed
    expect(MockMapConstructor).toHaveBeenCalledTimes(1)
    // setCenter must be called with the new coordinates
    expect(mockSetCenter).toHaveBeenCalledWith({
      lat: POSITION_B.latitude,
      lng: POSITION_B.longitude,
    })
  })
})

// ---------------------------------------------------------------------------
// Marker lifecycle: replaces marker when position changes
// ---------------------------------------------------------------------------
describe('useGoogleMap — marker lifecycle', () => {
  beforeEach(installGoogleMock)

  it('removes the previous marker and creates a new one when position changes', () => {
    const containerRef = makeDivRef()
    const { rerender } = renderHook(
      ({ pos }: { pos: GeolocationPosition | null }) => useGoogleMap(containerRef, pos),
      { initialProps: { pos: POSITION_A } },
    )

    // After first render a marker exists
    expect(MockMarkerConstructor).toHaveBeenCalledTimes(1)

    // Position changes
    rerender({ pos: POSITION_B })

    // Old marker must be cleared
    expect(mockSetMap).toHaveBeenCalledWith(null)
    // New marker must be created
    expect(MockMarkerConstructor).toHaveBeenCalledTimes(2)
    expect(MockMarkerConstructor).toHaveBeenLastCalledWith(
      expect.objectContaining({
        position: { lat: POSITION_B.latitude, lng: POSITION_B.longitude },
      }),
    )
  })
})
