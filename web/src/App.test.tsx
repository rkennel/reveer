/**
 * Smoke test for App.
 *
 * App is a single-line wrapper around HomeScreen. We verify only that it
 * mounts without crashing and that HomeScreen renders. All HomeScreen
 * behaviour is tested in HomeScreen.test.tsx.
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App'

// Minimal stubs to prevent crashes — full SDK and geolocation tests live in
// HomeScreen.test.tsx and the hook unit tests.
beforeEach(() => {
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

  Object.defineProperty(navigator, 'geolocation', {
    value: { getCurrentPosition: vi.fn() },
    configurable: true,
    writable: true,
  })
})

describe('App', () => {
  it('mounts and renders HomeScreen', () => {
    render(<App />)
    expect(screen.getByRole('application', { name: /map/i })).toBeInTheDocument()
  })
})
